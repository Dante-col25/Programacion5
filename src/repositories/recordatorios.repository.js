import { pool } from "../config/database.js";

const sortableFields = {
  id: "r.id_recordatorio",
  mensaje: "r.mensaje",
  fechaHora: "r.fecha_hora",
  canal: "r.canal",
  leido: "r.leido"
};

const selection = `r.id_recordatorio AS id, r.id_tarea AS tareaId, t.titulo AS tareaTitulo,
  m.nombre AS materiaNombre, r.mensaje, DATE_FORMAT(r.fecha_hora, '%Y-%m-%dT%H:%i:%s') AS fechaHora,
  r.canal, r.leido, r.created_at AS createdAt`;
const ownershipJoin = `FROM recordatorio r INNER JOIN tarea t ON t.id_tarea = r.id_tarea
  INNER JOIN materia m ON m.id_materia = t.id_materia`;
const mapRecord = row => row ? { ...row, leido: Boolean(row.leido) } : null;

function filtersSql(userId, filters) {
  const conditions = ["m.id_usuario = ?"];
  const params = [userId];
  if (filters.leido !== undefined) { conditions.push("r.leido = ?"); params.push(filters.leido ? 1 : 0); }
  if (filters.search) {
    conditions.push("(r.mensaje LIKE ? OR t.titulo LIKE ? OR m.nombre LIKE ?)");
    const search = `%${filters.search}%`;
    params.push(search, search, search);
  }
  return { where: conditions.join(" AND "), params };
}

export async function findAllByUserId(userId, filters) {
  const { where, params } = filtersSql(userId, filters);
  const [[count]] = await pool.execute(`SELECT COUNT(*) AS total ${ownershipJoin} WHERE ${where}`, params);
  const [rows] = await pool.execute(
    `SELECT ${selection} ${ownershipJoin} WHERE ${where}
     ORDER BY ${sortableFields[filters.sort]} ${filters.order}, r.id_recordatorio ASC LIMIT ? OFFSET ?`,
    [...params, filters.limit, (filters.page - 1) * filters.limit]
  );
  return { rows: rows.map(mapRecord), total: Number(count.total) };
}

export async function findTasksByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT t.id_tarea AS id, t.titulo, t.id_materia AS materiaId, m.nombre AS materiaNombre
     FROM tarea t INNER JOIN materia m ON m.id_materia = t.id_materia
     WHERE m.id_usuario = ? ORDER BY m.nombre ASC, t.titulo ASC`, [userId]
  );
  return rows;
}

export async function taskBelongsToUser(taskId, userId) {
  const [rows] = await pool.execute(
    `SELECT 1 FROM tarea t INNER JOIN materia m ON m.id_materia = t.id_materia
     WHERE t.id_tarea = ? AND m.id_usuario = ? LIMIT 1`, [taskId, userId]
  );
  return rows.length > 0;
}

export async function findByIdAndUserId(id, userId) {
  const [rows] = await pool.execute(`SELECT ${selection} ${ownershipJoin} WHERE r.id_recordatorio = ? AND m.id_usuario = ?`, [id, userId]);
  return mapRecord(rows[0]);
}

export async function create(userId, fields) {
  const [result] = await pool.execute(
    `INSERT INTO recordatorio (id_tarea, mensaje, fecha_hora, canal, leido)
     SELECT t.id_tarea, ?, ?, ?, ? FROM tarea t
     INNER JOIN materia m ON m.id_materia = t.id_materia
     WHERE t.id_tarea = ? AND m.id_usuario = ?`,
    [fields.mensaje, fields.fechaHora, fields.canal, fields.leido ?? false, fields.tareaId, userId]
  );
  return result.affectedRows ? findByIdAndUserId(result.insertId, userId) : null;
}

export async function patch(id, userId, fields) {
  const columns = { tareaId: "id_tarea", mensaje: "mensaje", fechaHora: "fecha_hora", canal: "canal", leido: "leido" };
  const assignments = Object.keys(fields).map(field => `${columns[field]} = ?`);
  if (!assignments.length) return findByIdAndUserId(id, userId);
  const values = Object.entries(fields).map(([key, value]) => key === "leido" ? (value ? 1 : 0) : value);
  const tareaIndex = Object.keys(fields).indexOf("tareaId");
  if (tareaIndex >= 0) {
    values.splice(tareaIndex, 1);
    assignments[tareaIndex] = "id_tarea = (SELECT t.id_tarea FROM tarea t INNER JOIN materia m ON m.id_materia = t.id_materia WHERE t.id_tarea = ? AND m.id_usuario = ?)";
    values.splice(tareaIndex, 0, fields.tareaId, userId);
  }
  const [result] = await pool.execute(
    `UPDATE recordatorio r INNER JOIN tarea t ON t.id_tarea = r.id_tarea
     INNER JOIN materia m ON m.id_materia = t.id_materia
     SET ${assignments.join(", ")} WHERE r.id_recordatorio = ? AND m.id_usuario = ?`,
    [...values, id, userId]
  );
  return findByIdAndUserId(id, userId);
}

export async function remove(id, userId) {
  const [result] = await pool.execute(
    `DELETE r FROM recordatorio r INNER JOIN tarea t ON t.id_tarea = r.id_tarea
     INNER JOIN materia m ON m.id_materia = t.id_materia
     WHERE r.id_recordatorio = ? AND m.id_usuario = ?`, [id, userId]
  );
  return result.affectedRows > 0;
}
