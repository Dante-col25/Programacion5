import * as service from "../services/recordatorios.service.js";
import { sendNoContent, sendSuccess } from "../utils/api-response.js";
import {
  validateCreateRecordatorio, validatePatchRecordatorio, validateRecordatorioId,
  validateRecordatorioListQuery, validateReplaceRecordatorio
} from "../validators/recordatorios.validator.js";

export async function list(request, response, next) {
  try {
    const result = await service.list(request.user.id, validateRecordatorioListQuery(request.query));
    return sendSuccess(response, result.data, 200, result.meta);
  } catch (error) { return next(error); }
}
export async function listTasks(request, response, next) {
  try { return sendSuccess(response, await service.listTasks(request.user.id)); }
  catch (error) { return next(error); }
}
export async function get(request, response, next) {
  try { return sendSuccess(response, await service.get(validateRecordatorioId(request.params.id), request.user.id)); }
  catch (error) { return next(error); }
}
export async function create(request, response, next) {
  try { return sendSuccess(response, await service.create(request.user.id, validateCreateRecordatorio(request.body)), 201); }
  catch (error) { return next(error); }
}
export async function replace(request, response, next) {
  try {
    const id = validateRecordatorioId(request.params.id);
    const row = await service.update(id, request.user.id, validateReplaceRecordatorio(request.body));
    return sendSuccess(response, row);
  } catch (error) { return next(error); }
}
export async function patch(request, response, next) {
  try {
    const id = validateRecordatorioId(request.params.id);
    const row = await service.update(id, request.user.id, validatePatchRecordatorio(request.body));
    return sendSuccess(response, row);
  } catch (error) { return next(error); }
}
export async function remove(request, response, next) {
  try { await service.remove(validateRecordatorioId(request.params.id), request.user.id); return sendNoContent(response); }
  catch (error) { return next(error); }
}
