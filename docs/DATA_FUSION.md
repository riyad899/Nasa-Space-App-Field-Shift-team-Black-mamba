# 🔄 Data Fusion Engine

[← Back to Main README](../README.md)

---

CropWise AI's **Data Fusion Engine** unites top-down satellite observations with bottom-up in-situ IoT telemetry, delivering cross-calibrated ground truth for farm-level decision making.

---

## 🛰️ Top-Down vs. Bottom-Up Inputs

```mermaid
flowchart TD
    subgraph SATELLITE["Satellite & Historical Sources"]
        NASA_P["NASA POWER (Meteorology)"]
        IMERG["GPM IMERG (Precipitation)"]
        SMAP["SMAP SPL4SMGP (Soil Moisture)"]
        MODIS["MODIS (NDVI, ET, PET)"]
    end

    subgraph IOT["Local ESP32 In-Situ Telemetry"]
        DHT["DHT11 (Air Temp & Humidity)"]
        SOIL["Capacitive Soil Probe (ADC)"]
        RAIN["Analog Rain Sensor (ADC)"]
        GPS["GPS Module (Lat/Lon)"]
    end

    SATELLITE --> INGEST["Ingestion & Quality Filtering"]
    IOT --> INGEST

    INGEST --> ALIGN["Spatial & Temporal Alignment"]
    ALIGN --> NORM["Scale & Unit Normalization"]
    NORM --> FUSION["Fused Environmental State"]

    FUSION --> VALIDATE["Satellite vs Ground Cross-Validation"]
    FUSION --> DECISION["Farm Decision & Alert Engine"]
```

---

## 📐 Core Data Fusion Principles

1. **Preservation of Raw Provenance:**
   Raw telemetry (ADC integer counts, sensor voltages) is archived untouched alongside processed physical quantities.
2. **Dual Timestamping:**
   System records the device generation timestamp (`device_time`) and the cloud ingestion timestamp (`server_time`) independently to detect telemetry latency or offline buffering.
3. **Multi-Scale Spatial Reconciliation:**
   A single ground probe measures moisture in ~$10\text{ cm}^3$ of soil, while SMAP estimates represent a $9\times 9\text{ km}$ pixel. The engine interprets ground telemetry as a point anomaly detector within the macro satellite envelope, avoiding naive equivalence assumptions.
4. **Physical Calibration:**
   Analog wetness sensor voltages are converted to rainfall intensity only when paired with calibrated tipping bucket gauges; otherwise, they are categorized into discrete event classes (`Dry`, `Light Dew/Moisture`, `Active Rain`).

---

[← Back to Main README](../README.md) • [Next: IoT Hardware →](IOT_HARDWARE.md)
