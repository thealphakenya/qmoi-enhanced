import React, { useState, useEffect, useRef } from 'react';
import { useMaster } from './MasterContext';
import { FaPhone, FaPhoneSlash, FaMicrophone, FaVolumeUp, FaVolumeMute, FaUser, FaStar, FaVideo, FaUserPlus } from 'react-icons/fa';

interface QmoiDialerProps {
  isVisible: boolean;
  onClose: () => void;
  language?: 'en' | 'sw';
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isFavorite: boolean;
  category: string;
}

interface Call {
  id: string;
  contactId?: string;
  phone: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: number;
  timestamp: Date;
  isVideo: boolean;
}

interface CallLog {
  id: string;
  phone: string;
  name?: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: number;
  timestamp: Date;
  isVideo: boolean;
}

export const QmoiDialer: React.FC<QmoiDialerProps> = ({
  isVisible,
  onClose,
  language = 'en'
}) => {
  const { isMaster } = useMaster();
  
  const [currentView, setCurrentView] = useState<'dialer' | 'contacts' | 'history' | 'favorites'>('dialer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIAssistantEnabled, setIsAIAssistantEnabled] = useState(true);
  const [isAutoAnswerEnabled, setIsAutoAnswerEnabled] = useState(false);
  const [isCallRecordingEnabled, setIsCallRecordingEnabled] = useState(false);
  
  const callDurationRef = useRef<NodeJS.Timeout | null>(null);

  const dialpadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  useEffect(() => {
    // Load contacts and call history
    const savedContacts = localStorage.getItem('qmoi-dialer-contacts');
    const savedCallLogs = localStorage.getItem('qmoi-dialer-call-logs');
    
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
    
    if (savedCallLogs) {
      setCallLogs(JSON.parse(savedCallLogs));
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem('qmoi-dialer-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem('qmoi-dialer-contacts', JSON.stringify(newContacts));
  };

  const saveCallLogs = (newCallLogs: CallLog[]) => {
    setCallLogs(newCallLogs);
    localStorage.setItem('qmoi-dialer-call-logs', JSON.stringify(newCallLogs));
  };

  const toggleFavorite = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const updatedContact = { ...contact, isFavorite: !contact.isFavorite };
    const newContacts = contacts.map(c => c.id === contactId ? updatedContact : c);
    saveContacts(newContacts);
    
    if (updatedContact.isFavorite) {
      const newFavorites = [...favorites, updatedContact];
      setFavorites(newFavorites);
      localStorage.setItem('qmoi-dialer-favorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = favorites.filter(f => f.id !== contactId);
      setFavorites(newFavorites);
      localStorage.setItem('qmoi-dialer-favorites', JSON.stringify(newFavorites));
    }
  };

  const addCallLog = (call: Omit<CallLog, 'id'>) => {
    const newCallLog: CallLog = {
      ...call,
      id: Date.now().toString()
    };
    
    const newCallLogs = [newCallLog, ...callLogs].slice(0, 100);
    saveCallLogs(newCallLogs);
  };

  const makeCall = (phone: string, isVideo = false) => {
    const call: Call = {
      id: Date.now().toString(),
      phone,
      type: 'outgoing',
      duration: 0,
      timestamp: new Date(),
      isVideo
    };
    
    setCurrentCall(call);
    setIsInCall(true);
    
    // Start call duration timer
    callDurationRef.current = setInterval(() => {
      setCurrentCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
    }, 1000);
    
    // Simulate call connection
    setTimeout(() => {
      if (callDurationRef.current) {
        clearInterval(callDurationRef.current);
      }
    }, 5000);
  };

  const endCall = () => {
    if (callDurationRef.current) {
      clearInterval(callDurationRef.current);
    }
    
    if (currentCall) {
      addCallLog({
        phone: currentCall.phone,
        type: currentCall.type,
        duration: currentCall.duration,
        timestamp: currentCall.timestamp,
        isVideo: currentCall.isVideo
      });
    }
    
    setCurrentCall(null);
    setIsInCall(false);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const searchContacts = (query: string) => {
    setSearchQuery(query);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const getContactName = (phone: string): string => {
    const contact = contacts.find(c => c.phone === phone);
    return contact ? contact.name : phone;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {language === 'sw' ? 'Qmoi Simu' : 'Qmoi Dialer'}
          </h1>
          <button onClick={onClose} className="text-white">
            ✕
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex mt-4">
          <button
            onClick={() => setCurrentView('dialer')}
            className={`flex-1 py-2 text-center ${currentView === 'dialer' ? 'bg-white text-blue-600' : 'text-white'}`}
          >
            {language === 'sw' ? 'Simu' : 'Dialer'}
          </button>
          <button
            onClick={() => setCurrentView('contacts')}
            className={`flex-1 py-2 text-center ${currentView === 'contacts' ? 'bg-white text-blue-600' : 'text-white'}`}
          >
            {language === 'sw' ? 'Mawasiliano' : 'Contacts'}
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`flex-1 py-2 text-center ${currentView === 'history' ? 'bg-white text-blue-600' : 'text-white'}`}
          >
            {language === 'sw' ? 'Historia' : 'History'}
          </button>
          <button
            onClick={() => setCurrentView('favorites')}
            className={`flex-1 py-2 text-center ${currentView === 'favorites' ? 'bg-white text-blue-600' : 'text-white'}`}
          >
            {React.createElement(FaStar as React.ElementType)}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {currentView === 'dialer' && (
          <div className="p-4">
            {/* Phone Number Display */}
            <div className="text-center mb-6">
              <div className="text-3xl font-mono mb-2">
                {formatPhoneNumber(phoneNumber) || (language === 'sw' ? 'Weka nambari...' : 'Enter number...')}
              </div>
              {currentCall && (
                <div className="text-sm text-gray-600">
                  {formatDuration(currentCall.duration)}
                </div>
              )}
            </div>

            {/* Dialpad */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {dialpadNumbers.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {row.map((number) => (
                    <button
                      key={number}
                      onClick={() => setPhoneNumber(prev => prev + number)}
                      className="h-16 bg-gray-100 rounded-full text-2xl font-semibold hover:bg-gray-200"
                    >
                      {number}
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* Call Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => makeCall(phoneNumber, false)}
                disabled={!phoneNumber}
                className="h-16 w-16 bg-green-500 text-white rounded-full flex items-center justify-center disabled:opacity-50"
              >
                {React.createElement(FaPhone as React.ElementType)}
              </button>
              
              <button
                onClick={() => makeCall(phoneNumber, true)}
                disabled={!phoneNumber}
                className="h-16 w-16 bg-blue-500 text-white rounded-full flex items-center justify-center disabled:opacity-50"
              >
                {React.createElement(FaVideo as React.ElementType)}
              </button>
            </div>
          </div>
        )}

        {currentView === 'contacts' && (
          <div className="p-4">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder={language === 'sw' ? 'Tafuta mawasiliano...' : 'Search contacts...'}
                value={searchQuery}
                onChange={(e) => searchContacts(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Add Contact Button */}
            <button className="w-full mb-4 p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2">
              {React.createElement(FaUserPlus as React.ElementType)}
              {language === 'sw' ? 'Ongeza Muwasiliano' : 'Add Contact'}
            </button>

            {/* Contacts List */}
            <div className="space-y-2">
              {filteredContacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {contact.avatar ? (
                        <img src={contact.avatar} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        React.createElement(FaUser as React.ElementType)
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{contact.name}</div>
                      <div className="text-sm text-gray-600">{formatPhoneNumber(contact.phone)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(contact.id)}
                      className={`p-2 ${contact.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      {React.createElement(FaStar as React.ElementType)}
                    </button>
                    <button
                      onClick={() => makeCall(contact.phone, false)}
                      className="p-2 text-green-500"
                    >
                      {React.createElement(FaPhone as React.ElementType)}
                    </button>
                    <button
                      onClick={() => makeCall(contact.phone, true)}
                      className="p-2 text-blue-500"
                    >
                      {React.createElement(FaVideo as React.ElementType)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'history' && (
          <div className="p-4">
            <div className="space-y-2">
              {callLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      log.type === 'incoming' ? 'bg-green-100 text-green-600' :
                      log.type === 'outgoing' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {React.createElement(FaPhone as React.ElementType, { className: "text-xs" })}
                    </div>
                    <div>
                      <div className="font-semibold">{getContactName(log.phone)}</div>
                      <div className="text-sm text-gray-600">{formatPhoneNumber(log.phone)}</div>
                      <div className="text-xs text-gray-500">
                        {log.timestamp.toLocaleDateString()} - {formatDuration(log.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => makeCall(log.phone, false)}
                      className="p-2 text-green-500"
                    >
                      {React.createElement(FaPhone as React.ElementType)}
                    </button>
                    <button
                      onClick={() => makeCall(log.phone, true)}
                      className="p-2 text-blue-500"
                    >
                      {React.createElement(FaVideo as React.ElementType)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'favorites' && (
          <div className="p-4">
            <div className="space-y-2">
              {favorites.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {contact.avatar ? (
                        <img src={contact.avatar} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        React.createElement(FaUser as React.ElementType)
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{contact.name}</div>
                      <div className="text-sm text-gray-600">{formatPhoneNumber(contact.phone)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => makeCall(contact.phone, false)}
                      className="p-2 text-green-500"
                    >
                      {React.createElement(FaPhone as React.ElementType)}
                    </button>
                    <button
                      onClick={() => makeCall(contact.phone, true)}
                      className="p-2 text-blue-500"
                    >
                      {React.createElement(FaVideo as React.ElementType)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call Interface */}
      {isInCall && currentCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <div className="text-center mb-6">
              <div className="text-2xl font-semibold mb-2">
                {getContactName(currentCall.phone)}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                {formatPhoneNumber(currentCall.phone)}
              </div>
              <div className="text-sm text-gray-500">
                {formatDuration(currentCall.duration)}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                {isMuted ? React.createElement(FaVolumeMute as React.ElementType) : React.createElement(FaMicrophone as React.ElementType)}
              </button>
              
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`p-4 rounded-full ${isSpeakerOn ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {React.createElement(FaVolumeUp as React.ElementType)}
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={endCall}
                className="h-16 w-16 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                {React.createElement(FaPhoneSlash as React.ElementType)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-100 border-t p-2 text-xs text-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isAIAssistantEnabled}
              onChange={(e) => setIsAIAssistantEnabled(e.target.checked)}
              className="w-3 h-3"
            />
            {language === 'sw' ? 'Msaidizi wa AI' : 'AI Assistant'}
          </label>
          
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isAutoAnswerEnabled}
              onChange={(e) => setIsAutoAnswerEnabled(e.target.checked)}
              className="w-3 h-3"
            />
            {language === 'sw' ? 'Jibu Kiotomatiki' : 'Auto Answer'}
          </label>
          
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isCallRecordingEnabled}
              onChange={(e) => setIsCallRecordingEnabled(e.target.checked)}
              className="w-3 h-3"
            />
            {language === 'sw' ? 'Rekodi Simu' : 'Call Recording'}
          </label>
        </div>
        
        <div className="flex items-center gap-2">
          {React.createElement(FaPhone as React.ElementType, { className: "text-green-500" })}
          <span>{language === 'sw' ? 'Tayari' : 'Ready'}</span>
        </div>
      </div>

      {/* Master Controls */}
      {isMaster && (
        <div className="bg-yellow-50 border-t p-2">
          <div className="flex items-center gap-4 text-xs">
            <button className="px-2 py-1 bg-blue-500 text-white rounded">
              {language === 'sw' ? 'Mipangilio ya Mfumo' : 'System Settings'}
            </button>
            <button className="px-2 py-1 bg-green-500 text-white rounded">
              {language === 'sw' ? 'Sasisha Simu' : 'Update Dialer'}
            </button>
            <button className="px-2 py-1 bg-purple-500 text-white rounded">
              {language === 'sw' ? 'Mipangilio ya AI' : 'AI Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 