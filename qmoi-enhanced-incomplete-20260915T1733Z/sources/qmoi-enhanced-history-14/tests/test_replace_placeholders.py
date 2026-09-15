import importlib.util
from pathlib import Path

def load_module():
    module_path = Path(__file__).resolve().parents[1] / 'scripts' / 'replace_placeholders.py'
    spec = importlib.util.spec_from_file_location('replace_placeholders', module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module

def test_replace_placeholders_module_loads():
    module = load_module()
    assert module is not None

# AUTOFIXED by Ollama at 2026-07-31T00:38:48.153161Z
