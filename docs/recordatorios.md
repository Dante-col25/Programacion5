# API de recordatorios

Todas las rutas parten de `/api/v1/recordatorios`. Las consultas unen `recordatorio` con `tarea` y `materia`, y siempre filtran por `materia.id_usuario = request.user.id`. El usuario actual sigue siendo temporalmente el ID `1`.

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/` | Lista paginada de recordatorios propios |
| GET | `/tareas` | Lista tareas propias para asociar |
| GET | `/:id` | Consulta un recordatorio propio |
| POST | `/` | Crea; responde 201 |
| PUT | `/:id` | Reemplaza los campos editables |
| PATCH | `/:id` | Cambia solo los campos enviados |
| DELETE | `/:id` | Elimina; responde 204 |

La lista acepta `leido=true|false`, `search`, `page` (1 por defecto), `limit` (20 por defecto, máximo 100), `sort=id|mensaje|fechaHora|canal|leido` y `order=asc|desc`. La búsqueda cubre el mensaje, título de tarea y nombre de materia.

POST y PUT reciben `tareaId`, `mensaje` (1–255 caracteres), `fechaHora` (`YYYY-MM-DDTHH:mm[:ss]`) y `canal` (`in_app` o `email`). `leido` es opcional y por defecto `false`. PATCH acepta esos campos parcialmente y requiere al menos uno. La tarea debe pertenecer al usuario actual; una tarea ajena o inexistente responde 404. IDs inválidos y entradas mal formadas responden 422.

La respuesta de lista es `{ "success": true, "data": [], "meta": { "page": 1, "limit": 20, "total": 0, "pages": 0 } }`. Las filas contienen `id`, `tareaId`, `tareaTitulo`, `materiaNombre`, `mensaje`, `fechaHora`, `canal`, `leido` y `createdAt`.

Las escrituras SQL modifican exclusivamente `recordatorio`. La tarea y la materia aparecen en consultas de lectura para comprobar propiedad; crear usa `INSERT ... SELECT` para validar la tarea en la propia inserción.
