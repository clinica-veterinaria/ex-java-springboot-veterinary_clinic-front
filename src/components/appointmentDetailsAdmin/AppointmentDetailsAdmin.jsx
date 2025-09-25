import React from "react";
import './AppointmentDetailsAdmin.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"; 
import PillDateTime from '../pillDateTime/PillDateTime';
import ButtonStatus from '../buttonStatus/ButtonStatus';
import ButtonText from '../buttonText/ButtonText';

export default function AppointmentDetailsAdmin({ onClose, patientName, appointmentDatetime, reason, status, onStatusChange }) {

    return(
        <div className="appointment-admin__overlay">
        <div className={`appointment-admin__container ${status === 'urgente' ? 'appointment-admin__container--urgent' : ''}`}>
            <button className="appointment-admin__close" onClick={onClose} aria-label="Cerrar detalles de la cita">
                <FontAwesomeIcon icon={faXmark} className="faXmark"/>        
            </button>
            <div className="appointment-admin__title">
                <h2>Datos de la cita</h2>
            </div>
            <div className="appointment-admin__details">
                <h3 className="appointment-admin__patient">{patientName}</h3>
                <div className="appointment-admin__data">
                <PillDateTime appointmentDatetime={appointmentDatetime} />
                <ButtonStatus initialStatus={status} onStatusChange={onStatusChange} />
                </div>
                <div className="appointment-admin__body">
                    <p className="appointment-admin__subtitle">Motivo</p>
                    <p className="appointment-admin__text">{reason}</p>
                    <ButtonText icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare}/>}>Ver ficha paciente</ButtonText>
                </div>
            </div>
        </div>
        </div>
        );
}