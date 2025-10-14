#!/usr/bin/env python3
"""
QMOI Ethical Writing Assistant
---------------------------------
Provides tools that help users produce original, well-cited work while preserving academic integrity.

Features:
- Originality assistant: outline → draft scaffolding with prompts and source slots
- Style coach: adapt to a user voice profile without impersonation or deception
- Self-similarity checker: local n-gram/Jaccard to flag high-overlap sections
- Citation builder: APA/MLA/Chicago quick-formatters from minimal fields
- Rubric reviewer: rubric-driven checklist with actionable suggestions

This tool avoids any intent to deceive detection systems or misrepresent authorship.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from typing import Dict, List, Tuple


# -------------------------
# Utilities
# -------------------------


def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return re.sub(r"\s+", " ", text).strip()


def split_sentences(text: str) -> List[str]:
    text = normalize_text(text)
    # Simple sentence split; deliberately lightweight
    return re.split(r"(?<=[.!?])\s+", text) if text else []


def ngrams(tokens: List[str], n: int) -> List[Tuple[str, ...]]:
    return [tuple(tokens[i : i + n]) for i in range(0, max(len(tokens) - n + 1, 0))]


def jaccard(a: set, b: set) -> float:
    return len(a & b) / max(len(a | b), 1)


# -------------------------
# Originality Assistant
# -------------------------


def generate_outline(topic: str, sections: int = 5) -> Dict[str, List[str]]:
    sections = max(3, min(sections, 10))
    outline = {"title": topic, "sections": []}
    for i in range(sections):
        outline["sections"].append(
            {
                "heading": f"Section {i+1}: Key Aspect",
                "prompts": [
                    "State the claim in your own words",
                    "Provide 1-2 reputable sources with brief summaries",
                    "Explain evidence and limitations",
                    "Relate to assignment rubric criteria",
                ],
                "sources": [],
            }
        )
    return outline


def scaffold_draft(outline: Dict[str, List[str]]) -> str:
    lines = [f"# {outline.get('title','Untitled')}\n"]
    for sec in outline.get("sections", []):
        lines.append(f"## {sec['heading']}")
        for p in sec.get("prompts", []):
            lines.append(f"- [ ] {p}")
        lines.append("\nSources to consult (add notes):")
        lines.append("- [ ] Author, Year, Title — url")
        lines.append("")
    lines.append("## References\n- Add properly formatted references here")
    return "\n".join(lines)


# -------------------------
# Style Coach
# -------------------------


@dataclass
class StyleProfile:
    sentence_length: Tuple[int, int] = (10, 22)
    formality: str = "neutral"  # informal | neutral | formal
    passive_ok: bool = False


def adapt_style(text: str, profile: StyleProfile) -> str:
    sentences = split_sentences(text)
    adjusted: List[str] = []
    for s in sentences:
        words = s.split()
        # basic length normalization
        if len(words) < profile.sentence_length[0]:
            s = s + (" and" if s.endswith(".") else ",") + " add detail"
        elif len(words) > profile.sentence_length[1]:
            # split long sentences heuristically
            mid = len(words) // 2
            s = " ".join(words[:mid]) + ". " + " ".join(words[mid:])

        if profile.formality == "formal":
            s = re.sub(r"\b(really|very|a lot)\b", "significantly", s, flags=re.I)
            s = re.sub(r"\b(kids|guys)\b", "people", s, flags=re.I)
        elif profile.formality == "informal":
            s = re.sub(r"\b(therefore|thus)\b", "so", s, flags=re.I)

        if not profile.passive_ok:
            s = re.sub(
                r"\b(is|was|were|be|been|being) ([a-z]+ed) by\b", r"\2", s, flags=re.I
            )

        adjusted.append(s if s.endswith((".", "!", "?")) else s + ".")
    return " ".join(adjusted)


# -------------------------
# Self-Similarity Checker
# -------------------------


def similarity_report(text: str, ref_texts: List[str], n: int = 5) -> Dict:
    tokens = normalize_text(text).lower().split()
    base = set(ngrams(tokens, n))
    details = []
    for idx, ref in enumerate(ref_texts):
        rtokens = normalize_text(ref).lower().split()
        rset = set(ngrams(rtokens, n))
        score = jaccard(base, rset)
        details.append({"ref": idx, "jaccard": round(score, 4)})
    overall = max((d["jaccard"] for d in details), default=0.0)
    return {"n": n, "max_jaccard": overall, "comparisons": details}


# -------------------------
# Citation Builder
# -------------------------


def cite_apa(author: str, year: str, title: str, source: str) -> str:
    return f"{author} ({year}). {title}. {source}."


def cite_mla(author: str, title: str, source: str, year: str) -> str:
    return f'{author}. "{title}." {source}, {year}.'


def cite_chicago(author: str, year: str, title: str, source: str) -> str:
    return f"{author}. {year}. {title}. {source}."


# -------------------------
# Rubric Reviewer
# -------------------------


def rubric_review(text: str, rubric_points: List[str]) -> Dict:
    findings = []
    for point in rubric_points:
        pattern = re.escape(point.split(":")[0].strip())
        present = re.search(pattern, text, flags=re.I) is not None
        findings.append({"criterion": point, "addressed": present})
    coverage = sum(1 for f in findings if f["addressed"]) / max(len(findings), 1)
    return {"coverage": round(coverage, 2), "findings": findings}


# -------------------------
# CLI
# -------------------------


def main():
    p = argparse.ArgumentParser(description="QMOI Ethical Writing Assistant")
    sub = p.add_subparsers(dest="cmd", required=True)

    p_outline = sub.add_parser("outline", help="Generate originality outline")
    p_outline.add_argument("topic")
    p_outline.add_argument("--sections", type=int, default=5)

    p_scaffold = sub.add_parser(
        "scaffold", help="Create draft scaffold from outline JSON"
    )
    p_scaffold.add_argument("outline_json")

    p_style = sub.add_parser("style", help="Adapt text to a style profile")
    p_style.add_argument("--text", required=True)
    p_style.add_argument(
        "--formality", choices=["informal", "neutral", "formal"], default="neutral"
    )
    p_style.add_argument("--min-len", type=int, default=10)
    p_style.add_argument("--max-len", type=int, default=22)
    p_style.add_argument("--passive-ok", action="store_true")

    p_sim = sub.add_parser(
        "similarity", help="Self-similarity report against references"
    )
    p_sim.add_argument("--text", required=True)
    p_sim.add_argument("--refs", nargs="*", default=[])
    p_sim.add_argument("--n", type=int, default=5)

    p_cite = sub.add_parser("cite", help="Quick citation formatter")
    p_cite.add_argument("--style", choices=["apa", "mla", "chicago"], required=True)
    p_cite.add_argument("--author", required=True)
    p_cite.add_argument("--year", required=True)
    p_cite.add_argument("--title", required=True)
    p_cite.add_argument("--source", required=True)

    p_rubric = sub.add_parser("rubric", help="Rubric-driven checklist review")
    p_rubric.add_argument("--text", required=True)
    p_rubric.add_argument(
        "--points", nargs="+", required=True, help="List rubric criteria"
    )

    args = p.parse_args()

    if args.cmd == "outline":
        print(json.dumps(generate_outline(args.topic, args.sections), indent=2))
        return

    if args.cmd == "scaffold":
        with open(args.outline_json, "r", encoding="utf-8") as f:
            outline = json.load(f)
        print(scaffold_draft(outline))
        return

    if args.cmd == "style":
        prof = StyleProfile(
            (args.min_len, args.max_len), args.formality, args.passive_ok
        )
        print(adapt_style(args.text, prof))
        return

    if args.cmd == "similarity":
        print(json.dumps(similarity_report(args.text, args.refs, args.n), indent=2))
        return

    if args.cmd == "cite":
        if args.style == "apa":
            print(cite_apa(args.author, args.year, args.title, args.source))
        elif args.style == "mla":
            print(cite_mla(args.author, args.title, args.source, args.year))
        else:
            print(cite_chicago(args.author, args.year, args.title, args.source))
        return

    if args.cmd == "rubric":
        print(json.dumps(rubric_review(args.text, args.points), indent=2))
        return


if __name__ == "__main__":
    main()
