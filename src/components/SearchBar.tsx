import { useState, FormEvent } from "react";
import { Search, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  error?: string;
  recentSearches: string[];
}

export default function SearchBar({ onSearch, isLoading, error, recentSearches }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div id="search-container" className="w-full max-w-xl mx-auto mb-8 relative z-10">
      <form onSubmit={handleSubmit} className="relative flex items-center mb-4">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search size={20} />
        </div>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city (e.g. New York, London, Tokyo...)"
          className="w-full pl-12 pr-28 py-3.5 bg-black/30 border border-white/10 rounded-2xl shadow-lg text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-sans"
          disabled={isLoading}
        />
        <button
          id="search-button"
          type="submit"
          disabled={isLoading}
          className="absolute right-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center min-w-[70px] shadow-md shadow-indigo-600/20"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            "Search"
          )}
        </button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          id="search-error"
          className="text-rose-400 text-sm mb-4 pl-1"
        >
          {error}
        </motion.div>
      )}

      {recentSearches.length > 0 && (
        <div id="recent-searches" className="flex flex-wrap items-center gap-2 pl-1">
          <span className="text-xs text-slate-400 flex items-center mr-1">
            <MapPin size={12} className="mr-1" /> Recent:
          </span>
          {recentSearches.map((city, index) => (
            <motion.button
              key={`${city}-${index}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setQuery(city);
                onSearch(city);
              }}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
            >
              {city}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
