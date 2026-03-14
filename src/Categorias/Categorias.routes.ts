import { Router } from "express";
import CategoriasController from "./Categorias.controller.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const categoriasRouter: Router = Router();
const categoriasController = new CategoriasController();

// Rutas públicas
categoriasRouter.get("/activas", (req, res) => categoriasController.getCategoriasActivas(req, res));

// Rutas para admin — categorías
categoriasRouter.get("/", (req, res) => categoriasController.getCategorias(req, res));
categoriasRouter.get("/:id", (req, res) => categoriasController.getCategoriaById(req, res));
categoriasRouter.post("/", verificarToken, verificarAdmin, (req, res) => categoriasController.crearCategoria(req, res));
categoriasRouter.put("/:id", verificarToken, verificarAdmin, (req, res) => categoriasController.actualizarCategoria(req, res));
categoriasRouter.delete("/:id", verificarToken, verificarAdmin, (req, res) => categoriasController.eliminarCategoria(req, res));

// Rutas para admin — subcategorías
categoriasRouter.post("/:id/subcategorias", verificarToken, verificarAdmin, (req, res) => categoriasController.agregarSubcategoria(req, res));
categoriasRouter.put("/:id/subcategorias/:subId", verificarToken, verificarAdmin, (req, res) => categoriasController.actualizarSubcategoria(req, res));
categoriasRouter.delete("/:id/subcategorias/:subId", verificarToken, verificarAdmin, (req, res) => categoriasController.eliminarSubcategoria(req, res));

export default categoriasRouter;
