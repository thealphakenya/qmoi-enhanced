import importlib.util
from pathlib import Path

def load_module():
    module_path = Path(__file__).resolve().parents[1] / 'scripts' / 'update_md_from_state.py'
    spec = importlib.util.spec_from_file_location('update_md_from_state', module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module

def test_update_md_from_state_module_loads():
    module = load_module()
    assert module is not None
