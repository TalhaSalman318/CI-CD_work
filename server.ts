import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Simple hash function for consistent simulated weather per city name
function getCityHashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate realistic simulated weather data based on city name
function getSimulatedWeather(city: string): any {
  const normalized = city.trim().toLowerCase();
  const hash = getCityHashCode(normalized);

  // Default conditions mapping
  const conditions = ["Clear", "Clouds", "Rain", "Snow", "Thunderstorm"];
  const condition = conditions[hash % conditions.length];

  let temp = 10 + (hash % 20); // 10 to 29 °C
  let humidity = 40 + (hash % 50); // 40% to 90%
  let windSpeed = 1 + (hash % 10); // 1 to 10 m/s
  let description = "clear sky";

  if (condition === "Clouds") {
    description = hash % 2 === 0 ? "few clouds" : "overcast clouds";
    temp -= 3;
    humidity += 10;
  } else if (condition === "Rain") {
    description = hash % 2 === 0 ? "light rain" : "heavy intensity rain";
    temp -= 5;
    humidity += 25;
  } else if (condition === "Snow") {
    description = "light snow";
    temp = -5 + (hash % 8); // -5 to 2 °C
    humidity += 15;
  } else if (condition === "Thunderstorm") {
    description = "thunderstorm with rain";
    temp -= 2;
    humidity += 30;
    windSpeed += 4;
  }

  // Generate 5-day forecast
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIndex = new Date().getDay();
  const forecast = [];

  for (let i = 1; i <= 5; i++) {
    const dayName = daysOfWeek[(todayIndex + i) % 7];
    const forecastHash = hash + i;
    const fCondition = conditions[forecastHash % conditions.length];
    let fTemp = temp + ((forecastHash % 6) - 3); // temp variance

    if (fCondition === "Snow") fTemp = Math.min(fTemp, 2);

    forecast.push({
      day: dayName,
      temp: fTemp,
      condition: fCondition,
      icon: "01d", // representation
    });
  }

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: "SIM",
    temp,
    feelsLike: temp + (humidity > 70 ? 1 : -1),
    humidity,
    windSpeed,
    condition,
    description,
    icon: "01d",
    high: temp + 2 + (hash % 3),
    low: temp - 2 - (hash % 3),
    forecast,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON parsing
  app.use(express.json());

  // API Route: Get weather data
  app.get("/api/weather", async (req, res) => {
    const city = req.query.city as string;
    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const isMockOrEmpty = !apiKey || apiKey === "MY_OPENWEATHER_API_KEY" || apiKey.trim() === "";

    if (isMockOrEmpty) {
      // Simulate real latency
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockData = getSimulatedWeather(city);
      res.setHeader("x-data-source", "simulated");
      return res.json(mockData);
    }

    try {
      // Call Current Weather API
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;
      const currentRes = await fetch(currentWeatherUrl);

      if (!currentRes.ok) {
        if (currentRes.status === 404) {
          return res.status(404).json({ error: `City '${city}' not found` });
        }
        throw new Error(`OpenWeatherMap error: ${currentRes.statusText}`);
      }

      const currentData = await currentRes.json();

      // Call Forecast API (5 days, 3-hour steps)
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;
      const forecastRes = await fetch(forecastUrl);
      let forecastList = [];

      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        // Extract 1 forecast per day (we filter roughly midday forecast or every 8th slot)
        const dailySlots = forecastData.list || [];
        const filteredDays = new Map<string, any>();

        for (const slot of dailySlots) {
          const date = new Date(slot.dt * 1000);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

          // Skip today's forecast
          if (dayName === todayName) continue;

          // Prefer slots around midday (12:00:00)
          const hour = date.getHours();
          if (!filteredDays.has(dayName) || (hour >= 11 && hour <= 15)) {
            filteredDays.set(dayName, {
              day: dayName,
              temp: slot.main.temp,
              condition: slot.weather[0].main,
              icon: slot.weather[0].icon,
            });
          }
        }
        forecastList = Array.from(filteredDays.values()).slice(0, 5);
      }

      // Map combined data
      const mappedData = {
        city: currentData.name,
        country: currentData.sys.country,
        temp: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        high: currentData.main.temp_max,
        low: currentData.main.temp_min,
        forecast: forecastList,
      };

      res.setHeader("x-data-source", "openweathermap");
      return res.json(mappedData);
    } catch (err: any) {
      console.error("Failed to fetch weather:", err.message);
      return res.status(500).json({ error: "Failed to fetch weather details from server." });
    }
  });

  // Serve static assets / handle Vite in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Weather Server running at http://localhost:${PORT}`);
  });
}

startServer();
