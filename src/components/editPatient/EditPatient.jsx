import React, { useState, useEffect, useRef } from "react";
import './EditPatient.css';
import Button from '../buttons/Button';
import { updatePatient } from '../../services/APIPatient'; 

export default function EditPatient({ isOpen = false, onClose = () => {}, onSave = () => {}, patient }) {
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        gender: '',
        age: '',
        tutorName: '',
        tutorDni: '',
        tutorEmail: '',
        tutorPhone: '',
        photo: '' 
    });

    const fileInputRef = useRef(null);

   
    useEffect(() => {
        if (patient) {
            setFormData({
                name: patient.name || '',
                breed: patient.breed || '',
                gender: patient.gender || '',
                age: patient.age || '',
                tutorName: patient.tutorName || '',
                tutorDni: patient.tutorDni || '',
                tutorEmail: patient.tutorEmail || '',
                tutorPhone: patient.tutorPhone || '',
                photo: patient.photo || '' 
            });
        }
    }, [patient]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

   
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(",")[1];
            setFormData(prev => ({ ...prev, photo: base64String }));
        };
        reader.readAsDataURL(file);
    };

    
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSave = async () => {
        try {
            const updatedPatient = await updatePatient(patient.id, formData);
            onSave(updatedPatient);
            onClose();
        } catch (error) {
            console.error("Error al editar paciente:", error);
            alert("Error al editar el paciente");
        }
    };

    if (!isOpen) return null;

    return(
        <div className="edit-patient__overlay">
            <div className="edit-patient__container">
                <div className="edit-patient__header">
                    <h2 className="edit-patient__title">Editar mascota</h2>
                </div> 
                <div className="edit-patient__content">

                    {/* Imagen clickable */}
                    <div className="form-row form-field--full">
                        <div 
                            className="edit-patient__image-preview"
                            onClick={handleImageClick}
                            style={{ cursor: "pointer" }}
                        >
                            <img 
                                src={formData.photo 
                                    ? `data:image/png;base64,${formData.photo}`
                                    : "/default-patient.jpg"} 
                                alt={formData.name || "Paciente"} 
                                className="edit-patient__photo"
                            />
                            <p className="edit-patient__image-hint">Haz clic para cambiar la foto</p>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleImageChange} 
                        />
                    </div>

                    {/* Fila 1: Nombre de la mascota y Género */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Nombre mascota</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Género</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fila 2: Raza y Edad */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Raza</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.breed}
                                onChange={(e) => handleInputChange('breed', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Edad</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.age}
                                onChange={(e) => handleInputChange('age', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fila 3: Nombre del dueño y DNI */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Nombre del dueño</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.tutorName}
                                onChange={(e) => handleInputChange('tutorName', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">DNI</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.tutorDni}
                                onChange={(e) => handleInputChange('tutorDni', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fila 4: Correo y Teléfono */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.tutorEmail}
                                onChange={(e) => handleInputChange('tutorEmail', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Teléfono de contacto</label>
                            <input
                                type="tel"
                                className="form-input"
                                value={formData.tutorPhone}
                                onChange={(e) => handleInputChange('tutorPhone', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="edit-patient__actions">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button variant="primary" onClick={handleSave}>Guardar cambios</Button> 
                    </div>
                </div>               
            </div>
        </div>
    );
}
