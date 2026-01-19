import { Preference } from "mercadopago";
import { client } from "../MercadoPagoConfig";

const preference = new Preference(client);

const createPreference = async (preferenceData) => {
    try {
        const response = await preference.create({
            body: preferenceData
        });

        return response;
    } catch (error) {
        console.error("Error MP:", error);
        throw error;
    }
};

export default createPreference;
