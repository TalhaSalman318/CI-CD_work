export interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  high: number;
  low: number;
  forecast: ForecastDay[];
}

export interface SearchHistoryItem {
  id: string;
  city: string;
  timestamp: string;
}
