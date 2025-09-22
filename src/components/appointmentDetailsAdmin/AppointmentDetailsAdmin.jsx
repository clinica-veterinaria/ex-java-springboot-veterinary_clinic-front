import React, { useState } from "react";
import './AppointmentDetailsAdmin.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"; 
import PillDateTime from '../pillDateTime/PillDateTime';
import ButtonStatus from '../buttonStatus/ButtonStatus';
import Button from '../buttons/Button';
import ButtonText from '../buttonText/ButtonText';

export default function AppointmentDetailsAdmin({ onClose, petName, appointmentDate, appointmentTime, description, icon}) {
    const [status, setStatus] = useState("pendiente");


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
                <h3 className="appointment-admin__petName">{petName}</h3>
                <div className="appointment-admin__data">
                <PillDateTime date={appointmentDate} time={appointmentTime} />
                <ButtonStatus initialStatus={status} onStatusChange={setStatus} />
                </div>
                <div className="appointment-admin__body">
                    <p className="appointment-admin__subtitle">Motivo</p>
                    <p className="appointment-admin__text">{description}</p>
                    <ButtonText icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare}/>}>Ver ficha paciente</ButtonText>
                </div>
                <div className="appointment-admin__buttons">
                    <Button variant="secondary" onClick={() => setStatus("urgente")}>Urgente</Button>
                    <Button variant="primary" onClick={() => setStatus("estandar")}>Estándar</Button>
                </div>
            </div>
        </div>
        </div>
        );
}