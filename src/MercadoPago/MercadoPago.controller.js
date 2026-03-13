import createPreference from "./MercadoPago.service.js";

console.log("✅ MercadoPago controller cargado");

export const crearPago = async (req, res) => {
    console.log("🟢 crearPago() - Función ejecutándose");

    try {
        console.log("🟢 Body recibido:", JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.items || req.body.items.length === 0) {
            console.log("❌ Error: No hay items en el body");
            return res.status(400).json({ error: "No hay items para procesar" });
        }

        console.log("🟢 Llamando a createPreference...");
        const mpResponse = await createPreference(req.body);

        console.log("🟢 Respuesta de MP recibida:");
        console.log("   ID:", mpResponse.id);
        console.log("   Init Point:", mpResponse.init_point);

        res.status(201).json({
            preferenceId: mpResponse.id,
            initPoint: mpResponse.init_point
        });

    } catch (error) {
        console.error("❌ === MERCADO PAGO ERROR ===");
        console.error("❌ Message:", error.message);
        console.error("❌ Stack:", error.stack);
        if (error.cause) {
            console.error("❌ Cause:", JSON.stringify(error.cause, null, 2));
        }
        res.status(500).json({
            error: "Error al procesar el pago. Por favor intentá de nuevo."
        });
    }
};
