import React from "react";
import './AppointmentCard.css';
import ButtonStatus from '../buttonStatus/ButtonStatus';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"; 

export default function AppointmentCard({ appointmentDatetime, patientName, reason, status, type, onOptionsClick, onClick, isNextAppointment = false, appointment, onStatusChange }) {
    const normalizedStatus = status ? status.toLowerCase() : '';
    const normalizedType = type ? type.toLowerCase() : '';

    if (normalizedStatus === 'expirada') {
        return (
            <div className="appointment-card appointment-card__expired" onClick={onClick}>
                <div className="appointment-card__expired-container">
                    <div className="appointment-card__date">{appointmentDatetime}</div>
                    <div className="appointment-card__pet">{patientName}</div>
                    <div className="appointment-card__reason">{reason}</div>
                </div>
            </div>
        );
    }

    // backend sends the expired state
    const cardClass = `appointment-card ${normalizedType === 'urgent' ? 'appointment-card__urgent' : ''}`;

    return(
        <div className={cardClass} onClick={onClick}>
            <div className="appointment-card__container">
                <div className="appointment-card__date">{appointmentDatetime}</div>
                <div className="appointment-card__pet">{patientName}</div>
                <div className="appointment-card__reason">{reason}</div>
                
                {/* Show state if is not "next appointment" */}
              {!isNextAppointment && (
                <div className="appointment-card__state">
                    <ButtonStatus initialStatus={status} onStatusChange={(newStatus) => onStatusChange(newStatus)} />
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