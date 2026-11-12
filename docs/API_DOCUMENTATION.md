# 🔗 API Documentation

[← Back to Main README](../README.md)

---

CropWise AI provides REST APIs powering IoT ingestion, historical database queries, and geospatial analytical datasets.

---

## 📡 1. IoT Server API (`esp32-iot-server`)

- **Default Local Port:** `5001` / `3000`
- **Hosted Production URL:** `https://esp32-iot-cloude-connect.vercel.app`

### Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/device/data/latest?deviceId={id}` | Retrieve latest reported sensor reading for a specific device. |
| `GET` | `/api/device/status?deviceId={id}` | Retrieve device connection status, uptime, and last seen timestamp. |
| `GET` | `/api/device/auth?deviceId={id}` | Check device authentication state and authorization headers. |
| `POST` | `/api/device/auth` | Register or authenticate an ESP32 hardware device node. |
| `POST` | `/api/device/heartbeat` | Periodic ping confirming device connectivity. |
| `POST` | `/api/device/data` | Ingest a new telemetry snapshot from an authorized device. |

---

## 🌍 2. Core Backend & Geospatial API (`server`)

- **Default Local Port:** `5000` (or `8000` for Python FastAPI microservices)

### Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/db/daily` | Query historical daily environmental records across all monitored districts. |
| `GET` | `/api/v1/db/timeseries/:district` | Retrieve chronological time-series records for a specific district. |
| `GET` | `/api/v1/db/summary/:district` | Get statistical aggregation (mean, min, max, trend) for a district. |
| `GET` | `/api/v1/db/districts` | List all 18 supported districts in Bangladesh with bounding boxes. |
| `GET` | `/api/v1/datasets/modis-ndvi` | Query MODIS 16-day composite NDVI / EVI observations. |
| `GET` | `/api/v1/datasets/modis-et` | Query MODIS 8-day composite actual and potential evapotranspiration. |
| `GET` | `/api/v1/datasets/landsat` | High-resolution 30m Landsat spectral indices (NDVI, NDWI, LST). |
| `GET` | `/api/v1/datasets/ecostress` | High-resolution ECOSTRESS land surface temperature thermal points. |
| `GET` | `/api/v1/datasets/soilgrids` | Retrieve ISRIC SoilGrids multi-depth soil profile parameters. |
| `GET` | `/api/v1/datasets/terrain` | Query NASADEM elevation, slope, aspect, and terrain wetness index. |
| `GET` | `/api/v1/datasets/all` | Aggregated payload combining satellite, soil, and weather inputs for a coordinate. |
| `POST` | `/api/v1/export/raster` | Trigger an asynchronous raster export job for spatial bounding boxes. |

---

## 🤖 3. AI & Decision Support Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/cropwise-ai/chat` | Conversational RAG assistant grounded in NASA Earth observation data. |
| `POST` | `/api/v1/analyze-ai/recommendations` | Generate climate-resilient crop rotation recommendations. |
| `GET` | `/api/v1/statistical-intelligence/models` | Retrieve fitted regression, PCA variance, and cluster centroids. |

---

[← Back to Main README](../README.md) • [Next: Key Features & Decision Support →](DECISION_SUPPORT_AND_FEATURES.md)

