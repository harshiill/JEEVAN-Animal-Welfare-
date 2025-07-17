'use client';
import { useState } from 'react';

export default function ChatBot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const data = await response.json();
    const botMessage = { role: 'assistant', content: data.message || '⚠️ Error: Failed to respond.' };

    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col border border-gray-200">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-500 text-white rounded-t-lg">
            <h2 className="text-sm font-semibold">DogCare Chatbot</h2>
            <button onClick={() => setOpen(false)} className="text-lg font-bold">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-gray-500 italic">Typing...</div>}
          </div>

          <div className="p-2 flex items-center border-t border-gray-300">
            <input
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-3 py-1 rounded-r text-sm"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-400 text-white px-4 py-2 rounded-full shadow-md text-sm hover:bg-blue-500"
        >
          💬 Ask DogCare
        </button>
      )}
    </div>
  );
}
