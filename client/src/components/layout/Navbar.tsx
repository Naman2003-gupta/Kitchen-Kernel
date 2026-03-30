import { useRef, useEffect, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import ExpiryBadge from '../inventory/ExpiryBadge';

interface NavbarProps {
  onSavedClick: () => void;
  onShoppingClick: () => void;
}

function getDaysUntilExpiry(expiryDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Navbar({ onSavedClick, onShoppingClick }: NavbarProps) {
  const { clearChat } = useChat();
  const { isDark, toggleTheme } = useTheme();
  const { inventory } = useInventory();
  const [showAlerts, setShowAlerts] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const expiringItems = inventory.filter(i =>
    i.expiryDate && getDaysUntilExpiry(i.expiryDate) <= 3
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowAlerts(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="h-14 bg-white dark:bg-gray-900 border-b border-kitchen-tan/30 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm flex-shrink-0 transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🍳</span>
        <span className="font-display font-bold text-xl tracking-tight">
          <span className="text-kitchen-brown dark:text-gray-100">Kitchen</span>
          <span className="text-kitchen-orange"> Kernel</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button onClick={onShoppingClick} className="btn-secondary text-sm flex items-center gap-1">
          🛒 Shopping List
        </button>
        <button onClick={onSavedClick} className="btn-secondary text-sm flex items-center gap-1">
          ❤️ Saved Recipes
        </button>
        <button onClick={clearChat} className="btn-secondary text-sm flex items-center gap-1">
          🗑️ Clear Chat
        </button>

        {/* 🔔 Expiry Alerts */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowAlerts(prev => !prev)}
            className="relative w-9 h-9 rounded-xl bg-kitchen-warm dark:bg-gray-800 border border-kitchen-tan/30 dark:border-gray-600
                       flex items-center justify-center text-lg hover:bg-kitchen-tan/20 dark:hover:bg-gray-700
                       transition-all duration-200"
            title="Expiry Alerts"
          >
            🔔
            {expiringItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold
                               rounded-full flex items-center justify-center leading-none">
                {expiringItems.length}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showAlerts && (
            <div className="absolute right-0 top-11 w-72 bg-white dark:bg-gray-800 border border-kitchen-tan/20
                            dark:border-gray-700 rounded-2xl shadow-card-hover z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-kitchen-tan/20 dark:border-gray-700">
                <p className="font-display font-bold text-kitchen-brown dark:text-gray-100 text-sm">
                  Expiry Alerts
                </p>
                <p className="text-xs text-kitchen-tan dark:text-gray-400 mt-0.5">
                  Ingredients expiring within 3 days
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {expiringItems.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-2xl mb-1">✅</p>
                    <p className="text-sm text-kitchen-tan dark:text-gray-400">
                      All ingredients are fresh!
                    </p>
                  </div>
                ) : (
                  expiringItems.map(item => (
                    <div
                      key={item._id}
                      className="px-4 py-3 border-b border-kitchen-tan/10 dark:border-gray-700/50
                                 hover:bg-kitchen-warm dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-kitchen-brown dark:text-gray-100 capitalize">
                          {item.name}
                        </p>
                        <ExpiryBadge expiryDate={item.expiryDate!} />
                      </div>
                      <p className="text-xs text-kitchen-tan dark:text-gray-400 mt-0.5">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {expiringItems.length > 0 && (
                <div className="px-4 py-3 border-t border-kitchen-tan/20 dark:border-gray-700">
                  <p className="text-xs text-kitchen-tan dark:text-gray-400 text-center">
                    💡 Ask Kitchen Kernel to use these first!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-kitchen-warm dark:bg-gray-800 border border-kitchen-tan/30 dark:border-gray-600
                     flex items-center justify-center text-lg hover:bg-kitchen-tan/20 dark:hover:bg-gray-700
                     transition-all duration-200"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}