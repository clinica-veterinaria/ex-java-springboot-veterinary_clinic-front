const API_URL = "/api/auth";

export async function registerUser(formData) {
    try {
        // 1. Registrar usuario
        const registerResponse = await fetch(`${API_URL}/register`, {
            method: 'POST',
            credentials: 'include',
            body: formData, // FormData con userData y photo
        });

        if (!registerResponse.ok) {
            const errorText = await registerResponse.text();
            throw new Error(errorText || '⚠️ Error al registrar el usuario');
        }

        const registerMessage = await registerResponse.text();
        console.log('✅ Registro exitoso:', registerMessage);

        // 2. Extraer email y password del FormData para hacer login automático
        const userDataJson = formData.get('userData');
        const userData = JSON.parse(userDataJson);

        // 3. Login automático después del registro
        const loginResponse = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: userData.email,
                password: userData.password
            }),
        });

        if (!loginResponse.ok) {
            throw new Error("Usuario registrado pero error al iniciar sesión automáticamente");
        }

        const loginData = await loginResponse.json();

        return {
            user: loginData.user,
            role: loginData.role
        };
    } catch (error) {
        console.error('❌ Error al registrar el usuario:', error);
        throw error;
    }
}