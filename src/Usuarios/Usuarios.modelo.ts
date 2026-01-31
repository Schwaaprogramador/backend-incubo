import { Schema, model, Document } from "mongoose";

export interface IUsuario extends Document {
  email: string;
  password: string;
  nombre: string;
  rol: "admin" | "usuario";
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UsuarioSchema = new Schema<IUsuario>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    rol: {
      type: String,
      enum: ["admin", "usuario"],
      default: "usuario"
    },
    activo: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

export const UsuarioModel = model<IUsuario>("Usuario", UsuarioSchema);
