import React from "react";
import './AppointmentDetailsAdmin.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons"; 
import PillDateTime from '../pillDateTime/PillDateTime';
import ButtonStatus from '../buttonStatus/ButtonStatus';
import Button from '../buttons/Button';
import ButtonText from '../buttonText/ButtonText';

export default function AppointmentDetailsAdmin({ onClose, petName, appointmentDate, appointmentTime, description, icon}) {
    return(
        <div className="appointment-admin__overlay">
        <div className="appointment-admin__container">
            <button className="appointment-admin__close" onClick={onClose} aria-label="Cerrar detalles de la cita">
                <FontAwesomeIcon icon={faXmark} className="faXmark"/>        
            </button>
            <div className="appointment-admin__title">
                <h2>Datos de la cita</h2>
            </div>
            <div className="appointment-admin__details">
                <h3 className="appointment-admin__petName">{petName}</h3>
                <div className="appointment-admin__date">
                <PillDateTime date={appointmentDate} time={appointmentTime} />
                </div>
                <div className="appointment-admin__body">
                    <p className="appointment-admin__subtitle">Motivo</p>
                    <p className="appointment-admin__text">{description}</p>
                    <ButtonText icon={icon}>Ver ficha paciente</ButtonText>
                </div>
                <div className="appointment-admin__buttons">
                    <Button variant="secondary">Urgente</Button>
                    <Button variant="primary">Estandar</Button>
                </div>
            </div>
        </div>
        </div>
        );
}