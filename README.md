# 🌱 CropWise AI
### Adapting Farms with NASA Data

**An AI-powered, climate-resilient agricultural decision-support platform that transforms NASA Earth observation data, historical environmental records, statistical modeling, and IoT-based field measurements into actionable agricultural insights.**

<p align="center">
  <img src="https://res.cloudinary.com/ogmllguj/image/upload/v1794494911/CropWise_AI_Logo_1.png" alt="CropWise AI Logo" width="450"/>
</p>

<p align="center">
  <b>Team:</b> Black Mamba · <b>Project:</b> CropWise AI · <b>Challenge:</b> NASA Space Apps Challenge
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-NASA%20Space%20Apps-0B6E4F?style=for-the-badge" alt="NASA Space Apps"/>
  <img src="https://img.shields.io/badge/AI-Environmental%20Intelligence-16A36A?style=for-the-badge" alt="AI"/>
  <img src="https://img.shields.io/badge/IoT-ESP32-007ACC?style=for-the-badge" alt="IoT"/>
  <img src="https://img.shields.io/badge/Architecture-Monorepo%20Workspaces-orange?style=for-the-badge" alt="Monorepo"/>
  <img src="https://img.shields.io/badge/Status-Development-blue?style=for-the-badge" alt="Status"/>
</p>

---

## 🧭 Documentation Portal (Explore by Route)

To keep documentation clean, modular, and easy to navigate, detailed architectural and scientific deep-dives are organized into dedicated documentation routes:

| Route / Section | Description | Direct Link |
| :--- | :--- | :---: |
| **🏗️ System Architecture** | High-level data pipelines, frontend/backend architecture, and flowcharts | [View Architecture →](docs/SYSTEM_ARCHITECTURE.md) |
| **🛰️ Data Sources & Datasets** | NASA POWER, GPM IMERG, SMAP, MODIS, Landsat, ECOSTRESS, SoilGrids | [View Data Sources →](docs/DATA_SOURCES.md) |
| **📊 Statistical Intelligence** | Regression, PCA, K-Means clustering, correlation, and model evaluation | [View Stats & Models →](docs/STATISTICAL_INTELLIGENCE.md) |
| **🔄 Data Fusion Engine** | Principles of satellite vs. in-situ ground sensor reconciliation | [View Data Fusion →](docs/DATA_FUSION.md) |
| **🔌 IoT Device & Hardware** | ESP32 wiring, GPIO pinout table, sensor specs, and telemetry format | [View Hardware Specs →](docs/IOT_HARDWARE.md) |
| **🔗 API Documentation** | Complete endpoint reference for IoT server and core backend services | [View API Reference →](docs/API_DOCUMENTATION.md) |
| **✨ Features & Decision Support** | Climate analysis, risk scoring, AI assistant, and crop rotation engine | [View Feature Guide →](docs/DECISION_SUPPORT_AND_FEATURES.md) |
| **🔬 Workflow & Limitations** | 7-step processing pipeline, scientific limitations, and future roadmap | [View Workflow →](docs/WORKFLOW_AND_LIMITATIONS.md) |
| **🖥️ Demo Screenshot Gallery** | Visual overview of all platform screens and dashboards | [View Demo Gallery →](docs/DEMO_GALLERY.md) |

---

## 🌍 Project Overview

Agriculture is increasingly affected by climate variability, unpredictable rainfall, extreme temperatures, soil degradation, and water scarcity. Farmers need understandable environmental information that helps them evaluate conditions, recognize risks, and make timely agronomic choices.

**CropWise AI** bridges the gap between satellite-based Earth observation, historical environmental records, artificial intelligence, statistical modeling, and real-world farm measurements.

### 🎯 Our Mission
To make advanced Earth observation, environmental analytics, and artificial intelligence directly accessible and actionable for farming communities.

### 🔭 Project Vision
> **Earth Data. Local Impact. Stronger Farms.**

---

## 🚨 The Problem & 💡 Our Solution

| The Challenge | CropWise AI Solution |
| :--- | :--- |
| **Unpredictable Rainfall & Drought** | Satellite precipitation tracking (GPM IMERG) + soil moisture (SMAP) + field sensors. |
| **Extreme Thermal Stress** | Real-time Land Surface Temperature (LST) and Thermal Stress Index (TSI) monitoring. |
| **Soil Degradation & Water Imbalance** | ISRIC SoilGrids texture analysis + MODIS Water Deficit Index ($WDI = 1 - ET/PET$). |
| **Disconnected Information Silos** | **Data Fusion Engine** synchronizing satellite passes with local ESP32 telemetry. |
| **Complex Scientific Data** | **RAG-powered AI Assistant** translating statistical models into plain-language advice. |

---

## 📁 Repository Structure

This repository is organized as an **npm workspaces monorepo**:

```text
├── client/             # Next.js 16 frontend web application
├── server/             # Express.js, TypeScript & Prisma core backend
├── esp32-iot-server/   # ESP32 telemetry ingestion server
├── docs/               # Modular deep-dive documentation pages
├── package.json        # Root npm workspaces configuration
└── .gitignore          # Root security configuration (protects all .env files)
```

---

## ⚙️ Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v7+ with workspaces support)
- **Git**
- **Neon PostgreSQL** database

### 2. Clone the Repository
```bash
git clone https://github.com/riyad899/Nasa-Space-App-Field-Shift-team-Black-mamba.git
cd Nasa-Space-App-Field-Shift-team-Black-mamba
```

### 3. Install All Dependencies (Single Command)
From the root directory, simply run:
```bash
npm install
```
> **Note:** Root `npm install` automatically traverses and installs all dependencies for `client`, `server`, and `esp32-iot-server` via npm workspaces.

### 4. Configure Environment Variables
Copy the example environment templates in each project directory:
```bash
# Core Backend
cp server/.env.example server/.env

# IoT Server
cp esp32-iot-server/.env.example esp32-iot-server/.env

# Frontend Client
cp client/.env.example client/.env.local
```
*(All `.env` files are strictly ignored by `.gitignore` to prevent secret leaks.)*

### 5. Running the Application
Run individual packages directly from the root workspace:

| Command | Action |
| :--- | :--- |
| `npm run dev:client` | Starts Next.js frontend on `http://localhost:3000` |
| `npm run dev:server` | Starts Express backend on `http://localhost:5000` |
| `npm run dev:iot` | Starts ESP32 IoT ingestion server |
| `npm run build:client` | Builds production client bundle |
| `npm run build:server` | Compiles TypeScript backend |

---

## 🧰 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query, Mapbox GL |
| **Backend** | Express 5, Node.js, TypeScript, Prisma ORM, Neon PostgreSQL |
| **IoT & Hardware** | ESP32, DHT11, Capacitive Soil Probe, Analog Rain Sensor, NEO-6M GPS, C++/Arduino |
| **Data Science & AI** | Python (NumPy, Pandas, SciPy, Scikit-learn), OLS Regression, PCA, K-Means, RAG |
| **Earth Observation** | NASA POWER, GPM IMERG, SMAP, MODIS, Landsat 8/9, ECOSTRESS, SoilGrids, NASADEM |

---

## 👥 Team Black Mamba

| Role | Domain Responsibilities |
| :--- | :--- |
| **Project Lead & Full-Stack** | System architecture, Next.js frontend, backend API design |
| **AI & Machine Learning** | RAG assistant, agronomic inference pipeline, LLM integration |
| **Data Science & Stats** | Statistical intelligence, OLS regression, PCA & clustering models |
| **IoT & Embedded Systems** | ESP32 firmware, sensor calibration, and telemetry ingestion |

---

## 🙏 Acknowledgements

We gratefully acknowledge the NASA Earth Science Division and open data platforms that make this work possible:
- **NASA POWER** · **NASA GPM IMERG** · **NASA SMAP** · **NASA MODIS**
- **USGS / NASA Landsat** · **NASA ECOSTRESS** · **NASADEM** · **GEDI**
- **ISRIC SoilGrids** · **NASA Space Apps Challenge Community**

---

## 📄 License

This project is developed for educational, research, and climate-resilience innovation purposes under the [MIT License](LICENSE).

<p align="center">
  <img src="https://res.cloudinary.com/ogmllguj/image/upload/v1794494911/CropWise_AI_Logo_1.png" alt="CropWise AI Logo" width="220"/>
  <br/><br/>
  <b>CropWise AI · Team Black Mamba</b><br/>
  <i>Earth Data. Local Impact. Stronger Farms.</i><br/>
  Made with 🌱 for a climate-resilient agricultural future.
</p>
