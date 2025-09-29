import React from "react";
import './AppointmentCard.css';
import ButtonStatus from '../buttonStatus/ButtonStatus';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"; 

export default function AppointmentCard({ appointmentDatetime, patientName, reason, status, type, onOptionsClick, onClick, isNextAppointment = false, appointment, onStatusChange }) {
    const formatDateTime = (isoString) => {
        if (!isoString) return 'Fecha no definida';

        const date = new Date(isoString); 
        
        // Verify date is ok
        if (isNaN(date)) {
            // If it's not valid, returns original string
            return isoString; 
        }

        const dateOptions = { day: '2-digit', month: 'short' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

        const formattedDate = date.toLocaleDateString('es-ES', dateOptions).toUpperCase(); 
        const formattedTime = date.toLocaleTimeString('es-ES', timeOptions);
        
        return `${formattedDate} ${formattedTime}`; 
    };

    const displayDateTime = formatDateTime(appointmentDatetime);
    const normalizedStatus = status ? status.toLowerCase() : '';
    const normalizedType = (type || '').trim().toLowerCase();

    // Check if it's expired first (highest priority)
    if (normalizedStatus === 'expirada') {
        return (
            <div className="appointment-card appointment-card__expired" onClick={onClick}>
                <div className="appointment-card__expired-container">
                    <div className="appointment-card__date">{displayDateTime}</div>
                    <div className="appointment-card__pet">{patientName}</div>
                    <div className="appointment-card__reason">{reason}</div>
                </div>
            </div>
        );
    }

    // Check if it's urgent (supports both 'urgente' and 'urgent')
    const isUrgent = normalizedType === 'urgente' || normalizedType === 'urgent';
    const cardClass = `appointment-card ${isUrgent ? 'appointment-card__urgent' : ''}`;
    
    return(
        <div className={cardClass} onClick={onClick}>
            <div className="appointment-card__container">
                <div className="appointment-card__date">{displayDateTime}</div>
                <div className="appointment-card__pet">{patientName}</div>
                <div className="appointment-card__reason">{reason}</div>
                
                {/* Show state if is not "next appointment" */}
              {!isNextAppointment && (
                <div className="appointment-card__state">
                    <ButtonStatus 
                        initialStatus={status} 
                        appointmentDatetime={appointmentDatetime}
                        onStatusChange={(newStatus) => onStatusChange(newStatus)} 
                    />
                </div>
              )}

              {/* Show icon if is not "next appointment" and not "attended" */}
              {!isNextAppointment && status !== 'atendido' && (
                <div className="appointment-card__icon" onClick={(e) => {
                    e.stopPropagation();
                    if (onOptionsClick) {
                        onOptionsClick(appointment);
                    }
                }}>
                    <FontAwesomeIcon icon={faEllipsis} className="faEllipsis"/>        
                </div>
              )}
          </div>
      </div>
  );
}