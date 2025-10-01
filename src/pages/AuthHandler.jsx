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
                email: formData.identifier, 
                password: formData.password 
            };

            const response = await loginUser(dataToApi);

            console.log('✅ Respuesta del login:', response);

            const normalizedRole = response.role?.replace('ROLE_', '') || response.role;
            
            localStorage.setItem('user', JSON.stringify({
                ...response.user,
                role: normalizedRole 
            }));

            console.log('✅ Usuario guardado en localStorage:', {
                email: response.user?.email,
                role: normalizedRole
            });

            const redirectPath = normalizedRole === 'ADMIN' ? '/admin' : '/user';
            console.log('✅ Redirigiendo a:', redirectPath);
            navigate(redirectPath, { replace: true });

        } catch (err) {
            console.error("Fallo de Login:", err);
            setAuthError(err.message || "Error de inicio de sesión.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRegistration = async (formData) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await registerUser(formData); 

            const normalizedRole = response.role?.replace('ROLE_', '') || response.role || 'USER';

            localStorage.setItem('user', JSON.stringify({
                ...response.user,
                role: normalizedRole 
            }));

            console.log('✅ Usuario registrado y guardado:', {
                email: response.user?.email,
                role: normalizedRole
            });

            navigate('/user', { replace: true });

        } catch (err) {
            console.error("Fallo de Registro:", err);
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