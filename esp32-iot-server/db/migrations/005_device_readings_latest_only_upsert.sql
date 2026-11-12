-- Migration: 005_device_readings_latest_only_upsert.sql
-- Description: Enforce latest-only PostgreSQL UPSERT strategy per device_id

-- 1. Previous deduplication disabled to protect historical data (NEVER DELETE DB DATA)
-- DELETE FROM device_readings a USING device_readings b ... [DISABLED]

-- 2. Add UNIQUE constraint on device_id to support ON CONFLICT (device_id) DO UPDATE
ALTER TABLE device_readings 
  DROP CONSTRAINT IF EXISTS device_readings_device_id_key;

ALTER TABLE device_readings 
  ADD CONSTRAINT device_readings_device_id_key UNIQUE (device_id);
