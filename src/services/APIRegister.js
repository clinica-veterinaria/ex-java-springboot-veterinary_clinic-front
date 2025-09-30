const API_URL = "http://localhost:8080/auth/register"; 

export const registerUser = async (userData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // importante
      },
      body: JSON.stringify(userData), // enviar como JSON
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status} en el registro`);
    }

    return await response.json(); // o .text() según lo que devuelva tu backend
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw error;
  }
};
