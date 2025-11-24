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

  // Update config mutation
  const updateConfigMutation = useMutation<void, AxiosError, Partial<WhatsAppConfig>>(
    async (newConfig) => {
      const response = await axios.post('/api/qcity/whatsapp/config', newConfig);
      return response.data;
    },
    {
      onSuccess: () => {
        refetchConfig();
        refetchMessages();
      },
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Update messages and config when data changes
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  useEffect(() => {
    if (configData) {
      setConfig(configData);
    }
  }, [configData]);

  // Send message
  const sendMessage = useCallback(
    (to: string, content: string, type: 'text' | 'image' | 'document' | 'audio' | 'video' = 'text') => {
      sendMessageMutation.mutate({ to, content, type });
    },
    [sendMessageMutation]
  );

  // Update config
  const updateConfig = useCallback(
    (newConfig: Partial<WhatsAppConfig>) => {
      updateConfigMutation.mutate(newConfig);
    },
    [updateConfigMutation]
  );

  return {
    messages,
    config,
    error,
    sendMessage,
    updateConfig,
    refetchMessages,
    refetchConfig,
  };
} 