import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WeatherCard from "./WeatherCard";
import { WeatherData } from "../types";

const mockWeatherData: WeatherData = {
  city: "San Francisco",
  country: "US",
  temp: 18.4,
  feelsLike: 15.0,
  humidity: 70,
  windSpeed: 4.5,
  condition: "Clouds",
  description: "scattered clouds",
  icon: "03d",
  high: 21.0,
  low: 15.0,
  forecast: [
    { day: "Thursday", temp: 19, condition: "Clear", icon: "01d" },
    { day: "Friday", temp: 20, condition: "Rain", icon: "02d" },
  ],
};

describe("WeatherCard Component", () => {
  it("renders city, country, temperature, condition and description", () => {
    render(<WeatherCard data={mockWeatherData} />);

    expect(screen.getByText("San Francisco")).toBeInTheDocument();
    expect(screen.getByText("US")).toBeInTheDocument();
    expect(screen.getByText("18°C")).toBeInTheDocument();
    expect(screen.getByText("Clouds")).toBeInTheDocument();
    expect(screen.getByText("scattered clouds")).toBeInTheDocument();
  });

  it("renders key metrics: humidity, wind speed, and high/low ranges", () => {
    render(<WeatherCard data={mockWeatherData} />);

    expect(screen.getByText("70%")).toBeInTheDocument();
    expect(screen.getByText("4.5 m/s")).toBeInTheDocument();
    expect(screen.getByText(/h: 21°/i)).toBeInTheDocument();
    expect(screen.getByText(/l: 15°/i)).toBeInTheDocument();
  });

  it("renders multi-day forecast cards correctly", () => {
    render(<WeatherCard data={mockWeatherData} />);

    expect(screen.getByText("Thursday")).toBeInTheDocument();
    expect(screen.getByText("19°")).toBeInTheDocument();

    expect(screen.getByText("Friday")).toBeInTheDocument();
    expect(screen.getByText("20°")).toBeInTheDocument();
  });
});
