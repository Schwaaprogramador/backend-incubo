// src/types/index.ts

export interface CreatePreferencePayload {
    body: {
        items: [
            {
                id: string;
                title: string;
                quantity: number;
                unit_price: number;
            }
        ],
    }
}

export interface PreferenceResponse {
    id: string;
    init_point: string;
    sandbox_init_point?: string;
}