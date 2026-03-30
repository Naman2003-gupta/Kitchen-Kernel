import { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, Recipe, Filters } from '../types';
import { generateRecipes } from '../services/gemini';
import { useInventory } from './InventoryContext';

interface ChatContextType {
  messages: ChatMessage[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

const defaultFilters: Filters = {
  diet: 'any',
  cuisine: 'any',
  maxTime: 60,
  difficulty: 'any',
  mode: 'normal',
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      type: 'ai-text',
      text: "👋 Welcome to Kitchen Kernel! Tell me what ingredients you have, or ask me what you can cook with your current inventory.",
      timestamp: new Date(),
    }
  ]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const { inventory } = useInventory();

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  };

  const sendMessage = async (text: string) => {
    // Add user message
    addMessage({ type: 'user', text });

    // Add loading indicator
    const loadingId = Date.now().toString() + '_loading';
    setMessages(prev => [...prev, {
      id: loadingId, type: 'ai-loading', timestamp: new Date()
    }]);
    setIsLoading(true);

    try {
      const result = await generateRecipes(text, inventory, filters);

      // Remove loading, add real response
      setMessages(prev => prev.filter(m => m.id !== loadingId));

      if (result.recipes && result.recipes.length > 0) {
        addMessage({ type: 'ai-text', text: result.replyText });
        addMessage({ type: 'ai-recipes', recipes: result.recipes });
      } else {
        addMessage({ type: 'ai-text', text: result.replyText });
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== loadingId));
      addMessage({ type: 'ai-text', text: "Sorry, something went wrong. Please try again!" });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([{
    id: '0', type: 'ai-text',
    text: "Chat cleared! What would you like to cook today?",
    timestamp: new Date()
  }]);

  return (
    <ChatContext.Provider value={{ messages, filters, setFilters, sendMessage, clearChat, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};