import { Preference } from "mercadopago";
import { client } from "../MercadoPagoConfig.js";

console.log("✅ MercadoPago service cargado");
console.log("🟡 Creando instancia de Preference...");

const preference = new Preference(client);

console.log("✅ Instancia de Preference creada");

const createPreference = async (preferenceData) => {
    console.log("🔵 createPreference() - Iniciando...");

    try {
        console.log("🔵 Datos a enviar a MP:", JSON.stringify(preferenceData, null, 2));

        const response = await preference.create({
            body: preferenceData
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
