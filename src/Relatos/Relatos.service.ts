import { RelatoModel } from "./Relatos.modelo.ts";

export class RelatosService {
  async obtenerTodos() {
    return RelatoModel.find().sort({ createdAt: -1 });
  }

  async obtenerAprobados() {
    return RelatoModel.find({ aprobado: true, activo: true }).sort({ createdAt: -1 });
  }

  async obtenerPorId(id: string) {
    return RelatoModel.findById(id);
  }

  async crear(data: any) {
    const relato = new RelatoModel(data);
    return relato.save();
  }

  async actualizar(id: string, data: any) {
    return RelatoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminar(id: string) {
    return RelatoModel.findByIdAndDelete(id);
  }
}
