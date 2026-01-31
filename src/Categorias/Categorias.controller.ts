import type { Request, Response } from "express";
import { CategoriasService } from "./Categorias.service.js";

export default class CategoriasController {
  private categoriasService: CategoriasService;

  constructor() {
    this.categoriasService = new CategoriasService();
  }

  public async getCategorias(_req: Request, res: Response) {
    try {
      const categorias = await this.categoriasService.obtenerTodas();
      res.status(200).json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  public async getCategoriasActivas(_req: Request, res: Response) {
    try {
      const categorias = await this.categoriasService.obtenerActivas();
      res.status(200).json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  public async getCategoriaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }

      const categoria = await this.categoriasService.obtenerPorId(id);

      if (!categoria) {
        res.status(404).json({ error: "Categoría no encontrada" });
        return;
      }

      res.status(200).json(categoria);
    } catch (error) {
      res.status(400).json({ error: "ID no válido o error en la consulta" });
    }
  }

  public async crearCategoria(req: Request, res: Response) {
    try {
      const { nombre, descripcion, activo } = req.body;

      if (!nombre || !nombre.trim()) {
        res.status(400).json({ error: "El nombre es requerido" });
        return;
      }

      const existente = await this.categoriasService.obtenerPorNombre(nombre.trim());
      if (existente) {
        res.status(400).json({ error: "Ya existe una categoría con ese nombre" });
        return;
      }

      const nueva = await this.categoriasService.crear({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || undefined,
        activo: activo !== undefined ? activo : true,
      });

      res.status(201).json(nueva);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al crear categoría" });
    }
  }

  public async actualizarCategoria(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }

      const { nombre, descripcion, activo } = req.body;

      if (nombre) {
        const existente = await this.categoriasService.obtenerPorNombre(nombre.trim());
        if (existente && existente._id.toString() !== id) {
          res.status(400).json({ error: "Ya existe otra categoría con ese nombre" });
          return;
        }
      }

      const actualizada = await this.categoriasService.actualizar(id, {
        ...(nombre && { nombre: nombre.trim() }),
        ...(descripcion !== undefined && { descripcion: descripcion?.trim() || undefined }),
        ...(activo !== undefined && { activo }),
      });

      if (!actualizada) {
        res.status(404).json({ error: "Categoría no encontrada" });
        return;
      }

      res.status(200).json(actualizada);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al actualizar categoría" });
    }
  }

  public async eliminarCategoria(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }

      const eliminada = await this.categoriasService.eliminar(id);

      if (!eliminada) {
        res.status(404).json({ error: "Categoría no encontrada" });
        return;
      }

      res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
    } catch (error) {
      res.status(400).json({ error: "ID no válido o error al eliminar" });
    }
  }
}
