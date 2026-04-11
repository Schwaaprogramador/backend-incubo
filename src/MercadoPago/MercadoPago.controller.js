import { Payment } from "mercadopago";
import { createHmac } from "crypto";
import { client } from "../MercadoPagoConfig.js";
import createPreference from "./MercadoPago.service.js";
import { PedidosService } from "../Pedidos/Pedidos.service.js";
import { ProductosService } from "../Productos/Productos.service.js";

const validarFirmaWebhook = (req) => {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // Si no hay secret configurado, no bloquear

  const xSignature = req.headers["x-signature"];
  const xRequestId = req.headers["x-request-id"];
  if (!xSignature || !xRequestId) return false;

  // Parsear ts y v1 del header x-signature
  const partes = Object.fromEntries(
    xSignature.split(",").map((p) => p.split("=").map((s) => s.trim()))
  );
  const ts = partes["ts"];
  const v1 = partes["v1"];
  if (!ts || !v1) return false;

  const dataId = req.body?.data?.id || req.query?.id || "";
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const firma = createHmac("sha256", secret).update(manifest).digest("hex");

  return firma === v1;
};

const pedidosService = new PedidosService();
const productosService = new ProductosService();
const paymentClient = new Payment(client);

// POST /mercadopago/crear-pago
export const crearPago = async (req, res) => {
  try {
    if (!req.body || !req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ error: "No hay items para procesar" });
    }

    const { items, payer, statement_descriptor } = req.body;

    // Calcular total
    const total = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

    // 1. Crear pedido en DB con estado pendiente
    const pedido = await pedidosService.crear({
      usuario: {
        nombre: payer?.name || "",
        apellido: payer?.surname || "",
        email: payer?.email || "",
        telefono: payer?.phone?.number || "",
        direccion: {
          calle: payer?.address?.street_name || "",
          numero: String(payer?.address?.street_number || ""),
          codigoPostal: payer?.address?.zip_code || "",
        },
      },
      items: items.map((item) => ({
        productoId: item.id,
        nombre: item.title,
        precio: item.unit_price,
        cantidad: item.quantity,
      })),
      total,
    });

    // 2. Crear preferencia en MP con external_reference = pedido ID
    const mpResponse = await createPreference({
      items,
      payer,
      statement_descriptor,
      external_reference: pedido._id.toString(),
    });

    // 3. Guardar preferenceId en el pedido
    await pedidosService.asignarPreferenceId(pedido._id.toString(), mpResponse.id);

    res.status(201).json({
      preferenceId: mpResponse.id,
      initPoint: mpResponse.init_point,
      pedidoId: pedido._id.toString(),
    });
  } catch (error) {
    console.error("❌ Error en crearPago:", error.message);
    if (error.cause) console.error("❌ Cause:", JSON.stringify(error.cause, null, 2));
    res.status(500).json({ error: "Error al procesar el pago. Por favor intentá de nuevo." });
  }
};

// POST /mercadopago/webhook
export const recibirWebhook = async (req, res) => {
  if (!validarFirmaWebhook(req)) {
    console.warn("⚠️ Webhook rechazado — firma inválida");
    return res.sendStatus(401);
  }

  // Responder 200 de inmediato para que MP no reintente
  res.sendStatus(200);

  try {
    // MP envía: { type: 'payment', data: { id: '...' } }
    // o via query params: ?id=xxx&topic=payment (IPN legacy)
    const tipo = req.body?.type || req.query?.topic;
    const paymentId = req.body?.data?.id || req.query?.id;

    if (tipo !== "payment" || !paymentId) return;

    // Obtener detalles del pago desde MP
    const pago = await paymentClient.get({ id: paymentId });

    const pedidoId = pago.external_reference;
    if (!pedidoId) {
      console.warn("⚠️ Webhook sin external_reference — pago ID:", paymentId);
      return;
    }

    // Mapear estado de MP a estado interno
    const mapaEstados = {
      approved: "pagado",
      rejected: "fallido",
      cancelled: "cancelado",
      in_process: "pendiente",
      pending: "pendiente",
    };

    const nuevoEstado = mapaEstados[pago.status] || "pendiente";

    // Obtener pedido actual para verificar idempotencia
    const pedido = await pedidosService.obtenerPorId(pedidoId);
    if (!pedido) {
      console.warn("⚠️ Pedido no encontrado:", pedidoId);
      return;
    }

    // No actualizar si ya está en un estado final
    const estadosFinales = ["pagado", "fallido", "cancelado"];
    if (estadosFinales.includes(pedido.estado)) {
      console.log(`ℹ️ Pedido ${pedidoId} ya en estado final: ${pedido.estado}`);
      return;
    }

    await pedidosService.actualizarEstado(pedidoId, nuevoEstado, String(paymentId));

    // Si el pago fue aprobado, reducir stock de cada producto
    if (nuevoEstado === "pagado") {
      console.log(`✅ Pago aprobado para pedido ${pedidoId}`);
      for (const item of pedido.items) {
        try {
          await productosService.reducirStock(item.productoId, item.cantidad);
        } catch (err) {
          console.error(`⚠️ Error reduciendo stock de producto ${item.productoId}:`, err.message);
        }
      }
    }

    console.log(`🔔 Webhook procesado — pedido: ${pedidoId}, estado: ${nuevoEstado}`);
  } catch (error) {
    console.error("❌ Error procesando webhook:", error.message);
  }
};
