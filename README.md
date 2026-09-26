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
| GET | `/:id/tareas` | listTareasByMateriaId |
| POST | `/` | createMateria |
| PUT | `/:id` | replaceMateria |
| PATCH | `/:id` | updateMateria |
| DELETE | `/:id` | deleteMateria |

El endpoint `GET /api/v1/materias/:id/tareas` devuelve las tareas de la materia indicada que pertenece al usuario autenticado. El ID de usuario se obtiene del contexto de autenticación (`request.user.id`) y se usa para verificar la materia y filtrar las tareas.
