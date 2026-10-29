# Verificacion de ajustes de StudentFlow

Este documento explica el uso del script [`04_verificacion_ajustes_studentflow.sql`](/D:/Downloads/camacho/2026B/programacionV/docs/BD/04_verificacion_ajustes_studentflow.sql).

## Proposito

El script sirve para comprobar que los ajustes aplicados previamente sobre la base `studentflow` quedaron correctos.

No modifica datos ni estructura. Solo ejecuta consultas de inspeccion y validacion.

## Cuando usarlo

Usalo despues de ejecutar:

- [`03_studentflow_ajustes_consistencia.sql`](/D:/Downloads/camacho/2026B/programacionV/docs/BD/03_studentflow_ajustes_consistencia.sql)

Tambien sirve cuando quieras revisar de nuevo si la base sigue consistente despues de cambios manuales en phpMyAdmin o despues de nuevas pruebas.

## Que valida

### 1. Estructura de tablas clave

Muestra el `SHOW CREATE TABLE` de:

- `studentflow.bloque_estudio`
- `studentflow.pomodoro_sesion`
- `studentflow.tarea_responsable`

Esto permite confirmar que las constraints nuevas quedaron realmente creadas.

### 2. Columnas agregadas en `tarea_responsable`

Consulta `INFORMATION_SCHEMA.COLUMNS` para verificar que existan y queden bien definidas:

- `id_tarea`
- `id_integrante`
- `id_usuario`
- `id_materia`

## 3. Constraints y llaves foraneas

Consulta `INFORMATION_SCHEMA.TABLE_CONSTRAINTS` y `INFORMATION_SCHEMA.KEY_COLUMN_USAGE` para listar:

- constraints de las tablas revisadas;
- columnas involucradas;
- tabla y columna referenciada.

Con eso puedes confirmar, por ejemplo, que existan:

- `fk_bloque_estudio_tarea_materia`
- `fk_pomodoro_tarea_materia`
- `fk_tarea_responsable_tarea_materia`
- `fk_tarea_responsable_integrante_usuario`
- `fk_tarea_responsable_materia_usuario`

### 4. Consistencia de datos

Ejecuta consultas que buscan inconsistencias reales:

- bloques de estudio ligados a tareas de otra materia;
- sesiones Pomodoro ligadas a tareas de otra materia;
- responsables asociados a tareas o integrantes de otro usuario.

Si estas consultas devuelven filas, hay un problema de integridad logica.

### 5. Estado actual de seed y normalizacion

Muestra:

- tareas con `id_tarea`, `titulo`, `fecha_entrega`, `estado` y `porcentaje_avance`;
- recordatorios con `id_recordatorio`, `mensaje`, `fecha_hora` y `leido`.

Esto ayuda a revisar si la normalizacion aplicada al 24 de agosto de 2026 quedo como esperabas.

### 6. Resumen final

El script termina con un resumen por conteos:

- `bloque_estudio_inconsistente`
- `pomodoro_inconsistente`
- `responsable_inconsistente`

Lo esperado es que los tres valores sean `0`.

## Como ejecutarlo

1. Abrir phpMyAdmin.
2. Ir a la pestaña `SQL`.
3. Pegar el contenido de [`04_verificacion_ajustes_studentflow.sql`](/D:/Downloads/camacho/2026B/programacionV/docs/BD/04_verificacion_ajustes_studentflow.sql).
4. Ejecutarlo completo.

El script ya usa nombres calificados como `studentflow.tabla`, por lo que no depende de tener `studentflow` como base activa en phpMyAdmin.

## Como interpretar el resultado

- Si no hay errores SQL y las consultas de inconsistencias salen vacias, la verificacion paso bien.
- Si el resumen final muestra `0` en los tres chequeos, la consistencia principal quedo validada.
- Si aparece alguna fila en los chequeos intermedios, esa fila señala exactamente el registro que hay que corregir.

## Alcance

Este script verifica la consistencia estructural y relacional de los ajustes realizados.

No reemplaza:

- pruebas funcionales del backend;
- validaciones de negocio en la aplicacion;
- revisiones manuales de datos insertados por usuarios reales.
