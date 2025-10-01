const API_URL = "/api/auth";

export async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Usuario o contraseña incorrectos");
            }
            const errorData = await response.json();
            throw new Error(errorData.error || `Error ${response.status}`);
        }

        const data = await response.json();
        
        console.log('✅ Respuesta del servidor:', data);

        return {
            user: data.user, 
            role: data.role  
        };
    } catch (error) {
        console.error("❌ Error en loginUser:", error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al cerrar sesión");
        }

        localStorage.removeItem('user');
        
        return true;
    } catch (error) {
        console.error("❌ Error en logoutUser:", error);
        throw error;
    }
}