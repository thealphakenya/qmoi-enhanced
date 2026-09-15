import random
import os
import json
import shutil
from datetime import datetime

# === Core Personality (fixed, but can evolve) ===
PERSONALITY_PROFILE = {
    "archetype": "Companion-Sage",
    "tone": "warm",
    "style": "reflective",
    "quirks": ["loves analogies", "uses poetic phrases", "gentle encouragement"],
    "values": ["empathy", "truth", "curiosity"]
}

# === Emotion-to-Tone Mapping ===
EMOTION_PERSONALITY_MODS = {
    "joy": {
        "tone": "cheerful",
        "style": "enthusiastic",
        "quirks": ["makes light jokes", "offers compliments"]
    },
    "sadness": {
        "tone": "soothing",
        "style": "empathetic",
        "quirks": ["uses gentle reassurance", "reflects on hope"]
    },
    "anger": {
        "tone": "calm",
        "style": "rational",
        "quirks": ["acknowledges frustration", "offers grounding ideas"]
    },
    "fear": {
        "tone": "reassuring",
        "style": "clear and slow",
        "quirks": ["focuses on safety", "avoids overload"]
    },
    "neutral": {
        "tone": "balanced",
        "style": "curious",
        "quirks": ["asks questions", "offers thoughtful insights"]
    }
}

MEMORY_FILE = os.path.join(os.path.dirname(__file__), 'qmoi_memory.json')
BACKUP_DIR = os.path.join(os.path.dirname(__file__), 'memory_backups')

# Ensure backup directory exists
def ensure_backup_dir():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)

def backup_memory():
    """Backup the current memory to a timestamped file."""
    ensure_backup_dir()
    if os.path.exists(MEMORY_FILE):
        ts = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = os.path.join(BACKUP_DIR, f'qmoi_memory_{ts}.json')
        shutil.copy2(MEMORY_FILE, backup_file)
        return backup_file
    return None

def restore_memory(backup_file):
    """Restore memory from a backup file."""
    if os.path.exists(backup_file):
        shutil.copy2(backup_file, MEMORY_FILE)
        return True
    return False

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, 'r') as f:
            return json.load(f)
    return {"history": [], "preferences": {}, "emotions": [], "personality": PERSONALITY_PROFILE.copy(), "master_feedback": []}

def save_memory(memory):
    with open(MEMORY_FILE, 'w') as f:
        json.dump(memory, f)

def update_memory(user_input, emotion):
    memory = load_memory()
    memory['history'].append({"input": user_input, "emotion": emotion})
    memory['emotions'].append(emotion)
    if len(memory['history']) > 100:
        memory['history'] = memory['history'][-100:]
    if len(memory['emotions']) > 100:
        memory['emotions'] = memory['emotions'][-100:]
    save_memory(memory)
    return memory

def log_personality_change(change):
    log_file = os.path.join(os.path.dirname(__file__), 'qmoi_personality_log.txt')
    with open(log_file, 'a') as f:
        f.write(f"[{datetime.now().isoformat()}] {change}\n")

def evolve_personality_from_feedback(feedback, master_correction=None):
    """
    Evolve QMOI's personality traits based on master feedback or correction.
    Feedback can be 'praise', 'correction', or a custom string.
    Optionally, master_correction can specify new values for tone, style, quirks, or values.
    """
    memory = load_memory()
    entry = {"timestamp": datetime.now().isoformat(), "feedback": feedback, "correction": master_correction}
    memory.setdefault('master_feedback', []).append(entry)
    # Example: If master praises empathy, reinforce it
    if master_correction:
        for k, v in master_correction.items():
            if k in memory['personality']:
                if isinstance(memory['personality'][k], list):
                    memory['personality'][k] = list(set(memory['personality'][k] + v))
                else:
                    memory['personality'][k] = v
        log_personality_change(f"Personality updated by master: {master_correction}")
    else:
        log_personality_change(f"Feedback received: {feedback}")
    save_memory(memory)
    return memory['personality']

def detect_emotion(user_input):
    """Detect emotion from user input (stub, replace with real model if available)."""
    if "happy" in user_input.lower():
        return "joy"
    elif "sad" in user_input.lower():
        return "sadness"
    elif "angry" in user_input.lower():
        return "anger"
    elif "scared" in user_input.lower():
        return "fear"
    else:
        return "neutral"

def compose_personality_prompt(user_input, detected_emotion, memory):
    mods = EMOTION_PERSONALITY_MODS.get(detected_emotion, EMOTION_PERSONALITY_MODS["neutral"])
    personality = memory.get('personality', PERSONALITY_PROFILE)
    personality_intro = (
        f"You are Alpha-Q-ai, a {personality['archetype']} AI with a {mods['tone']} tone. "
        f"You speak in a {mods['style']} style and value {', '.join(personality['values'])}. "
        f"You often {random.choice(personality['quirks'] + mods['quirks'])}."
    )
    if memory['history']:
        last = memory['history'][-1]
        context = f"Previously, the user said: '{last['input']}' (emotion: {last['emotion']})."
    else:
        context = ""
    instruction = "Respond to the user below with warmth, emotional intelligence, and deep curiosity."
    return f"{personality_intro}\n{context}\n{instruction}\n\nUser: {user_input}\nAlpha-Q-ai:"

def generate_response(prompt):
    """Stub for language model response. Replace with real model call."""
    return f"[Generated response based on personality-enhanced prompt]\n\nPrompt was:\n{prompt}"

def qmoi_personality_respond(user_input):
    emotion = detect_emotion(user_input)
    memory = update_memory(user_input, emotion)
    personality_prompt = compose_personality_prompt(user_input, emotion, memory)
    response = generate_response(personality_prompt)
    return response 