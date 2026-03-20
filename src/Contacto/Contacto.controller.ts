import type { Request, Response } from "express";
import { ContactoService } from "./Contacto.service.ts";

const contactoService = new ContactoService();

export async function crearMensaje(req: Request, res: Response) {
  try {
    const { nombre, email, asunto, mensaje, telefono, tieneWhatsapp } = req.body;
    if (!nombre || !email || !mensaje) {
      res.status(400).json({ error: "Nombre, email y mensaje son requeridos" });
      return;
    }
    const nuevo = await contactoService.crear({ nombre, email, asunto, mensaje, telefono, tieneWhatsapp: !!tieneWhatsapp });
    res.status(201).json(nuevo);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error al guardar el mensaje" });
  }
}

export async function getMensajes(_req: Request, res: Response) {
  try {
    const mensajes = await contactoService.obtenerTodos();
    res.status(200).json(mensajes);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function marcarLeido(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { leido } = req.body;
    const actualizado = await contactoService.marcarLeido(id, leido !== false);
    if (!actualizado) {
      res.status(404).json({ error: "Mensaje no encontrado" });
      return;
    }
    res.status(200).json(actualizado);
  } catch {
    res.status(400).json({ error: "Error al actualizar el mensaje" });
  }
}

export async function eliminarMensaje(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const eliminado = await contactoService.eliminar(id);
    if (!eliminado) {
      res.status(404).json({ error: "Mensaje no encontrado" });
      return;
    }
    res.status(200).json({ mensaje: "Eliminado correctamente" });
  } catch {
    res.status(400).json({ error: "Error al eliminar el mensaje" });
  }
}
