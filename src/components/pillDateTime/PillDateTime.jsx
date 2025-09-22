import React from "react";
import './PillDateTime.css';

export default function PillDateTime({ date, time }) {
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
        <div className="pill-row">
            <span className="pill pill-date">{formatDate(date)}</span>
            <span className="pill pill-time">{time}</span>
        </div>
    );
}
