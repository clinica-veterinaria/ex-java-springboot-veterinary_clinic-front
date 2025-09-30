import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { EyeClosed, PawPrint, Eye } from 'lucide-react';
import Oliwa from '../assets/logoPositive.svg';

const LoginPage = ({ onLogin = () => {} }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'El Email o DNI es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const dniRegex = /^[0-9]{8}[A-Za-z]$/;

      if (!emailRegex.test(formData.identifier) && !dniRegex.test(formData.identifier)) {
        newErrors.identifier = 'Introduce un Email o DNI válido';
      }
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const safeData = {
        identifier: formData.identifier,
        password: formData.password
      };
      onLogin(safeData);
    }
  };

  const goToSignIn = () => {
    navigate('/signin'); // redirige a SignInPage
  };

  return (
    <div className="login-page">
      <div className="login-background">
        {Array.from({ length: 200 }).map((_, i) => (
          <PawPrint key={i} size={60} color="#D9E460" strokeWidth={1} />
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
              <div className="input-group">
                <div className="input-container">
                  <input
                    type="text"
                    className={`login-input ${errors.identifier ? 'login-input--error' : ''}`}
                    placeholder="Email o DNI"
                    value={formData.identifier}
                    onChange={(e) => handleInputChange('identifier', e.target.value)}
                  />
                </div>
                {errors.identifier && <span className="error-message">{errors.identifier}</span>}
              </div>

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

              <button type="submit" className="login-button">Iniciar sesión</button>

              <div className="login-footer">
                <span className="login-footer-text">
                  Si no tienes cuenta.{' '}
                  <button type="button" className="register-link" onClick={goToSignIn}>
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
