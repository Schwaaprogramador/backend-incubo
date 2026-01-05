import { Router } from "express";
import { crearPago, webhookMP } from "./MercadoPago.controller.js";

const router = Router();

router.post("/crear-pago", crearPago);
router.post("/webhook", webhookMP);

export default router;
