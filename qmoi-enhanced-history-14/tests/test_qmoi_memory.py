import os
from scripts.qmoi_memory import set, get, delete


def test_set_get_delete():
    set('test:key', {'x': 1}, ttl=2)
    v = get('test:key')
    assert isinstance(v, dict) and v.get('x') == 1
    delete('test:key')
    assert get('test:key') is None


if __name__ == '__main__':
    test_set_get_delete()
    print('ok')
