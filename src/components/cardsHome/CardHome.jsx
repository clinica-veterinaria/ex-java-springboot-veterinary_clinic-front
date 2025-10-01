import React from "react";
import './CardHome.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faPaw } from "@fortawesome/free-solid-svg-icons";

// 1. Extraemos 'isSelected' junto con 'variant', 'onClick', y el resto de props en 'rest'.
export default function CardHome({ variant = "appointments", onClick, isSelected, ...rest }) { 

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

    const { icon, title } = config[variant] || {};

    const cardClasses = `card-home ${isSelected ? 'card-home--selected' : ''}`;

    return(
        <div className={cardClasses} onClick={onClick} {...rest}> 
                <div className="card-home__image">
                    <FontAwesomeIcon icon={icon} className="card-home__icon" />
                </div>
            <div className="card-home__title-container">
                <h2 className="card-home__title">{title}</h2>
            </div>
        </div>
    );
}