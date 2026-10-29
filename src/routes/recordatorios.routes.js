import { Router } from "express";
import * as controller from "../controllers/recordatorios.controller.js";

const router = Router();
router.get("/tareas", controller.listTasks);
router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", controller.create);
router.put("/:id", controller.replace);
router.patch("/:id", controller.patch);
router.delete("/:id", controller.remove);
export default router;
