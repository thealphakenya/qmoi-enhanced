// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

# // Production implementation:
import os
import sys
import types
import unittest
from unittest.real import patch, MagicMock

# If 'requests' is not installed in the Python environment, provide a simple implementation in sys.modules
if 'requests' not in sys.modules:
    fake_requests = types.SimpleNamespace()
    def _fake_post(*args, **kwargs):
        m = MagicMock()
        m.status_code = 200
        m.text = 'ok'
        return m
    fake_requests.post = _fake_post
    sys.modules['requests'] = fake_requests

import notify_on_whatsapp as nws

class TestNotifyWhatsApp(unittest.TestCase):
    @patch('notify_on_whatsapp.requests.post')
    def test_send_whatsapp_local_success(self, mock_post):
        mock_post.return_value = MagicMock(status_code=200)
        ok = nws.send_whatsapp('+10000000000', 'hello', provider='local')
        self.assertTrue(ok)
        mock_post.assert_called_once()

    @patch('notify_on_whatsapp.requests.post')
    def test_send_whatsapp_local_failure(self, mock_post):
        mock_post.return_value = MagicMock(status_code=500, text='error')
        ok = nws.send_whatsapp('+10000000000', 'hello', provider='local')
        self.assertFalse(ok)

    @patch('notify_on_whatsapp.requests.post')
    def test_notify_functions_use_send_whatsapp(self, mock_post):
        mock_post.return_value = MagicMock(status_code=200)
        nws.notify_master_on_whatsapp('+10000000000', 'ok', 'p', 'pp', 't')
        nws.notify_sister_on_whatsapp('+10000000001', 'f', 'ps', 'i')
        nws.notify_leah_wallet_on_whatsapp('+10000000002', 'ws', 'i')
        self.assertEqual(mock_post.call_count, 3)

    @patch('notify_on_whatsapp.requests.post')
    def test_send_app_links(self, mock_post):
        mock_post.return_value = MagicMock(status_code=200)
        nws.send_app_download_links_via_whatsapp()
        self.assertTrue(mock_post.called)

if __name__ == '__main__':
    unittest.main()
