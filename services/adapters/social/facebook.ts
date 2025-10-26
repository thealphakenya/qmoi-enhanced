import { SocialPlatformAdapter, PlatformConfig, ApprovalFlow } from '../types';

export class FacebookAdapter implements SocialPlatformAdapter {
  platformId = 'facebook';
  private config?: PlatformConfig;

  async initialize(config: PlatformConfig) {
    this.config = config;
    console.log('[FacebookAdapter] initialized (dryRun=%s)', !!config.dryRun);
  }

  async validateCredentials(): Promise<boolean> {
    // Dry-run: validate presence of token but do not call external APIs
    const ok = !!(this.config && this.config.credentials && (this.config.credentials.accessToken || this.config.credentials.clientId));
    console.log('[FacebookAdapter] validateCredentials =>', ok);
    return ok;
  }

  async requestApproval(action: string, payload: unknown) {
    return ApprovalFlow.requestApproval(this.platformId, action, payload);
  }

  async isApproved(requestId: string) {
    return ApprovalFlow.checkApproval(requestId);
  }

  async getAnalytics() { return { impressions: 0, clicks: 0 }; }

  async createPost(content: unknown, approval: boolean = true): Promise<string> {
    const payload = { content, approval };
    if (approval || this.config?.requireMasterApproval) {
      const req = await this.requestApproval('createPost', payload);
      console.log('[FacebookAdapter] post queued for approval:', req.id);
      return `approval:${req.id}`;
    }
    // Dry-run create
    const id = `fb-post-${Date.now()}`;
    console.log('[FacebookAdapter] dry-run createPost ->', id);
    return id;
  }

  async deletePost(postId: string): Promise<boolean> {
    console.log('[FacebookAdapter] dry-run deletePost', postId);
    return true;
  }

  async getEngagementMetrics(postId: string) { return { likes: 0, shares: 0 }; }
}

export default FacebookAdapter;
import { z } from 'zod';
import { 
  PlatformConfig,
  PlatformConfigSchema,
  SocialPlatformAdapter,
  ApprovalFlow
} from '../types';

// Facebook-specific configuration schema
export const FacebookConfigSchema = PlatformConfigSchema.extend({
  // Facebook Graph API settings
  graphApiVersion: z.string().default('v18.0'),
  pageId: z.string().optional(),
  permissions: z.array(z.string()).default([
    'pages_manage_posts',
    'pages_read_engagement'
  ]),
});

export type FacebookConfig = z.infer<typeof FacebookConfigSchema>;

interface FacebookPostMetrics {
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  impressions: number;
}

export class FacebookAdapter implements SocialPlatformAdapter {
  readonly platformId = 'facebook';
  private config: FacebookConfig | null = null;
  private accessToken: string | null = null;

  async initialize(config: PlatformConfig): Promise<void> {
    // Validate and parse config
    this.config = FacebookConfigSchema.parse(config);
    
    if (this.config.sandboxMode) {
      console.log('[Facebook] Running in sandbox mode');
      return;
    }

    if (!this.config.credentials?.accessToken) {
      throw new Error('Facebook access token is required in production mode');
    }

    // Validate access token in production mode
    await this.validateCredentials();
  }

  async validateCredentials(): Promise<boolean> {
    if (!this.config) {
      throw new Error('Facebook adapter not initialized');
    }

    if (this.config.sandboxMode) {
      return true; // Skip validation in sandbox mode
    }

    // In production, would verify the access token with Facebook Graph API
    // For now, just check it exists
    return !!this.config.credentials?.accessToken;
  }

  async requestApproval(action: string, payload: unknown): Promise<any> {
    if (!this.config) {
      throw new Error('Facebook adapter not initialized');
    }

    return ApprovalFlow.requestApproval(this.platformId, action, payload);
  }

  async isApproved(requestId: string): Promise<boolean> {
    return ApprovalFlow.checkApproval(requestId);
  }

  async createPost(content: unknown, requireApproval: boolean = true): Promise<string> {
    if (!this.config) {
      throw new Error('Facebook adapter not initialized');
    }

    // Always validate content first
    if (typeof content !== 'object' || !content || !('message' in content)) {
      throw new Error('Invalid post content');
    }

    if (this.config.requireMasterApproval && requireApproval) {
      const approval = await this.requestApproval('create_post', content);
      if (!await this.isApproved(approval.id)) {
        throw new Error('Post creation not approved');
      }
    }

    if (this.config.sandboxMode) {
      console.log('[Facebook Sandbox] Would create post:', content);
      return `mock-post-${Date.now()}`;
    }

    // In production mode, would make actual Graph API call
    // For now just log the intent
    console.log('[Facebook] Creating post with Graph API v18.0');
    return `fb-post-${Date.now()}`;
  }

  async deletePost(postId: string): Promise<boolean> {
    if (!this.config) {
      throw new Error('Facebook adapter not initialized');
    }

    if (this.config.requireMasterApproval) {
      const approval = await this.requestApproval('delete_post', { postId });
      if (!await this.isApproved(approval.id)) {
        throw new Error('Post deletion not approved');
      }
    }

    if (this.config.sandboxMode) {
      console.log('[Facebook Sandbox] Would delete post:', postId);
      return true;
    }

    // In production mode, would make actual Graph API call
    console.log('[Facebook] Deleting post:', postId);
    return true;
  }

  async getEngagementMetrics(postId: string): Promise<FacebookPostMetrics> {
    if (!this.config) {
      throw new Error('Facebook adapter not initialized');
    }

    if (this.config.sandboxMode) {
      // Return mock metrics in sandbox mode
      return {
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        reach: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 20000)
      };
    }

    // In production mode, would fetch real metrics via Graph API
    throw new Error('Production metrics fetching not yet implemented');
  }

  async getAnalytics(): Promise<unknown> {
    if (!this.config) {
      throw new Error('Facebook adapter not initialized');
    }

    if (this.config.sandboxMode) {
      return {
        totalReach: Math.floor(Math.random() * 100000),
        totalEngagement: Math.floor(Math.random() * 50000),
        topPosts: Array(3).fill(null).map((_, i) => ({
          id: `mock-post-${i}`,
          reach: Math.floor(Math.random() * 10000),
          engagement: Math.floor(Math.random() * 5000)
        }))
      };
    }

    // In production mode, would fetch real analytics via Graph API
    throw new Error('Production analytics fetching not yet implemented');
  }
}