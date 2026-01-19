import { Router } from "express";
import { crearPago } from "./MercadoPago.controller.js";

const router = Router();

router.post("/crear-pago", crearPago);

export default router;
