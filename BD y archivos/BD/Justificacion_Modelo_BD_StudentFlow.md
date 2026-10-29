# Justificación del modelo de base de datos de StudentFlow

## Propósito

Este documento resume la lógica del modelo de datos representado en `BDMysql.png` y materializado en los scripts:

- `01_studentflow_schema_mysql.sql`
- `02_studentflow_seed_inicial.sql`

El objetivo del modelo es soportar el MVP de **StudentFlow** y, al mismo tiempo, dejar preparada una base razonable para extensiones como Pomodoro, estadísticas, responsables por tarea e integración de funcionalidades inteligentes.

---

## Decisiones generales de diseño

### 1. Se agregó la entidad `usuario`

En el DER inicial, `configuracion_usuario` no tenía una relación real con una entidad de usuario.  
Eso dejaba el modelo incompleto.

Por esta razón se creó `usuario` como entidad base. Aunque el proyecto pueda operar inicialmente como monousuario, esta decisión permite:

- asociar materias, sesiones y configuración a una persona real;
- escalar a varios usuarios sin rediseñar toda la base;
- mantener consistencia entre preferencias, estudio y organización académica.

### 2. Se corrigió la relación de `evento`

En el DER anterior existía una inconsistencia conceptual entre `evento`, `tarea` y `materia`.  
La corrección aplicada fue dejar que **`evento` pertenezca a `materia`**.

Esto es coherente con la lógica del dominio:

- una clase, examen o reunión académica normalmente está asociada a una materia;
- una tarea puede existir como entrega, pero no necesariamente “contiene” eventos;
- la agenda del estudiante se organiza mejor si eventos y tareas convergen alrededor de la materia.

### 3. Se eliminó la duplicidad `estado` / `completada` en `tarea`

El modelo previo mezclaba un campo booleano de completado con un campo de estado.  
Eso produce redundancia y posibles contradicciones.

Ejemplo del problema:

- `completada = true`
- `estado = pendiente`

Ambos valores no deberían coexistir.

Por eso se dejó un único campo `estado`, con valores controlados por `ENUM`.  
Esto permite representar mejor el avance real de la tarea.

### 4. Se mantuvo una estructura preparada para crecimiento

Aunque el proyecto nace como MVP, el modelo se diseñó para soportar:

- gestión de materias;
- tareas y subtareas;
- agenda y eventos;
- bloques de estudio;
- Pomodoro;
- evaluaciones;
- responsables por tarea.

Esto evita rehacer la base cuando el proyecto avance hacia semanas posteriores.

---

## Justificación por entidad

## `usuario`

Representa al estudiante o dueño de la cuenta.

Se incluyó porque:

- centraliza la identidad del sistema;
- permite ligar materias, configuración y sesiones de estudio;
- hace viable un crecimiento futuro a múltiples usuarios.

Campos como `zona_horaria` e `idioma` ayudan a preparar el sistema para cálculos de agenda, visualización y personalización.

## `configuracion_usuario`

Guarda preferencias globales del usuario:

- días de pánico;
- minutos de estudio por hora;
- tema de IA;
- duración de Pomodoro y descansos.

Su función es soportar reglas funcionales de StudentFlow, especialmente:

- Modo Pánico;
- planeación de estudio;
- temporizador Pomodoro;
- futuras sugerencias automáticas.

Se definió como una relación **1 a 1** con `usuario`, porque cada usuario debe tener una configuración principal.

## `materia`

Es una de las entidades centrales del sistema.

Su función es organizar académicamente la información.  
Desde `materia` se relacionan:

- tareas;
- eventos;
- evaluaciones;
- bloques de estudio.

Esto tiene sentido porque StudentFlow está pensado para gestionar la vida académica por asignaturas.  
Además, el color y el código permiten identificación visual y orden dentro de la interfaz.

## `tarea`

Representa entregas, trabajos, lecturas o actividades con fecha objetivo.

Es una entidad clave porque soporta:

- organización de pendientes;
- próximas entregas;
- urgencia;
- Kanban;
- responsables;
- recordatorios;
- asociación con sesiones de estudio.

Se decidió incluir:

- `prioridad`, para la percepción del usuario;
- `estado`, para el flujo funcional;
- `carga_estimada_minutos`, para planificación;
- `porcentaje_avance`, para seguimiento más fino.

De esta manera, `tarea` no solo sirve para listar pendientes, sino también para priorizar y medir progreso.

## `subtarea`

Permite dividir una tarea grande en pasos pequeños.

Su inclusión se justifica porque:

- mejora la granularidad del seguimiento;
- facilita el avance progresivo;
- encaja bien con tareas complejas del ámbito académico.

El campo `orden` permite definir secuencia de trabajo.  
El estado simple `pendiente/hecha` es suficiente para el nivel actual del MVP.

## `evento`

Representa actividades de agenda con fecha y, opcionalmente, hora:

- clases;
- exámenes;
- reuniones;
- otros compromisos académicos.

Se relaciona con `materia` porque su función principal es estructurar la agenda académica.  
Esto separa claramente:

- **tarea**: algo que debe entregarse o realizarse;
- **evento**: algo que ocurre en una fecha/hora concreta.

Esa separación mejora la claridad del modelo y de la interfaz.

## `bloque_estudio`

Representa tiempo reservado para estudiar.

Se relaciona obligatoriamente con `materia` y opcionalmente con `tarea`.

Esta decisión se tomó porque un bloque de estudio puede:

- planearse para una materia en general;
- o asignarse a una tarea específica.

Eso da flexibilidad sin perder estructura.  
Además, el campo `origen` permite distinguir si el bloque fue:

- creado manualmente;
- generado desde Pomodoro;
- sugerido por IA.

## `recordatorio`

Permite asociar alertas a una tarea.

Se dejó ligado a `tarea` porque, para el MVP, el foco principal de alertas está en:

- vencimientos;
- urgencia;
- seguimiento de entregas.

En fases posteriores podría ampliarse a eventos, pero para el alcance actual mantenerlo en tareas simplifica el modelo.

## `pomodoro_sesion`

Registra sesiones reales de enfoque y descanso.

Se justifica porque StudentFlow no solo organiza tareas, sino también el tiempo de estudio.  
Esta entidad permite:

- medir cuánto se estudió;
- asociar sesiones a materias;
- asociarlas opcionalmente a tareas;
- alimentar estadísticas posteriores.

También hace posible diferenciar entre planificación y ejecución real del estudio.

## `evaluacion`

Representa calificaciones, parciales, quices o actividades evaluativas.

Se relaciona con `materia` porque el cálculo académico ocurre por asignatura.  
Su función es soportar:

- notas obtenidas;
- porcentaje evaluado;
- cálculo de desempeño;
- proyecciones de nota requerida.

Esto conecta directamente con las historias de usuario sobre cálculo académico.

## `equipo_integrante`

Permite modelar participantes de un equipo o grupo de trabajo.

Se agregó para soportar la funcionalidad electiva de tareas compartidas.  
No es obligatoria para el MVP básico, pero sí útil para crecimiento del proyecto.

Se relaciona con `usuario` porque el estudiante dueño del sistema puede administrar su propio conjunto de integrantes frecuentes.

## `tarea_responsable`

Resuelve la asignación de responsables a tareas.

Se implementó como tabla intermedia porque:

- una tarea puede tener más de un participante;
- una persona puede participar en varias tareas;
- puede existir un responsable principal y otros de apoyo.

Este diseño es más flexible que guardar un solo nombre dentro de `tarea`.

---

## Justificación de relaciones principales

### `usuario` 1:1 `configuracion_usuario`

Cada usuario necesita una configuración principal.  
No tiene sentido, en este alcance, manejar varias configuraciones activas por usuario.

### `usuario` 1:N `materia`

Un usuario puede registrar varias materias.  
Cada materia pertenece a un solo usuario.

### `materia` 1:N `tarea`

Una materia puede tener múltiples tareas.  
Cada tarea se asocia a una materia concreta para mantener orden académico.

### `materia` 1:N `evento`

Una materia puede tener clases, exámenes o reuniones.  
Cada evento pertenece a una materia.

### `materia` 1:N `bloque_estudio`

El estudio se organiza por materia, incluso cuando no existe una tarea concreta asociada.

### `materia` 1:N `evaluacion`

Las evaluaciones son propias de una materia, no del usuario en abstracto.

### `tarea` 1:N `subtarea`

Una tarea compleja puede dividirse en varios pasos.

### `tarea` 1:N `recordatorio`

Una misma tarea puede tener varias alertas o avisos en distintos momentos.

### `tarea` N:M `equipo_integrante` por medio de `tarea_responsable`

Es la forma correcta de representar participación compartida sin perder flexibilidad.

### `usuario` / `materia` / `tarea` con `pomodoro_sesion`

La sesión pertenece siempre a un usuario, y opcionalmente puede quedar ligada a:

- una materia;
- una tarea específica.

Esto permite registrar estudio general o enfocado en una entrega concreta.

---

## Ventajas del modelo propuesto

- Corrige inconsistencias del DER inicial.
- Se ajusta mejor a las historias de usuario del proyecto.
- Permite construir el MVP sin sobrecargar la implementación.
- Deja preparada la base para semanas posteriores.
- Facilita consultas para dashboard, agenda, urgencia, Pomodoro y estadísticas.

---

## Límites actuales del modelo

Aunque el modelo es sólido para el alcance del proyecto, todavía tiene límites razonables:

- `recordatorio` solo cubre tareas y no eventos;
- `evento` exige materia, por lo que no contempla eventos personales libres;
- `subtarea` usa un estado simple, no un flujo completo;
- no se modela colaboración en tiempo real;
- no existe aún una entidad específica para recomendaciones generadas por IA.

Estos límites son aceptables para el alcance actual de StudentFlow.

---

## Conclusión

El modelo propuesto para StudentFlow busca un equilibrio entre:

- simplicidad para el MVP;
- coherencia conceptual;
- posibilidad de crecimiento.

La base queda preparada para soportar organización académica, seguimiento de tareas, agenda, estudio, métricas y extensiones futuras, sin arrastrar las inconsistencias observadas en el DER inicial.
