import React, { useState } from 'react';
import './CardPatient.css';
import { Dog } from "lucide-react";

const CardPatient = ({ 
  name = "Pepita", 
  photo = null, 
  onClick = () => {},
  isSelectionMode = false, // AÑADIR - faltaba esta prop
  isSelected = false, // AÑADIR - faltaba esta prop
  onSelectionChange = () => {} // AÑADIR - faltaba esta prop
}) => {
  // REMOVER - no necesitas useState interno para isSelected
  // const [isSelected, setIsSelected] = useState(false);

  const handleCardClick = (e) => {
    if (isSelectionMode) {
        // En modo selección: alternar selección
        e.stopPropagation();
        onSelectionChange(!isSelected);
    } else {
        // En modo normal: ir al perfil
        onClick();
    }
  };

  return (
    <div 
      className={`patient-card ${isSelectionMode ? 'patient-card--selection-mode' : ''} ${isSelected ? 'patient-card--selected' : ''}`}
      onClick={handleCardClick} // CORREGIR - era handleClick, debe ser handleCardClick
    >
      {/* Checkbox para modo selección */}
      {isSelectionMode && (
        <div 
          className={`patient-card__checkbox ${isSelected ? 'patient-card__checkbox--checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectionChange(!isSelected);
          }}
        >
          {isSelected && (
            <svg 
              viewBox="0 0 24 24" 
              className="patient-card__checkbox-icon"
              fill="currentColor"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          )}
        </div>
      )}

      {/* Contenedor de la foto */}
      <div className="patient-card__photo-container">
        {photo ? (
          <img 
            src={photo} 
            alt={`Foto de ${name}`}
            className="patient-card__photo"
          />
        ) : (
          <Dog className="patient-card__icon" strokeWidth={0.5}/>
        )}
      </div>

      <div className="patient-card__divider"></div>

      <h3 className="patient-card__name">
        {name}
      </h3>
    </div>
  );
};

export { CardPatient };