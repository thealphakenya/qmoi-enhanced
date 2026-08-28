from pathlib import Path
import shutil
import tempfile


def test_link_cache_set_get_and_persist():
    tmp = Path(tempfile.mkdtemp(prefix='qmoi-test-'))
    try:
        from scripts.link_cache import LinkCache

        c = LinkCache(validation_dir=tmp, max_items=10)
        assert c.get('https://example.com') is None
        c.set('https://example.com', 'ok', {'code': 200})
        v = c.get('https://example.com')
        assert v is not None and v['status'] == 'ok'
        c.save()
        # reload
        c2 = LinkCache(validation_dir=tmp, max_items=10)
        v2 = c2.get('https://example.com')
        assert v2 is not None and v2['status'] == 'ok'
    finally:
        shutil.rmtree(tmp)

