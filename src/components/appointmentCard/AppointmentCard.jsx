import React from "react";
import './AppointmentCard.css';
import ButtonStatus from '../buttonStatus/ButtonStatus';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"; 

export default function AppointmentCard({ date, petName, reason, status, type, onMoreOptions }) {

    // backend sends the expirate state
    const cardClass = `appointment-card ${type === 'urgente' ? 'appointment-card--urgente' : ''} ${status === 'expirada' ? 'appointment-card--expired' : ''}`;


    return(
        <div className="appointment-card">
            <div className="appointment-card__container">
                <div className="appointment-card__date">{date}</div>
                <div className="appointment-card__pet">{petName}</div>
                <div className="appointment-card__reason">{reason}</div>
                <div className="appointment-card__state">
                    <ButtonStatus status={status} />
                </div>
                <div className="appointment-card__icon" onClick={onMoreOptions}>
                   <FontAwesomeIcon icon={faEllipsis} className="faEllipsis"/>        
                </div>
            </div>
        </div>
    );
}