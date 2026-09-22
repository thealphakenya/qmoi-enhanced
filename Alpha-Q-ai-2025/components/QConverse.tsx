import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Mic, MicOff, Volume2, Languages, MessageCircle, User, Users, Child } from 'lucide-react';

interface QConverseProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  userId: string;
}

export const QConverse: React.FC<QConverseProps> = ({
  isEnabled,
  onToggle,
  userId
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [recognizedUsers, setRecognizedUsers] = useState<any[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        setupSpeechRecognition();
      }
    }
  }, []);

  const setupSpeechRecognition = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language === 'sw' ? 'sw-KE' : 'en-US';

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setCurrentText(finalTranscript);
        processVoiceInput(finalTranscript);
      }
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (isEnabled) setTimeout(() => startListening(), 100);
    };
  };

  const processVoiceInput = (transcript: string) => {
    const isChild = detectChildVoice(transcript);
    const response = generateResponse(transcript, isChild);
    speak(response);
  };

  const detectChildVoice = (transcript: string): boolean => {
    const childWords = ['mommy', 'daddy', 'toy', 'play', 'story', 'song'];
    return childWords.some(word => transcript.toLowerCase().includes(word));
  };

  const generateResponse = (transcript: string, isChild: boolean): string => {
    if (isChild) {
      return language === 'sw' ? 
        "Jambo mtoto! Una nini kusema?" : 
        "Hello little one! What would you like to talk about?";
    }
    
    return language === 'sw' ? 
      "Asante kwa kuzungumza nami. Ninawezaje kukusaidia?" : 
      "Thank you for talking with me. How can I help you?";
  };

  const speak = (text: string) => {
    if (!synthesisRef.current) return;
    
    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'sw' ? 'sw-KE' : 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthesisRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'sw' : 'en';
    setLanguage(newLanguage);
    speak(newLanguage === 'sw' ? "Lugha imebadilishwa" : "Language changed");
  };

  useEffect(() => {
    if (isEnabled) {
      startListening();
    } else {
      stopListening();
    }
  }, [isEnabled]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Q-Converse
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Enable Q-Converse</Label>
          <Switch checked={isEnabled} onCheckedChange={onToggle} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mic className={`h-4 w-4 ${isListening ? 'text-green-500' : 'text-gray-400'}`} />
            <span className="text-sm">{isListening ? 'Listening' : 'Not Listening'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="text-sm">{isSpeaking ? 'Speaking' : 'Not Speaking'}</span>
          </div>
        </div>

        {currentText && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{currentText}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'sw' ? 'Kiswahili' : 'English'}
          </Button>

          <Button
            onClick={() => speak("Hello! How can I help you today?")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Test Voice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 