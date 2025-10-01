const API_URL = "/api/auth";


export async function registerUser(userData, photo) {
    try {
        const formData = new FormData();
        formData.append('userData', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
        
        if (photo) {
            formData.append('photo', photo);
        }

        const registerResponse = await fetch(`${API_URL}/register`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!registerResponse.ok) {
            const errorText = await registerResponse.text();
            throw new Error(errorText || '⚠️ Error al registrar el usuario');
        }

        const registerMessage = await registerResponse.text();
        console.log('✅ Registro exitoso:', registerMessage);

        // 2️⃣ Subir foto si existe
        if (photo) {
            const formData = new FormData();
            formData.append('photo', photo);

            const photoResponse = await fetch(`${API_URL}/upload-photo`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!photoResponse.ok) {
                console.warn('⚠️ Usuario registrado pero la foto no se subió correctamente');
            } else {
                console.log('✅ Foto subida correctamente');
            }
        }

        // 3️⃣ Login automático
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
