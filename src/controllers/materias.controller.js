import * as materiasService from "../services/materias.service.js";
import { sendNoContent, sendSuccess } from "../utils/api-response.js";
import {
   validateCreateMateria,
   validateMateriaListQuery,
   validateMateriaId,
   validatePatchMateria
} from "../validators/materias.validator.js";

/**
 * Atiende la consulta paginada de materias del usuario autenticado.
 *
 * @async
 * @function listMaterias
 * @param {import("express").Request} request - Solicitud HTTP con filtros en `query` y usuario autenticado.
 * @param {import("express").Response} response - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Middleware para propagar errores.
 * @returns {Promise<import("express").Response|void>} Respuesta con la lista y sus metadatos, o delegación del error.
 */
export async function listMaterias(request, response, next) {
 try {
   const filters = validateMateriaListQuery(request.query);
   const result = await materiasService.listMaterias(request.user.id, filters);
   return sendSuccess(response, result.data, 200, result.meta);
 } catch (error) {
   return next(error);
 }
}

/**
 * Atiende la consulta de una materia por ID para el usuario autenticado.
 *
 * @async
 * @function getMateriaById
 * @param {import("express").Request} request - Solicitud HTTP con el ID en `params`.
 * @param {import("express").Response} response - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Middleware para propagar errores.
 * @returns {Promise<import("express").Response|void>} Respuesta con la materia, o delegación del error.
 */
export async function getMateriaById(request, response, next) {
 try {
   const id  = validateMateriaId(request.params.id);
   const materia = await materiasService.getMateriaById(id, request.user.id);
   return sendSuccess(response, materia)
 } catch (error) {
   return next(error);
 }
}

/**
 * Devuelve las tareas de una materia del usuario autenticado.
 *
 * @async
 * @function listTareasByMateriaId
 * @param {import("express").Request} request - Solicitud HTTP con el ID de la materia en `params`.
 * @param {import("express").Response} response - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Middleware para propagar errores.
 * @returns {Promise<import("express").Response|void>} Respuesta con las tareas, o delegación del error.
 */
export async function listTareasByMateriaId(request, response, next) {
 try {
   const materiaId = validateMateriaId(request.params.id);
   const tareas = await materiasService.listTareasByMateriaId(materiaId, request.user.id);
   return sendSuccess(response, tareas);
 } catch (error) {
   return next(error);
 }
}

/**
 * Valida y crea una materia para el usuario autenticado.
 *
 * @async
 * @function createMateria
 * @param {import("express").Request} request - Solicitud HTTP con los datos de la materia en `body`.
 * @param {import("express").Response} response - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Middleware para propagar errores.
 * @returns {Promise<import("express").Response|void>} Respuesta 201 con la materia, o delegación del error.
 */
export async function createMateria(request, response, next) {
 try {
   const payload = validateCreateMateria(request.body);
   const materia = await materiasService.createMateria(request.user.id, payload);
   return sendSuccess(response, materia, 201);
 } catch (error) {
   return next(error);
 }
}

/**
 * Valida y reemplaza todos los campos de una materia del usuario autenticado.
 *
 * @async
 * @function replaceMateria
 * @param {import("express").Request} request - Solicitud HTTP con el ID en `params` y los datos en `body`.
 * @param {import("express").Response} response - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Middleware para propagar errores.
 * @returns {Promise<import("express").Response|void>} Respuesta con la materia reemplazada, o delegación del error.
 */
export async function replaceMateria(request, response, next) {
 try {
   const id = validateMateriaId(request.params.id);
   const payload = validateCreateMateria(request.body);
   const materia = await materiasService.replaceMateria(id, request.user.id, payload);
   return sendSuccess(response, materia);
 } catch (error) {
   return next(error);
 }
}

/**
 * Valida y actualiza parcialmente una materia del usuario autenticado.
 *
 * @async
 * @function updateMateria
 * @param {import("express").Request} request - Solicitud HTTP con el ID en `params` y los campos en `body`.
 * @param {import("express").Response} response - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Middleware para propagar errores.
 * @returns {Promise<import("express").Response|void>} Respuesta con la materia actualizada, o delegación del error.
 */
export async function updateMateria(request, response, next) {
 try {
   const id = validateMateriaId(request.params.id);
   const payload = validatePatchMateria(request.body);
   const materia = await materiasService.updateMateria(id, request.user.id, payload);
   return sendSuccess(response, materia);
 } catch (error) {
   return next(error);
 }
}

/**
 * Elimina una materia del usuario autenticado.
 *
 * @async
 * @function deleteMateria
 * @param {import("express").Request} request - Solicitud HTTP con el ID en `params`.
 * @param {import("express").Response} response - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Middleware para propagar errores.
 * @returns {Promise<import("express").Response|void>} Respuesta 204, o delegación del error.
 */
export async function deleteMateria(request, response, next) {
 try {
   const id = validateMateriaId(request.params.id);
   await materiasService.removeMateria(id, request.user.id);
   return sendNoContent(response);
 } catch (error) {
   return next(error);
 }
}