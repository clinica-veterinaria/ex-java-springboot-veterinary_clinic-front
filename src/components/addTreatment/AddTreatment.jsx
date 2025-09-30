import React, { useState } from 'react';
import './AddTreatment.css';

const AddTreatment = ({ isOpen = false, onClose = () => { }, onSave = () => { } }) => {
    const [formData, setFormData] = useState({
        motivo: '',
        descripcion: '',
        tratamiento: '',
        duracion: '',
        frecuencia: '',
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Aquí podrías añadir validación antes de guardar
        onSave(formData);
        onClose(); // Cierra el modal después de guardar
        // Reset form
        setFormData({
            motivo: '',
            descripcion: '',
            tratamiento: '',
            duracion: '',
            frecuencia: '',
        });
    };

    const handleCancel = () => {
        // Reset form state
        setFormData({
            motivo: '',
            descripcion: '',
            tratamiento: '',
            duracion: '',
            frecuencia: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Añadir tratamiento</h2>
                </div>

                <div className="modal-content">
                    {/* row 1: Motivo */}
                    <div className="form-row">
                        <div className="form-field form-field--full">
                            <label className="form-label">Motivo</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: Infección"
                                value={formData.motivo}
                                onChange={(e) => handleInputChange('motivo', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* row 2: Descripcion */}
                    <div className="form-row">
                        <div className="form-field form-field--full">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Ej: Infección por hongos"
                                value={formData.descripcion}
                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                rows="3"
                            />
                        </div>
                    </div>
                    
                    {/* row 3: Tratamiento */}
                    <div className="form-row">
                        <div className="form-field form-field--full">
                            <label className="form-label">Tratamiento</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: Ketoconazol"
                                value={formData.tratamiento}
                                onChange={(e) => handleInputChange('tratamiento', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* row 4: Duracion y Frecuencia */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Duración</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: 7 días"
                                value={formData.duracion}
                                onChange={(e) => handleInputChange('duracion', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Frecuencia</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: 1/día en ayunas"
                                value={formData.frecuencia}
                                onChange={(e) => handleInputChange('frecuencia', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                        <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTreatment;
