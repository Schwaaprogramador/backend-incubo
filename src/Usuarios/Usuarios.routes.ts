import { Router } from "express";
import UsuariosController from "./Usuarios.controller.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const usuariosRouter: Router = Router();
const usuariosController = new UsuariosController();

// Rutas públicas
usuariosRouter.post("/login", (req, res) => usuariosController.login(req, res));

// Rutas protegidas (requieren token)
usuariosRouter.get("/verificar", verificarToken, (req, res) => usuariosController.verificar(req, res));

// Rutas protegidas (requieren token + rol admin)
usuariosRouter.get("/", verificarToken, verificarAdmin, (req, res) => usuariosController.getUsuarios(req, res));
usuariosRouter.get("/:id", verificarToken, verificarAdmin, (req, res) => usuariosController.getUsuarioById(req, res));
usuariosRouter.post("/", verificarToken, verificarAdmin, (req, res) => usuariosController.crearUsuario(req, res));
usuariosRouter.put("/:id", verificarToken, verificarAdmin, (req, res) => usuariosController.actualizarUsuario(req, res));
usuariosRouter.delete("/:id", verificarToken, verificarAdmin, (req, res) => usuariosController.eliminarUsuario(req, res));

export default usuariosRouter;
