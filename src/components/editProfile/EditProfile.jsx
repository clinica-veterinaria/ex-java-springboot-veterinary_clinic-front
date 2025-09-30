import React, { useState, useEffect, useRef } from "react";
import "./EditProfile.css";
import Button from "../buttons/Button";
import * as APIUser from "../../services/APIUser"; // importar servicio

const EditProfile = ({ isOpen = false, onClose = () => {}, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    email: "",
    phone: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dni: user.dni || "",
        email: user.email || "",
        phone: user.phone || "",
        photo: null,
      });
      setPhotoPreview(user.photo ? `data:image/jpeg;base64,${user.photo}` : null);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePhotoSelect = () => fileInputRef.current?.click();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: "Solo imágenes JPG, PNG o GIF" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "La imagen debe ser menor a 5MB" }));
      return;
    }

    setFormData((prev) => ({ ...prev, photo: file }));

    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);

    if (errors.photo) setErrors((prev) => ({ ...prev, photo: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.dni.trim()) newErrors.dni = "El DNI es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El correo electrónico es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "El correo no es válido";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!user?.id) {
      alert("Usuario no válido");
      return;
    }

    try {
      const userData = {
        name: formData.name,
        dni: formData.dni,
        email: formData.email,
        phone: formData.phone,
      };

      // Llamada al backend real
      const updatedUser = await APIUser.updateUser(user.id, userData, formData.photo);

      console.log("Usuario actualizado:", updatedUser);

      // Actualizamos preview y cerramos modal
      setPhotoPreview(updatedUser.photo ? `data:image/jpeg;base64,${updatedUser.photo}` : null);
      onClose(updatedUser); 
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar el perfil");
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", dni: "", email: "", phone: "", photo: null });
    setErrors({});
    setPhotoPreview(user?.photo ? `data:image/jpeg;base64,${user.photo}` : null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <h2 className="edit-profile-title">Editar perfil</h2>
        </div>

        <div className="edit-profile-content">
          <div className="profile-info-section">
            <div className="photo-upload-container">
              <div
                className={`photo-upload-area ${errors.photo ? "photo-upload-area--error" : ""}`}
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
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
              </div>
              {errors.photo && <small className="error-text">{errors.photo}</small>}
            </div>

            <div className="profile-basic-info">
              <div className="form-field">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className={`form-input ${errors.name ? "form-input--error" : ""}`}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  className={`form-input ${errors.dni ? "form-input--error" : ""}`}
                  value={formData.dni}
                  onChange={(e) => handleInputChange("dni", e.target.value)}
                />
                {errors.dni && <span className="error-message">{errors.dni}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? "form-input--error" : ""}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className={`form-input ${errors.phone ? "form-input--error" : ""}`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="edit-profile-actions">
          <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
