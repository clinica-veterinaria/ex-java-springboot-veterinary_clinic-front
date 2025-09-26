import React from "react";
import "./AddSelectModal.css";

export default function AddSelectModal({ setModalType, setShowAddModal }) {
  const handleSelect = (type) => {
    setModalType(type);       // Define qué modal se abrirá
    setShowAddModal(true);    // Asegura que el modal principal sigue abierto
  };

  return (
    <div
      className="addSelect__overlay"
      onClick={() => setShowAddModal(false)}
    >
      <div
        className="addSelect__container"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="addSelect__actions">
          <button
            type="button"
            className="addSelect__link"
            onClick={() => handleSelect("appt")}
          >
            Añadir cita
          </button>
          <button
            type="button"
            className="addSelect__link"
            onClick={() => handleSelect("treatment")}
          >
            Añadir tratamiento
          </button>
        </div>
      </div>
    </div>
  );
}
