import React from "react";
import './CardHome.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faPaw } from "@fortawesome/free-solid-svg-icons";

export default function CardHome({ variant = "appointments", onClick, ...props }) {

    const config = {
        appointments: {
            icon: faCalendarCheck,
            title: "Citas"
        },

        patients: {
            icon: faPaw,
            title: "Pacientes"
        }
    };

    const { icon, title } = config[variant] || {}

return(
    <div className="card-home" onClick={onClick} {...props}>
            <div className="card-home__image">
                <FontAwesomeIcon icon={icon} className="card-home__icon" />
            </div>
        <div className="card-home__title-container">
            <h2 className="card-home__title">{title}</h2>
        </div>

    </div>
);
}