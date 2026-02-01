import type { Request as RequestType, Response as ResponseType } from "express";
import { RelatosService } from "./Relatos.service.ts";

export default class RelatosController {
  private relatosService: RelatosService;

  constructor() {
    this.relatosService = new RelatosService();
  }

  // Obtener todos los relatos (admin)
  public async getRelatos(_req: RequestType, res: ResponseType) {
    try {
      const relatos = await this.relatosService.obtenerTodos();
      res.status(200).json(relatos);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener relatos aprobados (público)
  public async getRelatosAprobados(_req: RequestType, res: ResponseType) {
    try {
      const relatos = await this.relatosService.obtenerAprobados();
      res.status(200).json(relatos);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener un relato por ID
  public async getRelatoById(req: RequestType, res: ResponseType) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }
      const relato = await this.relatosService.obtenerPorId(id);

      if (!relato) {
        res.status(404).json({ error: "Relato no encontrado" });
        return;
      }

      res.status(200).json(relato);
    } catch (error) {
      res.status(400).json({ error: "ID no válido o error en la consulta" });
    }
  }

  // Crear un relato (público - para que usuarios envíen)
  public async crearRelato(req: RequestType, res: ResponseType) {
    try {
      const { titulo, autor, tags, contenido } = req.body;

      if (!titulo || !autor || !contenido) {
        res.status(400).json({ error: "Título, autor y contenido son requeridos" });
        return;
      }

      const data = {
        titulo,
        autor,
        tags: tags || '',
        contenido,
        aprobado: false, // Por defecto no aprobado, requiere revisión
        activo: true,
      };

      const nuevo = await this.relatosService.crear(data);
      res.status(201).json(nuevo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al crear relato" });
    }
  }

  // Actualizar un relato (admin)
  public async actualizarRelato(req: RequestType, res: ResponseType) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }
      const actualizado = await this.relatosService.actualizar(id, req.body);

      if (!actualizado) {
        res.status(404).json({ error: "Relato no encontrado" });
        return;
      }

      res.status(200).json(actualizado);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al actualizar relato" });
    }
  }

  // Eliminar un relato (admin)
  public async eliminarRelato(req: RequestType, res: ResponseType) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }
      const eliminado = await this.relatosService.eliminar(id);

      if (!eliminado) {
        res.status(404).json({ error: "Relato no encontrado" });
        return;
      }

      res.status(200).json({ mensaje: "Relato eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ error: "ID no válido o error al eliminar" });
    }
  }
}
