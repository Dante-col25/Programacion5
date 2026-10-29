import { request } from "./http.js";

const base = "/recordatorios";
export const listRecordatorios = query => request(base, { query });
export const listTareasParaRecordatorio = () => request(`${base}/tareas`);
export const getRecordatorio = id => request(`${base}/${encodeURIComponent(id)}`);
export const createRecordatorio = body => request(base, { method: "POST", body });
export const replaceRecordatorio = (id, body) => request(`${base}/${encodeURIComponent(id)}`, { method: "PUT", body });
export const patchRecordatorio = (id, body) => request(`${base}/${encodeURIComponent(id)}`, { method: "PATCH", body });
export const deleteRecordatorio = id => request(`${base}/${encodeURIComponent(id)}`, { method: "DELETE" });
