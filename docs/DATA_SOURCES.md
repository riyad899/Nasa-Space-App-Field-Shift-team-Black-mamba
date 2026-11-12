# 🛰️ Data Sources and Datasets

[← Back to Main README](../README.md)

---

CropWise AI harnesses multi-mission satellite Earth observations, geospatial models, and historical environmental databases to assess climate and soil conditions for agriculture.

---

## 📋 Comprehensive Dataset Index

| Dataset / Product | Platform / Agency | Primary Parameters | Spatial Resolution | Temporal Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **NASA POWER** | NASA LaRC | Temp, Precipitation, Solar Radiation | 0.5° × 0.5° | Daily |
| **GPM IMERG** | NASA / JAXA | Precipitation rate & accumulation | 0.1° × 0.1° (~10 km) | 30-min / Daily |
| **SMAP SPL4SMGP** | NASA JPL | Surface & Root-zone soil moisture | ~9 km | 3-hourly |
| **MODIS MOD13Q1** | NASA Terra/Aqua | NDVI, EVI (Vegetation health) | 250 m | 16-day composite |
| **MODIS MOD16A2GF** | NASA Terra/Aqua | ET, PET, Water Deficit Index | 500 m | 8-day composite |
| **Landsat 8 & 9** | USGS / NASA | NDVI, NDWI, NDBI, Land Surface Temp | 30 m | 16 days |
| **ECOSTRESS** | NASA JPL / ISS | High-resolution Land Surface Temp | ~70 m | 1 to 5 days |
| **SoilGrids v2.0** | ISRIC | pH, Clay, Sand, Silt, SOC, Nitrogen | 250 m | Static (Multi-depth) |
| **NASADEM** | NASA / USGS | Elevation, Slope, Aspect, Hillshade | 30 m | Static |
| **GEDI** | NASA / UMD | Canopy height & Above-ground biomass | 25 m footprints | Sampled tracks |
| **Historical DB** | CropWise AI Core | 18 BD districts, 731 days (2024–2025) | District-level | Daily (13,158 records) |

---

## 🔍 Detailed Data Descriptions

### 1. NASA POWER
- **Purpose:** Historical meteorological and solar climatology.
- **Variables:** Daily maximum/minimum air temperature, cumulative precipitation, surface solar irradiance, relative humidity.
- **Resource:** [NASA POWER Portal](https://power.larc.nasa.gov/)

### 2. NASA GPM IMERG (Integrated Multi-satellitE Retrievals for GPM)
- **Purpose:** Satellite-based precipitation monitoring.
- **Runs Supported:** Early Run (near real-time), Late Run (monitoring), Final Run (research-grade calibrated).
- **Applications:** Drought onset detection, heavy rainfall alarms, rainfall deficit calculations, validation with ground rain sensors.
- **Resource:** [NASA GPM IMERG](https://gpm.nasa.gov/data/imerg)

### 3. NASA SMAP (Soil Moisture Active Passive)
- **Product:** SPL4SMGP (Level-4 Surface and Root Zone Soil Moisture).
- **Purpose:** Quantitative global soil moisture estimates down to 1 m depth.
- **Applications:** Root-zone water availability, agricultural drought monitoring, ground sensor validation.
- **Resource:** [NASA SMAP](https://smap.jpl.nasa.gov/)

### 4. MODIS Vegetation Indices (MOD13Q1)
- **Purpose:** Macro vegetation greenness and canopy dynamics.
- **Metrics:** Normalized Difference Vegetation Index (NDVI), Enhanced Vegetation Index (EVI).
- **Quality Control:** Filtered with DetailedQA pixel quality bands to remove cloud/aerosol contamination.
- **Resource:** [NASA MODIS MOD13Q1](https://modis.gsfc.nasa.gov/data/dataprod/mod13.php)

### 5. MODIS Evapotranspiration (MOD16A2GF)
- **Purpose:** Actual Evapotranspiration (ET) and Potential Evapotranspiration (PET).
- **Applications:** Crop water requirement calculations, Water Deficit Index ($WDI = 1 - ET/PET$), drought stress indices.
- **Resource:** [NASA MODIS MOD16A2GF](https://modis.gsfc.nasa.gov/data/dataprod/mod16.php)

### 6. Landsat 8 and Landsat 9 (Collection 2 Level-2)
- **Purpose:** Field-level multispectral surface analysis.
- **Resolution:** 30 m spatial resolution.
- **Derived Indices:**
  - **NDVI:** Canopy vigor
  - **NDWI:** Crop canopy water content
  - **NDBI:** Soil exposure vs built-up
  - **LST:** High-resolution Land Surface Temperature (thermal band)
- **Resource:** [USGS Landsat](https://www.usgs.gov/landsat-missions)

### 7. ECOSTRESS (ECOsystem Spaceborne Thermal Radiometer Experiment on Space Station)
- **Product:** L2_LSTE (Land Surface Temperature & Emissivity).
- **Purpose:** Diurnal thermal stress and plant water stress detection at ~70 m resolution.
- **Resource:** [NASA ECOSTRESS](https://ecostress.jpl.nasa.gov/)

### 8. ISRIC SoilGrids v2.0
- **Purpose:** Global digital soil mapping using machine learning models.
- **Depths Sampled:** 0–5 cm, 5–15 cm, 15–30 cm.
- **Key Parameters:** Soil pH, Clay/Sand/Silt percentages, Soil Organic Carbon (SOC) stock, Total Nitrogen.
- **Resource:** [ISRIC SoilGrids](https://soilgrids.org/)

### 9. NASADEM
- **Purpose:** High-accuracy digital elevation models (DEM) reprocessed from SRTM.
- **Derived Products:** Slope (run-off velocity), Aspect (solar exposure), Topographic Wetness Index (TWI).
- **Resource:** [NASA LP DAAC NASADEM](https://lpdaac.usgs.gov/products/nasadem_hgtv001/)

### 10. GEDI (Global Ecosystem Dynamics Investigation)
- **Purpose:** High-resolution laser altimetry of canopy structure.
- **Note:** Sampled footprints (not a continuous grid); used for micro-climate shading context.
- **Resource:** [GEDI NASA/UMD](https://gedi.umd.edu/)

### 11. Historical Geospatial District Database
- **Geographic Coverage:** 18 key agricultural districts of Bangladesh (e.g., Bogura, Rajshahi, Dinajpur, Jessore, Sylhet, etc.).
- **Timespan:** 731 contiguous days spanning 2024 to 2025 (13,158 daily records).
- **Tracked Parameters:** NDVI, EVI, ET, PET, WDI, LST, Precipitation, Soil Moisture, Vegetation Condition Index (VCI), Thermal Stress Index (TSI).

---

[← Back to Main README](../README.md) • [Next: Statistical Intelligence →](STATISTICAL_INTELLIGENCE.md)
