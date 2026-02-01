import { Schema, model, Document } from "mongoose";

export interface IUsuario extends Document {
  email: string;
  password?: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
  direccion?: {
    calle: string;
    numero: string;
    codigoPostal: string;
  };
  rol: "admin" | "usuario" | "cliente";
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
      required: false
    },
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    apellido: {
      type: String,
      required: false,
      trim: true
    },
    telefono: {
      type: String,
      required: false,
      trim: true
    },
    direccion: {
      calle: { type: String },
      numero: { type: String },
      codigoPostal: { type: String }
    },
    rol: {
      type: String,
      enum: ["admin", "usuario", "cliente"],
      default: "cliente"
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
