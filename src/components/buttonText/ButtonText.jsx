import React from "react";
import './ButtonText.css';

export default function ButtonText({ text, onClick, isSelected }) {
    const buttonClass = `btn-text ${isSelected ? 'selected' : ''}`;
    return (
        <button className={buttonClass} onClick={onClick}>{text}</button>
    );
}