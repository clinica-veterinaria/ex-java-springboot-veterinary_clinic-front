const API_URL = 'http://localhost:8080/auth'; 

export const registerUser = async (userData) => {
    try {
        // Adaptar los datos a la estructura esperada por el backend
        const data = {
            username: userData.username,
            password: userData.password,
            role: userData.role
        };
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
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
}

// Login de usuario
export const loginUser = async (credentials) => {
    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en el login');
        }
        return await response.json();
    } catch (error) {
        console.error("Error al hacer login:", error);
        throw error;
    }
};

// Logout de usuario
export const logoutUser = async () => {
    try {
        const response = await fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Error en el logout');
        }
        return true;
    } catch (error) {
        console.error("Error al hacer logout:", error);
        throw error;
    }
};