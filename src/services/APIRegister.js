const API_URL = 'http://localhost:8080/api/auth'; 

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            body: userData,
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.message || 'Error en el registro');
        }

        return await response.json();
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        throw error;
    }
};