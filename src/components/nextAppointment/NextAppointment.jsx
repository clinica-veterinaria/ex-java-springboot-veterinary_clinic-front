import React from "react";
import './NextAppointment.css';

export default function NextAppointment({ 
    appointmentDatetime, 
    patient, 
    reason, 
    type,
    onClick 
}) {
    const cardClass = `next-appointment ${type === 'urgente' ? 'next-appointment--urgent' : ''}`;

    return(
        <div className={cardClass} onClick={onClick}>
            <div className="next-appointment__container">
                <div className="next-appointment__time">
                    {appointmentDatetime}
                </div>
                <div className="next-appointment__info">
                    <div className="next-appointment__patient">{patient}</div>
                    <div className="next-appointment__reason">{reason}</div>
                </div>
            </div>
        </div>
    );
}