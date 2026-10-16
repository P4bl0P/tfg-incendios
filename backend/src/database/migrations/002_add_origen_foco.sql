ALTER TABLE focos_activos
ADD COLUMN IF NOT EXISTS origen VARCHAR(20);

UPDATE focos_activos
SET origen = CASE
  WHEN intensidad_frp IS NOT NULL THEN 'satelite'
  ELSE 'manual'
END
WHERE origen IS NULL;

ALTER TABLE focos_activos
ALTER COLUMN origen SET DEFAULT 'manual';

ALTER TABLE focos_activos
ALTER COLUMN origen SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'focos_activos_origen_check'
      AND conrelid = 'focos_activos'::regclass
  ) THEN
    ALTER TABLE focos_activos
    ADD CONSTRAINT focos_activos_origen_check
    CHECK (origen IN ('satelite', 'manual'));
  END IF;
END
$$;