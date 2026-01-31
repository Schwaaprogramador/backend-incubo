import bcrypt from "bcrypt";
import { UsuarioModel } from "./Usuarios.modelo.js";
import type { IUsuario } from "./Usuarios.modelo.js";

const SALT_ROUNDS = 10;

export class UsuariosService {
  async obtenerTodos() {
    return UsuarioModel.find().select("-password");
  }

  async obtenerPorId(id: string) {
    return UsuarioModel.findById(id).select("-password");
  }

  async obtenerPorEmail(email: string) {
    return UsuarioModel.findOne({ email: email.toLowerCase() });
  }

  async crear(data: Partial<IUsuario>) {
    const hashedPassword = await bcrypt.hash(data.password!, SALT_ROUNDS);
    const usuario = new UsuarioModel({
      ...data,
      password: hashedPassword,
    });
    const saved = await usuario.save();
    const { password, ...usuarioSinPassword } = saved.toObject();
    return usuarioSinPassword;
  }

  async actualizar(id: string, data: Partial<IUsuario>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    return UsuarioModel.findByIdAndUpdate(id, data, { new: true }).select("-password");
  }

  async eliminar(id: string) {
    return UsuarioModel.findByIdAndDelete(id);
  }

  async validarCredenciales(email: string, password: string) {
    const usuario = await this.obtenerPorEmail(email);
    if (!usuario) return null;

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return null;

    return usuario;
  }
}
