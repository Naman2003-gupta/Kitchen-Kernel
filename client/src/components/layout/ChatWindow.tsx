import { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import RecipeCardMessage from '../recipe/RecipeCardMessage';

export default function ChatWindow() {
  const { messages } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 bg-kitchen-cream dark:bg-gray-950 transition-colors duration-200">
      {messages.map(msg => {
        if (msg.type === 'user') return (
          <div key={msg.id} className="flex justify-end">
            <div className="bg-kitchen-orange text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-md shadow-sm">
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        );

        if (msg.type === 'ai-loading') return (
          <div key={msg.id} className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card border border-kitchen-tan/20 dark:border-gray-700">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-kitchen-orange rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-kitchen-orange rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-kitchen-orange rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        );

        if (msg.type === 'ai-text') return (
          <div key={msg.id} className="flex justify-start">
            <div className="flex items-start gap-2 max-w-lg">
              <div className="w-8 h-8 bg-kitchen-orange rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm mt-1">
                🍳
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card border border-kitchen-tan/20 dark:border-gray-700">
                <p className="text-sm text-kitchen-brown dark:text-gray-200 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        );

        if (msg.type === 'ai-recipes') return (
          <div key={msg.id} className="flex justify-start w-full">
            <div className="flex items-start gap-2 w-full">
              <div className="w-8 h-8 bg-kitchen-orange rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm mt-1">
                🍳
              </div>
              <RecipeCardMessage recipes={msg.recipes || []} />
            </div>
          </div>
        );

        return null;
      })}
      <div ref={bottomRef} />
    </div>
  );
}