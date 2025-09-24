// services/APIPatient.js
const API_URL = "http://localhost:8080/patients"; // Ajusta si tu backend tiene otra ruta

// Listar todos los pacientes
export async function getPatients() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPatients:", error);
    throw error;
  }
}
export async function updatePatient(patientId, updatedData) {
  try {
    const response = await fetch(`${API_URL}/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error en updatePatient (${patientId}):`, error);
    throw error;
  }
}

// Crear un nuevo paciente
export async function registerPatient(patient) {
  try {
    // Asegúrate de convertir edad a número si tu backend espera Integer
    const patientData = {
      name: patient.name,
      gender: patient.gender,
      breed: patient.breed,
      age: Number(patient.age),
      petIdentification: patient.petIdentification,
      tutorName: patient.tutorName,
      tutorDni: patient.tutorDni,
      tutorPhone: patient.tutorPhone,
      tutorEmail: patient.tutorEmail,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error en registerPatient:", error);
    throw error;
  }
}

// Eliminar paciente por ID
export async function deletePatient(patientId) {
  try {
    const response = await fetch(`${API_URL}/${patientId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return true;
  } catch (error) {
    console.error(`Error en deletePatient (${patientId}):`, error);
    throw error;
  }
}
