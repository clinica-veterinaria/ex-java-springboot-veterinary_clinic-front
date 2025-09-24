import React, { useState, useEffect, useRef } from 'react';
import './PetModal.css';
import Button from '../buttons/Button';
import { registerPatient, updatePatient } from '../../services/APIPatient';

const AddPetModal = ({ isOpen = false, onClose = () => {}, onSave = () => {}, editPatient = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    breed: '',
    age: '',
    petIdentification: '',
    tutorName: '',
    tutorDni: '',
    tutorEmail: '',
    tutorPhone: '',
  });
  const [errors, setErrors] = useState({});

  // Inicializar el formulario si hay paciente a editar
  useEffect(() => {
    if (editPatient) {
      setFormData({
        name: editPatient.name || '',
        gender: editPatient.gender || '',
        breed: editPatient.breed || '',
        age: editPatient.age?.toString() || '',
        petIdentification: editPatient.petIdentification || '',
        tutorName: editPatient.tutorName || '',
        tutorDni: editPatient.tutorDni || '',
        tutorEmail: editPatient.tutorEmail || '',
        tutorPhone: editPatient.tutorPhone || '',
      });
    } else {
      setFormData({
        name: '',
        gender: '',
        breed: '',
        age: '',
        petIdentification: '',
        tutorName: '',
        tutorDni: '',
        tutorEmail: '',
        tutorPhone: '',
      });
    }
    setErrors({});
  }, [editPatient, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.petIdentification.trim()) newErrors.petIdentification = 'La identificación es obligatoria';
    if (!formData.age.trim() || isNaN(Number(formData.age))) newErrors.age = 'La edad es obligatoria y debe ser un número';
    if (!formData.tutorName.trim()) newErrors.tutorName = 'El nombre del dueño es obligatorio';
    if (!formData.tutorDni.trim()) newErrors.tutorDni = 'El DNI es obligatorio';
    if (!formData.tutorEmail.trim()) newErrors.tutorEmail = 'El correo electrónico es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tutorEmail)) newErrors.tutorEmail = 'El correo electrónico no es válido';
    if (!formData.tutorPhone.trim()) newErrors.tutorPhone = 'El teléfono es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      let savedPatient;
      if (editPatient?.id) {
        // Editar paciente existente
        savedPatient = await updatePatient(editPatient.id, formData);
      } else {
        // Crear nuevo paciente
        savedPatient = await registerPatient(formData);
      }
      onSave(savedPatient);
      onClose();
    } catch (error) {
      console.error('Error guardando paciente:', error);
      alert('Hubo un error al guardar el paciente');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="pet-modal-container">
        <div className="pet-modal-header">
          <h2 className="pet-modal-title">{editPatient ? 'Editar mascota' : 'Añadir mascota'}</h2>
        </div>
        <div className="pet-modal-content">
          <div className="form-row">
            <div className="form-field">
              <label>Nombre mascota</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-field">
              <label>Identificación</label>
              <input
                type="text"
                value={formData.petIdentification}
                onChange={(e) => handleInputChange('petIdentification', e.target.value)}
              />
              {errors.petIdentification && <span className="error-message">{errors.petIdentification}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Género</label>
              <input
                type="text"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Raza</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Edad</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Nombre del dueño</label>
              <input
                type="text"
                value={formData.tutorName}
                onChange={(e) => handleInputChange('tutorName', e.target.value)}
              />
              {errors.tutorName && <span className="error-message">{errors.tutorName}</span>}
            </div>
            <div className="form-field">
              <label>DNI</label>
              <input
                type="text"
                value={formData.tutorDni}
                onChange={(e) => handleInputChange('tutorDni', e.target.value)}
              />
              {errors.tutorDni && <span className="error-message">{errors.tutorDni}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Correo electrónico</label>
              <input
                type="email"
                value={formData.tutorEmail}
                onChange={(e) => handleInputChange('tutorEmail', e.target.value)}
              />
              {errors.tutorEmail && <span className="error-message">{errors.tutorEmail}</span>}
            </div>
            <div className="form-field">
              <label>Teléfono</label>
              <input
                type="tel"
                value={formData.tutorPhone}
                onChange={(e) => handleInputChange('tutorPhone', e.target.value)}
              />
              {errors.tutorPhone && <span className="error-message">{errors.tutorPhone}</span>}
            </div>
          </div>
        </div>

        <div className="pet-modal-actions">
          <Button variant='secondary' onClick={onClose}>Cancelar</Button>
          <Button variant='primary' onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};

export default AddPetModal;
