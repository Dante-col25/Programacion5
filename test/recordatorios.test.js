import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  validateCreateRecordatorio, validatePatchRecordatorio,
  validateRecordatorioId, validateRecordatorioListQuery,
  validateReplaceRecordatorio
} from "../src/validators/recordatorios.validator.js";

const valid = { tareaId: 12, mensaje: "Revisar materiales", fechaHora: "2026-08-21T18:30", canal: "in_app" };

test("valida campos de creación y aplica leido=false por defecto", () => {
  const expected = { ...valid, fechaHora: "2026-08-21 18:30" };
  assert.deepEqual(validateCreateRecordatorio(valid), expected);
  assert.deepEqual(validateReplaceRecordatorio(valid), { ...expected, leido: false });
  assert.deepEqual(validateCreateRecordatorio({ ...valid, leido: true }).leido, true);
});

test("rechaza fechas, canales, longitudes y tarea inválidos", () => {
  for (const input of [
    { ...valid, tareaId: 0 }, { ...valid, mensaje: " " }, { ...valid, mensaje: "x".repeat(256) },
    { ...valid, fechaHora: "2026-02-30T12:00" }, { ...valid, canal: "sms" }, { ...valid, leido: "yes" }
  ]) assert.throws(() => validateCreateRecordatorio(input), { statusCode: 422 });
});

test("PATCH acepta campos parciales y exige al menos uno", () => {
  assert.deepEqual(validatePatchRecordatorio({ leido: true }), { leido: true });
  assert.throws(() => validatePatchRecordatorio({}), { statusCode: 422 });
  assert.throws(() => validatePatchRecordatorio({ id_usuario: 2 }), { statusCode: 422 });
});

test("valida filtro, paginación y el identificador", () => {
  assert.deepEqual(validateRecordatorioListQuery({ leido: "false", page: "2", limit: "10" }), {
    page: 2, limit: 10, leido: false, search: "", sort: "fechaHora", order: "ASC"
  });
  assert.throws(() => validateRecordatorioListQuery({ limit: "101" }), { statusCode: 422 });
  assert.throws(() => validateRecordatorioListQuery({ sort: "id_usuario" }), { statusCode: 422 });
  assert.equal(validateRecordatorioId("9"), 9);
  assert.throws(() => validateRecordatorioId("abc"), { statusCode: 422 });
});

test("las escrituras SQL afectan solo recordatorio y comprueban propiedad por lectura", async () => {
  const sql = await readFile(new URL("../src/repositories/recordatorios.repository.js", import.meta.url), "utf8");
  assert.match(sql, /INSERT INTO recordatorio[\s\S]*?SELECT[\s\S]*?FROM tarea[\s\S]*?INNER JOIN materia[\s\S]*?m\.id_usuario = \?/);
  assert.match(sql, /UPDATE recordatorio r[\s\S]*?INNER JOIN tarea[\s\S]*?INNER JOIN materia[\s\S]*?WHERE r\.id_recordatorio = \? AND m\.id_usuario = \?/);
  assert.match(sql, /DELETE r FROM recordatorio r[\s\S]*?INNER JOIN tarea[\s\S]*?INNER JOIN materia[\s\S]*?m\.id_usuario = \?/);
  assert.doesNotMatch(sql, /UPDATE\s+(?:tarea|materia)\b|DELETE\s+(?:FROM\s+)?(?:tarea|materia)\b/i);
});
