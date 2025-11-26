import type { Request as RequestType, Response as ResponseType } from "express";
import { ProductosService } from "./Productos.service.js";

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

  // Crear un producto
  public async crearProducto(req: RequestType, res: ResponseType) {
    try {
      const nuevo = await this.productosService.crear(req.body);
      res.status(201).json(nuevo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al crear producto" });
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
