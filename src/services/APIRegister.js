// APIRegister.js
export const registerUser = async (formData) => {
    try {
        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            body: formData, // Envía el FormData directamente
            // NO incluyas Content-Type header, el navegador lo configurará automáticamente con el boundary
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || '⚠️ Error al registrar el usuario');
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
};