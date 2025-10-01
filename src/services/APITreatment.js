const API_URL = "/api/treatments";

export async function getTreatments() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Error en getTreatments:", error);
        throw error;
    }
}


export async function getTreatmentsByPatient(patientId) {
    try {
        const response = await fetch(`${API_URL}/patient/${patientId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(`Error en getTreatmentsByPatient (${patientId}):`, error);
        throw error;
    }
}


export async function createTreatment(treatmentData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(treatmentData),
            credentials: "include"
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en createTreatment:", error);
        throw error;
    }
}
