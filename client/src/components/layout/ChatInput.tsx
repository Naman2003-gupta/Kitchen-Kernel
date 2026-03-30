import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useInventory } from '../../context/InventoryContext';

export default function ChatInput() {
  const [text, setText] = useState('');
  const { sendMessage, isLoading } = useChat();
  const { inventory } = useInventory();

  const handleSend = async () => {
    if (!text.trim() || isLoading) return;
    const msg = text.trim();
    setText('');
    await sendMessage(msg);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "What can I cook right now?",
    "Quick meal under 15 mins",
    "Use expiring ingredients",
    "Surprise me! 🎲",
  ];

  return (
    <div className="border-t border-kitchen-tan/30 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 transition-colors duration-200">
      {/* Quick prompts */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {quickPrompts.map(p => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            disabled={isLoading}
            className="text-xs bg-kitchen-warm dark:bg-gray-800 border border-kitchen-tan/30 dark:border-gray-600
                       text-kitchen-brown dark:text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap
                       hover:bg-kitchen-tan/20 dark:hover:bg-gray-700 transition-colors
                       disabled:opacity-50 flex-shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            className="input-field resize-none text-sm pr-4"
            rows={2}
            placeholder={
              inventory.length > 0
                ? `You have ${inventory.length} ingredients. Ask me what to cook...`
                : "Tell me what ingredients you have, or add them to your inventory..."
            }
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          className="btn-primary px-5 py-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳' : '➤'}
        </button>
      </div>
      <p className="text-xs text-kitchen-tan dark:text-gray-500 mt-2">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}