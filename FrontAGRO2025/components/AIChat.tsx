
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { chatWithAgronomist } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useGlobal } from '../store/GlobalStore';
import { FeatureGuard } from './common/FeatureGuard';
import { useActivity } from '../contexts/ActivityContext';

export const AIChat: React.FC = () => {
  const { t, user, language } = useGlobal();
  const { logActivity } = useActivity();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting when language loads
  useEffect(() => {
      if (messages.length === 0 && language) {
          setMessages([{ 
              id: '1', 
              role: 'model', 
              text: language === 'uz' 
                ? "Salom! Men Xorazm bo'yicha agro-ekspertman. Sho'r yuvish yoki ekinlar bo'yicha so'rang." 
                : (language === 'ru' ? "Здравствуйте! Я агро-эксперт по Хорезму. Спрашивайте о почве или посевах." : "Hello! I am your Khorezm agro-expert. Ask me about salt leaching or crops."),
              timestamp: Date.now() 
          }]);
      }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    // Pass language explicitly
    const responseText = await chatWithAgronomist(history, userMsg.text, language!);
    
    // Log the activity with Detailed Payload
    logActivity(
        'gpt', 
        `Q: ${userText.substring(0, 30)}${userText.length > 30 ? '...' : ''}`, 
        '/chat',
        {
            question: userText,
            answer: responseText,
            timestamp: Date.now()
        }
    );

    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <FeatureGuard featureId="gpt">
        <div className="flex flex-col h-[calc(100vh-60px)] pb-20 bg-gray-50">
        <div className="bg-white border-b p-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
            <div className="p-2 bg-agrogreen-100 rounded-full">
                <Bot className="w-6 h-6 text-agrogreen-600" />
            </div>
            <div>
                <h2 className="font-bold text-gray-800">Agro-GPT <span className="text-xs bg-agrogreen-100 text-agrogreen-800 px-1 rounded ml-1">BETA</span></h2>
                <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Khorezm Node Online
                </p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                    ? 'bg-agrogreen-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
            </div>
            ))}
            {loading && (
            <div className="flex justify-start">
                <div className="bg-white text-gray-500 rounded-2xl rounded-tl-none p-4 shadow-sm border flex gap-2 items-center">
                <Bot className="w-4 h-4 animate-bounce" />
                <span className="text-xs italic">Thinking...</span>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t sticky bottom-16 md:bottom-0">
            <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about cotton, rice, salinity..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-agrogreen-500 bg-gray-50"
            />
            <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-agrogreen-600 text-white p-3 rounded-full hover:bg-agrogreen-700 disabled:opacity-50 transition-colors shadow-lg"
            >
                <Send className="w-5 h-5" />
            </button>
            </div>
        </div>
        </div>
    </FeatureGuard>
  );
};
