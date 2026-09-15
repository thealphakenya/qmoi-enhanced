import json
import tempfile
import shutil
from pathlib import Path


def test_sign_and_verify_plan():
    tmp = Path(tempfile.mkdtemp(prefix='qmoi-test-'))
    try:
        # create a fake plan
        plan = {'changes': [{'type': 'A', 'name': 'x', 'value': '1.2.3.4'}]}
        in_file = tmp / 'plan.json'
        in_file.write_text(json.dumps(plan), encoding='utf-8')

        # run signer
        from importlib import reload
        import scripts.dns_plan_signer as signer
        reload(signer)
        out = signer.write_signed_plan(plan, name='testplan')
        assert out.exists()
        assert signer.verify_plan(out) is True
    finally:
        shutil.rmtree(tmp)
