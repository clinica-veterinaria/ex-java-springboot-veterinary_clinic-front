import React, { useState, useRef } from 'react';
import './PetModal.css';
import Button from '../buttons/Button'
import { createPatient } from './services/APIService.js';


const AddPetModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  onSave = () => {} 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    breed: '',
    age: '',
    ownerName: '',
    ownerDNI: '',
    email: '',
    phone: '',
    photo: null
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

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

  const handlePhotoSelect = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: 'Solo se permiten imágenes (JPG, PNG, GIF)' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'La imagen debe ser menor a 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear photo error
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.gender.trim()) {
      newErrors.gender = 'El género es obligatorio';
    }

    if (!formData.breed.trim()) {
      newErrors.breed = 'La raza es obligatoria';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'La edad es obligatoria';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'El nombre del dueño es obligatorio';
    }

    if (!formData.ownerDNI.trim()) {
      newErrors.ownerDNI = 'El DNI es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
  if (validateForm()) {
    try {
      const savedPatient = await createPatient(formData);
      onSave(savedPatient); 
      handleCancel(); // Reset form after save
    } catch (error) {
      console.error("Error al guardar paciente:", error);
    }
  }
};

  const handleCancel = () => {
    setFormData({
      name: '',
      gender: '',
      breed: '',
      age: '',
      ownerName: '',
      ownerDNI: '',
      email: '',
      phone: '',
      photo: null
    });
    setErrors({});
    setPhotoPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="pet-modal-container">
        <div className="pet-modal-header">
          <h2 className="pet-modal-title">Añadir mascota</h2>
        </div>

        <div className="pet-modal-content">
          {/* Photo and pet info section */}
          <div className="pet-info-section">
            {/* Photo upload */}
            <div className="photo-upload-container">
              <div 
                className={`photo-upload-area ${errors.photo ? 'photo-upload-area--error' : ''}`}
                onClick={handlePhotoSelect}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="signin-modal__image" />
                ) : (
                  <div className="signin-modal__image-placeholder">
                    <div>📁</div>
                    <span>Seleccionar imagen</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </div>
              {errors.photo && (
                <small className="error-text">{errors.photo}</small>
              )}
            </div>

            {/* Pet basic info */}
            <div className="pet-basic-info">
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Nombre mascota</label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                    placeholder="Ej: Valentín"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-field">
                  <label className="form-label">Género</label>
                  <input
                    type="text"
                    className={`form-input ${errors.gender ? 'form-input--error' : ''}`}
                    placeholder="Ej: Macho"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  />
                  {errors.gender && <span className="error-message">{errors.gender}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Raza</label>
                  <input
                    type="text"
                    className={`form-input ${errors.breed ? 'form-input--error' : ''}`}
                    placeholder="Ej: Jack Russell Terrier"
                    value={formData.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                  />
                  {errors.breed && <span className="error-message">{errors.breed}</span>}
                </div>
                <div className="form-field">
                  <label className="form-label">Edad</label>
                  <input
                    type="text"
                    className={`form-input ${errors.age ? 'form-input--error' : ''}`}
                    placeholder="Ej: 2 años"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                  {errors.age && <span className="error-message">{errors.age}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Owner info section */}
          <div className="owner-info-section">
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Nombre del dueño</label>
                <input
                  type="text"
                  className={`form-input ${errors.ownerName ? 'form-input--error' : ''}`}
                  placeholder="Ej: Vicente Benito"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                />
                {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
              </div>
              <div className="form-field">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  className={`form-input ${errors.ownerDNI ? 'form-input--error' : ''}`}
                  placeholder="12.345.678-A"
                  value={formData.ownerDNI}
                  onChange={(e) => handleInputChange('ownerDNI', e.target.value)}
                />
                {errors.ownerDNI && <span className="error-message">{errors.ownerDNI}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                  placeholder="Ej: vicente1A@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-field">
                <label className="form-label">Teléfono de contacto</label>
                <input
                  type="tel"
                  className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                  placeholder="666666666"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Modal actions */}
        <div className="pet-modal-actions">
          <Button variant='secondary' onClick={handleCancel} >
            Cancelar
          </Button>
          <Button variant='primary' onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPetModal;