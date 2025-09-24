import React, { useState, useEffect } from 'react';
import './AddAppt.css';
import ButtonType from '../buttonType/ButtonType';
import Button from '../buttons/Button';
import DateTimePicker from '../dateTimePicker/DateTimePicker';
import { AppointmentsService } from "../../services/apiService";


const AddAppt = ({ isOpen = false, onClose = () => { }, onSave = () => { }}) => {
    const [formData, setFormData] = useState({
        patient: '',
        petId: '',
        date: '',
        time: '',
        reason: '',
        type: 'estandar',
    });

    const [availableSlots, setAvailableSlots] = useState([]);

    // Obtener horarios disponibles al cambiar la fecha
    useEffect(() => {
        if (!formData.date) {
            setAvailableSlots([]);
            return;
        }
        const fetchSlots = async () => {
            try {
                const slots = await AppointmentsService.getAvailableSlots(formData.date);
                setAvailableSlots(slots);
            } catch (error) {
                console.error("Error obteniendo horarios disponibles:", error);
                setAvailableSlots([]);
            }
        };
        fetchSlots();
    }, [formData.date]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            await AppointmentsService.create(formData);
            onSave(formData);
            onClose();
        } catch (error) {
            console.error("Error al crear cita:", error);
            alert("Error al crear la cita");
        }
    };

    const handleCancel = () => {
        setFormData({
            patient: '',
            petId: '',
            date: '',
            time: '',
            reason: '',
            type: 'estandar',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Añadir cita</h2>
                </div>

                <div className="modal-content">
                    {/* Row 1: nombre y ID */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Nombre mascota</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: Valentín"
                                value={formData.patient}
                                onChange={(e) => handleInputChange('patient', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">ID</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: 15032"
                                value={formData.petId}
                                onChange={(e) => handleInputChange('petId', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Row 2: fecha y hora */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Fecha</label>
                            <DateTimePicker 
                                type="date"
                                value={formData.date}
                                onChange={(value) => handleInputChange('date', value)}
                                availableSlots={availableSlots}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Hora</label>
                            <DateTimePicker 
                                type="time"
                                value={formData.time}
                                onChange={(value) => handleInputChange('time', value)}
                                selectedDate={formData.date}
                                availableSlots={availableSlots}
                            />
                        </div>
                    </div>

                    {/* Row 3: motivo */}
                    <div className="form-row">
                        <div className="form-field form-field--full">
                            <label className="form-label">Motivo</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Ej: Revisión del año"
                                value={formData.reason}
                                onChange={(e) => handleInputChange('reason', e.target.value)}
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Row 4: tipo */}
                    <div className="form-row">
                        <ButtonType value={formData.type} onChange={(value) => handleInputChange('type', value)} />
                    </div>

                    {/* Botones */}
                    <div className="modal-actions">
                        <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
                        <Button variant="primary" onClick={handleSave}>Guardar</Button> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAppt;
