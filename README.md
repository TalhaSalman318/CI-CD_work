# Weather Dashboard 🌤️

A beautiful, fast, and responsive React Weather Dashboard built with Vite, TypeScript, Tailwind CSS, Express, and Vitest.

Features high-fidelity live tracking of global weather conditions, multi-day forecasts, search history persistence, and a secure server-side API proxy that keeps external API credentials fully protected.

## Features

- 🔍 **Global City Search:** Instantly look up weather for any city worldwide.
- 📊 **Rich Meteorology Metrics:** View temperature, high/low range, "feels-like" temperature, wind speeds, and relative humidity.
- 📅 **Multi-day Forecast:** View upcoming atmospheric trends across a beautifully formatted 5-day cycle.
- 🕒 **Persistent Search History:** Easily reload previous queries with quick-access tabs stored in browser localStorage.
- 🔒 **Secure Express proxy:** Proxies third-party API calls securely on the backend to avoid exposing secret tokens to the client.
- 💡 **Graceful Fallbacks:** Seamlessly falls back to an intelligent mock simulation engine if no OpenWeatherMap credentials are provided, so the application remains immediately interactable.
- 🧪 **Comprehensive CI/CD Suite:** Fully configured with ESLint and Unit Tests using Vitest and React Testing Library.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Motion (Animations), Lucide React (Icons).
- **Backend Proxy:** Express, tsx (dev runner), esbuild (production bundling).
- **Testing:** Vitest, React Testing Library, JSDOM.
- **Linting:** ESLint, TypeScript compiler.

---

## Folder Structure

```text
├── .env.example            # Environment configurations blueprint
├── .eslintrc.json          # ESLint code style and quality rules
├── package.json            # Scripts, tooling, and package configurations
├── tsconfig.json           # TypeScript compilation settings
├── vite.config.ts          # Vite build and Vitest runner configuration
├── server.ts               # Express proxy server with simulated/live dual-engine
├── src/
│   ├── main.tsx            # DOM initialization entry point
│   ├── App.tsx             # Main dashboard controller and layout
│   ├── index.css           # Global Tailwind and premium typeface imports
│   ├── types.ts            # Strongly-typed Interfaces for weather data schemas
│   ├── setupTests.ts       # Test environment and matcher setup
│   ├── App.test.tsx        # App integration and fetch mock tests
│   └── components/
│       ├── SearchBar.tsx   # Custom city search form with history list
│       ├── SearchBar.test.tsx
│       ├── WeatherCard.tsx # Detailed current weather & multi-day forecasts
│       └── WeatherCard.test.tsx
```

---

## Local Development

### 1. Configure Secrets

Create a `.env` file at the project root based on the blueprint in `.env.example`:

```bash
# Obtain your free key from https://openweathermap.org/
OPENWEATHERMAP_API_KEY="your_api_key_here"
```

*Note: If no key is set, the application automatically boots into **Simulated Mode**, returning premium mock meteorological cycles for any city you search!*

### 2. Install Dependencies

Install the project packages:

```bash
npm install
```

### 3. Start Development Server

Run the full-stack development server:

```bash
npm run dev
```

The application will launch on port **3000** at `http://localhost:3000`.

---

## Quality Assurance & Testing

### Run Linting Suite

To check for syntax errors and enforce code standard practices:

```bash
npm run lint
```

### Run Unit Tests

To run the complete suite of Vitest and React Testing Library tests:

```bash
npm test
```

The test runner will run all tests (in App, SearchBar, and WeatherCard) in isolated jsdom environments and exit upon completion.

---

## Deployment & Production Build

### Compile and Bundle

Compile the TypeScript frontend assets and bundle the backend Express server:

```bash
npm run build
```

This compiles static assets into `dist/` and compiles/bundles `server.ts` into a self-contained, high-performance CommonJS file at `dist/server.cjs` using `esbuild`.

### Run Production Server

To start the bundled application:

```bash
npm run start
```
