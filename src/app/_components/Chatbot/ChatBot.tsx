/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ChatBotProps {
  isLoggedIn: boolean;
}

export default function ChatBot({ isLoggedIn }: ChatBotProps) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      const fullText = data.message || '⚠️ Error: Failed to respond.';
      const assistantMessage = { role: 'assistant', content: '' };

      setMessages(prev => [...prev, assistantMessage]);

      // Typing animation - character by character
      for (let i = 0; i < fullText.length; i++) {
        await new Promise(res => setTimeout(res, 10)); // speed: 10ms per char
        setMessages(prev => {
          const updated = [...prev];
          const last = updated.length - 1;
          updated[last] = {
            ...updated[last],
            content: updated[last].content + fullText[i],
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Error: Unable to reach server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Hide chatbot if user is not logged in
  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-[400px] h-[550px] bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#00a89d] text-white rounded-t-2xl">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="animate-pulse w-5 h-5" />
              DogCare Assistant
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xl font-bold hover:scale-110 transform duration-200"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm bg-blue-50 scrollbar-thin">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] px-3 py-2 rounded-lg shadow ${
                  msg.role === 'user'
                    ? 'bg-[#20b4aa] text-white self-end ml-auto '
                    : 'bg-[#ffffff] border border-gray-300 text-gray-800 self-start mr-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 flex items-center border-t border-gray-200 gap-2 bg-white">
            <input
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-xl outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-[#00a89d] hover:bg-[#00968a] text-white px-4 py-2 rounded-r-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-[#00a67e] to-[#226059] hover:bg-[#00a89d] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 "
        >
          <Sparkles className='animate-bounce w-5 h-5' />
          Chat With DogCare
        </button>
      )}
    </div>
  );
}
