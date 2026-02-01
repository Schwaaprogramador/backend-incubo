import { Router } from 'express';
import RelatosController from './Relatos.controller.ts';

const relatosRouter: Router = Router();
const relatosController = new RelatosController();

// Rutas públicas
relatosRouter.get('/aprobados', (req, res) => relatosController.getRelatosAprobados(req, res));
relatosRouter.post('/', (req, res) => relatosController.crearRelato(req, res));

// Rutas admin (todas las demás)
relatosRouter.get('/', (req, res) => relatosController.getRelatos(req, res));
relatosRouter.get('/:id', (req, res) => relatosController.getRelatoById(req, res));
relatosRouter.put('/:id', (req, res) => relatosController.actualizarRelato(req, res));
relatosRouter.delete('/:id', (req, res) => relatosController.eliminarRelato(req, res));

export default relatosRouter;
