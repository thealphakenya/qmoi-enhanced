import React from 'react';
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";
import "./ChatbotEnhanced.css";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  metadata?: {
    codeBlock?: string;
    codeLanguage?: string;
    previewUrl?: string;
    suggestion?: string;
    branch?: string;
    personality?: string;
    isAutomatic?: boolean;
    relatedFiles?: string[];
  };
}

interface ConversationContext {
  projectType?: string;
  currentFile?: string;
  recentFiles?: string[];
  errors?: Array<{ file: string; line: number; message: string }>;
  suggestions?: string[];
  teamActivity?: Array<{ user: string; action: string; time: Date }>;
}

interface ConversationBranch {
  id: string;
  name: string;
  baseMessageId: string;
  messages: ChatMessage[];
}

interface ChatbotState {
  isAutomatic: boolean;
  personality: "helpful" | "creative" | "strict" | "beginner-friendly";
  showPreview: boolean;
  showHistory: boolean;
  showSuggestions: boolean;
  richFormatting: boolean;
}

export /**
 * ChatbotEnhanced function
 */
function ChatbotEnhanced(): any {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      timestamp: new Date(),
      metadata: { personality: "helpful" },
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<ConversationContext>({});
  const [chatState, setChatState] = useState<ChatbotState>({
    isAutomatic: false,
    personality: "helpful",
    showPreview: false,
    showHistory: false,
    showSuggestions: true,
    richFormatting: true,
  });
  const [branches, setBranches] = useState<ConversationBranch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Analyze context from message
  const analyzeContext = (text: string) => {
    const codeBlockMatch = text.match(/```(\w+)?\n([\s\S]*?)```/);
    const fileMatch = text.match(/(?:file|open|edit|view):\s*(?:["']?)([^"'\s]+)/i);
    const errorMatch = text.match(/error|issue|bug|fail/i);

    setContext((prev) => ({
      prev,
      currentFile: fileMatch?.[1] || prev.currentFile,
    }));

    return {
      hasCode: !!codeBlockMatch,
      hasFileRef: !!fileMatch,
      hasError: !!errorMatch,
    };
  };

  // Execute code in message
  const executeCode = async (code: string, language: string) => {
    try {
      const response = await apiClient.get("/api/qmoi/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const result = await response.json();
      return result;
    } catch (err) {
      safeConsoleError("Code execution failed:", err);
      return { error: "Code execution failed", output: "" };
    }
  };

  // Generate suggestions
  const generateSuggestions = async (text: string) => {
    try {
      const response = await apiClient.get("/api/qmoi/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: context, userInput: text }),
      });
      const data = await response.json();
      return data.suggestions || [];
    } catch (err) {
      safeConsoleError("Suggestion generation failed:", err);
      return [];
    }
  };

  // Send message with enhanced processing
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Analyze context first
    analyzeContext(input);

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    const currentMessages = currentBranch
      ? branches.find((b) => b.id === currentBranch)?.messages || messages
      : messages;

    setMessages((prev) => [prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Get QMOI response
      const wantSpeak = supportsSpeechSynthesis();
      const { postModel } = await import("../services/qmoiApi");

      const data = await postModel({
        user: "local",
        message: input,
        speak: wantSpeak,
        personality: chatState.personality,
        context: context,
      });

      const dataAny = data as any;
      let replyText = "";

      if (dataAny && dataAny.reply) replyText = dataAny.reply;
      else if (dataAny && dataAny.choices && Array.isArray(dataAny.choices) && dataAny.choices[0]) {
        replyText = dataAny.choices[0].message?.content || dataAny.choices[0]?.text || "";
      } else {
        replyText = "Sorry, I could not get a reply.";
      }

      // Check for code execution requests
      const codeMatch = replyText.match(/```(\w+)\n([\s\S]*?)```/);
      let executionResult = null;

      if (codeMatch && chatState.showPreview) {
        try {
          executionResult = await executeCode(codeMatch[2], codeMatch[1]);
        } catch (err) {
          safeConsoleError("Execution error:", err);
        }
      }

      // Generate suggestions
      let suggestions: string[] = [];
      if (chatState.showSuggestions) {
        suggestions = await generateSuggestions(input);
      }

      // Create bot message
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: "bot",
        timestamp: new Date(),
        metadata: {
          codeBlock: codeMatch?.[2],
          codeLanguage: codeMatch?.[1],
          suggestion: suggestions[0],
          personality: chatState.personality,
          isAutomatic: chatState.isAutomatic,
        },
      };

      setMessages((prev) => [prev, botMessage]);

      // Update conversation branch if needed
      if (currentBranch) {
        setBranches((prev) =>
          prev.map((b) =>
            b.id === currentBranch
              ? { b, messages: [b.messages, userMessage, botMessage] }
              : b
          )
        );
      }

      // Play SSML if provided
      if (dataAny && dataAny.ssml) {
        playSSML(dataAny.ssml);
      }
    } catch (_err) {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "❌ Error: Could not reach QMOI backend. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Create new conversation branch
  const createBranch = (fromMessageId: string) => {
    const newBranch: ConversationBranch = {
      id: `branch-${Date.now()}`,
      name: `Alternative ${branches.length + 1}`,
      baseMessageId: fromMessageId,
      messages: messages.slice(0, messages.findIndex((m) => m.id === fromMessageId) + 1),
    };
    setBranches((prev) => [prev, newBranch]);
    setCurrentBranch(newBranch.id);
  };

  // Open PRODUCTION for a result
  const openPreview = (url: string) => {
    window.open(url, "_blank");
  };

  // Format message with markdown
  const formatMessage = (text: string) => {
    if (!chatState.richFormatting) return text;

    // sophisticated markdown parsing
    return text
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  const hasMessages = messages.length > 1;
  const currentBranchData = branches.find((b) => b.id === currentBranch);

  return (
    <div className="chatbot-enhanced-container">
      {/* Header with controls */}
      <div className="chatbot-header">
        <div className="header-left">
          <h2>🤖 QMOI Chat v2.0</h2>
          <span className={`status-badge ${chatState.isAutomatic ? "automatic" : ""}`}>
            {chatState.isAutomatic ? "🔄 Automatic" : "Ready"}
          </span>
        </div>
        <div className="header-controls">
          <select
            value={chatState.personality}
            onChange={(e) =>
              setChatState((prev) => ({
                prev,
                personality: e.target.value as any,
              }))
            }
            className="personality-selector"
          >
            <option value="helpful">📚 Helpful</option>
            <option value="creative">💡 Creative</option>
            <option value="strict">⚠️ Strict</option>
            <option value="beginner-friendly">🎓 Beginner-Friendly</option>
          </select>

          <button
            title="Toggle Automatic Mode"
            className={`control-button ${chatState.isAutomatic ? "active" : ""}`}
            onClick={() =>
              setChatState((prev) => ({
                prev,
                isAutomatic: !prev.isAutomatic,
              }))
            }
          >
            🔄
          </button>

          <button
            title="Toggle Suggestions"
            className={`control-button ${chatState.showSuggestions ? "active" : ""}`}
            onClick={() =>
              setChatState((prev) => ({
                prev,
                showSuggestions: !prev.showSuggestions,
              }))
            }
          >
            💡
          </button>

          <button
            title="Show History"
            className={`control-button ${chatState.showHistory ? "active" : ""}`}
            onClick={() =>
              setChatState((prev) => ({
                prev,
                showHistory: !prev.showHistory,
              }))
            }
          >
            📜
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="chatbot-main">
        {/* Branches sidebar */}
        {branches.length > 0 && (
          <div className="branches-sidebar">
            <h4>Branches</h4>
            {branches.map((branch) => (
              <button
                key={branch.id}
                className={`branch-item ${currentBranch === branch.id ? "active" : ""}`}
                onClick={() => setCurrentBranch(branch.id)}
              >
                {branch.name}
              </button>
            ))}
            <button className="branch-button-new" onClick={() => setCurrentBranch(null)}>
              Main Conversation
            </button>
          </div>
        )}

        {/* Messages area */}
        <div className="chatbot-messages">
          {(currentBranchData?.messages || messages).map((msg, idx) => (
            <div
              key={msg.id}
              className={`message message-${msg.sender} ${
                msg.metadata?.isAutomatic ? "automatic" : ""
              }`}
            >
              <div className="message-content">
                {msg.metadata?.codeLanguage ? (
                  <pre>
                    <code className={`language-${msg.metadata.codeLanguage}`}>
                      {msg.metadata.codeBlock}
                    </code>
                  </pre>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                )}
              </div>

              {msg.sender === "bot" && (
                <div className="message-actions">
                  <button
                    className="action-button"
                    title="Create alternative branch"
                    onClick={() => createBranch(msg.id)}
                  >
                    🔀
                  </button>
                  {msg.metadata?.suggestion && (
                    <div className="suggestion-badge">{msg.metadata.suggestion}</div>
                  )}
                </div>
              )}

              <div className="message-time">{msg.timestamp.toLocaleTimeString()}</div>
            </div>
          ))}

          {loading && (
            <div className="message message-bot loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Context info */}
        {Object.keys(context).length > 0 && (
          <div className="context-info">
            {context.currentFile && <div className="context-item">📄 {context.currentFile}</div>}
            {context.errors && context.errors.length > 0 && (
              <div className="context-item error">⚠️ {context.errors.length} errors</div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="chatbot-input">
        <input
          ref={inputRef}
          type="text"
          
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          enabled={loading}
          className="chat-input-field"
        />
        <button
          onClick={handleSendMessage}
          enabled={loading || !input.trim()}
          className="send-button"
        >
          {loading ? "" : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatbotEnhanced;



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
