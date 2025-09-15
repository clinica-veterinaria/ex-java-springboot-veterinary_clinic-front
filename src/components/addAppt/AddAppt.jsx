import React, { useState } from 'react';
import './AddAppt.css';
import ButtonType from '../buttonType/ButtonType';
import ButtonStatus from '../buttonStatus/ButtonStatus'
// import ButtonPrimary from './ButtonPrimary'; // Descomenta cuando tengas el componente
// import ButtonSecondary from './ButtonSecondary'; // Descomenta cuando tengas el componente
// import ButtonStatus from './ButtonStatus'; // Ya lo tienes creado
// import DateTimePicker from './DateTimePicker'; // Componente que necesitarás crear para el calendario

const AddAppointmentModal = ({
    isOpen = false,
    onClose = () => { },
    onSave = () => { }
}) => {
    const [formData, setFormData] = useState({
        petName: '',
        petId: '',
        date: '',
        time: '',
        reason: '',
        type: 'estandar',
        status: 'pendiente'
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    const handleCancel = () => {
        setFormData({
            petName: '',
            petId: '',
            date: '',
            time: '',
            reason: '',
            type: 'estandar',
            status: 'pendiente'
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
                    {/* Fila 1: Nombre mascota e ID */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Nombre mascota</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: Valentín"
                                value={formData.petName}
                                onChange={(e) => handleInputChange('petName', e.target.value)}
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

                    {/* Fila 2: Fecha y Hora */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Fecha</label>
                            {/* Aquí irá tu componente DateTimePicker */}
                            <input
                                type="date"
                                className="form-input"
                                placeholder="Ej: 15/09/2025"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                            />
                            {/* <DateTimePicker 
                type="date"
                value={formData.date}
                onChange={(value) => handleInputChange('date', value)}
                availableSlots={availableSlots}
              /> */}
                        </div>
                        <div className="form-field">
                            <label className="form-label">Hora</label>
                            {/* Aquí irá tu componente DateTimePicker */}
                            <input
                                type="time"
                                className="form-input"
                                placeholder="Ej: 12:00"
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                            />
                            {/* <DateTimePicker 
                type="time"
                value={formData.time}
                onChange={(value) => handleInputChange('time', value)}
                selectedDate={formData.date}
                availableSlots={availableSlots}
              /> */}
                        </div>
                    </div>

                    {/* Fila 3: Motivo */}
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

                    {/* Fila 4: Tipo y Estado */}
                    <div className="form-row">
                        <ButtonType></ButtonType>
                        <ButtonStatus></ButtonStatus>
                    </div>

                    {/* Botones */}
                    <div className="modal-actions">
                        {/* Aquí usarías tus componentes de botones */}
                        {/* <ButtonSecondary onClick={handleCancel}>
            Cancelar
          </ButtonSecondary>
          <ButtonPrimary onClick={handleSave}>
            Guardar
          </ButtonPrimary> */}

                        {/* Botones temporales - reemplazar por tus componentes */}
                        <button
                            className="btn-cancel"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn-save"
                            onClick={handleSave}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAppointmentModal;