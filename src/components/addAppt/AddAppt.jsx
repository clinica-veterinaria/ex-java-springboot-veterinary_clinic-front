import React, { useState, useEffect } from 'react';
import './AddAppt.css';
import ButtonType from '../buttonType/ButtonType';
import Button from '../buttons/Button';
import DateTimePicker from '../dateTimePicker/DateTimePicker';
import { getAvailableSlots, createAppointment } from "../../services/APIAppointment";


const AddAppt = ({ isOpen = false, onClose = () => { }, onSave = () => { }}) => {
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        date: '',
        time: '',
        reason: '',
        type: 'estandar',
    });

    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        if (!formData.date) {
            setAvailableSlots([]);
            return;
        }
        const fetchSlots = async () => {
            const slots = await getAvailableSlots(formData.date);
            setAvailableSlots(slots);
        }
        fetchSlots();
    }, [formData.date]);

    const handleInputChange = (field, value) => {
        console.log(`Actualizando ${field}:`, value); // Debug
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault(); 
        console.log("Form data completo:", formData);
        console.log("Date:", formData.date, "Type:", typeof formData.date);
        console.log("Time:", formData.time, "Type:", typeof formData.time);

        const typeMapping = {
            'estandar': 'STANDARD',
            'urgente': 'URGENT'
        };

        try {
            const appointmentData = {
                appointmentDatetime: `${formData.date}T${formData.time}:00`,
                type: typeMapping[formData.type] || 'STANDARD',
                reason: formData.reason,
                patientId: Number(formData.patientId)
            };

            if (!appointmentData.appointmentDatetime || !appointmentData.patientId) {
                alert('Por favor, completa la fecha, hora y paciente.');
                return;
            }
    
            await createAppointment(appointmentData);
            onSave();
            onClose();
            
        } catch (error) {
            console.error("Error al crear cita:", error);
            alert("Error al crear la cita" + error.message);
        }
    };
    

    const handleCancel = () => {
        setFormData({
            patientName: '',
            patientId: '',
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
                    {/* row 1: name and id */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Nombre mascota</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: Valentín"
                                value={formData.patientName}
                                onChange={(e) => handleInputChange('patientName', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">ID</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: 15032"
                                value={formData.patientId}
                                onChange={(e) => handleInputChange('patientId', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* row 2: date and time */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Fecha</label>
                            {/* Date time picker-date */}
                            <DateTimePicker 
                                type="date"
                                value={formData.date}
                                onChange={(value) => handleInputChange('date', value)}
                                availableSlots={availableSlots}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Hora</label>
                            {/* Date Time Picker-time */}
                            <DateTimePicker 
                                type="time"
                                value={formData.time}
                                onChange={(value) => handleInputChange('time', value)}
                                selectedDate={formData.date}
                                availableSlots={availableSlots}
                            />
                        </div>
                    </div>

                    {/* row 3: cause */}
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

                    {/* Row 4: type */}
                    <div className="form-row">
                    <ButtonType value={formData.type} onChange={(value) => handleInputChange('type', value)} />
                    </div>

                    {/* Buttons */}
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