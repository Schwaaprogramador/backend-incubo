import createPreference from "./MercadoPago.service";

export const crearPago = async (req, res) => {
    try {
        // ENVÍAS DIRECTO EL BODY TAL CUAL
        const mpResponse = await createPreference(req.body);

        res.status(201).json({
            preferenceId: mpResponse.id,
            initPoint: mpResponse.init_point
        });

    } catch (error) {
        console.error("Error creando pago:", error);
        res.status(500).json({ error: error.message });
    }
};
