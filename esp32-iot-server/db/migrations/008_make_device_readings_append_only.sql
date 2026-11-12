-- Migration: 008_make_device_readings_append_only.sql
-- Description: Drop UNIQUE constraint on device_id in device_readings to enable append-only historical data storage. Never delete or overwrite readings.

ALTER TABLE device_readings 
  DROP CONSTRAINT IF EXISTS device_readings_device_id_key;

-- Ensure performance index for fast retrieval of the latest reading per device
CREATE INDEX IF NOT EXISTS idx_device_readings_device_created 
  ON device_readings (device_id, created_at DESC);
