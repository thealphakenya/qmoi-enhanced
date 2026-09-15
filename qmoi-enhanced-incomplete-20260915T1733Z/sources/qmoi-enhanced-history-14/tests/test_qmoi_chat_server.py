import importlib.util
from pathlib import Path

def load_module():
    module_path = Path(__file__).resolve().parents[1] / 'scripts' / 'qmoi_chat_server.py'
    spec = importlib.util.spec_from_file_location('qmoi_chat_server', module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module

def test_qmoi_chat_server_module_loads():
    module = load_module()
    assert module is not None
