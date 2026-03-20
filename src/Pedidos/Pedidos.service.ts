import { PedidoModel } from "./Pedidos.modelo.js";
import type { IPedido, IItemPedido, IUsuarioPedido, EstadoPedido } from "./Pedidos.modelo.js";

export class PedidosService {
  async crear(data: {
    usuario: IUsuarioPedido;
    items: IItemPedido[];
    total: number;
  }): Promise<IPedido> {
    const pedido = new PedidoModel({ ...data, estado: "pendiente" });
    return pedido.save();
  }

  async obtenerTodos() {
    return PedidoModel.find().sort({ createdAt: -1 });
  }

  async obtenerPorId(id: string) {
    return PedidoModel.findById(id);
  }

  async obtenerPorPreferenceId(preferenceId: string) {
    return PedidoModel.findOne({ mpPreferenceId: preferenceId });
  }

  async actualizarEstado(
    id: string,
    estado: EstadoPedido,
    mpPaymentId?: string
  ) {
    return PedidoModel.findByIdAndUpdate(
      id,
      {
        estado,
        ...(mpPaymentId && { mpPaymentId }),
      },
      { new: true }
    );
  }

  async asignarPreferenceId(pedidoId: string, mpPreferenceId: string) {
    return PedidoModel.findByIdAndUpdate(
      pedidoId,
      { mpPreferenceId },
      { new: true }
    );
  }
}
