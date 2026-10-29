import {
  createRecordatorio, deleteRecordatorio, getRecordatorio,
  listRecordatorios, listTareasParaRecordatorio, replaceRecordatorio
} from "../api/recordatorios.js";

const $ = selector => document.querySelector(selector);
const form = $("#form");
const rows = $("#rows");
const status = $("#status");
const pageSize = 20;
let page = 1;
let pages = 1;
let searchTimer;

function report(message) { status.textContent = message; }
function formatDate(value) { return value ? new Date(value).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }) : ""; }
function clearForm() {
  form.reset();
  $("#recordatorio-id").value = "";
  $("#form-title").textContent = "Nuevo recordatorio";
  $("#cancel-edit").hidden = true;
}

async function loadTasks() {
  const response = await listTareasParaRecordatorio();
  const select = $("#tarea");
  select.replaceChildren(new Option("Selecciona una tarea", ""));
  for (const task of response.data) select.add(new Option(`${task.titulo} · ${task.materiaNombre}`, task.id));
  if (!response.data.length) report("No hay tareas disponibles para asociar. Crea primero una tarea propia.");
}

async function loadRecords() {
  report("Cargando recordatorios…");
  try {
    const response = await listRecordatorios({
      page, limit: pageSize, search: $("#search").value,
      leido: $("#filter").value, sort: "fechaHora", order: "asc"
    });
    pages = Math.max(response.meta.pages, 1);
    $("#page-label").textContent = `Página ${response.meta.page} de ${pages} · ${response.meta.total} recordatorios`;
    $("#previous").disabled = page <= 1;
    $("#next").disabled = page >= pages;
    rows.replaceChildren();
    for (const record of response.data) {
      const tr = document.createElement("tr");
      const taskCell = document.createElement("td");
      taskCell.append(document.createTextNode(record.tareaTitulo));
      const subject = document.createElement("small");
      subject.textContent = record.materiaNombre;
      taskCell.append(subject);
      const values = [formatDate(record.fechaHora), record.mensaje, taskCell, record.canal === "email" ? "Correo" : "En la aplicación", record.leido ? "Leído" : "Pendiente"];
      for (const value of values) {
        const td = document.createElement("td");
        if (value instanceof Node) td.append(value); else td.textContent = value;
        tr.append(td);
      }
      const actions = document.createElement("td");
      const group = document.createElement("div"); group.className = "actions";
      const edit = document.createElement("button"); edit.type = "button"; edit.className = "secondary"; edit.textContent = "Editar";
      edit.addEventListener("click", () => editRecord(record.id));
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "danger"; remove.textContent = "Eliminar";
      remove.addEventListener("click", () => removeRecord(record.id));
      group.append(edit, remove); actions.append(group); tr.append(actions); rows.append(tr);
    }
    if (!response.data.length) {
      const tr = document.createElement("tr"); const td = document.createElement("td");
      td.colSpan = 6; td.textContent = "No se encontraron recordatorios."; tr.append(td); rows.append(tr);
    }
    report("Recordatorios actualizados.");
  } catch (error) { report(error.message); }
}

async function editRecord(id) {
  try {
    const { data } = await getRecordatorio(id);
    $("#recordatorio-id").value = data.id;
    $("#tarea").value = data.tareaId;
    $("#mensaje").value = data.mensaje;
    $("#fecha-hora").value = data.fechaHora.slice(0, 16);
    $("#canal").value = data.canal;
    $("#leido").checked = Boolean(data.leido);
    $("#form-title").textContent = `Editar recordatorio #${data.id}`;
    $("#cancel-edit").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) { report(error.message); }
}

async function removeRecord(id) {
  if (!window.confirm("¿Eliminar este recordatorio?")) return;
  try { await deleteRecordatorio(id); report("Recordatorio eliminado."); await loadRecords(); }
  catch (error) { report(error.message); }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const id = $("#recordatorio-id").value;
  const body = {
    tareaId: Number($("#tarea").value), mensaje: $("#mensaje").value,
    fechaHora: $("#fecha-hora").value, canal: $("#canal").value, leido: $("#leido").checked
  };
  try {
    if (id) await replaceRecordatorio(id, body); else await createRecordatorio(body);
    clearForm(); page = 1; report(id ? "Recordatorio actualizado." : "Recordatorio creado."); await loadRecords();
  } catch (error) { report(error.message); }
});

$("#cancel-edit").addEventListener("click", clearForm);
$("#previous").addEventListener("click", () => { page = Math.max(1, page - 1); loadRecords(); });
$("#next").addEventListener("click", () => { page = Math.min(pages, page + 1); loadRecords(); });
$("#filter").addEventListener("change", () => { page = 1; loadRecords(); });
$("#search").addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page = 1; loadRecords(); }, 250); });

try { await loadTasks(); } catch (error) { report(error.message); }
await loadRecords();
