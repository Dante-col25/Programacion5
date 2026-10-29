# Detalle de los primeros 7 pasos de la Fase 1

Este documento complementa [Fase1_Preparacion_Entorno_Desarrollo.md](/D:/Downloads/camacho/2026B/programacionV/desarrollo_fases/fase1/Fase1_Preparacion_Entorno_Desarrollo.md) y desarrolla con más detalle los **7 primeros pasos** del:

- `Segmento 1: Pasos para la creación`

El enfoque aquí no es solo decir qué significa cada paso, sino **qué se debe hacer realmente** para ejecutarlo en el proyecto backend de **StudentFlow**.

---

## Paso 1. Crear el directorio del backend

### Qué se debe hacer

Se debe crear una carpeta exclusiva para el backend, separada de cualquier estructura del frontend.

En este proyecto el directorio usado es:

- [studentFlow_back](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back)

### Acciones concretas

1. Verificar si la carpeta ya existe.
2. Si no existe, crearla.
3. Confirmar que el backend trabajará dentro de esa ruta y no en otra.

### Qué se espera como resultado

Debe existir una carpeta clara, vacía o lista para poblarse, que será la raíz del backend.

### Por qué es importante

Porque desde ese momento:

- las dependencias del backend quedan separadas;
- los archivos del servidor no se mezclan con el frontend;
- se puede documentar y ejecutar el backend desde un punto único.

---

## Paso 2. Inicializar el proyecto backend con Node.js

### Qué se debe hacer

Se debe preparar la carpeta del backend para que funcione como proyecto Node.js.

### Acciones concretas

1. Abrir terminal dentro de [studentFlow_back](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back).
2. Ejecutar el comando de inicialización de Node.js.
3. Confirmar que se generó `package.json`.
4. Definir que el proyecto tendrá un punto de entrada y scripts de ejecución.

### Comando

```powershell
cd D:\Downloads\camacho\2026B\programacionV\studentFlow_back
npm init -y
```

### Qué hace este comando

El comando:

```powershell
npm init -y
```

crea automáticamente un archivo `package.json` con valores iniciales por defecto.

La opción:

```text
-y
```

significa que `npm` acepta automáticamente la configuración inicial sin hacer preguntas interactivas.

### Qué archivo genera

Después de ejecutarlo, Node.js crea:

- [package.json](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/package.json)

Ese archivo convierte la carpeta en un proyecto Node.js formal.

### Ejemplo del resultado inicial esperado

Un `package.json` inicial generado por Node.js suele verse de forma parecida a esta:

```json
{
  "name": "studentflow_back",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Después, ese archivo se ajusta según las necesidades reales del backend.

### Qué se espera como resultado

Debe quedar creado el proyecto Node.js base, listo para:

- instalar paquetes;
- ejecutar scripts;
- organizar código fuente.

### Por qué es importante

Porque Node.js será el entorno de ejecución del backend.

Sin esta inicialización no se podrían manejar correctamente:

- dependencias;
- scripts;
- configuración del proyecto.

---

## Paso 3. Definir el archivo `package.json`

### Qué se debe hacer

Se debe crear o ajustar el archivo:

- [package.json](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/package.json)

para describir formalmente el proyecto.

En este paso conviene mostrar **dos estados** del archivo:

1. el `package.json` inicial que genera Node.js;
2. el `package.json` ajustado con los campos adicionales que sí necesita el backend.

### Acciones concretas

1. Definir el nombre del proyecto.
2. Definir la versión.
3. Definir el archivo principal.
4. Definir si se trabajará con módulos ES (`"type": "module"`).
5. Definir scripts como:
   - `npm run dev`
   - `npm start`
6. Declarar dependencias que usará el backend.

### Qué se espera como resultado

Debe quedar un `package.json` que indique:

- qué es el proyecto;
- cómo se ejecuta;
- de qué paquetes depende.

### Ejemplo del `package.json` inicial

Después de ejecutar:

```powershell
npm init -y
```

Node.js suele generar un archivo base parecido a este:

```json
{
  "name": "studentflow_back",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Ese archivo inicial todavía no es suficiente para el backend real.

### Ajustes adicionales que se deben tener

Después del archivo inicial, se deben incorporar los campos que el backend necesita para trabajar de forma correcta.

Entre los más importantes están:

1. Cambiar el nombre del proyecto según la convención elegida.
2. Ajustar la descripción.
3. Cambiar `main` para apuntar al archivo real de entrada.
4. Definir:
   - `"type": "module"`
5. Reemplazar el script de prueba por scripts útiles para desarrollo y ejecución.
6. Añadir `keywords`.
7. Ajustar la licencia.
8. Declarar las dependencias reales del backend.

### Ejemplo del `package.json` ajustado

Un ejemplo correcto para este proyecto sería:

```json
{
  "name": "studentflow-back",
  "version": "1.0.0",
  "description": "Backend base para StudentFlow",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "keywords": [
    "studentflow",
    "backend",
    "express",
    "mysql"
  ],
  "author": "",
  "license": "UNLICENSED",
  "dependencies": {
    "dotenv": "^16.6.1",
    "express": "^5.1.0",
    "mysql2": "^3.15.0"
  }
}
```

### Explicación de los adicionales

#### `"main": "src/server.js"`

Indica cuál es el archivo principal del backend.

#### `"type": "module"`

Permite usar la sintaxis moderna:

```js
import ...
export ...
```

#### `"scripts"`

Permite ejecutar comandos estandarizados:

- `npm run dev`
- `npm start`

#### `"keywords"`

Ayuda a describir técnicamente el proyecto.

#### `"license": "UNLICENSED"`

Indica que el proyecto no se está publicando como paquete abierto.

#### `"dependencies"`

Declara los paquetes que el backend necesita para funcionar:

- `express`
- `mysql2`
- `dotenv`

### Por qué es importante

Porque `package.json` es el archivo central de un proyecto Node.js.

Permite:

- estandarizar el arranque;
- compartir configuración del proyecto;
- instalar dependencias correctamente;
- evitar ejecución improvisada.

---

## Paso 4. Instalar las dependencias base del proyecto

### Qué se debe hacer

Se deben instalar los paquetes mínimos necesarios para arrancar el backend.

### Acciones concretas

Instalar al menos:

- `express`
  ```powershell
  npm install express
  ```
- `mysql2`
  ```powershell
  npm install mysql2
  ```
- `dotenv`
  ```powershell
  npm install dotenv
  ```

O se pueden instalar juntos en un solo comando:

```powershell
npm install express mysql2 dotenv
```

### Qué aporta cada paquete

#### `express`

Permite:

- crear el servidor HTTP;
- definir rutas;
- usar middlewares;
- responder peticiones.

`mysql2`

Permite:

- conectarse a MySQL;
- ejecutar consultas SQL;
- trabajar con promesas.

`dotenv`

Permite:

- cargar variables desde `.env`;
- evitar poner credenciales directamente en el código.

Qué se espera como resultado

Deben aparecer:

- `node_modules/`
- `package-lock.json`

y el proyecto debe quedar listo para importar esos paquetes desde el código.

### Por qué es importante

Porque sin estas dependencias no existiría todavía backend funcional:

- no habría servidor;
- no habría conexión a MySQL;
- no habría configuración por entorno.

---

## Paso 5. Crear la estructura inicial de carpetas en `src/`

### Qué se debe hacer

Se debe crear la estructura base de código dentro de:

- `src/`

### Acciones concretas

Crear las carpetas:

- `src/config`
- `src/controllers`
- `src/routes`
- `src/middlewares`
- `src/repositories`
- `src/services`
- `src/validators`
- `src/utils`

También se pueden dejar archivos como `.gitkeep` para conservar carpetas vacías.

### Qué se espera como resultado

Debe existir una estructura ordenada por responsabilidades.

### Por qué es importante

Porque desde la primera fase se quiere evitar este problema:

- poner toda la lógica en un solo archivo.

Con esta estructura, el backend ya nace preparado para crecer por módulos.

### Beneficio pedagógico

Este paso es especialmente importante para docencia porque ayuda al estudiante a entender que:

- una ruta no es lo mismo que una validación;
- una validación no es lo mismo que una consulta SQL;
- una consulta SQL no es lo mismo que una respuesta HTTP.

---

## Paso 6. Configurar las variables de entorno del backend

### Qué se debe hacer

Se debe definir qué variables externas necesita el proyecto para correr.

### Acciones concretas

1. Crear un archivo de ejemplo:
   - [`.env.example`](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/.env.example)
2. Definir variables mínimas como:
   - `PORT`
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
3. Mantener el archivo `.env` real fuera del control público del proyecto.

### Qué se espera como resultado

Debe quedar claro:

- qué variables necesita el backend;
- qué valores deben configurarse en cada máquina;
- y cuáles son sensibles.

### Por qué es importante

Porque separar configuración del código permite:

- cambiar de entorno sin modificar archivos fuente;
- proteger credenciales;
- hacer el backend más portable;
- facilitar desarrollo, pruebas y producción.

### Resultado práctico esperado

Un estudiante debería poder copiar `.env.example`, crear su `.env` y ajustar sus credenciales locales sin tocar el código del backend.

---

## Paso 7. Crear la configuración de conexión a MySQL

### Qué se debe hacer

Se debe crear el módulo que centraliza la conexión del backend con MySQL.

Archivo relacionado:

- [database.js](/D:/Downloads/camacho/2026B/programacionV/studentFlow_back/src/config/database.js)

### Acciones concretas

1. Importar `dotenv`.
2. Importar `mysql2/promise`.
3. Cargar variables de entorno.
4. Crear un pool de conexiones.
5. Exponer ese pool para uso del resto del backend.
6. Crear una función de prueba de conexión, como `checkDatabaseConnection()`.

### Qué se espera como resultado

Debe existir un archivo que:

- conozca host, puerto, base, usuario y contraseña;
- permita abrir conexiones reutilizables;
- permita comprobar si MySQL responde.

### Por qué es importante

Porque la conexión a base de datos no debe construirse de manera dispersa en:

- routes;
- controllers;
- services.

Debe existir un punto único de configuración para que:

- el acceso a MySQL sea consistente;
- la conexión sea reutilizable;
- la depuración sea más sencilla.

### Beneficio técnico y pedagógico

Este paso enseña una idea muy importante:

> el backend no consulta la base “desde cualquier lugar”; primero se construye una capa de acceso organizada.

---

## Vista del resultado esperado

Antes del cierre de esta fase, el estudiante debería poder ver una estructura parecida a esta en el explorador de archivos:

```text
studentFlow_back_inicial
├── node_modules
├── src
│   ├── config
│   │   └── database.js
│   ├── controllers
│   │   └── .gitkeep
│   ├── middlewares
│   │   └── .gitkeep
│   ├── repositories
│   │   └── .gitkeep
│   ├── routes
│   │   └── .gitkeep
│   ├── services
│   │   └── .gitkeep
│   ├── utils
│   │   └── .gitkeep
│   ├── validators
│   │   └── .gitkeep
│   └── server.js
├── .env.example
├── package-lock.json
└── package.json
```

### Cómo interpretar esta vista

- `node_modules` confirma que las dependencias ya fueron instaladas.
- `src/` confirma que el backend ya tiene una estructura base organizada.
- `config/database.js` muestra que ya existe un punto central para la conexión a MySQL.
- `server.js` indica que ya existe un archivo principal de arranque.
- `.env.example` muestra qué variables debe definir cada máquina.
- `package.json` y `package-lock.json` confirman que Node.js ya reconoce formalmente el proyecto.

---

## Cierre

Los primeros 7 pasos de la Fase 1 construyen la base real del backend.

No implementan todavía módulos del dominio como `materias` o `tareas`, pero sí dejan resuelto lo necesario para poder desarrollarlos después:

- raíz del backend;
- proyecto Node.js;
- `package.json`;
- dependencias;
- estructura de carpetas;
- variables de entorno;
- conexión a MySQL.

Si estos 7 pasos quedan bien hechos, las fases siguientes avanzan con mucha más claridad y menos desorden técnico.
