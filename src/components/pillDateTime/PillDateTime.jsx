import React from "react";
import './PillDateTime.css';

export default function PillDateTime({ appointmentDatetime }) {
  if (!appointmentDatetime) return null;

  const dateObj = new Date(appointmentDatetime);

  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("es-ES", { month: "short" }).toUpperCase();
  const year = dateObj.getFullYear();

  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  const formatted = `${day} ${month} ${year}, ${hours}:${minutes}`;

  return (
    <span className="pill pill--datetime">
      {formatted}
    </span>
  );
}
