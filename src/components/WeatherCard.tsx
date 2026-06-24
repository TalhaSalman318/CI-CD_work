import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Thermometer, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { WeatherData } from "../types";

interface WeatherCardProps {
  data: WeatherData;
}

export default function WeatherCard({ data }: WeatherCardProps) {
  // Map weather condition to appropriate Lucide Icon
  const getWeatherIcon = (condition: string, size = 48) => {
    const cond = condition.toLowerCase();
    if (cond.includes("clear") || cond.includes("sun")) {
      return <Sun size={size} className="text-amber-400 animate-pulse" />;
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      return <CloudRain size={size} className="text-sky-400 animate-bounce" style={{ animationDuration: '3s' }} />;
    } else if (cond.includes("snow")) {
      return <CloudSnow size={size} className="text-blue-300" />;
    } else if (cond.includes("thunder")) {
      return <CloudLightning size={size} className="text-yellow-300" />;
    }
    return <Cloud size={size} className="text-slate-300" />;
  };

  // Get background and card theme based on weather condition
  const getThemeStyles = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("clear") || cond.includes("sun")) {
      return {
        bg: "glass border-amber-500/20 shadow-[0_8px_32px_0_rgba(245,158,11,0.05)]",
        pill: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
        accent: "text-amber-400",
      };
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      return {
        bg: "glass border-sky-500/20 shadow-[0_8px_32px_0_rgba(14,165,233,0.05)]",
        pill: "bg-sky-500/10 text-sky-300 border border-sky-500/20",
        accent: "text-sky-400",
      };
    } else if (cond.includes("snow")) {
      return {
        bg: "glass border-blue-400/20 shadow-[0_8px_32px_0_rgba(96,165,250,0.05)]",
        pill: "bg-blue-400/10 text-blue-300 border border-blue-400/20",
        accent: "text-blue-400",
      };
    } else if (cond.includes("thunder")) {
      return {
        bg: "glass border-violet-500/20 shadow-[0_8px_32px_0_rgba(139,92,246,0.05)]",
        pill: "bg-violet-500/10 text-violet-300 border border-violet-500/20",
        accent: "text-violet-400",
      };
    }
    return {
      bg: "glass border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.02)]",
      pill: "bg-white/5 text-slate-300 border border-white/10",
      accent: "text-indigo-400",
    };
  };

  const theme = getThemeStyles(data.condition);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      id="weather-card"
      className="w-full max-w-xl mx-auto relative z-10"
    >
      {/* Current Weather Card */}
      <div className={`p-8 rounded-3xl border ${theme.bg} mb-6 backdrop-blur-md transition-all relative overflow-hidden`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${theme.pill}`}>
              {data.condition}
            </span>
            <h2 id="city-name" className="text-3xl sm:text-4xl font-light text-white mt-3 flex items-baseline tracking-tight">
              {data.city}
              <span className="text-sm font-medium text-slate-400 ml-2">{data.country}</span>
            </h2>
            <p className="text-sm text-indigo-300 font-medium italic capitalize mt-1">{data.description}</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-md">
            {getWeatherIcon(data.condition, 48)}
          </div>
        </div>

        <div className="flex items-center space-x-6 mb-8 mt-6">
          <span id="current-temp" className="text-6xl sm:text-7xl font-bold text-white tracking-tighter temp-glow leading-none">
            {Math.round(data.temp)}°C
          </span>
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1 font-mono text-indigo-300 uppercase tracking-widest text-[10px]">
              <span>H: {Math.round(data.high)}°</span>
              <span>•</span>
              <span>L: {Math.round(data.low)}°</span>
            </div>
            <div>
              Feels like <span className="font-semibold text-white">{Math.round(data.feelsLike)}°C</span>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 border border-white/5 text-sky-400 rounded-xl">
              <Droplets size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Humidity</div>
              <div id="humidity-value" className="text-sm font-bold text-white font-mono">{data.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 border border-white/5 text-teal-400 rounded-xl">
              <Wind size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Wind</div>
              <div id="wind-value" className="text-sm font-bold text-white font-mono">{data.windSpeed} m/s</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 border border-white/5 text-amber-400 rounded-xl">
              <Thermometer size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Real Feel</div>
              <div id="feels-like-value" className="text-sm font-bold text-white font-mono">{Math.round(data.feelsLike)}°</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      {data.forecast && data.forecast.length > 0 && (
        <div id="forecast-container" className="p-6 bg-black/40 border border-white/5 rounded-3xl shadow-xl backdrop-blur-md">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4 flex items-center gap-1.5 pl-1">
            <Calendar size={13} className="text-indigo-400" /> Multi-Day Forecast
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {data.forecast.map((item, idx) => (
              <div
                key={`${item.day}-${idx}`}
                className="flex flex-col items-center p-3 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <span className="text-[10px] text-slate-400 font-semibold mb-2 uppercase tracking-wider">{item.day}</span>
                <div className="mb-2 bg-white/5 p-1.5 rounded-xl border border-white/5">
                  {getWeatherIcon(item.condition, 20)}
                </div>
                <span className="text-xs font-bold text-white font-mono">{Math.round(item.temp)}°</span>
                <span className="text-[9px] text-indigo-300 capitalize mt-1 truncate max-w-full text-center">
                  {item.condition}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
