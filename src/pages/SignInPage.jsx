import React, { useState } from 'react';
import './SignInPage.css';
import { useNavigate } from 'react-router-dom';
import Oliwa from '../assets/logoPositive.svg';
import { PawPrint } from 'lucide-react';
import SignInModal from '../components/signInModal/SignInModal';
import { registerUser } from '../services/APIRegister';

export default function SignInPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ahora recibe el FormData completo directamente
    const handleRegistration = async (formData) => {
        setIsLoading(true);
        setError(null);
        try {
            await registerUser(formData);
            navigate('/home'); // redirige tras registro exitoso
        } catch (err) {
            console.error("Error en el registro:", err);
            setError(err.message || "Error en el registro. Por favor, revisa tus datos.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-background">
                {Array.from({ length: 200 }).map((_, i) => (
                    <PawPrint key={i} size={60} color='#D9E460' strokeWidth={1} />
                ))}
            </div>
            <div className="login-content">
                <div className="logo-container">
                    <img src={Oliwa} alt="Oliwa Logo" width="500" height="120" />
                </div>
                <div className="sign-in__modal-container">
                    <SignInModal
                        onSave={handleRegistration}
                        onCancel={() => {}}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}