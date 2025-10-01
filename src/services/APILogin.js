const API_URL = "http://localhost:8080/auth";

export const loginUser = async (loginData) => {
 console.log('📤 Enviando al backend:', loginData);    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password
            }), 
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Error ${response.status} al iniciar sesión.`);
        }

        const data = await response.json();
        console.log('✅ Login response:', data);
        return data; 
        
    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        localStorage.removeItem('user');
        console.log('✅ Logout exitoso');
    } catch (error) {
        console.error('❌ Error en logout:', error);
        localStorage.removeItem('user');
    }
};