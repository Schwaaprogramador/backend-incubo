import type { Request, Response } from "express";
import { PedidosService } from "./Pedidos.service.js";

const pedidosService = new PedidosService();

export const getPedidos = async (_req: Request, res: Response) => {
  try {
    const pedidos = await pedidosService.obtenerTodos();
    res.status(200).json(pedidos);
  } catch {
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
};

export const getPedidoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pedido = await pedidosService.obtenerPorId(id);
    if (!pedido) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }
    res.status(200).json(pedido);
  } catch {
    res.status(400).json({ error: "ID no válido" });
  }
};

export const actualizarEstadoPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ["pendiente", "pagado", "fallido", "cancelado"];
    if (!estadosValidos.includes(estado)) {
      res.status(400).json({ error: "Estado no válido" });
      return;
    }

    const pedido = await pedidosService.actualizarEstado(id, estado);
    if (!pedido) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }

    res.status(200).json(pedido);
  } catch {
    res.status(400).json({ error: "Error al actualizar el pedido" });
  }
};
