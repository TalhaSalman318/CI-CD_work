import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  const mockWeatherResponse = {
    city: "New York",
    country: "US",
    temp: 22,
    feelsLike: 21,
    humidity: 60,
    windSpeed: 4,
    condition: "Clear",
    description: "clear sky",
    icon: "01d",
    high: 25,
    low: 19,
    forecast: [
      { day: "Monday", temp: 23, condition: "Clear", icon: "01d" },
      { day: "Tuesday", temp: 24, condition: "Clouds", icon: "02d" },
    ],
  };

  beforeEach(() => {
    // Mock the global fetch
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          headers: {
            get: () => "simulated",
          },
          json: () => Promise.resolve(mockWeatherResponse),
        })
      )
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the dashboard title and loads default weather on startup", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Weather Dashboard" })).toBeInTheDocument();

    // Verify loading message displays initially
    expect(screen.getByText(/fetching meteorological data/i)).toBeInTheDocument();

    // Wait for mock fetch to resolve and weather card to render
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /New York/i })).toBeInTheDocument();
    });

    expect(screen.getByText("22°C")).toBeInTheDocument();
    expect(screen.getByText("clear sky")).toBeInTheDocument();
  });
});
