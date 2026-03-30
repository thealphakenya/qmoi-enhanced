// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import requests

def test_status_returns_prodice_info():
    r = requests.get('http://localhost:3000/api/qcity/status')
    assert r.status_code == 200
    data = r.json()
    assert 'prodices' in data and 'offloading' in data 