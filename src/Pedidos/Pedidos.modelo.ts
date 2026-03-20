import { Schema, model, Document } from "mongoose";

export interface IItemPedido {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  img?: string;
}

export interface IUsuarioPedido {
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  direccion?: {
    calle?: string;
    numero?: string;
    codigoPostal?: string;
  };
}

export type EstadoPedido = "pendiente" | "pagado" | "fallido" | "cancelado";

export interface IPedido extends Document {
  usuario: IUsuarioPedido;
  items: IItemPedido[];
  total: number;
  estado: EstadoPedido;
  mpPreferenceId?: string;
  mpPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemPedidoSchema = new Schema<IItemPedido>({
  productoId: { type: String, required: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  cantidad: { type: Number, required: true },
  img: { type: String },
});

const PedidoSchema = new Schema<IPedido>(
  {
    usuario: {
      nombre: { type: String, required: true },
      apellido: { type: String },
      email: { type: String, required: true },
      telefono: { type: String },
      direccion: {
        calle: { type: String },
        numero: { type: String },
        codigoPostal: { type: String },
      },
    },
    items: { type: [ItemPedidoSchema], required: true },
    total: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "pagado", "fallido", "cancelado"],
      default: "pendiente",
    },
    mpPreferenceId: { type: String },
    mpPaymentId: { type: String },
  },
  { timestamps: true }
);

// Índices para consultas frecuentes
PedidoSchema.index({ estado: 1, createdAt: -1 });
PedidoSchema.index({ "usuario.email": 1 });
PedidoSchema.index({ mpPreferenceId: 1 });

export const PedidoModel = model<IPedido>("Pedido", PedidoSchema);
