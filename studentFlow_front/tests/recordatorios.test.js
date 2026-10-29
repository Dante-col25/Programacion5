import test from "node:test";
import assert from "node:assert/strict";
import {
  createRecordatorio, deleteRecordatorio, getRecordatorio,
  listRecordatorios, listTareasParaRecordatorio, patchRecordatorio, replaceRecordatorio
} from "../public/js/api/recordatorios.js";

test("el cliente HTTP llama a las rutas CRUD y devuelve la respuesta de lista paginada", async t => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, ...options });
    return options.method === "DELETE" ? new Response(null, { status: 204 }) : Response.json({ success: true, data: [], meta: { page: 1 } });
  });
  await listRecordatorios({ leido: false, search: "parcial" });
  await listTareasParaRecordatorio();
  await getRecordatorio(4);
  const body = { tareaId: 12, mensaje: "Repasar", fechaHora: "2026-08-21T18:30", canal: "email" };
  await createRecordatorio(body);
  await replaceRecordatorio(4, body);
  await patchRecordatorio(4, { leido: true });
  assert.equal(await deleteRecordatorio(4), null);
  assert.deepEqual(calls.map(({ url, method }) => [method, url]), [
    ["GET", "/api/v1/recordatorios?leido=false&search=parcial"],
    ["GET", "/api/v1/recordatorios/tareas"], ["GET", "/api/v1/recordatorios/4"],
    ["POST", "/api/v1/recordatorios"], ["PUT", "/api/v1/recordatorios/4"],
    ["PATCH", "/api/v1/recordatorios/4"], ["DELETE", "/api/v1/recordatorios/4"]
  ]);
  assert.deepEqual(JSON.parse(calls[5].body), { leido: true });
  assert.equal(calls[0].headers["Content-Type"], undefined);
});
