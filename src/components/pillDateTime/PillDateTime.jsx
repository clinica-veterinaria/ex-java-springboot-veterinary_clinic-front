import React from "react";
import './PillDateTime.css';

export default function PillDateTime({ appointmentDatetime }) {
  if (!appointmentDatetime) {
    return (
      <span className="pill pill--datetime pill--error">
        Fecha no disponible
      </span>
    );
  }

  const dateObj = new Date(appointmentDatetime);
  
  if (isNaN(dateObj.getTime())) {
    console.error("Error: Fecha/hora inválida recibida en PillDateTime:", appointmentDatetime);
    return (
      <span className="pill pill--datetime pill--error">
        Error de fecha
      </span>
    );
  }
  
  const datePart = dateObj.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  }).replace('.', '').toUpperCase(); 

  const timePart = dateObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formatted = `${datePart} ${timePart}`;

  return (
    <span className="pill pill--datetime">
      {formatted}
    </span>
  );
}
