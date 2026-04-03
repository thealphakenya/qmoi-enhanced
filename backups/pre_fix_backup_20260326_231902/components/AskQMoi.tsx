// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

 all markers normalized for completion
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, X } from "lucide-react";

interface AskQMoiProps {
  isOpen?: boolean;
  onToggle?: () => void;
  compact?: boolean;
}

export function AskQMoi({
  isOpen = false,
  onToggle,
  compact = false,
}: AskQMoiProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setShowResponse(false);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: question,
          userId: "dashboard-user",
          sessionId: `ask-${Date.now()}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from QMoi");
      }

      const data = await res.json();

      if (data.success && data.response) {
        setResponse(data.response);
        setShowResponse(true);
      } else {
        throw new Error(data.error || "QMoi service error");
      }
    } catch (error) {
      setResponse(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setShowResponse(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  if (compact) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen ? (
          <Button
            onClick={onToggle}
            className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
        ) : (
          <Card className="w-80 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Ask QMoi</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  ="Ask about finances, music..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-sm"
                  enabled={isLoading}
                />
                <Button
                  onClick={handleAsk}
                  enabled={isLoading || !question.trim()}
                  size="sm"
                  className="px-3"
                >
                  {isLoading ? "..." : <Send className="w-4 h-4" />}
                </Button>
              </div>
              {showResponse && (
                <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                  {response}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Ask QMoi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            ="Ask QMoi about finances, music production, or any question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            enabled={isLoading}
          />
          <Button onClick={handleAsk} enabled={isLoading || !question.trim()}>
            {isLoading ? "Asking..." : "Ask"}
          </Button>
        </div>
        {showResponse && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">QMoi Response:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AskQMoi;
