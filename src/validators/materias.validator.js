import { HttpError } from "../utils/http-error.js";

/**
 * Convierte un valor de entrada al tipo booleano aceptado por la API.
 *
 * @function parseBoolean
 * @param {boolean|string|undefined} value - Valor booleano o texto `true`/`false`.
 * @returns {boolean|undefined} Valor convertido, o undefined si no se proporcionó.
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si el valor no es válido.
 */
function parseBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw new HttpError(422, "VALIDATION_ERROR", "El filtro 'activa' debe ser true o false.");
}

/**
 * Convierte un valor a entero no negativo.
 *
 * @function parsePositiveInteger
 * @param {string|number|null|undefined} value - Valor que se convertirá; puede estar vacío.
 * @param {string} fieldName - Nombre del campo para incluirlo en el mensaje de error.
 * @returns {number|null} Entero validado o null si no se proporcionó un valor.
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si el valor no es un entero no negativo.
 */
function parsePositiveInteger(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' debe ser un entero positivo o cero.`);
  }

  return parsed;
}

/**
 * Valida que un valor sea una cadena no vacía y devuelve su versión sin espacios externos.
 *
 * @function normalizeString
 * @param {unknown} value - Valor que se validará.
 * @param {string} fieldName - Nombre del campo para incluirlo en el mensaje de error.
 * @returns {string} Cadena validada y recortada.
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si el valor no es una cadena no vacía.
 */
function normalizeString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' es obligatorio.`);
  }

  return value.trim();
}

/**
 * Valida que el color use el formato hexadecimal #RRGGBB.
 *
 * @function validateColor
 * @param {string} color - Color que se validará.
 * @returns {void} No retorna un valor si el formato es válido.
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si el formato no es válido.
 */
function validateColor(color) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new HttpError(422, "VALIDATION_ERROR", "El campo 'color' debe tener formato hexadecimal #RRGGBB.");
  }
}

/**
 * Valida los parámetros de consulta para listar materias.
 *
 * @function validateMateriaListQuery
 * @param {Object} query - Parámetros recibidos en la URL.
 * @returns {{activa: boolean|undefined, search: string, sort: string|undefined, order: string|undefined, page: number, limit: number}} Filtros normalizados.
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si la paginación o el filtro booleano no son válidos.
 */
export function validateMateriaListQuery(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);

  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(422, "VALIDATION_ERROR", "El parámetro 'page' debe ser un entero mayor o igual a 1.");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(422, "VALIDATION_ERROR", "El parámetro 'limit' debe ser un entero entre 1 y 100.");
  }

  return {
    activa: parseBoolean(query.activa),
    search: typeof query.search === "string" ? query.search.trim() : "",
    sort: query.sort,
    order: query.order,
    page,
    limit
  };
}

/**
 * Valida y convierte el identificador de una materia.
 *
 * @function validateMateriaId
 * @param {string|number} id - Identificador recibido en la ruta.
 * @returns {number} Identificador entero positivo.
 * @throws {HttpError} Código 400 (INVALID_ID) si el identificador no es válido.
 */
export function validateMateriaId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new HttpError(400, "INVALID_ID", "El identificador de materia no es válido.");
  }

  return parsedId;
}

/**
 * Valida los datos obligatorios para crear o reemplazar una materia.
 *
 * @function validateCreateMateria
 * @param {Object} body - Cuerpo de la solicitud.
 * @returns {{nombre: string, codigo: string, color: string, creditos: number|null, activa: boolean}} Datos validados y normalizados.
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si falta un campo o alguno tiene un formato inválido.
 */
export function validateCreateMateria(body) {
  const nombre = normalizeString(body.nombre, "nombre");
  const codigo = normalizeString(body.codigo, "codigo");
  const color = normalizeString(body.color, "color");
  const creditos = parsePositiveInteger(body.creditos, "creditos");
  const activa = body.activa === undefined ? true : parseBoolean(body.activa);

  validateColor(color);

  return {
    nombre,
    codigo,
    color,
    creditos,
    activa
  };
}

/**
 * Valida y normaliza los campos opcionales enviados para actualizar una materia.
 *
 * @function validatePatchMateria
 * @param {Object} body - Cuerpo parcial de la solicitud.
 * @returns {Object} Campos validados que se actualizarán.
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si no hay campos válidos o algún valor es inválido.
 */
export function validatePatchMateria(body) {
  const payload = {};

  if (body.nombre !== undefined) {
    payload.nombre = normalizeString(body.nombre, "nombre");
  }

  if (body.codigo !== undefined) {
    payload.codigo = normalizeString(body.codigo, "codigo");
  }

  if (body.color !== undefined) {
    payload.color = normalizeString(body.color, "color");
    validateColor(payload.color);
  }

  if (body.creditos !== undefined) {
    payload.creditos = parsePositiveInteger(body.creditos, "creditos");
  }

  if (body.activa !== undefined) {
    payload.activa = parseBoolean(body.activa);
  }

  if (Object.keys(payload).length === 0) {
    throw new HttpError(422, "VALIDATION_ERROR", "No se enviaron campos válidos para actualizar.");
  }

  return payload;
}
