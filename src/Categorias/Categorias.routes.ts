import { Router } from "express";
import CategoriasController from "./Categorias.controller.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const categoriasRouter: Router = Router();
const categoriasController = new CategoriasController();

// Rutas públicas (para el select de productos en el frontend)
categoriasRouter.get("/activas", (req, res) => categoriasController.getCategoriasActivas(req, res));

// Rutas para admin
categoriasRouter.get("/", (req, res) => categoriasController.getCategorias(req, res));
categoriasRouter.get("/:id", (req, res) => categoriasController.getCategoriaById(req, res));
categoriasRouter.post("/", verificarToken, verificarAdmin, (req, res) => categoriasController.crearCategoria(req, res));
categoriasRouter.put("/:id", verificarToken, verificarAdmin, (req, res) => categoriasController.actualizarCategoria(req, res));
categoriasRouter.delete("/:id", verificarToken, verificarAdmin, (req, res) => categoriasController.eliminarCategoria(req, res));

export default categoriasRouter;
