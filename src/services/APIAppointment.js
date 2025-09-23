const API_URL = "http://localhost:8080/api/appointments";

// GET - UPCOMING APPOINTMENTS MAX.3
export async function getUpcomingAppointments(limit = 3) {
  const response = await fetch(`${API_URL}/upcoming?limit=${limit}`);
  if (!response.ok) throw new Error("Error fetching appointments");
  return response.json();
}

// POST - CREATE APPOINTMENT
export async function createAppointment(appointmentData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) throw new Error("Error creating appointment");
  return response.json();
}

// PUT - EDIT APPOINTMENT
export async function updateAppointment(id, updatedData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error("Error updating appointment");
  return response.json();
}

// DELETE - DELETE APPOINTMENT
export async function deleteAppointment(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error deleting appointment");
  return response.json();
}
