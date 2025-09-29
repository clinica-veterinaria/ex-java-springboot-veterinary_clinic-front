import React, { useState, useEffect } from "react";
import './EditAppt.css';
import ButtonType from '../buttonType/ButtonType';
import Button from '../buttons/Button';
import DateTimePicker from '../dateTimePicker/DateTimePicker';
import { getAvailableSlots, updateAppointment } from '../../services/APIAppointment';

export default function EditAppt({ isOpen = false, onClose = () => {}, onSave = () => {}, appointment }) {
    const [formData, setFormData] = useState({
        patient: '',
        patientId: '',
        date: '',
        time: '',
        reason: '',
        type: 'estandar',
    });

    const [availableSlots, setAvailableSlots] = useState([]);

    // Original data
    useEffect(() => {
        if (appointment) {
            const [date, time] = appointment.appointmentDatetime.split('T');
    
            setFormData({
                patient: appointment.patientName || '', 
                patientId: appointment.patientId || '',
                date: date || '',
                time: time.slice(0, 5) || '', 
                reason: appointment.reason || '',
                type: appointment.type.toUpperCase() || 'estandar',
            });
        }
    }, [appointment]);

  // load available slots
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
    setFormData(prev => ({...prev,[field]: value}));
  };

  const handleSave = async () => {
    try {
        const appointmentDatetime = `${formData.date}T${formData.time}:00`;

        let backendType = formData.type.toUpperCase();
        if (backendType === 'URGENTE') backendType = 'URGENT';
        if (backendType === 'ESTANDAR') backendType = 'STANDARD';

        const updatedData = {
            appointmentDatetime: appointmentDatetime,
            type: formData.type.toUpperCase(),
            reason: formData.reason,
            patientId: Number(formData.patientId), 
            status: appointment.status 
        };
        
        await updateAppointment(appointment.id, updatedData);
        onSave(updatedData);
        onClose();

    } catch (error) {
        console.error("Error al editar cita:", error);
        alert("Error al editar la cita");
        }
    };

  if (!isOpen) return null;

    return(
        <div className="edit-appointment__overlay">
            <div className="edit-appointment__container">
                <div className="edit-appointment__header">
                    <h2 className="edit-appointment__title">Editar cita</h2>
                </div> 
                <div className="edit-appointment__content">
                    {/* row 1: name and id */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Nombre mascota</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.patient}
                                onChange={(e) => handleInputChange('patient', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">ID</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.patientId}
                                onChange={(e) => handleInputChange('patientId', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* row 2: date and time */}
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

                    {/* row 3: cause */}
                    <div className="form-row">
                        <div className="form-field form-field--full">
                            <label className="form-label">Motivo</label>
                            <textarea
                                className="form-textarea"
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
                    <div className="edit-appointment__actions">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button variant="primary" onClick={handleSave}>Guardar cambios</Button> 
                    </div>
                </div>               
            </div>
        </div>
    );
}