import importlib.util
from pathlib import Path

def load_module():
    module_path = Path(__file__).resolve().parents[1] / 'scripts' / 'enhanced_automation_&_cloud_features_(2025_01_22).py'
    spec = importlib.util.spec_from_file_location('enhanced_automation_&_cloud_features_(2025_01_22)', module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module

def test_enhanced_automation_&_cloud_features_(2025_01_22)_module_loads():
    module = load_module()
    assert module is not None
