// services/APITreatment.js
const API_URL = "http://localhost:8080/treatments";

// Registrar tratamiento
export async function registerTreatment(treatmentData) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(treatmentData),
    });
    if (!response.ok) throw new Error("Error registrando tratamiento");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Ver historial de tratamientos de un paciente
export async function getTreatmentsByPatient(patientId) {
  try {
    const response = await fetch(`${API_URL}/patient/${patientId}`);
    if (!response.ok) throw new Error("Error obteniendo tratamientos del paciente");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Ver todos los tratamientos
export async function getAllTreatments() {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) throw new Error("Error obteniendo tratamientos");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
