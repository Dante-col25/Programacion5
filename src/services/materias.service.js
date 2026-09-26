import * as materiasRepository from "../repositories/materias.repositorio.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Obtiene las materias de un usuario con filtros y metadatos de paginación.
 *
 * @async
 * @function listMaterias
 * @param {string|number} userId - Identificador del usuario propietario.
 * @param {Object} filters - Filtros y opciones de paginación y ordenamiento.
 * @param {number} filters.page - Página solicitada.
 * @param {number} filters.limit - Cantidad máxima de materias por página.
 * @returns {Promise<{data: Object[], meta: {page: number, limit: number, total: number, pages: number}}>} Materias y metadatos de paginación.
 */
export async function listMaterias(userId, filters) {
 const { materias, total } = await materiasRepository.findAllByUserId(userId, filters);
 return {
   data: materias,
   meta: {
     page: filters.page,
     limit: filters.limit,
     total,
     pages: Math.ceil(total / filters.limit)
   }
 };
}

/**
 * Busca una materia que pertenezca al usuario indicado.
 *
 * @async
 * @function getMateriaById
 * @param {string|number} id - Identificador de la materia.
 * @param {string|number} userId - Identificador del usuario propietario.
 * @returns {Promise<Object>} Materia encontrada.
 * @throws {HttpError} Código 404 (Materia_not_found) si no existe para ese usuario.
 */
export async function getMateriaById(id, userId) {
 const materia = await materiasRepository.findByIdAndUserId(id, userId);
 if (!materia) {
   throw new HttpError(404, "Materia_not_found", "No se encontró la materia con el ID proporcionado para el usuario especificado.");
 }
 return materia
}

/**
 * Obtiene las tareas de una materia después de verificar que pertenece al usuario.
 *
 * @async
 * @function listTareasByMateriaId
 * @param {string|number} materiaId - Identificador de la materia.
 * @param {string|number} userId - Identificador del usuario propietario.
 * @returns {Promise<Object[]>} Tareas de la materia, o una lista vacía si no tiene.
 * @throws {HttpError} Código 404 (Materia_not_found) si la materia no existe para ese usuario.
 */
export async function listTareasByMateriaId(materiaId, userId) {
  await getMateriaById(materiaId, userId);
  return materiasRepository.findTareasByMateriaIdAndUserId(materiaId, userId);
}

/**
 * Valida los campos únicos y crea una materia para el usuario.
 *
 * @async
 * @function createMateria
 * @param {string|number} userId - Identificador del usuario propietario.
 * @param {Object} materia - Datos de la materia que se creará.
 * @param {string} materia.nombre - Nombre de la materia.
 * @param {string} materia.codigo - Código de la materia.
 * @param {string} materia.color - Color hexadecimal de la materia.
 * @param {number|null} materia.creditos - Cantidad de créditos, o null si no se indicó.
 * @param {boolean} materia.activa - Indica si la materia está activa.
 * @returns {Promise<Object|null>} Materia creada, o null si no se pudo recuperar.
 * @throws {HttpError} Código 409 si el código o el nombre ya están registrados para el usuario.
 */
export async function createMateria(userId, materia) {
 await ensureUniqueFields(userId, materia);
 return materiasRepository.createMateria(userId, materia);
}

/**
 * Valida que el código y el nombre sean únicos para un usuario específico.
 *
 * @async
 * @function ensureUniqueFields
 * @param {string|number} userId - Identificador del usuario propietario.
 * @param {Object} materia - Datos de la materia que se validarán.
 * @param {string} [materia.codigo] - Código de la materia, si se proporciona.
 * @param {string} [materia.nombre] - Nombre de la materia, si se proporciona.
 * @param {string|number} [excludeId] - ID que se excluye de la búsqueda, por ejemplo al actualizar.
 * @returns {Promise<void>} No retorna un valor si las validaciones son exitosas.
 * @throws {HttpError} Código 409 (DUPLICATE_CODE) si el código ya está registrado para el usuario.
 * @throws {HttpError} Código 409 (DUPLICATE_NAME) si el nombre ya está registrado para el usuario.
 */
async function ensureUniqueFields(userId, materia, excludeId) {
 if (materia.codigo) {
   const duplicatedCode = await materiasRepository.existsByCode(userId, materia.codigo, excludeId);
   if (duplicatedCode) {
     throw new HttpError(409, "DUPLICATE_CODE", "Ya existe una materia con ese código.");
   }
 }
 if (materia.nombre) {
   const duplicatedName = await materiasRepository.existsByName(userId, materia.nombre, excludeId);
   if (duplicatedName) {
     throw new HttpError(409, "DUPLICATE_NAME", "Ya existe una materia con ese nombre.");
   }
 }
}

/**
 * Reemplaza todos los campos de una materia después de validar su existencia y unicidad.
 *
 * @async
 * @function replaceMateria
 * @param {string|number} id - Identificador de la materia que se reemplazará.
 * @param {string|number} userId - Identificador del usuario propietario.
 * @param {Object} materia - Conjunto completo de datos nuevos de la materia.
 * @returns {Promise<Object|null>} Materia actualizada, o null si no se pudo recuperar.
 * @throws {HttpError} Código 404 si la materia no existe para ese usuario.
 * @throws {HttpError} Código 409 si el código o el nombre ya están registrados para otra materia del usuario.
 */
export async function replaceMateria(id, userId, materia) {
 await getMateriaById(id, userId);
 await ensureUniqueFields(userId, materia, id);
 return materiasRepository.updateMateria(id, userId, materia);
}

/**
 * Actualiza parcialmente una materia después de validar su existencia y unicidad.
 *
 * @async
 * @function updateMateria
 * @param {string|number} id - Identificador de la materia que se actualizará.
 * @param {string|number} userId - Identificador del usuario propietario.
 * @param {Object} partialMateria - Campos de la materia que se actualizarán.
 * @param {string} [partialMateria.nombre] - Nuevo nombre de la materia.
 * @param {string} [partialMateria.codigo] - Nuevo código de la materia.
 * @returns {Promise<Object|null>} Materia actualizada, o null si no se pudo recuperar.
 * @throws {HttpError} Código 404 si la materia no existe para ese usuario.
 * @throws {HttpError} Código 409 si el código o el nombre ya están registrados para otra materia del usuario.
 */
export async function updateMateria(id, userId, partialMateria) {
 await getMateriaById(id, userId);
 await ensureUniqueFields(userId, partialMateria, id);
 return materiasRepository.patchMateria(id, userId, partialMateria);
}

/**
 * Elimina una materia después de confirmar que pertenece al usuario.
 *
 * @async
 * @function removeMateria
 * @param {string|number} id - Identificador de la materia que se eliminará.
 * @param {string|number} userId - Identificador del usuario propietario.
 * @returns {Promise<void>} No retorna un valor si la eliminación finaliza correctamente.
 * @throws {HttpError} Código 404 si la materia no existe para ese usuario.
 */
export async function removeMateria(id, userId) {
 await getMateriaById(id, userId);
 await materiasRepository.deleteMateria(id, userId);
}