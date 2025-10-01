import React, { useState, useRef } from 'react';
import './PetModal.css';
import Button from '../buttons/Button'
import { registerPatient } from '../../services/APIPatient';



const AddPetModal = ({ isOpen = false, onClose = () => { }, onSave = () => { } }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    breed: '',
    age: '',
    tutorName: '',
    tutorDni: '',
    tutorEmail: '',
    tutorPhone: '',
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


    if (!formData.age.trim()) { // <-- .trim() ahora funciona porque es un string
      newErrors.age = 'La edad es obligatoria';
    } else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) <= 0) {
      // Ahora la validación revisa el string
      newErrors.age = 'La edad debe ser un número válido';
    }

    if (!formData.tutorName.trim()) {
      newErrors.tutorName = 'El nombre del dueño es obligatorio';
    }

    if (!formData.tutorDni.trim()) {
      newErrors.tutorDni = 'El DNI es obligatorio';
    }

    if (!formData.tutorEmail.trim()) {
      newErrors.tutorEmail = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tutorEmail)) {
      newErrors.tutorEmail = 'El correo electrónico no es válido';
    }

    if (!formData.tutorPhone.trim()) {
      newErrors.tutorPhone = 'El teléfono es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
  // 🔍 AGREGAR ESTAS LÍNEAS AQUÍ
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('🔍 Usuario actual:', user);
  console.log('🔍 Rol del usuario:', user?.role);
  console.log('🔍 Datos del paciente:', formData);
  
  if (!validateForm()) return;

  try {
    console.log("Datos de formData antes de construir el JSON:", formData);
    
    const patientData = {
      name: formData.name,
      age: parseInt(formData.age) || 0,
      breed: formData.breed,
      gender: formData.gender,
      tutorName: formData.tutorName,
      tutorDni: formData.tutorDni,
      tutorPhone: formData.tutorPhone,
      tutorEmail: formData.tutorEmail,
      petIdentification: formData.petIdentification,
    };

    console.log("📤 Datos que se enviarán al backend:", patientData);
    
    const savedPatient = await registerPatient(patientData, formData.photo); 
    onSave(savedPatient);
    handleCancel();

  } catch (error) {
    console.error("❌ Error al guardar paciente:", error);
    alert("Hubo un error al guardar la mascota");
  }
};

  const handleCancel = () => {
    setFormData({
      name: '',
      gender: '',
      breed: '',
      age: '',
      tutorName: '',
      tutorDni: '',
      tutorEmail: '',
      tutorPhone: '',
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
                  className={`form-input ${errors.tutorName ? 'form-input--error' : ''}`}
                  placeholder="Ej: Vicenta Benito"
                  value={formData.tutorName}
                  onChange={(e) => handleInputChange('tutorName', e.target.value)}
                />
                {errors.ownerName && <span className="error-message">{errors.tutorName}</span>}
              </div>
              <div className="form-field">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  className={`form-input ${errors.tutorDni ? 'form-input--error' : ''}`}
                  placeholder="12.345.678-A"
                  value={formData.tutorDni}
                  onChange={(e) => handleInputChange('tutorDni', e.target.value)}
                />
                {errors.tutorDni && <span className="error-message">{errors.tutorDni}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-input ${errors.tutorEmail ? 'form-input--error' : ''}`}
                  placeholder="Ej: vicentabenito21@gmail.com"
                  value={formData.tutorEmail}
                  onChange={(e) => handleInputChange('tutorEmail', e.target.value)}
                />
                {errors.tutorEmail && <span className="error-message">{errors.tutorEmail}</span>}
              </div>
              <div className="form-field">
                <label className="form-label">Teléfono de contacto</label>
                <input
                  type="tel"
                  className={`form-input ${errors.tutorPhone ? 'form-input--error' : ''}`}
                  placeholder="666666666"
                  value={formData.tutorPhone}
                  onChange={(e) => handleInputChange('tutorPhone', e.target.value)}
                />
                {errors.tutorPhone && <span className="error-message">{errors.tutorPhone}</span>}
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