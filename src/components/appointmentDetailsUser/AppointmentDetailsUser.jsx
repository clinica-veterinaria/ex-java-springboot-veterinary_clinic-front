import React from 'react';
import './AppointmentDetailsUser.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons"; 


export default function AppointmentDetailsUser({onClose, petName, description}) {
    return(
    <div className="appointment-user__container">
        <div className="appointment-card__icon" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} className="faXmark"/>        
        </div>
        <div className="appointment-user__title">
            <h2>Datos de la cita</h2>
        </div>
        <div className="appointment-user__details">
            <h3>{`${petName}`}</h3>
            <div className="appointment-user__date">

            </div>
            <div className="appointment-user__text">
                <p className="appointment-user__subtitle">Motivo</p>
                <p>{`${description}`}</p>
            </div>
        </div>
    </div>
    );
}