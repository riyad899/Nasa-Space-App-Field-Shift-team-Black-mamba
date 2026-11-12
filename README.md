# NASA Space Apps Challenge - Field Shift (Team Black Mamba)

A unified monorepo containing the full stack for the **Field Shift** project, including the frontend client, backend application server, and the ESP32 IoT hardware server.

---

## 📁 Repository Structure

```text
├── client/             # Next.js frontend application
├── server/             # Express.js & Prisma backend server
├── esp32-iot-server/   # ESP32 IoT integration server
├── package.json        # Root npm workspaces configuration
└── .gitignore          # Root gitignore protecting all environment files
```

---

## 🚀 Quick Start

### 1. Install All Dependencies

From the project root directory, run:

```bash
npm install
```

> **Note:** This repository uses **npm workspaces**. Running `npm install` at the root automatically installs dependencies for all sub-projects (`client`, `server`, and `esp32-iot-server`).

### 2. Environment Variables

Each service requires its own `.env` file for configuration. Copy the example files:

```bash
# Server
cp server/.env.example server/.env

# ESP32 IoT Server
cp esp32-iot-server/.env.example esp32-iot-server/.env

# Client
cp client/.env.example client/.env.local  # (or create client/.env)
```

Fill in the appropriate credentials and database URLs in each `.env` file.

---

## 🛠️ Running Services

You can run individual services directly from the root using workspace commands:

| Command | Description |
| :--- | :--- |
| `npm run dev:client` | Starts Next.js frontend development server |
| `npm run dev:server` | Starts the Express/Prisma backend server |
| `npm run dev:iot` | Starts the ESP32 IoT server |
| `npm run build:client` | Builds Next.js frontend production bundle |
| `npm run build:server` | Builds backend TypeScript bundle |

Or navigate to each folder independently:

```bash
cd client && npm run dev
cd server && npm run dev
cd esp32-iot-server && npm run dev
```

---

## 🔒 Security

All `.env` files across all directories are strictly ignored by `.gitignore` to prevent sensitive credentials and API keys from being committed.
