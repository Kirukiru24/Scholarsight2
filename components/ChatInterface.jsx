import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, X } from 'lucide-react';

// NOTE: Chat, GenerateContentResponse, and ChatMessage types/classes
// are assumed to be available from the Gemini client or defined elsewhere.
// For clean JS, we treat them as standard objects.

/**
 * ChatInterface Component
 * Provides a real-time chat experience powered by a Gemini Chat Session, 
 * supporting streaming responses.
 * * @param {object} props
 * @param {object | null} props.chatSession - The active Gemini Chat object instance.
 * @param {function} props.onClose - Function to close the chat interface.
 */
const ChatInterface = ({ chatSession, onClose }) => {
  // ChatMessage structure: { id: string, role: 'user' | 'model', text: string, timestamp: Date }
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'model',
      text: "I've analyzed the paper. Ask me anything about the methodology, results, or specific details.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  /**
   * Scrolls the chat window to the bottom whenever messages change.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handles sending the user's message and streaming the model's response.
   */
  const handleSend = async () => {
    if (!input.trim() || !chatSession || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the streaming method from the chat session object
      const result = await chatSession.sendMessageStream({
        message: input
      });

      let fullText = "";
      const botMsgId = (Date.now() + 1).toString();

      // 1. Optimistic update: Add a temporary empty bot message container
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: "", // Will be filled by the stream
        timestamp: new Date()
      }]);

      // 2. Stream the response chunks
      for await (const chunk of result) {
        // chunk is an object potentially containing a 'text' property
        const text = chunk.text || "";
        fullText += text;
        
        // Update the specific bot message in state with the cumulative text
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullText } : msg
        ));
        
        // Scroll to show the newest chunk
        scrollToBottom();
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error responding to your question.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Allows sending messages with the Enter key.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-xl border-l border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-academic-600" />
          <h3 className="font-semibold text-blue-700">Research Assistant</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((msg) => {
            // Determine if the current message is the one actively loading
            const isLastMessage = msg.id === messages[messages.length - 1].id;
            const isTyping = isLoading && msg.role === 'model' && isLastMessage && !msg.text;

            return (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-2`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-academic-600' : 'bg-slate-200'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-slate-600" />}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-academic-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    {msg.text}
                    {isTyping && (
                      <span className="animate-pulse">...</span>
                    )}
                  </div>
                </div>
              </div>
            )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-end space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the paper..."
            className="flex-1 max-h-32 min-h-[44px] p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent resize-none bg-white text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 p-3 bg-academic-600 text-white rounded-xl hover:bg-academic-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;