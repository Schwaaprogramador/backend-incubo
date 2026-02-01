import bcrypt from "bcrypt";
import { UsuarioModel } from "./Usuarios.modelo.js";
import type { IUsuario } from "./Usuarios.modelo.js";

const SALT_ROUNDS = 10;

export class UsuariosService {
  async obtenerTodos() {
    return UsuarioModel.find().select("-password").sort({ createdAt: -1 });
  }

  async obtenerPorId(id: string) {
    return UsuarioModel.findById(id).select("-password");
  }

  async obtenerPorEmail(email: string) {
    return UsuarioModel.findOne({ email: email.toLowerCase() });
  }

  async crear(data: Partial<IUsuario>) {
    const usuarioData: Partial<IUsuario> = { ...data };

    // Solo hashear si se proporciona password
    if (data.password) {
      usuarioData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const usuario = new UsuarioModel(usuarioData);
    const saved = await usuario.save();
    const usuarioObj = saved.toObject();
    delete usuarioObj.password;
    return usuarioObj;
  }

  async crearOActualizarCliente(data: Partial<IUsuario>) {
    const existente = await this.obtenerPorEmail(data.email!);

    if (existente) {
      // Actualizar datos del cliente existente (sin cambiar password ni rol)
      const actualizado = await UsuarioModel.findByIdAndUpdate(
        existente._id,
        {
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          direccion: data.direccion
        },
        { new: true }
      ).select("-password");
      return actualizado;
    }

    // Crear nuevo cliente
    return this.crear({
      ...data,
      rol: "cliente"
    });
  }

  async actualizar(id: string, data: Partial<IUsuario>) {
    const updateData: Partial<IUsuario> = { ...data };

    // Solo hashear si se proporciona nueva password
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    } else {
      delete updateData.password;
    }

    return UsuarioModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
  }

  async eliminar(id: string) {
    return UsuarioModel.findByIdAndDelete(id);
  }

  async validarCredenciales(email: string, password: string) {
    const usuario = await this.obtenerPorEmail(email);
    if (!usuario || !usuario.password) return null;

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return null;

    return usuario;
  }
}
