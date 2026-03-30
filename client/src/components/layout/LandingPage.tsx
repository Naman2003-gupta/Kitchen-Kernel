import { useRef } from 'react';
import InventorySidebar from '../inventory/InventorySidebar';
import FilterBar from '../filters/FilterBar';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import heroBg from '../../assets/hero-bg2.jpg';

export default function LandingPage() {
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="overflow-y-auto h-full bg-kitchen-cream dark:bg-gray-950 transition-colors duration-200">

      {/* ─── HERO ─── */}
      <section
        className="section-pad min-h-[90vh] flex flex-col justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-kitchen-cream/85 dark:bg-gray-950/90 transition-colors duration-200" />

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-kitchen-orange/5 rounded-full -translate-y-1/2 translate-x-1/2 z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-kitchen-tan/10 rounded-full translate-y-1/2 -translate-x-1/2 z-10" />

        {/* Hero content */}
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-kitchen-orange/10 dark:bg-kitchen-orange/20 text-kitchen-orange px-4 py-2 rounded-full text-sm font-medium mb-6">
            🍳 AI-Powered Kitchen Assistant
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-kitchen-brown dark:text-gray-100 leading-tight mb-6">
            Cook Smarter,<br />
            <span className="text-kitchen-orange">Waste Less.</span>
          </h1>
          <p className="text-xl text-kitchen-tan dark:text-gray-400 leading-relaxed mb-8 max-w-xl font-sans font-light">
            Tell Kitchen Kernel what's in your fridge and get instant, personalized recipe ideas — no guesswork, no waste.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button onClick={scrollToChat} className="btn-primary px-8 py-3 text-base">
              Start Cooking →
            </button>
            <a href="#features" className="btn-secondary px-8 py-3 text-base">
              See Features
            </a>
          </div>
        </div>

        {/* Floating ingredient pills */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-10">
          {['🥚 Eggs', '🧅 Onion', '🥛 Milk', '🍅 Tomato', '🌶️ Chilli'].map((item, i) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-800 shadow-card rounded-xl px-4 py-2 text-sm text-kitchen-brown dark:text-gray-200 font-medium border border-kitchen-tan/20 dark:border-gray-700"
              style={{ transform: `translateX(${i % 2 === 0 ? '0' : '20px'})` }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="bg-kitchen-orange py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { value: '500+', label: 'Recipe Combinations' },
            { value: '15+', label: 'Cuisine Types' },
            { value: '0', label: 'Food Wasted' },
            { value: '∞', label: 'Possibilities' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-bold">{stat.value}</p>
              <p className="text-white/80 text-sm mt-1 font-sans">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="section-pad bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-kitchen-brown dark:text-gray-100 mb-4">
              Everything your kitchen needs
            </h2>
            <p className="text-kitchen-tan dark:text-gray-400 text-lg font-sans font-light max-w-xl mx-auto">
              From smart inventory tracking to AI-powered recipe generation — Kitchen Kernel has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🧠', title: 'AI Recipe Generation', desc: 'Get personalized recipes based on exactly what you have. No hallucinations, no missing ingredients.' },
              { emoji: '📦', title: 'Smart Inventory', desc: 'Track quantities, categories, and expiry dates. Get alerts before food goes bad.' },
              { emoji: '🔄', title: 'Ingredient Substitutions', desc: "No butter? No problem. Kitchen Kernel suggests smart swaps so you're never stuck." },
              { emoji: '🛒', title: 'Shopping List', desc: 'Missing an ingredient? Add it to your shopping list instantly from the recipe card.' },
              { emoji: '📊', title: 'Nutrition Estimates', desc: 'Get rough calorie, protein, carb and fat estimates for every generated recipe.' },
              { emoji: '👨‍🍳', title: 'Step-by-Step Cooking', desc: 'Follow along with one step at a time — like having a chef guide you through the kitchen.' },
            ].map(f => (
              <div key={f.title} className="card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-kitchen-brown dark:text-gray-100 text-lg mb-2 font-display">{f.title}</h3>
                <p className="text-kitchen-tan dark:text-gray-400 text-sm leading-relaxed font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section-pad bg-kitchen-warm dark:bg-gray-900/50 transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-kitchen-brown dark:text-gray-100 mb-4">How it works</h2>
            <p className="text-kitchen-tan dark:text-gray-400 font-sans font-light">Three simple steps to your next meal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', emoji: '📝', title: 'Add your ingredients', desc: 'Type in what you have in your fridge, pantry, or anywhere in your kitchen.' },
              { step: '02', emoji: '💬', title: 'Ask Kitchen Kernel', desc: 'Type a message or click "What can I cook right now?" and let AI do the thinking.' },
              { step: '03', emoji: '🍽️', title: 'Cook & enjoy', desc: 'Follow the step-by-step guide, track nutrition, and save your favorites.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-kitchen-orange rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-card">
                  {s.emoji}
                </div>
                <div className="text-xs font-bold text-kitchen-orange tracking-widest mb-2">{s.step}</div>
                <h3 className="font-bold text-kitchen-brown dark:text-gray-100 text-lg mb-2 font-display">{s.title}</h3>
                <p className="text-kitchen-tan dark:text-gray-400 text-sm leading-relaxed font-sans">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHAT SECTION ─── */}
      <section ref={chatRef} id="chat" className="section-pad bg-kitchen-cream dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-kitchen-brown dark:text-gray-100 mb-4">
              Ready to cook? 🍳
            </h2>
            <p className="text-kitchen-tan dark:text-gray-400 font-sans font-light">
              Add your ingredients and start chatting with your AI kitchen assistant
            </p>
          </div>

          <div className="flex rounded-3xl overflow-hidden shadow-2xl border border-kitchen-tan/20 dark:border-gray-700 h-[680px]">
            <InventorySidebar />
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
              <FilterBar />
              <ChatWindow />
              <ChatInput />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-kitchen-brown dark:bg-gray-900 border-t dark:border-gray-700 text-white py-10 px-6 text-center transition-colors duration-200">
        <p className="font-display text-2xl font-bold mb-2">🍳 Kitchen Kernel</p>
        <p className="text-white/60 text-sm font-sans">
          Built with ❤️ — AI-powered cooking assistant
        </p>
        <p className="text-white/40 text-xs mt-4 font-sans">
          Optimizes food usage · Reduces waste · Intelligent cooking assistance
        </p>
      </footer>
    </div>
  );
}