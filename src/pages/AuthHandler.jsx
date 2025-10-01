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

            localStorage.setItem('user', JSON.stringify({
                ...response.user,
                role: response.role
            }));

            // Redirigir según el rol
            const redirectPath = response.role === 'ADMIN' ? '/admin' : '/user';
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
            await registerUser(formData);

           localStorage.setItem('user', JSON.stringify({
                ...response.user,
                role: response.role || 'USER'
            }));

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