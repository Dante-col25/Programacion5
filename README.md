# StudentFlow - Programación

Repositorio del proyecto de clase.

- `studentFlow_back/`: API REST (Node.js + Express + MySQL) con el CRUD de **materias**.
- `BD y archivos/`: scripts SQL, diagramas y documentación.
- `Proyectos/`: ejercicios de clase y PRD.

## Endpoints de materias (`/api/v1/materias`)

| Método | Ruta | Función |
|--------|------|---------|
| GET | `/` | listMaterias |
| GET | `/:id` | getMateriaById |
| GET | `/:id/tareas` | listTareasByMateria |
| POST | `/` | createMateria |
| PUT | `/:id` | replaceMateria |
| PATCH | `/:id` | updateMateria |
| DELETE | `/:id` | deleteMateria |

## Recordatorios

El API de recordatorios está disponible en `/api/v1/recordatorios` y se limita a las materias del usuario actual (`request.user.id`, asignado temporalmente al usuario `1`). Consulta el [contrato del API](docs/recordatorios.md). El esquema MySQL del proyecto ya contiene la tabla `recordatorio` con los campos usados por este API.

El frontend se sirve desde `studentFlow_front/` en `http://127.0.0.1:5501/recordatorios.html`. Ejecuta `npm test` en esta carpeta para validaciones y alcance SQL, y dentro de `studentFlow_front` para las pruebas del cliente HTTP.

## Base de datos

Los scripts y el DER están en [`BD y archivos/BD`](<BD y archivos/BD/>). Para crear la base en un entorno limpio, importa primero `01_studentflow_schema_mysql.sql` y luego `02_studentflow_seed_inicial.sql` desde phpMyAdmin. El esquema contiene `DROP DATABASE IF EXISTS studentflow`, por lo que al importarlo se recreará esa base y se borrarán sus datos anteriores. El seed agrega datos de ejemplo, incluidos tres recordatorios. Para revisar la base existente, abre `studentflow` → `recordatorio` → **Examinar**; no vuelvas a importar el esquema sobre datos que quieras conservar.

El endpoint `GET /api/v1/materias/:id/tareas` devuelve las tareas asociadas a la materia indicada, filtradas por el usuario autenticado (`request.user.id`). Responde con HTTP 200 y `data: []` cuando no hay coincidencias, incluyendo materias inexistentes o pertenecientes a otro usuario. El procedimiento realizado está documentado en [`docs/endpoint-get-tareas-por-materia.md`](docs/endpoint-get-tareas-por-materia.md).
