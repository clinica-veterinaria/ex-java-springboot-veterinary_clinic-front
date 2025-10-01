const API_URL = "/api/patients";

// Listar todos los pacientes
export async function getPatients() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });
    
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPatients:", error);
    throw error;
  }
}

// Crear un nuevo paciente
export async function registerPatient(patientData, imageFile = null) {
  try {

    console.log("🔍 [APIPatient] Usuario desde localStorage:", JSON.parse(localStorage.getItem('user') || 'null'));
    console.log("🔍 [APIPatient] Datos recibidos:", patientData);
    const formDataToSend = new FormData();

    console.log("Datos del paciente para enviar:", patientData);

    // Añadir el JSON del paciente
    formDataToSend.append(
      'patient',
      new Blob([JSON.stringify(patientData)], {
        type: 'application/json'
      })
    );

    // Añadir la imagen si existe
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    // IMPORTANTE: Sin Content-Type header para FormData
    const response = await fetch(API_URL, {
      method: "POST",
      body: formDataToSend, 
      credentials: "include",
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

// Actualizar paciente
export async function updatePatient(patientId, updatedData) {
  try {
    const response = await fetch(`${API_URL}/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include", 
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

// Eliminar paciente
export async function deletePatient(patientId) {
  try {
    const response = await fetch(`${API_URL}/${patientId}`, {
      method: "DELETE",
      credentials: "include", 
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

// Buscar pacientes
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
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
    });
    
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en searchPatients:", error);
    throw error;
  }
}