---
title: "Issue draft for hooks/useWhatsApp.ts"
generated: 2025-11-08T16:06:38.388667Z
---

# Review needed: hooks/useWhatsApp.ts

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:41.815339Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:41.815339Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:41.815339Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';

interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  timestamp: number;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

interface WhatsAppConfig {
  enabled: boolean;
  phoneNumber: string;
  apiKey: string;
  webhookUrl: string;
  autoReply: boolean;
  allowedContacts: string[];
  messageTemplates: Record<string, string>;
}

export function useWhatsApp() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch messages
  const { data: messagesData, refetch: refetchMessages } = useQuery<WhatsAppMessage[], AxiosError>(
    'whatsapp-messages',
    async () => {
      const response = await axios.get('/api/qcity/whatsapp/messages');
      return response.data;
    },
    {
      refetchInterval: 5000, // Poll every 5 seconds
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Fetch WhatsApp config
  const { data: configData, refetch: refetchConfig } = useQuery<WhatsAppConfig, AxiosError>(
    'whatsapp-config',
    async () => {
      const response = await axios.get('/api/qcity/whatsapp/config');
      return response.data;
    },
    {
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation<WhatsAppMessage, AxiosError, { to: string; content: string; type?: 'text' | 'image' | 'document' | 'audio' | 'video' }>(
    async ({ to, content, type = 'text' }) => {
      const response = await axios.post('/api/qcity/whatsapp/messages', { to, content, type });
      return response.data;
    },
    {
      onSuccess: () => refetchMessages(),
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Update config mutati
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
