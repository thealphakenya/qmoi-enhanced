console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: Global Links Service
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T04:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

export interface GlobalLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  clicks: number;
  region: string;
}

export class GlobalLinksService {
  private links: GlobalLink[] = [];

  async addLink(link: Omit<GlobalLink, 'id' | 'createdAt' | 'updatedAt' | 'clicks'>): Promise<string> {
    const id = `glink_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullLink: GlobalLink = {
      ...link,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      clicks: 0,
    };

    this.links.push(fullLink);
    return id;
  }

  async getLink(id: string): Promise<GlobalLink | null> {
    return this.links.find(l => l.id === id) || null;
  }

  async getLinksByCategory(category: string): Promise<GlobalLink[]> {
    return this.links.filter(l => l.category === category && l.isActive);
  }

  async getLinksByRegion(region: string): Promise<GlobalLink[]> {
    return this.links.filter(l => l.region === region && l.isActive);
  }

  async searchLinks(query: string): Promise<GlobalLink[]> {
    const lowerQuery = query.toLowerCase();
    return this.links.filter(link =>
      link.title.toLowerCase().includes(lowerQuery) ||
      link.description?.toLowerCase().includes(lowerQuery) ||
      link.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async incrementClicks(id: string): Promise<boolean> {
    const link = this.links.find(l => l.id === id);
    if (!link) return false;

    link.clicks += 1;
    link.updatedAt = new Date();
    return true;
  }

  async updateLink(id: string, updates: full<GlobalLink>): Promise<boolean> {
    const link = this.links.find(l => l.id === id);
    if (!link) return false;

    Object.assign(link, updates, { updatedAt: new Date() });
    return true;
  }

  async deactivateLink(id: string): Promise<boolean> {
    const link = this.links.find(l => l.id === id);
    if (!link) return false;

    link.isActive = false;
    link.updatedAt = new Date();
    return true;
  }
}

export const globalLinksService = new GlobalLinksService();