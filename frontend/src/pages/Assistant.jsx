/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Assistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your NagrikSetu AI Assistant. How can I help you today? You can ask me how to report an issue, check rules, or understand local civic responsibilities.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    
    if (!user) {
      alert("Please login to use AI Assistant");
      return;
    }

    const newMessage = { role: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/ai/chat', { 
        message: input, 
        history: messages 
      });
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    }
    
    setLoading(false);
  };

  const quickQuestions = [
    "How do I report a pothole?",
    "What is the status of my issue?",
    "Who is responsible for streetlights?",
    "How long does resolution take?"
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-[65px])] px-6 text-center">
        <Bot size={64} className="text-[var(--color-secondary)] mb-6 opacity-80" />
        <h2 className="text-3xl font-serif font-bold mb-4">AI Civic Assistant</h2>
        <p className="text-gray-400 max-w-md mb-8">Please log in to chat with our smart city assistant and get instant answers to your civic queries.</p>
        <Link to="/login" className="px-8 py-3 bg-[var(--color-secondary)] text-white font-bold rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all">
          Login to Chat
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 max-w-4xl mx-auto min-h-[calc(100vh-[65px])] flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-secondary)] border-opacity-30">
        <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-[var(--color-secondary)]">
          <Sparkles className="text-[var(--color-secondary)]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold">NagrikSetu <span className="text-[var(--color-secondary)]">AI</span></h1>
          <p className="text-sm text-gray-400 drop-shadow-md">Powered by Gemini 1.5 Flash</p>
        </div>
      </div>

      <div className="quick-suggests flex gap-3 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button 
            key={idx}
            onClick={() => setInput(q)}
            className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-600 bg-black bg-opacity-40 text-xs text-gray-300 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex-1 glass rounded-2xl p-6 overflow-y-auto mb-6 border border-opacity-20 flex flex-col gap-6" style={{ maxHeight: '60vh' }}>
        {messages.map((msg, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
             <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-[var(--color-primary)] text-white' : 'bg-black border border-[var(--color-secondary)] text-[var(--color-secondary)]'}`}>
               {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
             </div>
             <div className={`p-4 rounded-xl leading-relaxed text-sm ${
               msg.role === 'user' 
                 ? 'bg-gradient-to-br from-[var(--color-primary)] to-[#4a2b9e] text-white rounded-tr-sm shadow-md' 
                 : 'bg-black bg-opacity-60 border border-gray-700 text-gray-200 rounded-tl-sm'
             }`}>
               {msg.text}
             </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 self-start max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-black border border-[var(--color-secondary)] text-[var(--color-secondary)] flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-xl bg-black bg-opacity-60 border border-gray-700 text-gray-400 rounded-tl-sm flex items-center gap-2 text-sm">
              <Loader2 size={16} className="animate-spin text-[var(--color-secondary)]" /> Thinking...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about local civic services..." 
          className="w-full bg-black bg-opacity-60 border border-gray-600 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-[var(--color-secondary)] shadow-lg transition-all"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-secondary)] text-[var(--color-accent)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all"
        >
          <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
        </button>
      </form>
    </div>
  );
};

export default Assistant;