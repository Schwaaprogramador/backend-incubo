import { Router } from "express";
import { crearMensaje, getMensajes, marcarLeido, eliminarMensaje } from "./Contacto.controller.ts";
import { verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const contactoRouter = Router();

// Pública: enviar mensaje desde la web
contactoRouter.post("/", crearMensaje);

// Admin: ver y gestionar mensajes
contactoRouter.get("/",           verificarToken, verificarAdmin, getMensajes);
contactoRouter.put("/:id/leido",  verificarToken, verificarAdmin, marcarLeido);
contactoRouter.delete("/:id",     verificarToken, verificarAdmin, eliminarMensaje);

export default contactoRouter;
