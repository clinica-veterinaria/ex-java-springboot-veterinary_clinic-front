const API_URL = 'http://localhost:8080/api/auth'; 


// POST - Register
export async function createAppointment(appointmentData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok) throw new Error("Error creating appointment");
    return response.json();
  }