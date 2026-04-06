import type { Request as RequestType, Response as ResponseType } from "express";
import { ProductosService } from "./Productos.service.js";
import fs from "fs";
import path from "path";

export default class ProductosController {
  private productosService: ProductosService;

  constructor() {
    this.productosService = new ProductosService();
  }

  // Obtener todos los productos
  public async getProductos(_req: RequestType, res: ResponseType) {
    try {
      const productos = await this.productosService.obtenerTodos();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener un producto por ID
  public async getProductoById(req: RequestType, res: ResponseType) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }
      const producto = await this.productosService.obtenerPorId(id);

      if (!producto) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }

      res.status(200).json(producto);
    } catch (error) {
      res.status(400).json({ error: "ID no válido o error en la consulta" });
    }
  }

  // Crear un producto (con imágenes opcionales via multipart/form-data)
  public async crearProducto(req: RequestType, res: ResponseType) {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const imagenes = files && files.length > 0
        ? files.map(f => `/uploads/productos/${f.filename}`)
        : [];

      const data = {
        nombre: req.body.nombre,
        precio: Number(req.body.precio),
        stock: Number(req.body.stock),
        descripcion: req.body.descripcion || undefined,
        categoria: req.body.categoria || undefined,
        subcategoria: req.body.subcategoria || undefined,
        activo: req.body.activo === "true" || req.body.activo === true,
        imagenes,
        img: imagenes[0] ?? req.body.img ?? undefined,
      };

      const nuevo = await this.productosService.crear(data);
      res.status(201).json(nuevo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al crear producto" });
    }
  }

  // Agregar imágenes a un producto existente
  public async agregarImagenes(req: RequestType, res: ResponseType) {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[] | undefined;

      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }

      if (!files || files.length === 0) {
        res.status(400).json({ error: "No se proporcionaron imágenes" });
        return;
      }

      const producto = await this.productosService.obtenerPorId(id);
      if (!producto) {
        files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }

      const nuevasUrls = files.map(f => `/uploads/productos/${f.filename}`);
      const imagenes = [...(producto.imagenes || []), ...nuevasUrls];

      const actualizado = await this.productosService.actualizar(id, {
        imagenes,
        img: imagenes[0],
      });

      res.status(200).json(actualizado);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al agregar imágenes" });
    }
  }

  // Eliminar una imagen por índice
  public async eliminarImagen(req: RequestType, res: ResponseType) {
    try {
      const { id, indice } = req.params;
      const idx = parseInt(indice);

      if (!id || isNaN(idx) || idx < 0) {
        res.status(400).json({ error: "Parámetros inválidos" });
        return;
      }

      const result = await this.productosService.eliminarImagenPorIndice(id, idx);

      if (!result) {
        res.status(404).json({ error: "Producto o imagen no encontrada" });
        return;
      }

      if (result.url.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), result.url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      res.status(200).json(result.producto);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al eliminar imagen" });
    }
  }

  // Actualizar un producto
  public async actualizarProducto(req: RequestType, res: ResponseType) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }
      const actualizado = await this.productosService.actualizar(id, req.body);

      if (!actualizado) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }

      res.status(200).json(actualizado);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al actualizar producto" });
    }
  }

  // Eliminar un producto
  public async eliminarProducto(req: RequestType, res: ResponseType) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }
      const eliminado = await this.productosService.eliminar(id);

      if (!eliminado) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }

      res.status(200).json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ error: "ID no válido o error al eliminar" });
    }
  }

  // Método de prueba (lo dejé igual)
  public async prueba(_req: RequestType, res: ResponseType) {
    try {
      const result = await this.productosService.prueba();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
