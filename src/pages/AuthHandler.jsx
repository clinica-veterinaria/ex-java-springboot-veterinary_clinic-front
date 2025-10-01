import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage'; 
import SignInPage from './SignInPage'; 
import { loginUser } from '../services/APILogin'; 
import { registerUser } from '../services/APIRegister'; 

export default function AuthHandler({ isLoginView }) {
    const navigate = useNavigate(); 
    const [authError, setAuthError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (formData) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const dataToApi = {
                email: formData.email, // ✅ Cambiado de identifier a email
                password: formData.password 
            };

            const response = await loginUser(dataToApi);

            console.log('✅ Respuesta del login:', response);

            // El rol ya viene sin prefijo desde el backend
            localStorage.setItem('user', JSON.stringify({
                ...response.user,
                role: response.role 
            }));

            console.log('✅ Usuario guardado en localStorage:', {
                email: response.user?.email,
                role: response.role
            });

            const redirectPath = response.role === 'ADMIN' ? '/admin' : '/user';
            console.log('✅ Redirigiendo a:', redirectPath);
            navigate(redirectPath, { replace: true });

        } catch (err) {
            console.error("❌ Fallo de Login:", err);
            setAuthError(err.message || "Error de inicio de sesión.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRegistration = async (formData) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            // formData debe ser un FormData con userData (JSON) y photo (File opcional)
            const response = await registerUser(formData); 

            // El rol ya viene sin prefijo desde el backend
            localStorage.setItem('user', JSON.stringify({
                ...response.user,
                role: response.role 
            }));

            console.log('✅ Usuario registrado y guardado:', {
                email: response.user?.email,
                role: response.role
            });

            navigate('/user', { replace: true });

        } catch (err) {
            console.error("❌ Fallo de Registro:", err);
            setAuthError(err.message || "Error al registrar el usuario.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoginView) {
        return (
            <LoginPage 
                onLogin={handleLogin} 
                onGoToRegister={() => navigate('/signin')}
                isLoading={isLoading} 
                error={authError}
            />
        );
    } else {
        return (
            <SignInPage 
                onSave={handleRegistration}
                onGoToLogin={() => navigate('/login')}
                isLoading={isLoading}
                error={authError}
            />
        );
    }
}