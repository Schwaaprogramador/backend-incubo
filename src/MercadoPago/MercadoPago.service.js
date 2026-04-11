import { Preference } from "mercadopago";
import { client } from "../MercadoPagoConfig.js";

const preference = new Preference(client);

const createPreference = async (preferenceData) => {
    const webUrl = process.env.WEB_URL || "http://localhost:4321";
    const back_urls = {
        success: `${webUrl}/checkout/success`,
        failure: `${webUrl}/checkout/failure`,
        pending: `${webUrl}/checkout/pending`
    };

    try {
        console.log("🔵 createPreference() — items:", preferenceData.items?.length, "ref:", preferenceData.external_reference);

        const isHttps = webUrl.startsWith("https://");
        const apiUrl = process.env.API_URL || "http://localhost:3100";

        const response = await preference.create({
            body: {
                ...preferenceData,
                back_urls,
                notification_url: `${apiUrl}/mercadopago/webhook`,
                ...(isHttps && { auto_return: "all" }),
            }
        });

        console.log("✅ Respuesta MP exitosa - ID:", response.id);
        return response;
    } catch (error) {
        console.error("❌ === ERROR EN SERVICIO MP ===");
        console.error("❌ Error name:", error.name);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error stack:", error.stack);

        if (error.cause) {
            console.error("❌ Error cause:", JSON.stringify(error.cause, null, 2));
        }
        if (error.status) {
            console.error("❌ Error status:", error.status);
        }
        if (error.response) {
            console.error("❌ Error response:", JSON.stringify(error.response, null, 2));
        }

        throw error;
    }
};

export default createPreference;
