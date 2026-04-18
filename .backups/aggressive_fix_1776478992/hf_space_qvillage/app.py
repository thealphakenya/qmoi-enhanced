#!/usr/bin/env python3
"""
QVillage HF Space Gradio application.
"""

import os
import gradio as gr
from typing import Optional
from core import (
    fetch_daily_papers,
    get_community_stats,
    generate_session_token,
    load_trending_papers,
    search_knowledge_base,
)

QVILLAGE_HOME = os.getenv("QVILLAGE_HOME_URL", "https://qvillage.ai")
MAX_API_CALLS_PER_HOUR = int(os.getenv("MAX_API_CALLS_PER_HOUR", "100"))

api_call_count = {"used": 0}


def _increment_api_call() -> None:
    api_call_count["used"] += 1


def _remaining_api_calls() -> int:
    return max(0, MAX_API_CALLS_PER_HOUR - api_call_count["used"])


def get_upgrade_html(feature_name: str, feature_description: str) -> str:
    session_token = generate_session_token()
    upgrade_url = f"{QVILLAGE_HOME}/login?session={session_token}&feature={feature_name}&source=hf_space"
    return (
        f"<div style='padding:20px;background:linear-gradient(135deg,#5b8df9,#2a2d7b);" \
        f"border-radius:16px;color:#ffffff;'>"
        f"<h3 style='margin-top:0;'>✨ {feature_description}</h3>"
        f"<p style='opacity:0.92;'>Unlock the full QVillage research workspace and QMOI integration.</p>"
        f"<a href='{upgrade_url}' target='_blank' "
        f"style='display:inline-block;padding:12px 20px;background:#ff6b6b;color:#fff;border-radius:10px;text-decoration:none;'>"
        f"Upgrade for full access</a>"
        f"</div>"
    )


def build_paper_results(tag_filter: Optional[str]) -> str:
    _increment_api_call()
    result = fetch_daily_papers(tag_filter=tag_filter, max_results=15)
    return result


def build_search_results(query: str) -> str:
    _increment_api_call()
    return search_knowledge_base(query)


def build_trending_results() -> str:
    _increment_api_call()
    return load_trending_papers(max_results=7)


def build_stats() -> str:
    return get_community_stats()


with gr.Blocks(title="QVillage HF Space", theme=gr.themes.Default()) as demo:
    gr.Markdown(
        "# 🏘️ QVillage HF Space — AI Research Hub\n"
        "QVillage HF Space delivers daily AI papers, advanced knowledge search, and community insights directly inside Hugging Face Spaces."
    )

    with gr.Tab("Daily Papers"):
        papers_input = gr.Dropdown(
            choices=["All", "ML", "NLP", "Vision", "RL", "Security", "Robotics", "Audio"],
            value="All",
            label="Research Category",
            info="Choose a research area to fetch the latest papers."
        )
        papers_output = gr.Markdown(label="Latest Papers")
        papers_button = gr.Button("Fetch Latest Papers")
        papers_button.click(lambda choice: build_paper_results(choice), inputs=papers_input, outputs=papers_output)

    with gr.Tab("Knowledge Search"):
        search_input = gr.Textbox(label="Search QVillage Knowledge Base", placeholder="Search for transformers, reinforcement learning, GANs...")
        search_output = gr.Markdown(label="Search Results")
        search_button = gr.Button("Search")
        search_button.click(build_search_results, inputs=search_input, outputs=search_output)

    with gr.Tab("Trending"):
        trending_output = gr.Markdown(label="Trending AI Papers")
        trending_button = gr.Button("Load Trending Papers")
        trending_button.click(build_trending_results, inputs=None, outputs=trending_output)

    with gr.Tab("Community"):
        stats_output = gr.Markdown(label="Community & System Stats")
        stats_button = gr.Button("Refresh Stats")
        stats_button.click(build_stats, inputs=None, outputs=stats_output)

    with gr.Tab("Upgrade"):
        upgrade_html = gr.HTML(value=get_upgrade_html("hf_space_full", "Full QVillage Research Portal"))
        gr.Markdown("**Feature access is managed by QVillage. Upgrade to unlock live dataset sync, premium papers feeds, and QMOI knowledge pipelines.**")

    gr.Markdown(
        "---\n"
        "### Notes\n"
        "- API quota is managed per session and will adapt to Hugging Face rate limits.\n"
        "- QVillage HF Space is integrated with the QVillage research and QMOI ecosystem.\n"
        "- For full production deployment, use the hosted QVillage master platform and API endpoints."
    )

    gr.Markdown(f"**API Calls Used**: {api_call_count['used']} / {MAX_API_CALLS_PER_HOUR}")


if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=int(os.getenv("PORT", "7860")))
