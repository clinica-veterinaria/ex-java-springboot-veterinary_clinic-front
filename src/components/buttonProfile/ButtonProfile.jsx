import React from "react";
import './ButtonProfile.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons"; 


export default function ButtonProfile({ children, onClick }) {
    return(
        <div className="btn-profile">
            <FontAwesomeIcon icon={faCircleUser} className="fa-cicle-user"/>        
            <button className="btn-profile__text" onClick={onClick}>{children}
            </button>
        </div>
       
    );
}