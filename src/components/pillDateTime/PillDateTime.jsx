import React from "react";
import './PillDateTime.css';

export default function PillDateTime({ label, type }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('es-ES', { 

          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 

        })
        .toUpperCase(); 
      };

    return(
        <span className={`pill pill--${type}`}>
        {formatDate(label)}
        </span>
    );
}
