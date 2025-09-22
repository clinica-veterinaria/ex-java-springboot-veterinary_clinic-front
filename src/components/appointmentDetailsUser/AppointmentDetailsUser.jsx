import React from 'react';
import './AppointmentDetailsUser.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons"; 
import PillDateTime from '../pillDateTime/PillDateTime';


export default function AppointmentDetailsUser({onClose, patient, reason, appointmentDatetime}) {
    return(
    <div className="appointment-user__overlay">
    <div className="appointment-user__container">
        <button className="appointment-user__close" onClick={onClose} aria-label="Cerrar detalles de la cita">
            <FontAwesomeIcon icon={faXmark} className="faXmark"/>        
        </button>
        <div className="appointment-user__title">
            <h2>Datos de la cita</h2>
        </div>
        <div className="appointment-user__details">
            <h3 className="appointment-user__petName">{patient}</h3>
            <div className="appointment-user__date">
            <PillDateTime appointmentDatetime={appointmentDatetime} />            </div>
            <div className="appointment-user__body">
                <p className="appointment-user__subtitle">Motivo</p>
                <p className="appointment-user__text">{reason}</p>
            </div>
        </div>
    </div>
    </div>
    );
}