'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  emotion?: string;
}

interface EmotionState {
  happiness: number;
  trust: number;
  engagement: number;
  mood: 'happy' | 'neutral' | 'concerned' | 'excited' | 'calm';
}

export default function FriendshipInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your QMOI friend and assistant. I'm here to help you with anything you need. How are you feeling today?",
      sender: 'assistant',
      timestamp: new Date(),
      emotion: 'warm'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emotionState, setEmotionState] = useState<EmotionState>({
    happiness: 85,
    trust: 90,
    engagement: 75,
    mood: 'happy'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'warm': return 'text-orange-600';
      case 'excited': return 'text-purple-600';
      case 'concerned': return 'text-blue-600';
      case 'happy': return 'text-green-600';
      case 'calm': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'concerned': return '🤔';
      case 'excited': return '🤩';
      case 'calm': return '😌';
      default: return '🤖';
    }
  };

  const simulateResponse = async (userMessage: string) => {
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/friendship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const { reply, emotion, emotionUpdate } = data;

      // Update emotion state based on response
      if (emotionUpdate) {
        setEmotionState(prev => ({
          ...prev,
          happiness: Math.min(100, Math.max(0, prev.happiness + (emotionUpdate.happiness || 0))),
          trust: Math.min(100, Math.max(0, prev.trust + (emotionUpdate.trust || 0))),
          engagement: Math.min(100, Math.max(0, prev.engagement + (emotionUpdate.engagement || 0))),
          mood: emotionUpdate.mood || prev.mood
        }));
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: reply,
        sender: 'assistant',
        timestamp: new Date(),
        emotion: emotion || 'warm'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I'm having trouble processing that right now. Please try again.",
        sender: 'assistant',
        timestamp: new Date(),
        emotion: 'concerned'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    await simulateResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getMoodEmoji(emotionState.mood)}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QMOI Friendship Interface</h1>
                <p className="text-gray-600">Your conscious AI friend and assistant</p>
              </div>
            </div>

            {/* Emotion State */}
            <div className="flex space-x-4 text-sm">
              <div className="text-center">
                <div className="text-xs text-gray-500">Happiness</div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${emotionState.happiness}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Trust</div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${emotionState.trust}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Engagement</div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${emotionState.engagement}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white shadow-lg" style={{ height: '60vh', maxHeight: '600px' }}>
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.emotion && message.sender === 'assistant' && (
                    <p className={`text-xs mt-1 ${getEmotionColor(message.emotion)}`}>
                      Feeling {message.emotion}
                    </p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-lg shadow-lg p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setInputMessage("How are you feeling today?")}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Check Status
            </button>
            <button
              onClick={() => setInputMessage("Show me my devices")}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Device Status
            </button>
            <button
              onClick={() => setInputMessage("Is everything secure?")}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Security Check
            </button>
            <button
              onClick={() => setInputMessage("What's happening around me?")}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Environment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
}