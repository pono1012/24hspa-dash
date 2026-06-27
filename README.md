# 24H Spa Live Dashboard

![Dashboard Demo](public/demo.png)

A modular, drag-and-drop live telemetry and streaming dashboard built specifically for the CrowdStrike 24 Hours of Spa.

## Features

- **Draggable & Resizable Widgets**: Fully customizable layout powered by `react-rnd`. Layouts are automatically saved locally.
- **Live Timing Integration**: Embeds the official Swiss Timing live feed, bypassing client-side iframe restrictions.
- **Race Control**: Direct official notifications embedded alongside timing.
- **Accurate Track Weather**: Uses localized Circuit de Spa-Francorchamps weather data via the `yr.no` API.
- **Windy Radar**: Live precipitation radar overlay.
- **Live Onboards & Broadcast**: Integrated streaming views for a complete race center experience.

## Tech Stack

- React 19
- Vite
- Lucide React (Icons)
- Vercel Serverless (for proxy routing in production)

## Local Development

To run the dashboard locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

*Note: The local Vite proxy is configured to automatically rewrite Swiss Timing security checks and bypass Yr.no CORS restrictions.*

## Live Demo (Vercel)

The live demo of this dashboard can be deployed for free on Vercel. 
The repository includes `vercel.json` and a Serverless Function (`api/swisstiming-bypass.js`) to replicate the local proxy environment in production.

Simply link this repository to a new Vercel project to deploy!
