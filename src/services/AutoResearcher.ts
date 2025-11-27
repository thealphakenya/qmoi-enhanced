// AutoResearcher: Detects knowledge gaps, researches, and updates knowledge base
export interface AutoResearcherOptions {
  fetcher?: (topic: string) => Promise<string>;
  onNotify?: (topic: string, content: string) => void;
}

export class AutoResearcher {
  private knowledgeBase: Record<string, string> = {};
  private fetcher?: (topic: string) => Promise<string>;
  private onNotify?: (topic: string, content: string) => void;

  constructor(opts?: AutoResearcherOptions) {
    this.fetcher = opts?.fetcher;
    this.onNotify = opts?.onNotify;
  }

  detectKnowledgeGap(topic: string): boolean {
    return !this.knowledgeBase[topic];
  }

  async researchTopic(topic: string): Promise<string> {
    // Prefer an injected fetcher (e.g., web search or AI research API)
    let research: string;
    if (this.fetcher) {
      try {
        research = await this.fetcher(topic);
      } catch (err) {
        console.warn("AutoResearcher fetcher failed, falling back:", err);
        research = `Auto-researched content for ${topic}`;
      }
    } else {
      // Safe default: lightweight local stub
      research = `Auto-researched content for ${topic}`;
    }

    this.knowledgeBase[topic] = research;
    this.notifyImprovements(topic, research);
    return research;
  }

  notifyImprovements(topic: string, content: string) {
    // Notify user/master of new learnings or improvements
    if (this.onNotify) {
      try {
        this.onNotify(topic, content);
        return;
      } catch (err) {
        console.warn("AutoResearcher onNotify failed:", err);
      }
    }
    console.log(`New knowledge added for ${topic}`);
  }
}
