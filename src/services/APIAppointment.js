const API_URL = "http://localhost:8080";

export function formatDateTime(datetime) {
    if (!datetime) return "";
    const date = new Date(datetime);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
    const month = monthNames[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month}, ${hours}:${minutes}h`;
}

// =========================================================================

// GET - UPCOMING APPOINTMENTS MAX.3 (HOME PAGE)
export async function getUpcomingAppointments(limit = 3) {
  try {
      const response = await fetch(`${API_URL}/appointments/upcoming?limit=${limit}`);
      if (!response.ok) {
          throw new Error(`Error fetching appointments: ${response.statusText}`);
      }
      const data = await response.json();
      
      return data; 
  } catch (error) {
      console.error("Error al obtener las próximas citas", error);
      throw error;
  }
}

// GET - ALL APPOINTMENTS
export async function getAllAppointments() {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) throw new Error(`Error fetching all appointments: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error en getAllAppointments", error);
    throw error;
  }
}

// GET - APPOINTMENTS BY DATE
export async function getAppointmentsByDate(date) {
  try {
    const response = await fetch(`${API_URL}/by-date?fecha=${date}`);
    if (!response.ok) throw new Error(`Error fetching appointments by date: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener las citas", error);
    throw error;
  }
}

// GET -AVAILABLE SLOTS
export async function getAvailableSlots(date) {
    try {
        const response = await fetch(`${API_URL}/appointments/disponibles?fecha=${date}`);
        if (!response.ok) throw new Error("Error al obtener los horarios disponibles");
        const data = await response.json();
        return data.slots.slice(0, 10);
      } catch (error) {
        console.error(error);
        return [];
      }
}

// GET - PATIENT'S APPOINTMENTS
export async function getAppointmentsByPatient(patientId) {
  try {
    const response = await fetch(`${API_URL}/patient/${patientId}`);
    if (!response.ok) throw new Error(`Error fetching patient appointments: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener citas del pacienciente", error);
    throw error;
  }
}

// POST - CREATE APPOINTMENT
export async function createAppointment(appointmentData) {
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error("Error creating appointment");
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
}

// PUT - EDIT APPOINTMENT
export async function updateAppointment(id, updatedData) {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error creando cita: ${response.status} - ${errorText}`);
      }
  
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
}

// PUT- UPDATE STATUS
export async function updateAppointmentStatus(id, newStatus, appointmentData) {
  return updateAppointment(id, {
    status: newStatus.toUpperCase(),
    type: appointmentData.type,
    patientId: appointmentData.patientId,
    appointmentDatetime: appointmentData.appointmentDatetime,
    reason: appointmentData.reason
  });
}

// PUT - UPDATE TYPE
export async function updateAppointmentType(id, newType) {
  return updateAppointment(id, { type: newType });
}

// DELETE - DELETE APPOINTMENT
export async function deleteAppointment(id) {
  try {
    const response = await fetch(`${API_URL}/appointments/${id}`, { method: "DELETE" });
    if (!response.ok) {
        throw new Error("Error deleting appointment");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return null; 
    
  } catch (error) {
    console.error("API Error in deleteAppointment:", error);
    throw error;
  }
}
