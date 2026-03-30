import { useChat } from '../../context/ChatContext';
import { Filters } from '../../types';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  value: string;
  options: FilterOption[];
  onChange: (val: string) => void;
}

function FilterPills({ value, options, onChange }: FilterGroupProps) {
  return (
    <div className="flex gap-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150 whitespace-nowrap
            ${value === opt.value
              ? 'bg-kitchen-orange text-white shadow-sm'
              : 'bg-kitchen-warm dark:bg-gray-800 text-kitchen-tan dark:text-gray-400 hover:text-kitchen-brown dark:hover:text-gray-200 hover:bg-kitchen-tan/20 dark:hover:bg-gray-700 border border-kitchen-tan/30 dark:border-gray-600'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function FilterBar() {
  const { filters, setFilters } = useChat();

  const update = (key: keyof Filters, value: string | number) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-kitchen-tan/20 dark:border-gray-700 px-4 py-3 transition-colors duration-200">
      <div className="flex flex-col gap-2">

        {/* Row 1 — Diet + Cuisine */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-kitchen-tan dark:text-gray-500 uppercase tracking-wider flex-shrink-0">Diet</span>
          <FilterPills
            value={filters.diet}
            onChange={v => update('diet', v)}
            options={[
              { value: 'any', label: '🍽️ Any' },
              { value: 'veg', label: '🌿 Veg' },
              { value: 'vegan', label: '🥦 Vegan' },
              { value: 'non-veg', label: '🍗 Non-Veg' },
              { value: 'keto', label: '🥑 Keto' },
              { value: 'high-protein', label: '💪 High Protein' },
            ]}
          />
        </div>

        {/* Row 2 — Cuisine + Time + Mode */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-kitchen-tan dark:text-gray-500 uppercase tracking-wider flex-shrink-0">Cuisine</span>
          <FilterPills
            value={filters.cuisine}
            onChange={v => update('cuisine', v)}
            options={[
              { value: 'any', label: '🌍 Any' },
              { value: 'indian', label: '🇮🇳 Indian' },
              { value: 'italian', label: '🇮🇹 Italian' },
              { value: 'chinese', label: '🇨🇳 Chinese' },
              { value: 'mexican', label: '🇲🇽 Mexican' },
              { value: 'american', label: '🇺🇸 American' },
            ]}
          />
          <div className="w-px h-4 bg-kitchen-tan/30 flex-shrink-0" />
          <FilterPills
            value={String(filters.maxTime)}
            onChange={v => update('maxTime', Number(v))}
            options={[
              { value: '15', label: '⚡ 15m' },
              { value: '30', label: '🕐 30m' },
              { value: '60', label: '🕑 1hr' },
              { value: '120', label: '🕑 2hr' },
            ]}
          />
          <div className="w-px h-4 bg-kitchen-tan/30 flex-shrink-0" />
          <FilterPills
            value={filters.mode}
            onChange={v => update('mode', v)}
            options={[
              { value: 'normal', label: '🍳 Normal' },
              { value: 'leftover', label: '♻️ Leftover' },
              { value: 'expiring', label: '⚠️ Expiring' },
            ]}
          />
        </div>

      </div>
    </div>
  );
}