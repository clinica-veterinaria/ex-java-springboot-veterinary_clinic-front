import React, { useState } from "react";
import { useForm } from "react-hook-form";
import './SignInModal.css';
import Button from '../buttons/Button';
import InputField from '../inputField/InputField';

export default function SignInModal({ onCancel, onSave, isLoading, error }) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [preview, setPreview] = useState(null);
    
    // See password for validation
    const password = watch("password");

    /* Password encrypted with btoa method
        const onSubmit = (data) => {
            const encryptedData = {
            ...data,
            password: btoa(data.password), // Encrypt password
            confirmPassword: undefined, // dont send confirmPassword
            imagen: data.imagen[0] // just the file, not the FileList
            };
            
            if (onSave) onSave(encryptedData);
            };*/

        const onSubmit = (data) => {

            const formData = new FormData();
            formData.append('nombre', data.nombre);
            formData.append('dni', data.dni);
            formData.append('email', data.email);
            formData.append('telefono', data.telefono);
            formData.append('password', btoa(data.password));
            formData.append('imagen', data.imagen[0]); 
        
               
            if (onSave) onSave(formData);
        };
        

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="signin-modal">            
            <div className="signin-modal__content">
                <div className="signin-modal__title">
                    <h2>Regístrate</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="signin-modal__form">
                    
                    {/* Upload image */}
                    <div className="signin-modal__form-body">
                    <div className="signin-modal__image-section">
                        <label className="signin-modal__image-label">
                            {preview ? (
                                <img src={preview} alt="Preview" className="signin-modal__image" />
                            ) : (
                                <div className="signin-modal__image-placeholder">
                                    <div>📁</div>
                                    <span>Seleccionar imagen</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                {...register("imagen", { 
                                    required: "La imagen es obligatoria" 
                                })}
                                onChange={handleImageChange}
                                className="signin-modal__image-input"
                            />
                        </label>
                        {errors.imagen && (
                            <small className="error-text">{errors.imagen.message}</small>
                        )}
                    </div>

                    {/* Form */}
                    <div className="signin-modal__fields">
                        <InputField
                            label="Nombre"
                            placeholder="Ej.: Miranda López"
                            {...register("nombre", { 
                                required: "El nombre es obligatorio",
                                minLength: { value: 2, message: "Mínimo 2 caracteres" }
                            })}
                            error={errors.nombre?.message}/>

                        <InputField
                            label="DNI"
                            placeholder="12345678 A"
                            {...register("dni", {
                                required: "El DNI es obligatorio",
                                pattern: {
                                    value: /^[0-9]{8,10}[A-Z]$/,
                                    message: "Debe contener entre 8 y 10 dígitos y una mayúscula"
                                }
                            })}
                            error={errors.dni?.message}/>          

                        <InputField
                            label="Correo electrónico"
                            placeholder="Ej.: dramiranda@email.com"
                            type="email"
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Introduce un correo válido"
                                }
                            })}
                            error={errors.email?.message}/>

                        <InputField
                            label="Teléfono"
                            placeholder="666666666"
                            {...register("telefono", {
                                required: "El teléfono es obligatorio",
                                pattern: {
                                    value: /^[0-9]{9}$/,
                                    message: "Debe contener 9 dígitos"
                                }
                            })}
                            error={errors.telefono?.message}/>

                        <InputField
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: "Debe contener mayúscula, minúscula y número"
                                }
                            })}
                            error={errors.password?.message}/>

                        <InputField
                            label="Confirmar contraseña"
                            type="password"
                            placeholder="••••••••"
                            {...register("confirmPassword", {
                                required: "Debes confirmar la contraseña",
                                validate: value => 
                                    value === password || "Las contraseñas no coinciden"
                            })}
                            error={errors.confirmPassword?.message}/>
                    </div>
                    </div>
                    {/* Errors from API */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="signin-modal__buttons">
                        <Button variant="secondary" type="button" disabled={isLoading} onClick={onCancel}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>{isLoading ? "Registrando..." : "Registrarse"}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

{/* falta el captcha! */}