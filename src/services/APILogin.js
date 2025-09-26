const API_URL = "http://localhost:8080/auth/login"; 

export const loginUser = async (loginData) => {
    // loginData debe ser { username: "...", password: "..." }
    
    // NOTA IMPORTANTE: Tu frontend actualmente codifica la contraseña con btoa(), 
    // pero tu backend espera la contraseña sin codificar (en texto plano) para poder
    // compararla con el hash de la base de datos.
    // VERIFICAREMOS ESTO EN EL PUNTO 3.

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // El backend espera un objeto JSON simple: { username, password }
            body: JSON.stringify(loginData), 
        });

        if (!response.ok) {
            // El backend devuelve 401 para credenciales incorrectas o 500 para errores.
            // Leemos el mensaje de error como texto.
            const errorText = await response.text(); 
            throw new Error(errorText || `Error ${response.status} al iniciar sesión.`);
        }

        // Si el login es exitoso (200 OK), el backend devuelve un JSON
        // (ej. { message: "Login exitoso" }) o, idealmente, un token JWT.
        return await response.json(); 
        
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
};