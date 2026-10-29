# Fase 1 – Preparación del entorno de desarrollo

Este documento corresponde a la preparación inicial del backend de **StudentFlow** en el directorio [studentFlow_back](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back).

## Segmento 1: Pasos para la creación

1. Crear el directorio del backend.
2. Inicializar el proyecto backend con Node.js.
3. Definir el archivo `package.json`.
4. Instalar las dependencias base del proyecto.
5. Crear la estructura inicial de carpetas en `src/`.
6. Configurar las variables de entorno del backend.
7. Crear la configuración de conexión a MySQL.
8. Crear la aplicación base con Express.
9. Crear un endpoint de prueba `GET /api/v1/health`.
10. Configurar el manejo básico de errores y rutas inexistentes.
11. Documentar el arranque básico del proyecto.
12. Verificar que el servidor inicie correctamente en local.

## Segmento 2: Explicación de cada paso

### 1. Crear el directorio del backend

Consiste en definir una carpeta exclusiva para el servidor, separada del frontend.

En este proyecto se usa:

- [studentFlow_back](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back)

Esto sirve para mantener aislado el código del backend, sus dependencias, su configuración y sus scripts.

### 2. Inicializar el proyecto backend con Node.js

Consiste en preparar el proyecto para que pueda ejecutarse con Node.js como entorno de servidor.

Esto sirve para:

- tener un punto de entrada claro;
- gestionar dependencias con `npm`;
- definir scripts de arranque;
- dejar una base compatible con Express y MySQL.

### 3. Definir el archivo `package.json`

Consiste en crear el archivo que describe el proyecto y sus scripts principales.

En este caso se definieron scripts como:

- `npm run dev`
- `npm start`

Esto sirve para estandarizar cómo se ejecuta el backend y qué dependencias necesita.

### 4. Instalar las dependencias base del proyecto

Consiste en descargar e instalar los paquetes mínimos para arrancar el backend.

En esta fase se utilizaron:

- `express`
- `mysql2`
- `dotenv`

Esto sirve para:

- exponer endpoints HTTP;
- conectarse a MySQL;
- leer variables de entorno desde un archivo `.env`.

### 5. Crear la estructura inicial de carpetas en `src/`

Consiste en organizar el proyecto por responsabilidades desde el inicio.

La estructura base creada fue:

- `src/config`
- `src/controllers`
- `src/routes`
- `src/middlewares`
- `src/repositories`
- `src/services`
- `src/validators`
- `src/utils`

Esto sirve para evitar que toda la lógica quede mezclada en un solo archivo y facilita el crecimiento del proyecto por módulos.

### 6. Configurar las variables de entorno del backend

Consiste en definir los valores externos que el proyecto necesita para ejecutarse.

Se dejó un archivo de ejemplo:

- [`.env.example`](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/.env.example)

Incluye variables como:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Esto sirve para no escribir credenciales ni configuraciones sensibles directamente dentro del código fuente.

### 7. Crear la configuración de conexión a MySQL

Consiste en preparar el módulo que abrirá la conexión del backend con la base de datos `studentflow`.

Se creó en:

- [database.js](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/src/config/database.js)

Esto sirve para centralizar la conexión, reutilizarla en el resto del proyecto y hacer una verificación simple del estado de la base.

### 8. Crear la aplicación base con Express

Consiste en construir la instancia principal de la aplicación HTTP.

Se creó en:

- [app.js](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/src/app.js)

Esto sirve para registrar middlewares, rutas y comportamiento global del backend.

### 9. Crear un endpoint de prueba `GET /api/v1/health`

Consiste en definir una ruta mínima que permita comprobar que el backend responde y que, cuando corresponda, puede verificar conexión con MySQL.

Archivos relacionados:

- [health.routes.js](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/src/routes/health.routes.js)
- [health.controller.js](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/src/controllers/health.controller.js)

Esto sirve para validar rápidamente que el backend está vivo antes de implementar módulos reales como materias o tareas.

### 10. Configurar el manejo básico de errores y rutas inexistentes

Consiste en definir una respuesta controlada cuando una ruta no existe o cuando ocurre un error interno.

Se creó en:

- [error.middleware.js](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/src/middlewares/error.middleware.js)

Esto sirve para que el backend no responda con errores desordenados y desde el inicio mantenga una estructura consistente de respuesta.

### 11. Documentar el arranque básico del proyecto

Consiste en dejar instrucciones mínimas para que cualquier persona pueda entender cómo arrancar el backend.

Se creó en:

- [README.md](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/README.md)

Esto sirve para que el proyecto no dependa solo de memoria oral o improvisación técnica.

### 12. Verificar que el servidor inicie correctamente en local

Consiste en ejecutar el backend y comprobar que arranca sin errores de estructura.

En esta fase ya se verificó que el servidor inicia en el puerto `3000`.

Esto sirve para cerrar la fase con una evidencia concreta: el entorno local del backend ya está listo para pasar a la siguiente etapa.
