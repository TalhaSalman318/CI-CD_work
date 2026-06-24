import { useState, useEffect } from "react";
import { CloudSun, HelpCircle, Layers, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import { WeatherData } from "./types";

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [dataSource, setDataSource] = useState<string | null>(null);

  // Lazy state initialization for recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("weather_recent_searches");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
    return [];
  });

  const handleSearch = async (city: string) => {
    if (!city.trim()) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `City "${city}" not found`);
      }

      const data: WeatherData = await response.json();
      setWeather(data);

      // Extract the source header to know if it's Live or Simulated
      const source = response.headers.get("x-data-source");
      setDataSource(source);

      // Add to recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== city.toLowerCase());
        const updated = [data.city, ...filtered].slice(0, 5);
        localStorage.setItem("weather_recent_searches", JSON.stringify(updated));
        return updated;
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch default city on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleSearch("New York");
  }, []);

  return (
    <div id="app-root" className="min-h-screen bg-[#05060f] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Immersive background atmosphere */}
      <div className="atmosphere"></div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header Section */}
        <header id="app-header" className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20 mb-4 border border-indigo-400/20">
            <CloudSun size={32} className="animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Weather Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Get instant weather forecasts, atmospheric metrics, and historical patterns for any city.
          </p>
        </header>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          error={error}
          recentSearches={recentSearches}
        />

        {/* Weather Results Panel */}
        <main id="app-main" className="mt-4 flex flex-col items-center">
          {isLoading && !weather ? (
            <div id="initial-loader" className="flex flex-col items-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-indigo-200/80 text-sm font-medium">Fetching meteorological data...</p>
            </div>
          ) : weather ? (
            <WeatherCard data={weather} />
          ) : (
            <div id="no-data" className="text-center py-16 glass border border-white/10 rounded-3xl p-8 max-w-md shadow-2xl backdrop-blur-md">
              <HelpCircle size={40} className="mx-auto text-slate-500 mb-3" />
              <p className="text-slate-300 font-medium font-sans">No weather information loaded.</p>
              <p className="text-xs text-slate-400 mt-1">Search for a city above to view real-time metrics.</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer / Configuration Info */}
      <footer id="app-footer" className="max-w-xl mx-auto w-full mt-12 pt-6 border-t border-white/5 text-center text-xs text-slate-400 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-500">
            {dataSource === "simulated" ? (
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-full font-medium border border-amber-500/20">
                <Layers size={12} /> Simulated Mode
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">
                <ShieldCheck size={12} /> Live API Mode
              </span>
            )}
          </div>
          <p className="text-slate-400">
            {dataSource === "simulated"
              ? "Add your OpenWeatherMap API key in the Secrets panel to activate live fetches."
              : "Live weather data provided by OpenWeatherMap API."}
          </p>
        </div>
      </footer>
    </div>
  );
}
