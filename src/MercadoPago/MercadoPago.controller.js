
import createPreference from "./MercadoPago.service"

export const crearPago = async (req, res) => {
    try {
        const { id, title, price, quantity } = req.body;

        const preference = await createPreference({
            id,
            title,
            price,
            quantity,
        });

        res.json({
            id: preference.id,
            init_point: preference.init_point,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando pago" });
    }
};

export const webhookMP = (req, res) => {
    console.log("Webhook MercadoPago:", req.body);

    // Aquí luego validas el pago con la API
    res.sendStatus(200);
};
