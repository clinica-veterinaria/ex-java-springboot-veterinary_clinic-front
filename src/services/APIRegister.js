const API_URL = "http://localhost:8080/auth/register"; 

export const registerUser = async (userData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: userData,
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(errorText || `Error ${response.status} en el registro`);
        }

        return await response.text(); 
        
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        throw error;
    }
};