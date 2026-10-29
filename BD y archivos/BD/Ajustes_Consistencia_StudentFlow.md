# Ajustes de consistencia para StudentFlow

Este documento acompaña el script [`03_studentflow_ajustes_consistencia.sql`](/D:/Downloads/camacho/2026B/programacionV/docs/BD/03_studentflow_ajustes_consistencia.sql).

Tambien puedes usar el script [`04_verificacion_ajustes_studentflow.sql`](/D:/Downloads/camacho/2026B/programacionV/docs/BD/04_verificacion_ajustes_studentflow.sql) para comprobar que la estructura y los datos quedaron consistentes despues de aplicar los cambios.

## Objetivo

Aplicar correcciones sobre una base `studentflow` que ya existe, sin volver a crear tablas ni volver a cargar todo el esquema.

Los ajustes atacan dos problemas:

- inconsistencias relacionales que el modelo original permitia;
- datos seed que, al 24 de agosto de 2026, ya quedaron parcialmente desfasados para pruebas.

## Cambios que hace el script

### 1. Normaliza estados y recordatorios historicos

- Si una tarea esta `entregada`, fuerza `porcentaje_avance = 100`.
- Si una tarea esta `pendiente`, fuerza `porcentaje_avance = 0`.
- Si una tarea vencio antes del `2026-08-24` y seguia activa:
  - pasa a `entregada` si ya estaba al 100%;
  - pasa a `en_progreso` si sigue incompleta.
- Marca como `leido = TRUE` los recordatorios anteriores al `2026-08-24 00:00:00`.

Esto deja el seed mas coherente para dashboard, agenda y logica de urgencia.

### 2. Refuerza la consistencia entre `bloque_estudio` y `tarea`

Agrega una clave foranea compuesta para obligar que, si un `bloque_estudio` apunta a una `tarea`, esa tarea pertenezca a la misma `materia`.

Problema que evita:

- un bloque guardado con `id_materia = 3` y `id_tarea = 9`, cuando la tarea 9 realmente pertenece a otra materia.

Importante:

- la version corregida usa `ON DELETE RESTRICT`, no `ON DELETE SET NULL`;
- la razon es que `id_materia` en `bloque_estudio` es obligatoria (`NOT NULL`), asi que MariaDB no puede anular una FK compuesta completa al borrar una tarea.

### 3. Refuerza la consistencia entre `pomodoro_sesion` y `tarea`

Aplica la misma regla anterior sobre `pomodoro_sesion`.

Problema que evita:

- registrar una sesion Pomodoro ligada a una tarea de una materia distinta a la materia registrada en la sesion.

### 4. Refuerza la consistencia de `tarea_responsable`

El modelo original permitia asignar a una tarea un integrante perteneciente a otro usuario.

Para corregirlo, el script:

- agrega `id_usuario` e `id_materia` en `tarea_responsable`;
- rellena esos campos a partir de la tarea ya existente;
- crea claves foraneas compuestas para que:
  - la tarea pertenezca a la materia indicada;
  - el integrante pertenezca al usuario indicado;
  - la materia tambien pertenezca al mismo usuario.

Con eso se evita mezclar responsables de otro propietario cuando el sistema evolucione a autenticacion o multiusuario.

## Orden recomendado de ejecucion

1. Abrir phpMyAdmin.
2. Seleccionar la base `studentflow`.
3. Ir a la pestaña `SQL`.
4. Pegar el contenido de [`03_studentflow_ajustes_consistencia.sql`](/D:/Downloads/camacho/2026B/programacionV/docs/BD/03_studentflow_ajustes_consistencia.sql).
5. Ejecutarlo completo una sola vez.

## Si ya te fallo una vez

Si el error aparecio en la seccion de `bloque_estudio`, lo normal es que:

- las sentencias `UPDATE` iniciales ya se hayan ejecutado;
- los tres indices unicos de apoyo ya se hayan creado;
- las FK nuevas todavia no existan.

En ese caso, vuelve a ejecutar el script corregido, pero:

1. si falla en la seccion 1 por `duplicate key name`, omite esas tres sentencias `ALTER TABLE ... ADD UNIQUE KEY`;
2. continua desde la seccion 2 en adelante.

## Advertencias

- El script esta pensado para una base creada desde `01_studentflow_schema_mysql.sql` y poblada con `02_studentflow_seed_inicial.sql`.
- No es idempotente. Si lo ejecutas dos veces, los `ALTER TABLE ... ADD ...` van a fallar porque las columnas, llaves y constraints ya existirian.
- Si ya insertaste datos manuales distintos al seed, conviene exportar un respaldo antes de correrlo.

## Resultado esperado

Despues de ejecutarlo:

- la base sigue siendo la misma `studentflow`;
- no se recrean tablas;
- los datos quedan mas coherentes para pruebas al 24 de agosto de 2026;
- el modelo queda mejor preparado para backend, validaciones y multiusuario futuro.

## Verificacion posterior

Despues de aplicar el ajuste, ejecuta [`04_verificacion_ajustes_studentflow.sql`](/D:/Downloads/camacho/2026B/programacionV/docs/BD/04_verificacion_ajustes_studentflow.sql).

Ese script no modifica datos. Solo:

- muestra el `SHOW CREATE TABLE` de las tablas clave;
- lista las constraints creadas;
- revisa que no existan inconsistencias relacionales en `bloque_estudio`, `pomodoro_sesion` y `tarea_responsable`;
- muestra el estado final de `tarea` y `recordatorio`;
- entrega un resumen con conteos esperados en cero para las inconsistencias.
