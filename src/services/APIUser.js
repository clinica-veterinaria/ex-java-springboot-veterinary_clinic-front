const API_URL = "/api/users";

// ============================================================================
// GET ALL USERS
export async function getAllUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error fetching users");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// GET USER BY ID
export async function getUserById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      credentials: "include"
    });
    if (!response.ok) throw new Error("Error fetching user by ID");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// GET USER BY EMAIL
export async function getUserByEmail(email) {
  try {
    const response = await fetch(`${API_URL}/email/${email}`, {
      credentials: "include"
    });
    if (!response.ok) throw new Error("Error fetching user by email");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// POST CREATE USER
export async function createUser(userData, photoFile = null) {
  try {
    let body, headers;

    if (photoFile) {
      // FormData para multipart
      body = new FormData();
      body.append("user", new Blob([JSON.stringify(userData)], { type: "application/json" }));
      body.append("photo", photoFile);
      headers = {}; // multipart/form-data no necesita Content-Type explícito
    } else {
      body = JSON.stringify(userData);
      headers = { "Content-Type": "application/json" };
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body,
      credentials: "include"
    });

    if (!response.ok) throw new Error("Error creating user");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// PUT UPDATE USER
export async function updateUser(id, updatedData, photoFile = null) {
  try {
    let body, headers;

    if (photoFile) {
      body = new FormData();
      body.append("user", new Blob([JSON.stringify(updatedData)], { type: "application/json" }));
      body.append("photo", photoFile);
      headers = {};
    } else {
      body = JSON.stringify(updatedData);
      headers = { "Content-Type": "application/json" };
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers,
      body,
      credentials: "include"
    });

    if (!response.ok) throw new Error("Error updating user");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// DELETE USER
export async function deleteUser(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { 
      method: "DELETE" ,
      credentials: "include"
    });
    if (!response.ok) throw new Error("Error deleting user");
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
