-- StudentFlow
-- Esquema MySQL corregido a partir del DER revisado.
-- Correcciones principales:
-- 1. Se agrega USUARIO y se conecta CONFIGURACION_USUARIO de forma real.
-- 2. EVENTO pertenece a MATERIA, no a TAREA.
-- 3. TAREA conserva un solo campo de estado; se elimina la duplicidad con "completada".
-- 4. BLOQUE_ESTUDIO puede relacionarse opcionalmente con una TAREA.

DROP DATABASE IF EXISTS studentflow;
CREATE DATABASE studentflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studentflow;

CREATE TABLE usuario (
  id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  zona_horaria VARCHAR(60) NOT NULL DEFAULT 'America/Bogota',
  idioma VARCHAR(10) NOT NULL DEFAULT 'es-CO',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuario_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE configuracion_usuario (
  id_config INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  dias_panico INT NOT NULL DEFAULT 3,
  minutos_por_hora_estudio INT NOT NULL DEFAULT 50,
  tema_ia VARCHAR(150) NULL,
  duracion_pomodoro INT NOT NULL DEFAULT 25,
  descanso_corto INT NOT NULL DEFAULT 5,
  descanso_largo INT NOT NULL DEFAULT 15,
  ciclos_para_descanso_largo INT NOT NULL DEFAULT 4,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_configuracion_usuario UNIQUE (id_usuario),
  CONSTRAINT fk_configuracion_usuario_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT chk_config_dias_panico CHECK (dias_panico BETWEEN 1 AND 30),
  CONSTRAINT chk_config_minutos_estudio CHECK (minutos_por_hora_estudio BETWEEN 1 AND 60),
  CONSTRAINT chk_config_pomodoro CHECK (duracion_pomodoro BETWEEN 5 AND 90),
  CONSTRAINT chk_config_descanso_corto CHECK (descanso_corto BETWEEN 1 AND 30),
  CONSTRAINT chk_config_descanso_largo CHECK (descanso_largo BETWEEN 5 AND 60),
  CONSTRAINT chk_config_ciclos CHECK (ciclos_para_descanso_largo BETWEEN 2 AND 10)
) ENGINE=InnoDB;

CREATE TABLE materia (
  id_materia INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  codigo VARCHAR(30) NOT NULL,
  color CHAR(7) NOT NULL,
  creditos TINYINT UNSIGNED NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_materia_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT uq_materia_usuario_codigo UNIQUE (id_usuario, codigo),
  CONSTRAINT uq_materia_usuario_nombre UNIQUE (id_usuario, nombre),
  CONSTRAINT chk_materia_color CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$')
) ENGINE=InnoDB;

CREATE TABLE tarea (
  id_tarea INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_materia INT UNSIGNED NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  fecha_entrega DATE NOT NULL,
  hora_entrega TIME NULL,
  prioridad ENUM('baja', 'media', 'alta') NOT NULL DEFAULT 'media',
  estado ENUM('pendiente', 'en_progreso', 'entregada', 'calificada', 'cancelada') NOT NULL DEFAULT 'pendiente',
  carga_estimada_minutos INT UNSIGNED NULL,
  porcentaje_avance TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tarea_materia
    FOREIGN KEY (id_materia) REFERENCES materia(id_materia)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT chk_tarea_carga_estimada CHECK (carga_estimada_minutos IS NULL OR carga_estimada_minutos > 0),
  CONSTRAINT chk_tarea_porcentaje_avance CHECK (porcentaje_avance BETWEEN 0 AND 100)
) ENGINE=InnoDB;

CREATE TABLE subtarea (
  id_subtarea INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_tarea INT UNSIGNED NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  estado ENUM('pendiente', 'hecha') NOT NULL DEFAULT 'pendiente',
  orden INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subtarea_tarea
    FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE evento (
  id_evento INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_materia INT UNSIGNED NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NULL,
  hora_fin TIME NULL,
  tipo ENUM('clase', 'examen', 'reunion', 'otro') NOT NULL DEFAULT 'clase',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_evento_materia
    FOREIGN KEY (id_materia) REFERENCES materia(id_materia)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT chk_evento_horas CHECK (hora_fin IS NULL OR hora_inicio IS NULL OR hora_fin > hora_inicio)
) ENGINE=InnoDB;

CREATE TABLE bloque_estudio (
  id_bloque INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_materia INT UNSIGNED NOT NULL,
  id_tarea INT UNSIGNED NULL,
  titulo VARCHAR(150) NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  descripcion TEXT NULL,
  origen ENUM('manual', 'pomodoro', 'ia') NOT NULL DEFAULT 'manual',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bloque_estudio_materia
    FOREIGN KEY (id_materia) REFERENCES materia(id_materia)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_bloque_estudio_tarea
    FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_bloque_horas CHECK (hora_fin > hora_inicio)
) ENGINE=InnoDB;

CREATE TABLE recordatorio (
  id_recordatorio INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_tarea INT UNSIGNED NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  fecha_hora DATETIME NOT NULL,
  canal ENUM('in_app', 'email') NOT NULL DEFAULT 'in_app',
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_recordatorio_tarea
    FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pomodoro_sesion (
  id_sesion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  id_materia INT UNSIGNED NULL,
  id_tarea INT UNSIGNED NULL,
  minutos_enfoque INT UNSIGNED NOT NULL,
  minutos_descanso INT UNSIGNED NOT NULL DEFAULT 0,
  ciclos_completados TINYINT UNSIGNED NOT NULL DEFAULT 1,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  origen ENUM('manual', 'temporizador') NOT NULL DEFAULT 'temporizador',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pomodoro_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_pomodoro_materia
    FOREIGN KEY (id_materia) REFERENCES materia(id_materia)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_pomodoro_tarea
    FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_pomodoro_minutos_enfoque CHECK (minutos_enfoque > 0),
  CONSTRAINT chk_pomodoro_minutos_descanso CHECK (minutos_descanso >= 0),
  CONSTRAINT chk_pomodoro_fechas CHECK (fecha_fin > fecha_inicio)
) ENGINE=InnoDB;

CREATE TABLE evaluacion (
  id_evaluacion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_materia INT UNSIGNED NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  porcentaje DECIMAL(5,2) NOT NULL,
  nota DECIMAL(4,2) NULL,
  fecha DATE NULL,
  observaciones TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_evaluacion_materia
    FOREIGN KEY (id_materia) REFERENCES materia(id_materia)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT chk_evaluacion_porcentaje CHECK (porcentaje > 0 AND porcentaje <= 100),
  CONSTRAINT chk_evaluacion_nota CHECK (nota IS NULL OR (nota >= 0 AND nota <= 5))
) ENGINE=InnoDB;

CREATE TABLE equipo_integrante (
  id_integrante INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NULL,
  rol VARCHAR(60) NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_equipo_integrante_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tarea_responsable (
  id_tarea_responsable INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_tarea INT UNSIGNED NOT NULL,
  id_integrante INT UNSIGNED NOT NULL,
  es_principal BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tarea_responsable_tarea
    FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_tarea_responsable_integrante
    FOREIGN KEY (id_integrante) REFERENCES equipo_integrante(id_integrante)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT uq_tarea_integrante UNIQUE (id_tarea, id_integrante)
) ENGINE=InnoDB;

CREATE INDEX idx_tarea_fecha_entrega ON tarea (fecha_entrega);
CREATE INDEX idx_tarea_estado ON tarea (estado);
CREATE INDEX idx_tarea_prioridad ON tarea (prioridad);
CREATE INDEX idx_evento_fecha ON evento (fecha);
CREATE INDEX idx_bloque_estudio_fecha ON bloque_estudio (fecha);
CREATE INDEX idx_recordatorio_fecha_hora ON recordatorio (fecha_hora);
CREATE INDEX idx_pomodoro_fecha_inicio ON pomodoro_sesion (fecha_inicio);
CREATE INDEX idx_evaluacion_fecha ON evaluacion (fecha);
