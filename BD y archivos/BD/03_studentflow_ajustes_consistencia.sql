-- StudentFlow
-- Ajustes incrementales de consistencia para una base ya creada.
-- Version corregida para ejecucion despues de un intento fallido parcial.

USE studentflow;

-- =========================================================
-- 0. Normalizacion previa de datos para evitar conflictos
-- =========================================================

UPDATE tarea
SET porcentaje_avance = 100
WHERE estado = 'entregada'
  AND porcentaje_avance < 100;

UPDATE tarea
SET porcentaje_avance = 0
WHERE estado = 'pendiente'
  AND porcentaje_avance > 0;

UPDATE tarea
SET estado = CASE
  WHEN porcentaje_avance >= 100 THEN 'entregada'
  ELSE 'en_progreso'
END
WHERE fecha_entrega < '2026-08-24'
  AND estado IN ('pendiente', 'en_progreso');

UPDATE recordatorio
SET leido = TRUE
WHERE fecha_hora < '2026-08-24 00:00:00'
  AND leido = FALSE;

-- =========================================================
-- 1. Indices de apoyo
-- Si el primer intento ya los creo, estas sentencias pueden fallar.
-- En ese caso, omitelas y sigue desde la seccion 2.
-- =========================================================

/* ALTER TABLE materia
  ADD UNIQUE KEY uq_materia_id_usuario (id_materia, id_usuario);

ALTER TABLE tarea
  ADD UNIQUE KEY uq_tarea_id_materia (id_tarea, id_materia);

ALTER TABLE equipo_integrante
  ADD UNIQUE KEY uq_integrante_id_usuario (id_integrante, id_usuario); */

-- =========================================================
-- 2. BLOQUE_ESTUDIO: consistencia tarea-materia
-- No se usa SET NULL porque id_materia es obligatorio.
-- Se usa RESTRICT para impedir borrar una tarea si todavia
-- existe un bloque ligado a ella y a su materia.
-- =========================================================

ALTER TABLE bloque_estudio
  ADD CONSTRAINT fk_bloque_estudio_tarea_materia
  FOREIGN KEY (id_tarea, id_materia)
  REFERENCES tarea (id_tarea, id_materia)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- =========================================================
-- 3. POMODORO_SESION: consistencia tarea-materia
-- Misma razon que en bloque_estudio.
-- =========================================================

ALTER TABLE pomodoro_sesion
  ADD CONSTRAINT fk_pomodoro_tarea_materia
  FOREIGN KEY (id_tarea, id_materia)
  REFERENCES tarea (id_tarea, id_materia)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- =========================================================
-- 4. TAREA_RESPONSABLE: impedir mezclar responsables de otro usuario
-- Si el primer intento ya agrego columnas, omite solo los ADD COLUMN
-- y ejecuta desde el UPDATE en adelante.
-- =========================================================

ALTER TABLE tarea_responsable
  ADD COLUMN id_usuario INT UNSIGNED NULL AFTER id_integrante,
  ADD COLUMN id_materia INT UNSIGNED NULL AFTER id_usuario;

UPDATE tarea_responsable tr
JOIN tarea t
  ON t.id_tarea = tr.id_tarea
JOIN materia m
  ON m.id_materia = t.id_materia
SET tr.id_materia = t.id_materia,
    tr.id_usuario = m.id_usuario
WHERE tr.id_materia IS NULL
   OR tr.id_usuario IS NULL;

ALTER TABLE tarea_responsable
  MODIFY COLUMN id_usuario INT UNSIGNED NOT NULL,
  MODIFY COLUMN id_materia INT UNSIGNED NOT NULL;

ALTER TABLE tarea_responsable
  ADD CONSTRAINT fk_tarea_responsable_tarea_materia
  FOREIGN KEY (id_tarea, id_materia)
  REFERENCES tarea (id_tarea, id_materia)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  ADD CONSTRAINT fk_tarea_responsable_integrante_usuario
  FOREIGN KEY (id_integrante, id_usuario)
  REFERENCES equipo_integrante (id_integrante, id_usuario)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  ADD CONSTRAINT fk_tarea_responsable_materia_usuario
  FOREIGN KEY (id_materia, id_usuario)
  REFERENCES materia (id_materia, id_usuario)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- =========================================================
-- 5. Verificaciones rapidas post-migracion
-- =========================================================

SELECT
  t.id_tarea,
  t.titulo,
  t.fecha_entrega,
  t.estado,
  t.porcentaje_avance
FROM tarea t
ORDER BY t.id_tarea;

SELECT
  tr.id_tarea_responsable,
  tr.id_tarea,
  tr.id_integrante,
  tr.id_usuario,
  tr.id_materia
FROM tarea_responsable tr
ORDER BY tr.id_tarea_responsable;
