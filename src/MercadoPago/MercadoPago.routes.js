import { Router } from "express";
import { crearPago, recibirWebhook } from "./MercadoPago.controller.js";

const router = Router();

// Webhook de MP — debe estar ANTES de cualquier middleware de parseo especial
// MP envía POST con body JSON
router.post("/webhook", recibirWebhook);

router.post("/crear-pago", crearPago);

export default router;
