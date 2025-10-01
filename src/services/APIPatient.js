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
      credentials: 'include',
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
export async function registerPatient(patientData, imageFile) {
  try {
    
    const formDataToSend = new FormData(); 

    console.log("Datos del paciente (JSON) para enviar:", patientData);

    formDataToSend.append(
      'patient',
      new Blob([JSON.stringify(patientData)], {
        type: 'application/json'
      })
    );
   
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    // 5. Envío de la petición
    const response = await fetch(API_URL, {
      method: "POST",
      credentials: 'include',
      body: formDataToSend,
      
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

export async function searchPatients({ search, species, gender, sortBy }) {
  try {
    const params = new URLSearchParams();
    if (search && search.trim() !== '') params.append('search', search.trim());
    if (species) params.append('species', species);
    if (gender) params.append('gender', gender);
    if (sortBy) params.append('sortBy', sortBy);

    const url = `${API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: "GET",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en searchPatients:", error);
    throw error;
  }
}



