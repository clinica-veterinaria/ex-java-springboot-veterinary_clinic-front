import React, { useState } from 'react';
import './CardPatient.css';
import { Dog } from "lucide-react";

const CardPatient = ({ 
  name = "Pepita", 
  photo = null, 
  onClick = () => {} 
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(true); 
    onClick();           
  };

  return (
    <div 
      className={`patient-card ${isSelected ? 'patient-card--selected' : ''}`}
      onClick={handleClick}
    >
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
