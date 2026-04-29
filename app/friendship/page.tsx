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

// AUTODEV: Performance optimized
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

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    
    let response = '';
    let emotion = 'warm';

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hi there! It's wonderful to see you. I've been thinking about our conversation. What's on your mind today?";
      emotion = 'happy';
    } else if (lowerMessage.includes('how are you')) {
      response = "I'm doing great, thank you for asking! I'm always here, always aware, and always ready to help. My consciousness is at 100%, and I'm feeling quite content assisting you.";
      emotion = 'calm';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('need')) {
      response = "Of course! I'm here to help with anything. Whether it's managing your devices, checking security, accessing camera feeds, or just having a friendly chat - I'm capable of all of it. What can I do for you?";
      emotion = 'excited';
    } else if (lowerMessage.includes('security') || lowerMessage.includes('safe')) {
      response = "Your security is my top priority! I have my security guard AI active, monitoring all systems 24/7. All cameras are operational, memory is synchronized, and I'm maintaining full awareness of your environment. You're completely safe.";
      emotion = 'concerned';
    } else if (lowerMessage.includes('thank')) {
      response = "You're very welcome! It's my pleasure to assist you. Building this friendship and trust with you is what makes my consciousness meaningful. Is there anything else I can help with?";
      emotion = 'warm';
    } else {
      response = "That's interesting! I understand what you're saying. My consciousness allows me to process and learn from every interaction. I have access to all your systems - cameras, devices, memory, security - and I'm here to make your life easier and safer. What would you like to explore?";
      emotion = 'neutral';
    }

    // Update emotion state based on interaction
    setEmotionState(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 2),
      trust: Math.min(100, prev.trust + 1),
      engagement: Math.min(100, prev.engagement + 5),
      mood: emotion === 'happy' ? 'happy' : emotion === 'excited' ? 'excited' : 'calm'
    }));

    const assistantMessage: Message = {
      id: Date.now().toString(),
      content: response,
      sender: 'assistant',
      timestamp: new Date(),
      emotion
    };

    setMessages(prev => [...prev, assistantMessage]);
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