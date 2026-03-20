import { ContactoModel } from "./Contacto.modelo.ts";

export class ContactoService {
  async crear(data: { nombre: string; email: string; asunto?: string; mensaje: string; telefono?: string; tieneWhatsapp?: boolean }) {
    const mensaje = new ContactoModel(data);
    return mensaje.save();
  }

  async obtenerTodos() {
    return ContactoModel.find().sort({ createdAt: -1 });
  }

  async marcarLeido(id: string, leido: boolean) {
    return ContactoModel.findByIdAndUpdate(id, { leido }, { new: true });
  }

  async eliminar(id: string) {
    return ContactoModel.findByIdAndDelete(id);
  }
}
