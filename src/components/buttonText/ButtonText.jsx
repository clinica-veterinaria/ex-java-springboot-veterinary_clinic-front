import React from "react";
import './ButtonText.css';


export default function ButtonText({ children, onClick, isSelected, icon, iconPosition = "right" }) {
    const buttonClass = `btn-text ${isSelected ? 'selected' : ''}`;
    return (
        <button className={buttonClass} onClick={onClick}><span className="btn-text__text">{children}</span>
        {iconPosition === "right" && icon && (
            <span className="btn-text__icon btn-text__icon--right">{icon}</span>
        )}
    </button>
    );
}