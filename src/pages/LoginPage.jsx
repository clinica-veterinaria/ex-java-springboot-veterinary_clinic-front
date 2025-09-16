import React, { useState } from 'react';
import './LoginPage.css';
import { EyeClosed, PawPrint } from 'lucide-react';
import { Eye } from 'lucide-react';
import Oliwa from '../assets/logoPositive.svg'


const LoginPage = ({ onLogin = () => { }, onGoToRegister = () => { } }) => {
    const [formData, setFormData] = useState({
        dni: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.dni.trim()) {
            newErrors.dni = 'El ID o DNI es obligatorio';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onLogin(formData);
        }
    };

    return (
        <div className="login-page">
            <div className="login-background">
                {/* background */}
                {Array.from({ length: 200 }).map((_, i) => (
                    <PawPrint key={i} size={60} color='#D9E460' strokeWidth={1} />
                ))}
            </div>
            <div className="login-content">
            <div className="logo-container">
                <img src={Oliwa} alt="Olivwa Logo" width="500" height="120" />

            </div>

            <div className="login-container">
                <div className="login-modal">
                    <div className="login-header">
                        <h2 className="login-title">Inicia sesión</h2>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {/* Field ID o DNI */}
                        <div className="input-group">
                            <div className="input-container">
                                <input
                                    type="text"
                                    className={`login-input ${errors.dni ? 'login-input--error' : ''}`}
                                    placeholder="ID o DNI"
                                    value={formData.dni}
                                    onChange={(e) => handleInputChange('dni', e.target.value)}
                                />
                            </div>
                            {errors.dni && <span className="error-message">{errors.dni}</span>}
                        </div>

                        {/* Field password */}
                        <div className="input-group">
                            <div className="input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`login-input ${errors.password ? 'login-input--error' : ''}`}
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="input-icon input-icon--clickable"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="eye-icon">{showPassword ? <Eye /> : <EyeClosed />}</span>
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        {/* Button login */}
                        <button type="submit" className="login-button">
                            Iniciar sesión
                        </button>

                        {/* Link register */}
                        <div className="login-footer">
                            <span className="login-footer-text">
                                Si no tienes cuenta.{' '}
                                <button
                                    type="button"
                                    className="register-link"
                                    onClick={onGoToRegister}
                                >
                                    Regístrate aquí
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    );
};

export default LoginPage;