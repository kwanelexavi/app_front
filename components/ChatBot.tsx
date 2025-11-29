import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Minimize2, Sparkles, Stethoscope } from 'lucide-react';
import { sendMessageToGemini, initializeChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi, I'm Haven. I'm here to listen and support you emotionally. How are you feeling today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize once on mount
  useEffect(() => {
    if (!hasInitialized) {
      try {
        initializeChat();
      } catch (e) {
        console.error("Auto-initialization skipped (likely missing key), will retry on send.");
      }
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  // Scroll to bottom when messages change or when opened
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (manualText?: string) => {
    const textToSend = typeof manualText === 'string' ? manualText : inputValue;

    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Add a placeholder for the model response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      const stream = await sendMessageToGemini(userMsg.text);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
           fullText += c.text;
           setMessages(prev => {
             const newMsgs = [...prev];
             // Ensure we are updating the last message which is the model's
             if (newMsgs[newMsgs.length - 1].role === 'model') {
                 newMsgs[newMsgs.length - 1] = { role: 'model', text: fullText };
             }
             return newMsgs;
           });
        }
      }

    } catch (error: any) {
      console.error("Chat Error", error);
      
      let errorMessage = "I'm having trouble connecting to my AI services right now. Please check your internet connection.";
      
      // Check for specific API Key error
      if (error.message && (error.message.includes("API_KEY") || error.message.includes("API Key"))) {
          errorMessage = "Configuration Error: API_KEY is missing. Please add your API_KEY to the .env file.";
      }

      setMessages(prev => {
        // Remove the empty placeholder if it failed immediately
        const newMsgs = [...prev];
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].text === '') {
            newMsgs.pop();
        }
        return [...newMsgs, { role: 'model', text: errorMessage, isError: true }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render text with clickable links
  const renderMessageText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-200 hover:text-white underline break-all font-medium"
            onClick={(e) => e.stopPropagation()} // Prevent bubbling if needed
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Toggle Button - Always visible when chat is closed */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 z-50 flex items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open Support Chat"
      >
        <MessageCircle size={28} />
        <span className="font-semibold hidden md:inline">Talk to Haven</span>
      </button>

      {/* Chat Window - Persists in DOM but hidden via CSS when closed */}
      <div 
        className={`fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none translate-y-10'}`}
      >
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold">Haven Support</h3>
              <p className="text-xs text-indigo-100">AI Emotional Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <button 
              onClick={() => handleSend("Can you recommend professional counselors, psychologists, or safe chat rooms?")}
              className="hover:bg-indigo-500 p-1.5 rounded transition-colors"
              title="Find Professional Help"
            >
              <Stethoscope size={20} />
            </button>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-1 rounded transition-colors">
              <Minimize2 size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none shadow-sm'
                } ${msg.isError ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800' : ''}`}
              >
                 {msg.role === 'user' ? msg.text : renderMessageText(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
               <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-600 shadow-sm flex items-center gap-2">
                 <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={16} />
                 <span className="text-xs text-gray-500 dark:text-gray-300">Haven is thinking...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputValue.trim()}
              className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
            Haven is an AI. For emergencies, call your local emergency number immediately.
          </p>
        </div>
      </div>
    </>
  );
};
