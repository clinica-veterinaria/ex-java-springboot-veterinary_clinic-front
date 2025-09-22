import React from 'react';
import './AppointmentDetailsUser.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons"; 
import PillDateTime from '../pillDateTime/PillDateTime';


export default function AppointmentDetailsUser({onClose, petName, description, appointmentDate, appointmentTime}) {
    return(
    <div className="appointment-user__container">
        <button className="appointment-card__icon" onClick={onClose} aria-label="Cerrar detalles de la cita">
            <FontAwesomeIcon icon={faXmark} className="faXmark"/>        
        </button>
        <div className="appointment-user__title">
            <h2>Datos de la cita</h2>
        </div>
        <div className="appointment-user__details">
            <h3 className="appointment-user__petName">{petName}</h3>
            <div className="appointment-user__date">
            <PillDateTime date={appointmentDate} time={appointmentTime} />
            </div>
            <div className="appointment-user__text">
                <p className="appointment-user__subtitle">Motivo</p>
                <p>{description}</p>
            </div>
        </div>
    </div>
    );
}