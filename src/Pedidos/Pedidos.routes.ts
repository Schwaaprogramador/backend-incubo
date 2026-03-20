import { Router } from "express";
import { getPedidos, getPedidoById, actualizarEstadoPedido } from "./Pedidos.controller.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const pedidosRouter = Router();

// Pública: ver un pedido por ID (para páginas de success/pending)
pedidosRouter.get("/:id", getPedidoById);

// Admin: ver todos los pedidos y gestionar estados
pedidosRouter.get("/", verificarToken, verificarAdmin, getPedidos);
pedidosRouter.put("/:id/estado", verificarToken, verificarAdmin, actualizarEstadoPedido);

export default pedidosRouter;
