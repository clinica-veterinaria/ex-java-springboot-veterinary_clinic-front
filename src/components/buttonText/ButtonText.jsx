import React from "react";
import './ButtonText.css';

export default function ButtonText({ text, onClick }) {
    return (
        <button className="btn-text" onClick={onClick}>{text}</button>
    );
}