# 🏗️ System Architecture

[← Back to Main README](../README.md)

---

## 📌 Architecture Overview

**CropWise AI** follows a modular, decoupled architecture that connects frontend web applications, backend analytics services, Earth observation pipelines, statistical computing engines, AI assistant layers, and ESP32 IoT field nodes.

---

## 🔄 High-Level Architecture

The following diagram illustrates how user requests, telemetry streams, and satellite data flow through the platform:

```mermaid
flowchart TB
    FARMER["Farmer / Agronomist / User"]

    subgraph FRONTEND["Frontend Application (Next.js)"]
        UI["CropWise AI Dashboard"]
        MAP["Geospatial Visualization"]
        SI_UI["Statistical Intelligence"]
        AI_UI["AI Assistant"]
        IOT_UI["IoT Monitoring"]
    end

    subgraph BACKEND["Backend Services (Node.js & Express)"]
        API["API Layer"]
        CLIMATE["Climate Intelligence"]
        ENV["Environmental Intelligence"]
        FUSION["Data Fusion"]
        STAT["Statistical Intelligence Engine"]
        CROP["Crop Recommendation Engine"]
        DEVICE["Device Management"]
        AI["AI / RAG Services"]
    end

    subgraph DATA["External & Internal Data Sources"]
        NASA["NASA Earth Observation (POWER, IMERG, SMAP, MODIS)"]
        GEO["Geospatial Environmental API"]
        NEON["Neon PostgreSQL Database"]
        ESP["ESP32 IoT Field Device"]
    end

    FARMER --> UI
    UI --> MAP
    UI --> SI_UI
    UI --> AI_UI
    UI --> IOT_UI

    UI --> API
    API --> CLIMATE
    API --> ENV
    API --> FUSION
    API --> STAT
    API --> CROP
    API --> DEVICE
    API --> AI

    NASA --> CLIMATE
    GEO --> ENV
    NEON --> STAT
    NEON --> FUSION
    ESP --> DEVICE
    DEVICE --> FUSION
    CLIMATE --> FUSION
    ENV --> STAT
    FUSION --> STAT
    STAT --> CROP
    AI --> UI
    CROP --> UI
```

---

## 🔬 Data Processing Pipeline

This pipeline validates, aligns, and normalizes satellite observations and IoT telemetry before feeding them into statistical modeling and agricultural decision support:

```mermaid
flowchart TD
    A["NASA Satellite Data"] --> D["Data Collection"]
    B["Historical Environmental Records"] --> D
    C["ESP32 Sensor Measurements"] --> D

    D --> E["Data Validation"]
    E --> F["Quality Control"]
    F --> G["Spatial and Temporal Alignment"]
    G --> H["Unit Normalization"]

    H --> I["Environmental Observation Store"]

    I --> J["Statistical Analysis"]
    I --> K["Data Fusion"]
    I --> L["Environmental Assessment"]

    J --> M["Model Results"]
    K --> N["Satellite-Ground Comparison"]
    L --> O["Environmental Indicators"]

    M --> P["Agricultural Decision Support"]
    N --> P
    O --> P

    P --> Q["CropWise AI Dashboard UI"]
```

---

## 🧩 Architectural Modules

| Layer | Responsibility | Key Technologies |
| :--- | :--- | :--- |
| **Presentation Layer** | Responsive web dashboards, interactive maps, telemetry graphs, and AI chat. | Next.js 16, React 19, Tailwind CSS, TanStack Query, Mapbox GL |
| **Backend Core** | Business logic, authentication, geospatial parsing, and external API connectors. | Express 5, TypeScript, Prisma ORM |
| **Data Fusion & Stats Engine** | Multimodal data alignment, OLS regression, PCA, and K-Means clustering. | Node.js, Python statistical workflows |
| **Hardware & IoT Ingestion** | Ingesting real-time ambient and soil telemetry from distributed ESP32 nodes. | Express, PostgreSQL, WebSockets/REST |
| **Data Persistence** | Relational data, user configurations, historical timeseries, and device logs. | Neon PostgreSQL |

---

[← Back to Main README](../README.md) • [Next: Data Sources →](DATA_SOURCES.md)
