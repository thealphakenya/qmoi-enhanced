import importlib.util
from pathlib import Path

def load_module():
    module_path = Path(__file__).resolve().parents[1] / 'scripts' / 'link_normalization_dryrun.py'
    spec = importlib.util.spec_from_file_location('link_normalization_dryrun', module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module

def test_link_normalization_dryrun_module_loads():
    module = load_module()
    assert module is not None
