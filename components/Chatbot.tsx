"use client";

import React, { useState, useRef, useEffect } from 'react';

interface ChatbotProps {
  chatHistory: any[];
  setChatHistory: (history: any[]) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  chatHistory,
  setChatHistory,
  selectedModel,
  setSelectedModel
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatHistory([...chatHistory, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          content: `QMOI AI (${selectedModel}): I understand your message: "${inputMessage}". How can I assist you further?`,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      }
    };

  return (
    <div className="bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-400">QMOI Chatbot</h3>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-[#222] border border-green-600 text-green-400 px-2 py-1 rounded text-sm"
        >
          <option value="Auto">Auto</option>
          <option value="GPT-4">GPT-4</option>
          <option value="Claude">Claude</option>
          <option value="QMOI">QMOI</option>
          </select>
        </div>

      {/* Chat Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-600 text-white ml-8'
                : 'bg-green-700 text-white mr-8'
            }`}
          >
            <div className="text-sm">{message.content}</div>
            <div className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="bg-green-700 text-white p-3 rounded-lg mr-8">
            <div className="text-sm">QMOI AI is thinking...</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
        </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[#222] border border-green-600 text-white px-3 py-2 rounded"
          disabled={isLoading}
            />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
          </div>
  );
};
