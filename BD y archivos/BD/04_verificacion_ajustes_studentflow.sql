-- StudentFlow
-- Verificacion no destructiva posterior a los ajustes de consistencia.
-- Ejecutar sobre la base `studentflow` desde phpMyAdmin.

-- =========================================================
-- 1. Verificar estructura final de tablas clave
-- =========================================================

SHOW CREATE TABLE studentflow.bloque_estudio;

SHOW CREATE TABLE studentflow.pomodoro_sesion;

SHOW CREATE TABLE studentflow.tarea_responsable;

-- =========================================================
-- 2. Verificar columnas agregadas en tarea_responsable
-- =========================================================

SELECT
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE,
  COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'studentflow'
  AND TABLE_NAME = 'tarea_responsable'
  AND COLUMN_NAME IN ('id_tarea', 'id_integrante', 'id_usuario', 'id_materia')
ORDER BY ORDINAL_POSITION;

-- =========================================================
-- 3. Verificar constraints creadas
-- =========================================================

SELECT
  tc.TABLE_NAME,
  tc.CONSTRAINT_NAME,
  tc.CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
WHERE tc.TABLE_SCHEMA = 'studentflow'
  AND tc.TABLE_NAME IN ('bloque_estudio', 'pomodoro_sesion', 'tarea_responsable')
ORDER BY tc.TABLE_NAME, tc.CONSTRAINT_TYPE, tc.CONSTRAINT_NAME;

SELECT
  kcu.TABLE_NAME,
  kcu.CONSTRAINT_NAME,
  kcu.COLUMN_NAME,
  kcu.REFERENCED_TABLE_NAME,
  kcu.REFERENCED_COLUMN_NAME,
  kcu.ORDINAL_POSITION
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
WHERE kcu.TABLE_SCHEMA = 'studentflow'
  AND kcu.TABLE_NAME IN ('bloque_estudio', 'pomodoro_sesion', 'tarea_responsable')
  AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY kcu.TABLE_NAME, kcu.CONSTRAINT_NAME, kcu.ORDINAL_POSITION;

-- =========================================================
-- 4. Verificar consistencia de datos relacionales
-- =========================================================

-- No debe haber bloques ligados a tareas de otra materia.
SELECT
  b.id_bloque,
  b.id_materia AS materia_bloque,
  b.id_tarea,
  t.id_materia AS materia_tarea
FROM studentflow.bloque_estudio b
JOIN studentflow.tarea t
  ON t.id_tarea = b.id_tarea
WHERE b.id_tarea IS NOT NULL
  AND b.id_materia <> t.id_materia;

-- No debe haber sesiones Pomodoro ligadas a tareas de otra materia.
SELECT
  p.id_sesion,
  p.id_materia AS materia_pomodoro,
  p.id_tarea,
  t.id_materia AS materia_tarea
FROM studentflow.pomodoro_sesion p
JOIN studentflow.tarea t
  ON t.id_tarea = p.id_tarea
WHERE p.id_tarea IS NOT NULL
  AND p.id_materia IS NOT NULL
  AND p.id_materia <> t.id_materia;

-- No debe haber responsables asociados a otro usuario.
SELECT
  tr.id_tarea_responsable,
  tr.id_tarea,
  tr.id_integrante,
  tr.id_usuario AS usuario_en_responsable,
  m.id_usuario AS usuario_real_de_la_tarea,
  ei.id_usuario AS usuario_real_del_integrante
FROM studentflow.tarea_responsable tr
JOIN studentflow.tarea t
  ON t.id_tarea = tr.id_tarea
JOIN studentflow.materia m
  ON m.id_materia = t.id_materia
JOIN studentflow.equipo_integrante ei
  ON ei.id_integrante = tr.id_integrante
WHERE tr.id_usuario <> m.id_usuario
   OR tr.id_usuario <> ei.id_usuario;

-- =========================================================
-- 5. Verificar normalizacion de seed y estado actual
-- =========================================================

SELECT
  id_tarea,
  titulo,
  fecha_entrega,
  estado,
  porcentaje_avance
FROM studentflow.tarea
ORDER BY id_tarea;

SELECT
  id_recordatorio,
  mensaje,
  fecha_hora,
  leido
FROM studentflow.recordatorio
ORDER BY id_recordatorio;

-- =========================================================
-- 6. Resumen esperado
-- =========================================================

SELECT 'bloque_estudio_inconsistente' AS chequeo, COUNT(*) AS total
FROM (
  SELECT b.id_bloque
  FROM studentflow.bloque_estudio b
  JOIN studentflow.tarea t
    ON t.id_tarea = b.id_tarea
  WHERE b.id_tarea IS NOT NULL
    AND b.id_materia <> t.id_materia
) x
UNION ALL
SELECT 'pomodoro_inconsistente', COUNT(*)
FROM (
  SELECT p.id_sesion
  FROM studentflow.pomodoro_sesion p
  JOIN studentflow.tarea t
    ON t.id_tarea = p.id_tarea
  WHERE p.id_tarea IS NOT NULL
    AND p.id_materia IS NOT NULL
    AND p.id_materia <> t.id_materia
) y
UNION ALL
SELECT 'responsable_inconsistente', COUNT(*)
FROM (
  SELECT tr.id_tarea_responsable
  FROM studentflow.tarea_responsable tr
  JOIN studentflow.tarea t
    ON t.id_tarea = tr.id_tarea
  JOIN studentflow.materia m
    ON m.id_materia = t.id_materia
  JOIN studentflow.equipo_integrante ei
    ON ei.id_integrante = tr.id_integrante
  WHERE tr.id_usuario <> m.id_usuario
     OR tr.id_usuario <> ei.id_usuario
) z;
