import { HttpError } from "../utils/http-error.js";

const requiredFields = ["tareaId", "mensaje", "fechaHora", "canal"];
const writableFields = new Set([...requiredFields, "leido"]);

function invalid(message) {
  throw new HttpError(422, "VALIDATION_ERROR", message);
}

export function validateRecordatorioId(value) {
  if (!/^\d+$/.test(String(value)) || Number(value) < 1 || !Number.isSafeInteger(Number(value))) {
    invalid("El identificador de recordatorio no es válido.");
  }
  return Number(value);
}

function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  invalid("El campo 'leido' debe ser true o false.");
}

function validateFields(body, { partial = false } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) invalid("El cuerpo debe ser un objeto JSON.");
  const unknown = Object.keys(body).filter(field => !writableFields.has(field));
  if (unknown.length) invalid(`Campo no permitido: '${unknown[0]}'.`);
  if (partial && Object.keys(body).length === 0) invalid("PATCH requiere al menos un campo.");
  if (!partial) {
    for (const field of requiredFields) if (body[field] === undefined) invalid(`El campo '${field}' es obligatorio.`);
  }

  const result = {};
  if (body.tareaId !== undefined) {
    const id = Number(body.tareaId);
    if (!Number.isSafeInteger(id) || id < 1) invalid("El campo 'tareaId' debe ser un entero positivo.");
    result.tareaId = id;
  }
  if (body.mensaje !== undefined) {
    if (typeof body.mensaje !== "string" || !body.mensaje.trim() || body.mensaje.trim().length > 255) {
      invalid("El campo 'mensaje' debe tener entre 1 y 255 caracteres.");
    }
    result.mensaje = body.mensaje.trim();
  }
  if (body.fechaHora !== undefined) {
    if (typeof body.fechaHora !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(body.fechaHora)) {
      invalid("El campo 'fechaHora' debe usar YYYY-MM-DDTHH:mm[:ss].");
    }
    const normalized = body.fechaHora.length === 16 ? `${body.fechaHora}:00` : body.fechaHora;
    const date = new Date(`${normalized}Z`);
    if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 19) !== normalized) invalid("El campo 'fechaHora' no es una fecha válida.");
    result.fechaHora = body.fechaHora.replace("T", " ");
  }
  if (body.canal !== undefined) {
    if (!['in_app', 'email'].includes(body.canal)) invalid("El campo 'canal' debe ser 'in_app' o 'email'.");
    result.canal = body.canal;
  }
  if (body.leido !== undefined) result.leido = parseBoolean(body.leido);
  return result;
}

export const validateCreateRecordatorio = body => validateFields(body);
export const validateReplaceRecordatorio = body => ({ leido: false, ...validateFields(body) });
export const validatePatchRecordatorio = body => validateFields(body, { partial: true });

export function validateRecordatorioListQuery(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  if (!Number.isInteger(page) || page < 1) invalid("El parámetro 'page' debe ser un entero mayor o igual a 1.");
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) invalid("El parámetro 'limit' debe ser un entero entre 1 y 100.");
  let leido;
  if (query.leido !== undefined) {
    if (query.leido !== "true" && query.leido !== "false") invalid("El filtro 'leido' debe ser true o false.");
    leido = query.leido === "true";
  }
  const allowedSort = new Set(["id", "mensaje", "fechaHora", "canal", "leido"]);
  if (query.sort && !allowedSort.has(query.sort)) invalid("El parámetro 'sort' no es válido.");
  if (query.order && !["asc", "desc"].includes(String(query.order).toLowerCase())) invalid("El parámetro 'order' debe ser asc o desc.");
  return { page, limit, leido, search: typeof query.search === "string" ? query.search.trim() : "", sort: query.sort || "fechaHora", order: String(query.order || "asc").toUpperCase() };
}
