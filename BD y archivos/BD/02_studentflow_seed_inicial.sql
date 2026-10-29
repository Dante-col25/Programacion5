-- StudentFlow
-- Seed inicial para poblar la base de datos con un escenario coherente de uso.

USE studentflow;

INSERT INTO usuario (id_usuario, nombre, email, zona_horaria, idioma)
VALUES
  (1, 'Camilo Camacho', 'camilo.camacho@studentflow.local', 'America/Bogota', 'es-CO');

INSERT INTO configuracion_usuario (
  id_config,
  id_usuario,
  dias_panico,
  minutos_por_hora_estudio,
  tema_ia,
  duracion_pomodoro,
  descanso_corto,
  descanso_largo,
  ciclos_para_descanso_largo
)
VALUES
  (1, 1, 3, 50, 'Planificación académica semanal', 25, 5, 15, 4);

INSERT INTO materia (id_materia, id_usuario, nombre, codigo, color, creditos, activa)
VALUES
  (1, 1, 'Algoritmos', 'ALG-101', '#63C66D', 4, TRUE),
  (2, 1, 'Inteligencia Artificial', 'IA-202', '#74A7F7', 3, TRUE),
  (3, 1, 'Bases de Datos', 'BD-203', '#A689F5', 3, TRUE),
  (4, 1, 'Desarrollo Web', 'WEB-204', '#FFA33A', 4, TRUE),
  (5, 1, 'Matemáticas Discretas', 'MAT-205', '#F5629D', 3, TRUE);

INSERT INTO tarea (
  id_tarea,
  id_materia,
  titulo,
  descripcion,
  fecha_entrega,
  hora_entrega,
  prioridad,
  estado,
  carga_estimada_minutos,
  porcentaje_avance
)
VALUES
  (1, 1, 'Tarea 2 - Estructuras de datos', 'Resolver ejercicios de listas, pilas y colas.', '2026-08-20', '23:00:00', 'alta', 'en_progreso', 180, 55),
  (2, 2, 'Ensayo: Inteligencia Artificial', 'Redactar ensayo corto sobre sesgos en sistemas de IA.', '2026-08-22', '18:00:00', 'media', 'pendiente', 240, 10),
  (3, 3, 'Laboratorio 4 - Normalización', 'Aplicar 1FN, 2FN y 3FN al caso propuesto.', '2026-08-25', '20:00:00', 'alta', 'pendiente', 150, 0),
  (4, 4, 'Proyecto final - Entrega 1', 'Presentar wireframe y layout inicial del dashboard.', '2026-08-28', '17:00:00', 'alta', 'en_progreso', 360, 35),
  (5, 1, 'Leer capítulo 5', 'Lectura base sobre árboles binarios.', '2026-08-19', '21:00:00', 'baja', 'entregada', 60, 100),
  (6, 5, 'Taller de lógica proposicional', 'Resolver equivalencias y tablas de verdad.', '2026-08-26', '19:00:00', 'media', 'pendiente', 120, 0);

INSERT INTO subtarea (id_subtarea, id_tarea, titulo, estado, orden)
VALUES
  (1, 4, 'Definir layout general del dashboard', 'hecha', 1),
  (2, 4, 'Preparar barra lateral y encabezado', 'hecha', 2),
  (3, 4, 'Maquetar área de próximas entregas', 'pendiente', 3),
  (4, 1, 'Implementar ejemplos en JavaScript', 'hecha', 1),
  (5, 1, 'Documentar complejidad temporal', 'pendiente', 2);

INSERT INTO evento (
  id_evento,
  id_materia,
  titulo,
  descripcion,
  fecha,
  hora_inicio,
  hora_fin,
  tipo
)
VALUES
  (1, 1, 'Clase de Algoritmos', 'Sesión presencial sobre árboles y recorridos.', '2026-08-20', '08:00:00', '10:00:00', 'clase'),
  (2, 2, 'Clase de IA', 'Tema: agentes racionales y representación del conocimiento.', '2026-08-22', '10:00:00', '12:00:00', 'clase'),
  (3, 3, 'Clase de Bases de Datos', 'Tema: dependencias funcionales.', '2026-08-24', '11:00:00', '13:00:00', 'clase'),
  (4, 4, 'Asesoría de Desarrollo Web', 'Revisión del avance del wireframe.', '2026-08-21', '14:00:00', '15:00:00', 'reunion'),
  (5, 5, 'Quiz de Matemáticas Discretas', 'Evaluación corta de lógica proposicional.', '2026-08-27', '09:00:00', '10:00:00', 'examen');

INSERT INTO bloque_estudio (
  id_bloque,
  id_materia,
  id_tarea,
  titulo,
  fecha,
  hora_inicio,
  hora_fin,
  descripcion,
  origen
)
VALUES
  (1, 4, 4, 'Bloque diseño dashboard', '2026-08-20', '15:00:00', '17:00:00', 'Diseño del wireframe base de StudentFlow.', 'manual'),
  (2, 1, 1, 'Repaso estructuras de datos', '2026-08-21', '16:00:00', '18:00:00', 'Práctica con listas enlazadas y colas.', 'manual'),
  (3, 2, 2, 'Sesión de escritura del ensayo', '2026-08-22', '18:30:00', '20:00:00', 'Borrador inicial y revisión de fuentes.', 'ia');

INSERT INTO recordatorio (
  id_recordatorio,
  id_tarea,
  mensaje,
  fecha_hora,
  canal,
  leido
)
VALUES
  (1, 1, 'La tarea de Estructuras de datos vence mañana.', '2026-08-19 18:00:00', 'in_app', FALSE),
  (2, 4, 'Revisa el wireframe antes de la asesoría de Desarrollo Web.', '2026-08-21 09:00:00', 'in_app', FALSE),
  (3, 3, 'Laboratorio 4 entra en fase de urgencia alta.', '2026-08-23 08:00:00', 'in_app', FALSE);

INSERT INTO pomodoro_sesion (
  id_sesion,
  id_usuario,
  id_materia,
  id_tarea,
  minutos_enfoque,
  minutos_descanso,
  ciclos_completados,
  fecha_inicio,
  fecha_fin,
  origen
)
VALUES
  (1, 1, 1, 1, 25, 5, 1, '2026-08-18 17:00:00', '2026-08-18 17:30:00', 'temporizador'),
  (2, 1, 4, 4, 50, 10, 2, '2026-08-18 19:00:00', '2026-08-18 20:00:00', 'temporizador'),
  (3, 1, 2, 2, 25, 5, 1, '2026-08-19 07:00:00', '2026-08-19 07:30:00', 'manual');

INSERT INTO evaluacion (
  id_evaluacion,
  id_materia,
  nombre,
  porcentaje,
  nota,
  fecha,
  observaciones
)
VALUES
  (1, 1, 'Quiz 1', 15.00, 4.20, '2026-08-12', 'Buen resultado inicial.'),
  (2, 2, 'Ensayo corto', 20.00, NULL, '2026-08-22', 'Pendiente de entrega.'),
  (3, 3, 'Parcial 1', 30.00, 3.80, '2026-08-15', 'Debe reforzar normalización.');

INSERT INTO equipo_integrante (
  id_integrante,
  id_usuario,
  nombre,
  email,
  rol,
  activo
)
VALUES
  (1, 1, 'Camilo Camacho', 'camilo.camacho@studentflow.local', 'Líder', TRUE),
  (2, 1, 'Laura Gómez', 'laura.gomez@studentflow.local', 'Diseño UI', TRUE),
  (3, 1, 'David Ruiz', 'david.ruiz@studentflow.local', 'Apoyo desarrollo', TRUE);

INSERT INTO tarea_responsable (
  id_tarea_responsable,
  id_tarea,
  id_integrante,
  es_principal
)
VALUES
  (1, 4, 1, TRUE),
  (2, 4, 2, FALSE),
  (3, 3, 3, TRUE);
