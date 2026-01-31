import type { Response } from "express";
import { UsuariosService } from "./Usuarios.service.js";
import { generarToken } from "../middleware/auth.middleware.js";
import type { AuthRequest, JwtPayload } from "../middleware/auth.middleware.js";

export default class UsuariosController {
  private usuariosService: UsuariosService;

  constructor() {
    this.usuariosService = new UsuariosService();
  }

  public async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email y contraseña son requeridos" });
        return;
      }

      const usuario = await this.usuariosService.validarCredenciales(email, password);

      if (!usuario) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      if (!usuario.activo) {
        res.status(403).json({ error: "Usuario desactivado" });
        return;
      }

      if (usuario.rol !== "admin") {
        res.status(403).json({ error: "Acceso denegado. Solo administradores pueden acceder" });
        return;
      }

      const payload: JwtPayload = {
        id: usuario._id.toString(),
        email: usuario.email,
        rol: usuario.rol,
      };

      const token = generarToken(payload);

      res.status(200).json({
        token,
        usuario: {
          id: usuario._id,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  public async verificar(req: AuthRequest, res: Response) {
    try {
      const usuario = await this.usuariosService.obtenerPorId(req.usuario!.id);

      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.status(200).json({
        usuario: {
          id: usuario._id,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  public async getUsuarios(_req: AuthRequest, res: Response) {
    try {
      const usuarios = await this.usuariosService.obtenerTodos();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  public async getUsuarioById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }

      const usuario = await this.usuariosService.obtenerPorId(id);

      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json({ error: "ID no válido o error en la consulta" });
    }
  }

  public async crearUsuario(req: AuthRequest, res: Response) {
    try {
      const { email, password, nombre, rol } = req.body;

      if (!email || !password || !nombre) {
        res.status(400).json({ error: "Email, contraseña y nombre son requeridos" });
        return;
      }

      const existente = await this.usuariosService.obtenerPorEmail(email);
      if (existente) {
        res.status(400).json({ error: "Ya existe un usuario con ese email" });
        return;
      }

      const nuevo = await this.usuariosService.crear({ email, password, nombre, rol });
      res.status(201).json(nuevo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al crear usuario" });
    }
  }

  public async actualizarUsuario(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }

      const actualizado = await this.usuariosService.actualizar(id, req.body);

      if (!actualizado) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.status(200).json(actualizado);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al actualizar usuario" });
    }
  }

  public async eliminarUsuario(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID no proporcionado" });
        return;
      }

      if (req.usuario!.id === id) {
        res.status(400).json({ error: "No puedes eliminar tu propio usuario" });
        return;
      }

      const eliminado = await this.usuariosService.eliminar(id);

      if (!eliminado) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ error: "ID no válido o error al eliminar" });
    }
  }
}
