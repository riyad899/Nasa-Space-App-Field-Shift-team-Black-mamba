# Bangladesh Geospatial Intelligence & Environmental API Documentation (2024–2025)

Complete reference manual for all REST API endpoints, parameter inputs, query parameters, database schemas, and curl/fetch examples.

---

## 📌 Table of Contents
1. [Server Information & Base URLs](#1-server-information--base-urls)
2. [Reference Table: 18 Districts & Coordinates](#2-reference-table-18-districts--coordinates)
3. [Database Query Endpoints (Neon PostgreSQL - 13,158 Daily Records)](#3-database-query-endpoints-neon-postgresql)
   - [GET /api/v1/db/daily (Unlimited by Default)](#endpoint-1-get-apiv1dbdaily)
   - [GET /api/v1/db/timeseries/{district_name}](#endpoint-2-get-apiv1dbtimeseriesdistrict_name)
   - [GET /api/v1/db/summary/{district_name}](#endpoint-3-get-apiv1dbsummarydistrict_name)
   - [GET /api/v1/db/districts](#endpoint-4-get-apiv1dbdistricts)
   - [GET /api/v1/db/export/csv/{district_name}](#endpoint-5-get-apiv1dbexportcsvdistrict_name)
4. [Individual Dataset On-Demand APIs (Satellites & Earth Engine)](#4-individual-dataset-on-demand-apis)
   - [MODIS NDVI / EVI (Phase 1)](#endpoint-6-get--post-apiv1datasetsmodis-ndvi)
   - [MODIS Evapotranspiration (Phase 1)](#endpoint-7-get--post-apiv1datasetsmodis-et)
   - [Landsat 8 & 9 (30m) (Phase 2)](#endpoint-8-get--post-apiv1datasetslandsat)
   - [ECOSTRESS (70m Thermal Stress) (Phase 2)](#endpoint-9-get--post-apiv1datasetsecostress)
   - [SoilGrids v2.0 (Phase 2)](#endpoint-10-get--post-apiv1datasetssoilgrids)
   - [NASADEM Terrain & Erosion (Phase 2)](#endpoint-11-get--post-apiv1datasetsterrain)
   - [GEDI Canopy & Biomass (Optional)](#endpoint-12-get--post-apiv1datasetsgedi)
   - [All 7 Datasets Combined](#endpoint-13-get--post-apiv1datasetsall)
5. [District Shortcut Routes](#5-district-shortcut-routes)
6. [GeoTIFF Raster Export API (Google Drive)](#6-geotiff-raster-export-api)

---

## 1. Server Information & Base URLs

- **Local Base URL**: `http://localhost:8000`
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Interactive ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Database Backend**: Neon Serverless PostgreSQL (`13,158` pre-ingested continuous daily records, 731 days for 2024–2025 across all 18 districts).

### Starting the API Server:
```bash
cd "/Users/riyadussalehin/Desktop/dataset download and making api "
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 2. Reference Table: 18 Districts & Coordinates

These 18 districts are pre-indexed in the database with their respective SoilGrids, NASADEM, and GEDI baselines:

| # | District Name | Division | Latitude | Longitude | Agro-Ecological Zone |
|---|---|---|---|---|---|
| 1 | `Dhaka` | Dhaka | `23.8103` | `90.4125` | Madhupur Tract / Central Basin |
| 2 | `Chittagong` | Chattogram | `22.3569` | `91.7832` | Southeastern Coast & Hills |
| 3 | `Rajshahi` | Rajshahi | `24.3745` | `88.6042` | High Barind Tract (Drought prone) |
| 4 | `Khulna` | Khulna | `22.8456` | `89.5403` | Coastal Saline Zone / Ganges Tidal |
| 5 | `Barisal` | Barishal | `22.7010` | `90.3535` | Southern Delta / Lowland Estuary |
| 6 | `Sylhet` | Sylhet | `24.8949` | `91.8687` | Haor Basin, Wetlands & Tea Hills |
| 7 | `Rangpur` | Rangpur | `25.7439` | `89.2752` | Tista Meander Floodplain |
| 8 | `Mymensingh` | Mymensingh | `24.7471` | `90.4203` | Old Brahmaputra Floodplain |
| 9 | `Dinajpur` | Rangpur | `25.6217` | `88.6355` | Old Himalayan Piedmont Plain |
| 10 | `Bogura` | Rajshahi | `24.8465` | `89.3777` | Karatoya-Bangali Floodplain |
| 11 | `Comilla` | Chattogram | `23.4682` | `91.1788` | Middle Meghna Floodplain |
| 12 | `Jessore` | Khulna | `23.1664` | `89.2137` | High Ganges River Floodplain |
| 13 | `Pabna` | Rajshahi | `24.0116` | `89.2562` | Padma & Jamuna Confluence |
| 14 | `Tangail` | Dhaka | `24.2513` | `89.9167` | Jamuna Floodplain & Madhupur Forest |
| 15 | `Kushtia` | Khulna | `23.9013` | `89.1205` | Active Ganges Meander |
| 16 | `Sirajganj` | Rajshahi | `24.4534` | `89.7008` | Active Jamuna River Basin |
| 17 | `Faridpur` | Dhaka | `23.6071` | `89.8429` | Low Ganges Floodplain & Charland |
| 18 | `Natore` | Rajshahi | `24.4206` | `88.9868` | Chalan Beel Wetland Ecosystem |

---

## 3. Database Query Endpoints (Neon PostgreSQL)

These endpoints query the indexed PostgreSQL database directly with sub-millisecond execution times.

---

### Endpoint 1: `GET /api/v1/db/daily`
Query continuous daily records. **Returns UNLIMITED records by default** (all 731 days for a district, or across the whole country).

#### Query Input Parameters:
| Parameter | Type | Required | Default | Description | Example |
|---|---|---|---|---|---|
| `district` | `string` | Optional | `null` | Filter by district name | `Dhaka`, `Rajshahi` |
| `date_from` | `string` | Optional | `2024-01-01` | Start date (`YYYY-MM-DD`) | `2024-01-01` |
| `date_to` | `string` | Optional | `2025-12-31` | End date (`YYYY-MM-DD`) | `2025-12-31` |
| `min_ndvi` | `float` | Optional | `null` | Filter rows where NDVI ≥ value | `0.45` |
| `limit` | `integer` | Optional | `null` (**Unlimited**) | Number of records to return. Leave empty for all rows. | `50` or omitted |
| `offset` | `integer` | Optional | `0` | Skip first N rows (pagination) | `100` |

#### Output Response Fields:
- `id`: Unique record ID
- `district_name`: District name
- `date`: Date (`YYYY-MM-DD`)
- `year`, `month`, `day`, `day_of_year`: Date components
- `latitude`, `longitude`: Coordinate
- `ndvi`: Normalized Difference Vegetation Index (0.0 to 1.0)
- `evi`: Enhanced Vegetation Index
- `evapotranspiration_mm`: Actual daily crop evapotranspiration (mm/day)
- `potential_et_mm`: FAO-56 Penman-Monteith Potential ET (mm/day)
- `water_deficit_index`: Water deficit ratio `(PET - ET) / PET` (0.0 = no stress, 1.0 = extreme stress)
- `surface_temperature_celsius`: Daily land surface / air temperature (°C)
- `precipitation_mm`: Daily rainfall (mm)
- `soil_moisture_pct`: Root-zone volumetric soil moisture (%)
- `vegetation_condition_index`: Agricultural drought VCI (0 to 100)
- `thermal_stress_index`: High temperature stress indicator

#### Example Queries:
```bash
# 1. Fetch ALL 731 days for Rajshahi (Unlimited):
curl -X GET "http://localhost:8000/api/v1/db/daily?district=Rajshahi"

# 2. Fetch all districts for January 2024 where NDVI >= 0.40:
curl -X GET "http://localhost:8000/api/v1/db/daily?date_from=2024-01-01&date_to=2024-01-31&min_ndvi=0.40"

# 3. Fetch first 50 days for Dhaka:
curl -X GET "http://localhost:8000/api/v1/db/daily?district=Dhaka&limit=50"
```

---

### Endpoint 2: `GET /api/v1/db/timeseries/{district_name}`
Retrieves a complete continuous daily time-series array (731 days) for a single district.

#### URL & Query Parameters:
| Parameter | Location | Type | Required | Default | Description |
|---|---|---|---|---|---|
| `district_name` | Path | `string` | **Yes** | — | District name (`Dhaka`, `Sylhet`, etc.) |
| `date_from` | Query | `string` | Optional | `2024-01-01` | Start date (`YYYY-MM-DD`) |
| `date_to` | Query | `string` | Optional | `2025-12-31` | End date (`YYYY-MM-DD`) |

#### Example Query:
```bash
curl -X GET "http://localhost:8000/api/v1/db/timeseries/Mymensingh?date_from=2024-01-01&date_to=2025-12-31"
```

---

### Endpoint 3: `GET /api/v1/db/summary/{district_name}`
Computes an instant 2-year aggregated statistical profile directly in PostgreSQL using SQL aggregate functions.

#### URL & Query Parameters:
| Parameter | Location | Type | Required | Default | Description |
|---|---|---|---|---|---|
| `district_name` | Path | `string` | **Yes** | — | District name (e.g. `Dinajpur`) |
| `date_from` | Query | `string` | Optional | `2024-01-01` | Start date |
| `date_to` | Query | `string` | Optional | `2025-12-31` | End date |

#### Example Query:
```bash
curl -X GET "http://localhost:8000/api/v1/db/summary/Dinajpur"
```

#### Sample Response:
```json
{
  "source": "Neon PostgreSQL",
  "district": "Dinajpur",
  "period": { "date_from": "2024-01-01", "date_to": "2025-12-31" },
  "two_year_analytics": {
    "total_days_recorded": 731,
    "mean_ndvi": 0.4421,
    "max_ndvi": 0.7012,
    "min_ndvi": 0.2215,
    "mean_evi": 0.3583,
    "cumulative_et_mm": 1920.45,
    "total_precipitation_mm": 3890.5,
    "mean_water_deficit_index": 0.268,
    "mean_surface_temperature_c": 25.12,
    "max_surface_temperature_c": 36.4,
    "mean_soil_moisture_pct": 28.4,
    "extreme_heat_days_count": 4,
    "severe_water_stress_days_count": 132
  }
}
```

---

### Endpoint 4: `GET /api/v1/db/districts`
Retrieves all 18 districts with their permanent environmental baseline properties stored in the database.

#### Example Query:
```bash
curl -X GET "http://localhost:8000/api/v1/db/districts"
```

---

### Endpoint 5: `GET /api/v1/db/export/csv/{district_name}`
Directly streams all 731 daily records from PostgreSQL as a downloadable CSV file.

#### Example Query:
```bash
curl -O -J "http://localhost:8000/api/v1/db/export/csv/Khulna"
```

---

## 4. Individual Dataset On-Demand APIs

Each satellite and environmental dataset has dedicated `GET` and `POST` routes accepting coordinates and date ranges.

### Common Input Formats:

#### A. GET URL Query Parameters:
`?lat=23.8103&lon=90.4125&date_from=2024-01-01&date_to=2025-12-31`

#### B. POST JSON Body:
```json
{
  "latitude": 23.8103,
  "longitude": 90.4125,
  "date_from": "2024-01-01",
  "date_to": "2025-12-31"
}
```
*(Accepts either `latitude` or `lat`, `longitude` or `lon`, `date_from` or `start_date`, `date_to` or `end_date`)*

---

### Endpoint 6: `GET` & `POST` `/api/v1/datasets/modis-ndvi`
- **Dataset**: MODIS/Terra Vegetation Indices 16-Day Global 250m (`MODIS/061/MOD13Q1`)
- **Cadence**: 16-day composites
- **Outputs**: Scaled `NDVI` (0.0001), `EVI`, DetailedQA quality filtering.

```bash
# GET Query:
curl -X GET "http://localhost:8000/api/v1/datasets/modis-ndvi?lat=23.8103&lon=90.4125&date_from=2024-01-01&date_to=2025-12-31"

# POST Query:
curl -X POST "http://localhost:8000/api/v1/datasets/modis-ndvi" \
     -H "Content-Type: application/json" \
     -d '{"latitude": 23.8103, "longitude": 90.4125, "date_from": "2024-01-01", "date_to": "2025-12-31"}'
```

---

### Endpoint 7: `GET` & `POST` `/api/v1/datasets/modis-et`
- **Dataset**: MODIS/Terra Net Evapotranspiration 8-Day 500m Gap-Filled (`MODIS/061/MOD16A2GF`)
- **Cadence**: 8-day composites
- **Outputs**: `et_mm_8d`, `pet_mm_8d`, `latent_heat_flux`, `water_deficit_index`.

```bash
curl -X GET "http://localhost:8000/api/v1/datasets/modis-et?lat=24.3745&lon=88.6042&date_from=2024-01-01&date_to=2025-12-31"
```

---

### Endpoint 8: `GET` & `POST` `/api/v1/datasets/landsat`
- **Dataset**: Landsat 8 & Landsat 9 Collection 2 Tier 1 Level-2 Surface Reflectance (30m)
- **Masking**: Cloud, cirrus, and cloud shadow removed via `QA_PIXEL`.
- **Outputs**: `ndvi_30m`, `ndwi_30m` (water index), `ndbi_30m` (built-up), `lst_celsius` (Land Surface Temperature).

```bash
curl -X GET "http://localhost:8000/api/v1/datasets/landsat?lat=23.8103&lon=90.4125&date_from=2024-01-01&date_to=2025-12-31"
```

---

### Endpoint 9: `GET` & `POST` `/api/v1/datasets/ecostress`
- **Dataset**: NASA ECOSTRESS 70m Land Surface Temperature & Evapotranspiration (`ECOSTRESS/V002/L2_LSTE`)
- **Outputs**: Diurnal `lst_celsius_70m` for high-resolution agricultural thermal stress detection.

```bash
curl -X GET "http://localhost:8000/api/v1/datasets/ecostress?lat=23.8103&lon=90.4125&date_from=2024-01-01&date_to=2025-12-31"
```

---

### Endpoint 10: `GET` & `POST` `/api/v1/datasets/soilgrids`
- **Dataset**: ISRIC World Soil Information SoilGrids v2.0 (250m)
- **Depths**: `0-5cm`, `5-15cm`, `15-30cm`
- **Outputs**:
  - `phh2o`: Soil pH in $H_2O$
  - `clay`: Clay percentage (%)
  - `sand`: Sand percentage (%)
  - `silt`: Silt percentage (%)
  - `soc`: Soil Organic Carbon ($g/kg$)
  - `nitrogen`: Total Nitrogen ($g/kg$)

```bash
curl -X GET "http://localhost:8000/api/v1/datasets/soilgrids?lat=23.8103&lon=90.4125"
```

---

### Endpoint 11: `GET` & `POST` `/api/v1/datasets/terrain`
- **Dataset**: NASA NASADEM Merged Global DEM 1 arc-second 30m (`NASA/NASADEM_HGT/001`)
- **Outputs**: `elevation_m`, `slope_deg`, `aspect_deg`, `hillshade`, `erosion_slope_index`.

```bash
curl -X GET "http://localhost:8000/api/v1/datasets/terrain?lat=22.3569&lon=91.7832"
```

---

### Endpoint 12: `GET` & `POST` `/api/v1/datasets/gedi`
- **Dataset**: NASA GEDI on the International Space Station (`LARSE/GEDI/GEDI02_A_002_MONTHLY` & `004_A`)
- **Outputs**: `canopy_top_height_m` ($rh_{98}$) and `aboveground_biomass_mg_ha` ($Mg/ha$).

```bash
curl -X GET "http://localhost:8000/api/v1/datasets/gedi?lat=22.3569&lon=91.7832&date_from=2024-01-01&date_to=2025-12-31"
```

---

### Endpoint 13: `GET` & `POST` `/api/v1/datasets/all`
Unified endpoint pulling all 7 layers (Vegetation, Water Balance, Landsat, Thermal, Soil, Terrain, Biomass) in one combined JSON response.

```bash
curl -X POST "http://localhost:8000/api/v1/datasets/all" \
     -H "Content-Type: application/json" \
     -d '{
       "latitude": 23.8103,
       "longitude": 90.4125,
       "date_from": "2024-01-01",
       "date_to": "2025-12-31"
     }'
```

---

## 5. District Shortcut Routes

Query by name instead of coordinates:

```bash
# Query by name:
curl -X GET "http://localhost:8000/api/v1/districts/Dhaka?date_from=2024-01-01&date_to=2025-12-31"
curl -X GET "http://localhost:8000/api/v1/districts/Sylhet"
curl -X GET "http://localhost:8000/api/v1/districts/Bogura"

# List all 18 districts with lat/lon:
curl -X GET "http://localhost:8000/api/v1/districts"
```

---

## 6. GeoTIFF Raster Export API

Submit asynchronous background export tasks to Google Drive for nationwide GeoTIFF rasters:

### `POST /api/v1/export/raster`
#### JSON Payload Parameters:
| Field | Type | Required | Default | Allowed Values |
|---|---|---|---|---|
| `dataset_name` | `string` | **Yes** | — | `modis_ndvi`, `modis_et`, `landsat`, `terrain`, `gedi` |
| `date_from` | `string` | Optional | `2024-01-01` | Start date (`YYYY-MM-DD`) |
| `date_to` | `string` | Optional | `2025-12-31` | End date (`YYYY-MM-DD`) |
| `scale_m` | `integer` | Optional | `250` | Export pixel resolution (e.g., `30`, `60`, `250`, `500`) |
| `drive_folder` | `string` | Optional | `Bangladesh_Geospatial_2024_2025` | Destination folder in Google Drive |

#### Example Export Request:
```bash
curl -X POST "http://localhost:8000/api/v1/export/raster" \
     -H "Content-Type: application/json" \
     -d '{
       "dataset_name": "modis_ndvi",
       "date_from": "2024-01-01",
       "date_to": "2025-12-31",
       "scale_m": 250,
       "drive_folder": "Bangladesh_Geospatial_2024_2025"
     }'
```
Monitor export progress at: [https://code.earthengine.google.com/tasks](https://code.earthengine.google.com/tasks)
