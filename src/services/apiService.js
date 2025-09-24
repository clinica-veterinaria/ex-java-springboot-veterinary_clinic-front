const API_URL = "http://localhost:8080";

// ==================== PATIENTS ====================
export const PatientsService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/patients`);
    if (!res.ok) throw new Error("Error fetching patients");
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/patients/${id}`);
    if (!res.ok) throw new Error("Error fetching patient");
    return res.json();
  },

  create: async (patientData) => {
    const res = await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });
    if (!res.ok) throw new Error("Error creating patient");
    return res.json();
  },

  update: async (id, patientData) => {
    const res = await fetch(`${API_URL}/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });
    if (!res.ok) throw new Error("Error updating patient");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/patients/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error deleting patient");
    return res.status === 204 ? null : res.json();
  },

  // Busquedas especiales
  getByTutorPhone: async (phone) => {
    const res = await fetch(`${API_URL}/patients/tutorPhone/${phone}`);
    if (!res.ok) throw new Error("Error fetching patient by phone");
    return res.json();
  },

  getByTutorEmail: async (email) => {
    const res = await fetch(`${API_URL}/patients/tutorEmail/${email}`);
    if (!res.ok) throw new Error("Error fetching patient by email");
    return res.json();
  },

  getByTutorDni: async (dni) => {
    const res = await fetch(`${API_URL}/patients/tutorDni/${dni}`);
    if (!res.ok) throw new Error("Error fetching patient by DNI");
    return res.json();
  },

  getByPetIdentification: async (id) => {
    const res = await fetch(`${API_URL}/patients/petIdentification/${id}`);
    if (!res.ok) throw new Error("Error fetching patient by pet ID");
    return res.json();
  }
};

// ==================== APPOINTMENTS ====================
export const AppointmentsService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/appointments`);
    if (!res.ok) throw new Error("Error fetching appointments");
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/appointments/${id}`);
    if (!res.ok) throw new Error("Error fetching appointment");
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error creating appointment");
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error updating appointment");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/appointments/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error deleting appointment");
    return res.status === 204 ? null : res.json();
  },

  getByPatient: async (patientId) => {
    const res = await fetch(`${API_URL}/appointments/patient/${patientId}`);
    if (!res.ok) throw new Error("Error fetching appointments by patient");
    return res.json();
  }
};

// ==================== TREATMENTS ====================
export const TreatmentsService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/treatments`);
    if (!res.ok) throw new Error("Error fetching treatments");
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/treatments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error creating treatment");
    return res.json();
  },

  getByPatient: async (patientId) => {
    const res = await fetch(`${API_URL}/treatments/patient/${patientId}`);
    if (!res.ok) throw new Error("Error fetching treatments by patient");
    return res.json();
  }
};

// ==================== AUTH ====================
export const AuthService = {
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error registering user");
    return res.json();
  },

  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error logging in");
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
    if (!res.ok) throw new Error("Error logging out");
    return res.json();
  }
};
