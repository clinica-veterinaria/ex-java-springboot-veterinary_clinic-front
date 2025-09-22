import React from "react";
import './AppointmentCard.css';
import ButtonStatus from '../buttonStatus/ButtonStatus';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"; 

export default function AppointmentCard({ date, petName, reason, status, type, onMoreOptions }) {

    if (status === 'expirada') {
        return (
            <div className="appointment-card appointment-card__expired">
                <div className="appointment-card__expired-container">
                    <div className="appointment-card__date">{date}</div>
                    <div className="appointment-card__pet">{petName}</div>
                    <div className="appointment-card__reason">{reason}</div>
                </div>
            </div>
        );
    }

    // backend sends the expired state
    const cardClass = `appointment-card ${type === 'urgente' ? 'appointment-card__urgent' : ''}`;

    return(
        <div className={cardClass}>
            <div className="appointment-card__container">
                <div className="appointment-card__date">{date}</div>
                <div className="appointment-card__pet">{petName}</div>
                <div className="appointment-card__reason">{reason}</div>
                <div className="appointment-card__state">
                    <ButtonStatus initialStatus={status} />
                </div>
                {status !== 'atendido' && (
                    <div className="appointment-card__icon" onClick={onMoreOptions}>
                        <FontAwesomeIcon icon={faEllipsis} className="faEllipsis"/>        
                    </div>
                )}
            </div>
        </div>
    );
}