from pathlib import Path

def get_notes() -> str:
    repo_root = Path(__file__).resolve().parent.parent
    p = repo_root / 'docs' / 'converted' / 'qmoi-enhanced_scripts_scripts_qmoi_parallel_processor_py_py.md'
    if p.exists():
        return p.read_text(encoding='utf-8')
    return ''
