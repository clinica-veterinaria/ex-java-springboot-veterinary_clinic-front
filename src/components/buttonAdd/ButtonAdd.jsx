import React from "react";
import './ButtonAdd.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"; 

export default function ButtonAdd(props) {
    return(
        <button className="add" {...props}>
            <FontAwesomeIcon icon={faPlus} className="faPlus"/>        
        </button>

    );
}