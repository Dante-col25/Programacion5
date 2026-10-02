# Explicación: endpoint GET de tareas por materia

## Objetivo

Agregar `GET /api/v1/materias/:id/tareas` para consultar las tareas asociadas a una materia, asegurando que la materia pertenezca al usuario de la solicitud. Este documento explica los cambios realizados tomando como base el procedimiento compartido por el profesor.

## Flujo de la solicitud

```text
GET /api/v1/materias/:id/tareas
  -> router de materias
  -> controlador listTareasByMateria
  -> valida request.params.id
  -> obtiene request.user.id
  -> servicio listTareasByMateria(id, userId)
  -> repositorio findTareasByMateriaAndUserId(id, userId)
  -> consulta MySQL
  -> sendSuccess(response, tareas)
```

## Cambios realizados

### 1. Ruta: `src/routes/materias.routes.js`

Se importa `listTareasByMateria` desde el controlador y se registra:

```js
router.get("/:id/tareas", listTareasByMateria);
```

La ruta se registra antes de `router.get("/:id", getMateriaById)`. El router ya está montado en `/api/v1/materias` desde `app.js`, por lo que la ruta completa queda como `/api/v1/materias/:id/tareas`.

### 2. Controlador: `src/controllers/materias.controller.js`

`listTareasByMateria(request, response, next)` valida el parámetro de ruta con `validateMateriaId`, obtiene el usuario desde `request.user.id`, llama al servicio con ambos identificadores y responde con `sendSuccess`. Los errores se envían al middleware central usando `next(error)`.

El usuario no se recibe desde la URL, el query string ni el body: proviene del contexto que asigna el middleware de la solicitud.

### 3. Servicio: `src/services/materias.service.js`

`listTareasByMateria(id, userId)` delega la consulta al repositorio y devuelve el arreglo obtenido. No se hace una consulta separada para comprobar la existencia de la materia; el JOIN y el filtro de propietario del repositorio controlan qué tareas se devuelven.

### 4. Repositorio: `src/repositories/materias.repositorio.js`

`findTareasByMateriaAndUserId(id, userId)` selecciona explícitamente los campos de la tarea y usa alias camelCase como `materiaId`, `fechaEntrega` y `createdAt`. La consulta une `tarea` con `materia` por `id_materia`, y filtra por el ID solicitado y el propietario de la materia:

```sql
WHERE m.id_materia = ? AND m.id_usuario = ?
```

Los valores se entregan como `[id, userId]` a `pool.execute`, usando placeholders para parametrizar la consulta. Como `id_usuario` pertenece a `materia` y no a `tarea`, el filtro se realiza mediante `m.id_usuario`.

## Respuesta y casos esperados

- Una materia del usuario con tareas devuelve HTTP 200 y las tareas en `data`.
- Una materia sin tareas devuelve HTTP 200 con `data: []`.
- Una materia inexistente o perteneciente a otro usuario devuelve HTTP 200 con `data: []`, porque la consulta no encuentra coincidencias.
- Un ID inválido se rechaza mediante `validateMateriaId` y el middleware de errores.
- El middleware temporal `attachTemporaryUser` asigna actualmente `request.user.id = 1`; por eso las pruebas locales consultan datos del usuario 1.

La respuesta exitosa conserva el formato común del API:

```json
{
  "success": true,
  "data": []
}
```

## Componentes existentes reutilizados

| Componente | Uso |
| --- | --- |
| `validateMateriaId` | Validar que el ID de la ruta sea válido. |
| `sendSuccess` | Responder con HTTP 200 y envolver el arreglo en `data`. |
| `pool` | Ejecutar la consulta MySQL parametrizada. |
| `request.user.id` | Obtener el ID del usuario asociado a la solicitud. |
| `error.middleware.js` | Manejar errores enviados mediante `next(error)`. |

## Prueba manual realizada

Con el servidor en ejecución y MySQL conectado, se consultaron las tareas de la materia 1:

```powershell
curl.exe http://localhost:3000/api/v1/materias/1/tareas
```

La respuesta de la prueba que se realizo fue HTTP 200 con las dos tareas asociadas a Algoritmos, dentro de `data`.
