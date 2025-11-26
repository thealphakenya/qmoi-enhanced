// NOTE: 1 TBD(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { voiceProfiles, avatarsConfig } from '@/components/q-city/avatarsConfig';

// Simple API key auth for admin operations
function requireApiKey(request: NextRequest) {
  const key = request.headers.get('x-qmoi-api-key') || '';
  const expected = process.env.QMOI_API_KEY || '';
  if (!expected) return true; // allow when no key configured (dev)
  return key === expected;
}

async function writeProposal(proposal: any) {
  try {
    const dir = '.qmoi_validation';
    const proposalsDir = path.join(dir, 'proposals');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (!fs.existsSync(proposalsDir)) fs.mkdirSync(proposalsDir, { recursive: true });

    const aggFile = path.join(dir, 'voice_profile_proposals.json');
    let agg: any[] = [];
    if (fs.existsSync(aggFile)) {
      try { agg = JSON.parse(fs.readFileSync(aggFile, 'utf8') || '[]'); } catch (e) { agg = []; }
    }
    agg.push(proposal);
    fs.writeFileSync(aggFile, JSON.stringify(agg, null, 2), 'utf8');

    const name = `${Date.now()}-voice_profile_${(proposal.type||'proposal').replace(/[^a-z0-9-_\.]/gi, '_')}.json`;
    fs.writeFileSync(path.join(proposalsDir, name), JSON.stringify(proposal, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write voice profile proposal:', err && err.message ? err.message : err);
  }
}

export async function GET() {
  try {
    // Return all available voice profiles with metadata
    const profilesWithMetadata = voiceProfiles.map(profile => ({
      ...profile,
      isAvailable: true,
      lastUpdated: new Date().toISOString(),
      features: getVoiceFeatures(profile.id),
      compatibility: getVoiceCompatibility(profile.id)
    }));

    return NextResponse.json({
      success: true,
      profiles: profilesWithMetadata,
      total: profilesWithMetadata.length
    });
  } catch (error) {
    console.error('Error fetching voice profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voice profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, voiceId, text, quality, volume } = body;
    // simple auth for mutating actions
    const mutating = ['switch', 'enhance', 'upgrade'];
    if (mutating.includes(action) && !requireApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      case 'switch':
        return await switchVoice(voiceId);

      case 'preview':
        return await previewVoice(voiceId, text, quality, volume, request);

      case 'enhance':
        return await enhanceVoice(voiceId);

      case 'upgrade':
        return await upgradeVoice(voiceId);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in voice profiles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function switchVoice(voiceId: string) {
  try {
    // Validate voice ID
    const voiceProfile = voiceProfiles.find(v => v.id === voiceId);
    if (!voiceProfile) {
      return NextResponse.json(
        { error: 'Invalid voice ID' },
        { status: 400 }
      );
    }
    // Proposal-first: record the requested voice switch for review unless explicitly allowed
    const canApply = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    const proposal = {
      type: 'voice_switch',
      voiceId,
      voiceProfile,
      requestedAt: new Date().toISOString(),
      applied: !!canApply
    };

    if (!canApply) {
      await writeProposal(proposal);
      console.log(`🔒 Dry-run: voice switch proposed for ${voiceId}`);
      return NextResponse.json({ success: true, proposed: true, voice: voiceProfile });
    }

    // Persist to a simple state file
    try {
      const stateDir = '.qmoi_state';
      if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
      const stateFile = path.join(stateDir, 'voice_state.json');
      fs.writeFileSync(stateFile, JSON.stringify({ current: voiceId, updated: new Date().toISOString() }, null, 2), 'utf8');
      console.log(`✅ Voice switched to ${voiceProfile.name} and persisted to ${stateFile}`);
    } catch (err) {
      console.error('Failed to persist voice state:', err && (err as any).message ? (err as any).message : err);
    }

    // Trigger enhancement if needed (proposal-first inside enhanceVoice)
    if (voiceProfile.quality === 'ai-enhanced') {
      await enhanceVoice(voiceId);
    }

    return NextResponse.json({ success: true, message: `Voice switched to ${voiceProfile.name}`, voice: voiceProfile });
  } catch (error) {
    console.error('Error switching voice:', error);
    return NextResponse.json(
      { error: 'Failed to switch voice' },
      { status: 500 }
    );
  }
}

async function previewVoice(voiceId: string, text: string, quality: string, volume: number, request?: NextRequest) {
  try {
    // In a real implementation, this would:
    // 1. Use the selected TTS engine (Bark, XTTS, SadTalker, etc.)
    // 2. Generate audio with the specified quality and volume
    // 3. Return the audio stream or URL
    
    const voiceProfile = voiceProfiles.find(v => v.id === voiceId);
    if (!voiceProfile) {
      return NextResponse.json(
        { error: 'Invalid voice ID' },
        { status: 400 }
      );
    }

    // Proxy to the dedicated TTS preview API so we reuse provider handling
    try {
      const apiUrl = process.env.INTERNAL_TTS_ENDPOINT || '/api/qmoi/voice-preview';
      // Use fetch to call internal route (server-side)
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voiceId, text, quality, volume })
      });

      if (!resp.ok) {
        console.warn('TTS preview proxy returned non-ok', resp.status);
        return NextResponse.json({ success: false, error: 'TTS provider failed' }, { status: 502 });
      }

      // We expect binary audio — return a URL to the caller or inline base64 in dev
      const arrayBuffer = await resp.arrayBuffer();
      const buf = Buffer.from(arrayBuffer);

      // For small responses return base64 in JSON for simplicity (client can decode)
      const base64 = buf.toString('base64');
      return NextResponse.json({ success: true, audioBase64: base64, voice: voiceProfile });
    } catch (err) {
      console.error('Error proxying to TTS:', err && (err as any).message ? (err as any).message : err);
      return NextResponse.json({ error: 'TTS proxy failed' }, { status: 502 });
    }
  } catch (error) {
    console.error('Error previewing voice:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice preview' },
      { status: 500 }
    );
  }
}

async function enhanceVoice(voiceId: string) {
  try {
    // Proposal-first: generate a proposal to enhance the voice. Actual model work requires offline jobs.
    const proposal = { type: 'enhance_voice', voiceId, timestamp: new Date().toISOString() };
    const canApply = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    if (!canApply) {
      await writeProposal(proposal);
      return NextResponse.json({ success: true, proposed: true, message: 'Enhancement proposed for review' });
    }

    // Real enhancement path — TBD that should enqueue a job or call an offline pipeline
    console.log(`Applying enhancement to voice ${voiceId}`);
    // TODO: enqueue enhancement job in real implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return NextResponse.json({ success: true, message: 'Voice enhancement enqueued/applied' });
  } catch (error) {
    console.error('Error enhancing voice:', error);
    return NextResponse.json(
      { error: 'Failed to enhance voice' },
      { status: 500 }
    );
  }
}

async function upgradeVoice(voiceId: string) {
  try {
    // Proposal-first for upgrades
    const proposal = { type: 'upgrade_voice', voiceId, timestamp: new Date().toISOString() };
    const canApply = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    if (!canApply) {
      await writeProposal(proposal);
      return NextResponse.json({ success: true, proposed: true, message: 'Upgrade proposed for review' });
    }

    // Real upgrade path (TBD)
    console.log(`Applying upgrade to voice ${voiceId}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return NextResponse.json({ success: true, message: 'Voice upgraded', newVersion: '2.1.0' });
  } catch (error) {
    console.error('Error upgrading voice:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade voice' },
      { status: 500 }
    );
  }
}

function getVoiceFeatures(voiceId: string): string[] {
  const features: { [key: string]: string[] } = {
    'professional-male': ['clear_pronunciation', 'business_tone', 'confidence'],
    'confident-male': ['assertive', 'leadership', 'authority'],
    'young-male': ['energetic', 'friendly', 'approachable'],
    'young-female': ['bright', 'enthusiastic', 'creative'],
    'elder-male': ['wise', 'calm', 'experienced'],
    'robotic-ai': ['digital', 'precise', 'futuristic'],
    'lion-roar': ['powerful', 'majestic', 'commanding'],
    'cat-purr': ['gentle', 'playful', 'comforting'],
    'dolphin-whistle': ['playful', 'intelligent', 'melodic'],
    'octopus-bubble': ['mysterious', 'intelligent', 'fluid'],
    'whale-song': ['deep', 'peaceful', 'majestic'],
    'eagle-screech': ['sharp', 'focused', 'powerful'],
    'parrot-mimic': ['versatile', 'colorful', 'adaptive'],
    'owl-hoot': ['wise', 'calm', 'nocturnal'],
    'falcon-cry': ['swift', 'precise', 'focused'],
    'swan-song': ['elegant', 'graceful', 'beautiful'],
    'peacock-call': ['proud', 'colorful', 'majestic'],
    'hummingbird-buzz': ['quick', 'energetic', 'precise'],
    'penguin-chirp': ['adorable', 'friendly', 'social'],
    'dragon-roar': ['powerful', 'majestic', 'fierce'],
    'phoenix-song': ['eternal', 'majestic', 'renewing']
  };
  
  return features[voiceId] || ['standard', 'clear', 'natural'];
}

function getVoiceCompatibility(voiceId: string): string[] {
  const compatibility: { [key: string]: string[] } = {
    'professional-male': ['human', 'professional', 'business'],
    'confident-male': ['human', 'leadership', 'authority'],
    'young-male': ['human', 'youth', 'casual'],
    'young-female': ['human', 'youth', 'creative'],
    'elder-male': ['human', 'wisdom', 'experience'],
    'robotic-ai': ['robot', 'technology', 'futuristic'],
    'lion-roar': ['animal', 'wild', 'leadership'],
    'cat-purr': ['animal', 'domestic', 'gentle'],
    'dolphin-whistle': ['sea-creature', 'ocean', 'intelligent'],
    'octopus-bubble': ['sea-creature', 'ocean', 'mysterious'],
    'whale-song': ['sea-creature', 'ocean', 'majestic'],
    'eagle-screech': ['bird', 'predator', 'majestic'],
    'parrot-mimic': ['bird', 'tropical', 'intelligent'],
    'owl-hoot': ['bird', 'nocturnal', 'wise'],
    'falcon-cry': ['bird', 'predator', 'swift'],
    'swan-song': ['bird', 'water', 'elegant'],
    'peacock-call': ['bird', 'exotic', 'majestic'],
    'hummingbird-buzz': ['bird', 'small', 'energetic'],
    'penguin-chirp': ['bird', 'flightless', 'friendly'],
    'dragon-roar': ['mythical', 'fantasy', 'powerful'],
    'phoenix-song': ['mythical', 'fantasy', 'eternal']
  };
  
  return compatibility[voiceId] || ['general'];
}

async function generateTTSAudio(voiceId: string, text: string, quality: string, volume: number): Promise<string> {
  // In a real implementation, this would integrate with:
  // - Bark (for high-quality TTS)
  // - XTTS (for multilingual support)
  // - SadTalker (for talking head generation)
  // - EVA3D (for 3D avatar animation)
  // - Commercial APIs (ElevenLabs, Azure, etc.)
  
  // For now, return a [PRODUCTION IMPLEMENTATION REQUIRED] URL
  return `/api/tts/generate?voice=${voiceId}&text=${encodeURIComponent(text)}&quality=${quality}&volume=${volume}`;
} 