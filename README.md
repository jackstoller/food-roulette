# Food Roulette

Food Roulette is a web application that helps users decide where to eat by randomly selecting a restaurant from nearby options. It leverages the Google Maps and Places APIs to provide location-based restaurant suggestions.

## ⚠️ Disclaimer

**This project was created with the use of AI.** It is not intended to be used in a production system. The code does not always follow best practices, lacks proper security measures, and has minimal error handling. Use this project solely for educational purposes or as a learning reference—not.

## Getting Started

### Docker Build

**Prerequisites:**
- [Docker](https://www.docker.com/get-started) installed and running

**Steps:**

1. **Create a `.env` file** in the project root with your Google API keys:
   > **Note:** If you have an UAkron M365 account use [this link](https://uazips-my.sharepoint.com/:u:/g/personal/jas591_uakron_edu/IQCfcBRdqoivQa_ratM2hUhCAR209yphdWjz9YDRGxq_i3c?e=uvOGbc) to access my API keys

   Example:
   ```
   GOOGLE_PLACES_API_KEY=AIza...
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIza...
   NEXT_PUBLIC_GOOGLE_MAP_ID=aa125...
   ```

2. **Build and run with Docker Compose:**
   ```powershell
   docker-compose up --build
   ```

3. **Visit** `http://localhost:3000`

### Local Development

**Prerequisites:**
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

**Steps:**

1. Install dependencies:
   ```sh
   npm install
   ```
2. **Create a `.env` file** in the project root with your Google API keys:
   > **Note:** If you have an UAkron M365 account use [this link](https://uazips-my.sharepoint.com/:u:/g/personal/jas591_uakron_edu/IQCfcBRdqoivQa_ratM2hUhCAR209yphdWjz9YDRGxq_i3c?e=uvOGbc) to access my API keys

   Example:
   ```
   GOOGLE_PLACES_API_KEY=AIza...
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIza...
   NEXT_PUBLIC_GOOGLE_MAP_ID=aa125...
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```
4. Visit `http://localhost:3000`
