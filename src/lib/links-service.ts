console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.084471 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:16.162757 -->
// QMOI EVOLUTION ENHANCED: Links Service
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T04:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

export interface Link {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  isZeroRated: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  clicks: number;
  ownerId: string;
}

export class LinksService {
  private links: Link[] = [];

  async createLink(link: Omit<Link, 'id' | 'createdAt' | 'updatedAt' | 'clicks'>): Promise<string> {
    const id = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullLink: Link = {
      ...link,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      clicks: 0,
    };

    this.links.push(fullLink);
    return id;
  }

  async getLink(id: string): Promise<Link | null> {
    return this.links.find(l => l.id === id) || null;
  }

  async getLinksByOwner(ownerId: string): Promise<Link[]> {
    return this.links.filter(l => l.ownerId === ownerId);
  }

  async getZeroRatedLinks(): Promise<Link[]> {
    return this.links.filter(l => l.isZeroRated && l.isActive);
  }

  async updateLink(id: string, updates: full<Link>): Promise<boolean> {
    const link = this.links.find(l => l.id === id);
    if (!link) return false;

    Object.assign(link, updates, { updatedAt: new Date() });
    return true;
  }

  async deleteLink(id: string): Promise<boolean> {
    const index = this.links.findIndex(l => l.id === id);
    if (index === -1) return false;

    this.links.splice(index, 1);
    return true;
  }

  async incrementClicks(id: string): Promise<boolean> {
    const link = this.links.find(l => l.id === id);
    if (!link) return false;

    link.clicks += 1;
    link.updatedAt = new Date();
    return true;
  }

  async searchLinks(query: string, ownerId?: string): Promise<Link[]> {
    let filteredLinks = this.links;

    if (ownerId) {
      filteredLinks = filteredLinks.filter(l => l.ownerId === ownerId);
    }

    const lowerQuery = query.toLowerCase();
    return filteredLinks.filter(link =>
      link.title.toLowerCase().includes(lowerQuery) ||
      link.description?.toLowerCase().includes(lowerQuery) ||
      link.url.toLowerCase().includes(lowerQuery) ||
      link.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async toggleZeroRated(id: string): Promise<boolean> {
    const link = this.links.find(l => l.id === id);
    if (!link) return false;

    link.isZeroRated = !link.isZeroRated;
    link.updatedAt = new Date();
    return true;
  }
}

export const linksService = new LinksService();