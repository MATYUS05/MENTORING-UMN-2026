// src/shared/components/ChatbotModal.tsx
import { useEffect, useRef, useState } from 'react';
import angry from '../../assets/chatbot/angry.svg';
import cheerful from '../../assets/chatbot/cheerful.svg';
import happy from '../../assets/chatbot/happy.svg';
import neutral from '../../assets/chatbot/neutral.svg';
import serious from '../../assets/chatbot/serious.svg';
import shy from '../../assets/chatbot/shy.svg';

type ChatEmotion = 'angry' | 'cheerful' | 'happy' | 'neutral' | 'serious' | 'shy';
type ChatSource = 'database' | 'gemini' | 'rate_limited' | 'error' | 'filter' | 'none';

interface ChatApiResponse {
  response: string;
  score: number;
  emotion: ChatEmotion;
  source: ChatSource;
}
interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  emotion?: ChatEmotion;
}

const BACKEND_URL = import.meta.env.VITE_CHATBOT_URL as string;

const emotionAssets: Record<ChatEmotion, string> = {
  angry,
  cheerful,
  happy,
  neutral,
  serious,
  shy,
};

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [emotion, setEmotion] = useState<ChatEmotion>('neutral');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text }]);
    setLoading(true);
    setStatus('Mencari jawaban...');
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data: ChatApiResponse = await res.json();
      if (data.source === 'gemini') {
        setStatus('Menghubungi asisten AI...');
      }
      setEmotion(data.emotion ?? 'neutral');
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'bot', text: data.response, emotion: data.emotion },
      ]);
    } catch (err) {
      console.error('Chatbot fetch error:', err);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'bot', text: 'Koneksi bermasalah, coba lagi.', emotion: 'shy' },
      ]);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70 sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div
        className="flex h-128 w-full max-w-sm flex-col overflow-hidden rounded-2xl border-2 border-neutral-stone/30 bg-neutral-surface shadow-xl dark:border-neutral-stone/20 dark:bg-neutral-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-secondary-deep px-4 py-3 text-white dark:bg-secondary-sky dark:text-neutral-charcoal-deep">
          <div className="flex items-center gap-2">
            <img src={emotionAssets[emotion]} alt={emotion} className="h-9 w-9" />
            <span className="font-body font-semibold">Chatbot Mentoring</span>
          </div>
          <button onClick={onClose} className="text-white/80 transition-colors duration-200 hover:text-white dark:text-neutral-charcoal-deep/70 dark:hover:text-neutral-charcoal-deep">
            ✕
          </button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'bot' && (
                <img src={emotionAssets[msg.emotion ?? 'neutral']} alt={msg.emotion} className="h-9 w-9 shrink-0" />
              )}
              <span
                className={`max-w-[75%] rounded-2xl px-4 py-2 font-body text-sm ${
                  msg.role === 'user'
                    ? 'bg-secondary-deep text-white dark:bg-secondary-sky dark:text-neutral-charcoal-deep'
                    : 'bg-neutral-cream text-neutral-charcoal dark:bg-neutral-charcoal-deep dark:text-neutral-cream'
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <p className="font-body text-xs text-neutral-stone">{status}</p>}
          <div ref={bottomRef} />
        </div>
        <div className="flex items-center gap-2 border-t-2 border-neutral-stone/25 px-3 py-3 dark:border-neutral-stone/15">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
            placeholder="Ketik pertanyaan..."
            className="flex-1 rounded-full border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-2 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-secondary-deep dark:border-neutral-stone/25 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-secondary-sky"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-full bg-secondary-deep px-4 py-2 font-body text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(40,100,174,0.45)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-secondary-sky dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(78,171,238,0.5)]"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}