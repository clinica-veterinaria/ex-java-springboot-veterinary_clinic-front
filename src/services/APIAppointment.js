// const API_URL = "http://localhost:8080/appointments";

// export function formatDateTime(datetime) {
//     if (!datetime) return "";
//     const date = new Date(datetime);
//     const day = date.getDate().toString().padStart(2, "0");
//     const monthNames = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
//     const month = monthNames[date.getMonth()];
//     const hours = date.getHours().toString().padStart(2, "0");
//     const minutes = date.getMinutes().toString().padStart(2, "0");
//     return `${day} ${month}, ${hours}:${minutes}h`;
// }

// // =========================================================================

// // GET - UPCOMING APPOINTMENTS MAX.3
// export async function getUpcomingAppointments(limit = 3) {
//     try {
//       const response = await fetch(`${API_URL}/upcoming?limit=${limit}`);
//       if (!response.ok) throw new Error("Error fetching appointments");
//       const data = await response.json();

//       // Format dates before return
//       data.appointments?.forEach(a => a.appointmentDatetime = formatDateTime(a.appointmentDatetime));
//       return data;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
// }

// // GET -AVAILABLE SLOTS
// export async function getAvailableSlots(date) {
//     try {
//         const response = await fetch(`${API_URL}/disponibles?fecha=${date}`);
//         if (!response.ok) throw new Error("Error al obtener los horarios disponibles");
//         const data = await response.json();
//         return data.slots.slice(0, 10);
//       } catch (error) {
//         console.error(error);
//         return [];
//       }
// }

// // POST - CREATE APPOINTMENT
// export async function createAppointment(appointmentData) {
//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(appointmentData),
//       });

//       if (!response.ok) throw new Error("Error creating appointment");
//       return response.json();
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
// }

// // PUT - EDIT APPOINTMENT
// export async function updateAppointment(id, updatedData) {
//     try {
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedData),
//       });

//       if (!response.ok) throw new Error("Error updating appointment");
//       return response.json();
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
// }

// // PUT- UPDATE STATUS
// export async function updateAppointmentStatus(id, newStatus) {
//   return updateAppointment(id, { status: newStatus });
// }

// // PUT - UPDATE TYPE
// export async function updateAppointmentType(id, newType) {
//   return updateAppointment(id, { type: newType });
// }

// // DELETE - DELETE APPOINTMENT
// export async function deleteAppointment(id) {
//   try {
//     const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//     if (!response.ok) throw new Error("Error deleting appointment");
//     return response.status === 204 ? null : response.json();
    
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
