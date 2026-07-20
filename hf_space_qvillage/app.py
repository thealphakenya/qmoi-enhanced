#!/usr/bin/env python3
"""
QVillage Gradio App for Hugging Face Spaces.

Features:
- Daily papers discovery and filtering
- Knowledge base search
- Community discussions
- Paid feature redirects (safe billing)
- Compute cost monitoring

Run: python app.py
"""

import gradio as gr
import httpx
import os
import asyncio
import json
from datetime import datetime
from typing import List, Tuple, Optional

# Configuration
QVILLAGE_API = os.getenv("QVILLAGE_API_URL", "https://api.qvillage.ai")
QVILLAGE_HOME = os.getenv("QVILLAGE_HOME_URL", "https://qvillage.ai")
MAX_COMPUTE_TIME = int(os.getenv("MAX_COMPUTE_MINUTES", "30"))
MAX_API_CALLS = int(os.getenv("MAX_API_CALLS_PER_HOUR", "100"))

# Rate limiting state
api_call_count = {}


def generate_session_token() -> str:
    """Generate a session token for upgrade links."""
    import uuid
    return f"hf_{uuid.uuid4().hex[:16]}"


async def safe_api_call(endpoint: str, timeout: int = 15) -> Optional[dict]:
    """
    Safely call QVillage API with timeout and error handling.
    Prevents accidental compute overages.
    """
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.get(f"{QVILLAGE_API}{endpoint}")
            response.raise_for_status()
            return response.json()
    except httpx.TimeoutException:
        return {
            "error": "Request timed out. Upgrade to full site for extended operations.",
            "papers": [],
        }
    except Exception as e:
        return {
            "error": f"API error: {str(e)}",
            "papers": [],
        }


async def fetch_daily_papers(tag_filter: str = None) -> str:
    """Fetch today's curated papers from QVillage."""
    params = ""
    if tag_filter and tag_filter != "All":
        params = f"?tag={tag_filter}"
    
    response = await safe_api_call(f"/papers/daily{params}")
    
    if not response or "error" in response:
        return f"⚠️ {response.get('error', 'Failed to fetch papers')}"
    
    papers = response.get("papers", [])
    if not papers:
        return "📭 No papers found for today. Check back later!"
    
    output_lines = []
    for i, paper in enumerate(papers[:20], 1):  # Limit to 20 papers per view
        title = paper.get("title", "Untitled")
        abstract = paper.get("abstract", "No abstract")[:200]
        arxiv_id = paper.get("arxiv_id", "")
        authors = paper.get("authors", "Unknown")
        date = paper.get("published_date", "")
        
        paper_md = f"""
**{i}. {title}**

👤 {authors}  
📅 {date}

{abstract}...

[📖 Read on arXiv](https://arxiv.org/abs/{arxiv_id}) | Save for later (upgrade)
"""
        output_lines.append(paper_md)
    
    return "\n" + "---\n".join(output_lines)


async def search_knowledge_base(query: str) -> str:
    """Search knowledge base with free tier limits."""
    if not query or len(query) < 2:
        return "🔍 Enter at least 2 characters to search."
    
    response = await safe_api_call(f"/kb/search?q={query}&limit=10")
    
    if not response or "error" in response:
        return f"⚠️ {response.get('error', 'Search failed')}"
    
    results = response.get("results", [])
    if not results:
        return f"No results found for '{query}'. Try different keywords!"
    
    output_lines = []
    for i, result in enumerate(results[:10], 1):
        title = result.get("title", "Untitled")
        excerpt = result.get("excerpt", "No preview")[:150]
        relevance = result.get("score", 0.0)
        
        result_md = f"""
**{i}. {title}** (relevance: {relevance:.1%})

{excerpt}...

[View full entry](https://qvillage.ai/kb/{result.get('id', '')})
"""
        output_lines.append(result_md)
    
    return "\n" + "---\n".join(output_lines)


def get_upgrade_html(feature_name: str, feature_description: str) -> str:
    """Generate HTML for upgrade prompt."""
    session_token = generate_session_token()
    upgrade_url = f"{QVILLAGE_HOME}/login?session={session_token}&feature={feature_name}&source=hf_space"
    
    return f"""
    <div style="
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        margin: 10px 0;
    ">
        <h3>✨ {feature_description}</h3>
        <p>This premium feature is available on the full QVillage platform.</p>
        <p style="font-size: 0.9em; opacity: 0.9;">
            🎯 Free tier: {feature_name.replace('_', ' ')} coming soon  
            💎 Upgrade now for unlimited access
        </p>
        <a href="{upgrade_url}" target="_blank" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #FF6B6B;
            color: white;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 10px;
            transition: background-color 0.3s;
        " onmouseover="this.style.backgroundColor='#EE5A52'" onmouseout="this.style.backgroundColor='#FF6B6B'">
            🚀 Upgrade & Unlock
        </a>
    </div>
    """


async def load_trending_papers() -> str:
    """Load trending papers for initial page load."""
    response = await safe_api_call("/papers/trending?days=7&limit=15")
    
    if not response or "error" in response:
        return "Unable to load trending papers. Please refresh."
    
    papers = response.get("papers", [])
    if not papers:
        return "No trending papers available."
    
    output_lines = ["# 🔥 Trending This Week\n"]
    for i, paper in enumerate(papers[:10], 1):
        title = paper.get("title", "Untitled")
        views = paper.get("view_count", 0)
        arxiv_id = paper.get("arxiv_id", "")
        output_lines.append(f"{i}. **{title}** ({views} views)  \n")
    
    return "\n".join(output_lines)


async def get_community_stats() -> str:
    """Get community statistics."""
    response = await safe_api_call("/community/stats")
    
    if not response or "error" in response:
        return "Stats unavailable"
    
    stats = response.get("stats", {})
    users = stats.get("active_users", 0)
    papers = stats.get("total_papers", 0)
    discussions = stats.get("total_discussions", 0)
    
    return f"""
    **Community Stats:**
    - 👥 {users:,} Active Users
    - 📄 {papers:,} Research Papers
    - 💬 {discussions:,} Discussions
    """


def get_about_html() -> str:
    """Generate About page."""
    return """
    <div style="max-width: 600px; margin: auto;">
        <h1>🏘️ QVillage — Your AI Research Hub</h1>
        
        <h3>About</h3>
        <p>
            QVillage is a collaborative platform for AI researchers, bringing together daily papers,
            community knowledge base, and intelligent discovery tools.
        </p>
        
        <h3>Free Tier Features (This Space)</h3>
        <ul>
            <li>📰 Daily papers curated by QMOI AI</li>
            <li>🔍 Full-text search of papers and knowledge base</li>
            <li>🔥 Trending papers and discussions</li>
            <li>👥 Community insights and statistics</li>
            <li>📖 Read-only access to public knowledge base</li>
        </ul>
        
        <h3>Premium Features (Full Site)</h3>
        <ul>
            <li>✨ AI-powered paper summaries and insights</li>
            <li>🎯 Advanced search filters and saved searches</li>
            <li>📝 Create and edit knowledge base entries</li>
            <li>💬 Full discussion threads and community engagement</li>
            <li>📊 Custom analytics and dashboards</li>
            <li>🤖 Custom model training</li>
            <li>⚡ API access (1000+ requests/day)</li>
            <li>📥 Bulk data export</li>
        </ul>
        
        <h3>Get Started</h3>
        <p>
            👉 <a href="https://qvillage.ai" target="_blank">Full QVillage Site</a> — All features  
            🔗 <a href="https://github.com/alphaqmoi/qvillage" target="_blank">GitHub Repo</a> — Source code  
            💬 <a href="https://discord.gg/qvillage" target="_blank">Discord Community</a> — Chat with us
        </p>
        
        <hr>
        <p style="font-size: 0.9em; color: #666;">
            <strong>Note:</strong> This HF Space provides free-tier features only.  
            Full premium features, billing, and advanced analytics are available at qvillage.ai
        </p>
    </div>
    """


# ============================================================================
# Build Gradio Interface
# ============================================================================

async def create_interface():
    """Create Gradio interface with tabs."""
    
    with gr.Blocks(
        title="QVillage — AI Research Hub (Free Tier)",
        theme=gr.themes.Soft(),
        css="""
        .header { text-align: center; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
        .stat-card { 
            padding: 15px;
            background-color: #f0f0f0;
            border-radius: 8px;
            text-align: center;
        }
        """
    ) as demo:
        gr.Markdown("# 🏘️ QVillage — AI Research Hub", elem_classes="header")
        gr.Markdown(
            "**Free access to daily papers, search knowledge base, and community insights.**  "
            "👉 [Upgrade for full features](https://qvillage.ai)"
        )
        
        with gr.Tabs():
            # ==================== Tab 1: Daily Papers ====================
            with gr.Tab("📰 Daily Papers"):
                gr.Markdown("### Today's Curated Research Papers")
                
                with gr.Row():
                    tag_filter = gr.Dropdown(
                        choices=["All", "ML", "NLP", "Vision", "Security", "RL", "Robotics", "Audio"],
                        value="All",
                        label="🏷️ Filter by tag"
                    )
                    refresh_btn = gr.Button("🔄 Load Papers", variant="primary")
                
                papers_output = gr.Markdown("Loading papers...")
                
                def load_papers_sync(tag):
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    return loop.run_until_complete(fetch_daily_papers(tag))
                
                refresh_btn.click(
                    load_papers_sync,
                    inputs=tag_filter,
                    outputs=papers_output
                )
                demo.load(
                    load_papers_sync,
                    inputs=tag_filter,
                    outputs=papers_output
                )
            
            # ==================== Tab 2: Search KB ====================
            with gr.Tab("🔍 Search Knowledge Base"):
                gr.Markdown("### Search Community Knowledge Base")
                gr.Markdown("Search papers, code snippets, techniques, and insights shared by the community.")
                
                with gr.Row():
                    search_query = gr.Textbox(
                        placeholder="e.g., 'transformer architecture', 'BERT fine-tuning'...",
                        label="Search query",
                        scale=4
                    )
                    search_btn = gr.Button("Search", variant="primary", scale=1)
                
                kb_output = gr.Markdown("Enter a search query to get started.")
                
                def search_sync(query):
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    return loop.run_until_complete(search_knowledge_base(query))
                
                search_btn.click(search_sync, inputs=search_query, outputs=kb_output)
                search_query.submit(search_sync, inputs=search_query, outputs=kb_output)
            
            # ==================== Tab 3: Trending ====================
            with gr.Tab("🔥 Trending"):
                gr.Markdown("### Most Popular This Week")
                
                trending_output = gr.Markdown("Loading trending papers...")
                
                def load_trending_sync():
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    return loop.run_until_complete(load_trending_papers())
                
                def load_stats_sync():
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    return loop.run_until_complete(get_community_stats())
                
                stats_output = gr.Markdown("Loading stats...")
                
                with gr.Row():
                    trending_refresh = gr.Button("🔄 Refresh", variant="primary")
                
                trending_refresh.click(load_trending_sync, outputs=trending_output)
                gr.Markdown("---")
                stats_output.value = asyncio.run(get_community_stats())
                
                demo.load(load_trending_sync, outputs=trending_output)
                demo.load(load_stats_sync, outputs=stats_output)
            
            # ==================== Tab 4: Premium Features ====================
            with gr.Tab("✨ Premium Features"):
                gr.Markdown("### Unlock Advanced Capabilities")
                
                with gr.Column():
                    gr.HTML(get_upgrade_html(
                        "AI_Summaries",
                        "📝 AI-Powered Paper Summaries"
                    ))
                    gr.HTML(get_upgrade_html(
                        "Advanced_Search",
                        "🎯 Advanced Search & Filters"
                    ))
                    gr.HTML(get_upgrade_html(
                        "Knowledge_Base_Write",
                        "✍️ Create Knowledge Base Entries"
                    ))
                    gr.HTML(get_upgrade_html(
                        "Custom_Models",
                        "🤖 Train Custom Models"
                    ))
                    gr.HTML(get_upgrade_html(
                        "API_Access",
                        "⚡ Unlimited API Access"
                    ))
                    gr.HTML(get_upgrade_html(
                        "Bulk_Export",
                        "📥 Bulk Data Export"
                    ))
            
            # ==================== Tab 5: About ====================
            with gr.Tab("ℹ️ About"):
                gr.HTML(get_about_html())
    
    return demo


# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    demo = asyncio.run(create_interface())
    demo.launch(
        share=False,
        server_name="0.0.0.0",
        server_port=7860,
        show_error=True,
    )

# AUTOFIXED by Ollama at 2026-07-20T01:19:39.429406Z: replaced placeholders or noted TODOs. Please review.
