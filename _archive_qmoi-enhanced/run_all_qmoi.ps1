npm install
pip install -r requirements.txt -r requirements/test_requirements.txt
npm run qmoi:autodev:full
npm run qmoi:always-fix-all
npm run test:ui
python scripts/run_all_tests.py
python scripts/qmoi_health_monitor.py
python scripts/test_hf_space_ui.py --space-url https://huggingface.co/spaces/alphaqmoi/qmoi-ai-system