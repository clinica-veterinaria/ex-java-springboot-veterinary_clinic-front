import React from "react";
import './PillDateTime.css';

export default function PillDateTime({ appointmentDatetime }) {
  if (!appointmentDatetime) return null;

  const dateObj = new Date(appointmentDatetime);

  const formatted = dateObj.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace('.', '').toUpperCase();

  return (
    <span className="pill pill--datetime">
      {formatted}
    </span>
  );
}
