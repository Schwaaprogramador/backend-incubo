import { Schema, model, Document, Model } from "mongoose";

export interface IContacto extends Document {
  nombre: string;
  email: string;
  asunto?: string;
  mensaje: string;
  telefono?: string;
  tieneWhatsapp?: boolean;
  leido: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactoSchema = new Schema<IContacto>(
  {
    nombre:         { type: String, required: true, trim: true },
    email:          { type: String, required: true, trim: true, lowercase: true },
    asunto:         { type: String, trim: true },
    mensaje:        { type: String, required: true },
    telefono:       { type: String, trim: true },
    tieneWhatsapp:  { type: Boolean, default: false },
    leido:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

ContactoSchema.index({ leido: 1, createdAt: -1 });

export const ContactoModel = model<IContacto, Model<IContacto>>("Contacto", ContactoSchema);
