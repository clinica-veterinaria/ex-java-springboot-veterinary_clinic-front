import React from "react";
import './AppointmentCard.css';
import ButtonStatus from '../buttonStatus/ButtonStatus';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"; 

export default function AppointmentCard({ appointmentDatetime, patient, reason, status, type, onOptionsClick, onClick, isNextAppointment = false, appointment }) {

    if (status === 'expirada') {
        return (
            <div className="appointment-card appointment-card__expired" onClick={onClick}>
                <div className="appointment-card__expired-container">
                    <div className="appointment-card__date">{appointmentDatetime}</div>
                    <div className="appointment-card__pet">{patient}</div>
                    <div className="appointment-card__reason">{reason}</div>
                </div>
            </div>
        );
    }

    // backend sends the expired state
    const cardClass = `appointment-card ${type === 'urgente' ? 'appointment-card__urgent' : ''}`;

    return(
        <div className={cardClass} onClick={(e) => e.stopPropagation()}>
            <div className="appointment-card__container">
                <div className="appointment-card__date">{appointmentDatetime}</div>
                <div className="appointment-card__pet">{patient}</div>
                <div className="appointment-card__reason">{reason}</div>
                
                {/* Show state if is not "next appointment" */}
              {!isNextAppointment && (
                <div className="appointment-card__state">
                    <ButtonStatus initialStatus={status} />
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