import * as repository from "../repositories/recordatorios.repository.js";
import { HttpError } from "../utils/http-error.js";

export async function list(userId, filters) {
  const { rows, total } = await repository.findAllByUserId(userId, filters);
  return { data: rows, meta: { page: filters.page, limit: filters.limit, total, pages: Math.ceil(total / filters.limit) } };
}
export const listTasks = userId => repository.findTasksByUserId(userId);

export async function get(id, userId) {
  const row = await repository.findByIdAndUserId(id, userId);
  if (!row) throw new HttpError(404, "NOT_FOUND", "No se encontró el recordatorio para este usuario.");
  return row;
}

async function assertTaskOwnership(taskId, userId) {
  if (!(await repository.taskBelongsToUser(taskId, userId))) {
    throw new HttpError(404, "TASK_NOT_FOUND", "No se encontró la tarea para este usuario.");
  }
}

export async function create(userId, fields) {
  await assertTaskOwnership(fields.tareaId, userId);
  const row = await repository.create(userId, fields);
  if (!row) throw new HttpError(404, "TASK_NOT_FOUND", "No se encontró la tarea para este usuario.");
  return row;
}

export async function update(id, userId, fields) {
  await get(id, userId);
  if (fields.tareaId !== undefined) await assertTaskOwnership(fields.tareaId, userId);
  return repository.patch(id, userId, fields);
}

export async function remove(id, userId) {
  if (!(await repository.remove(id, userId))) throw new HttpError(404, "NOT_FOUND", "No se encontró el recordatorio para este usuario.");
}
