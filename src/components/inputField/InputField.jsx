import React from "react";
import './InputField.css';

export default function InputField({ label, placeholder, type = "text", error, ...props}) {
    return(
        <div className="input-field">
            {label && <label className="input-field__label">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                className={`input-field__input ${error ? "input-error" : ""}`}                
                {...props}
            />
            {error && <span className="input-field__error">{error}</span>}
        </div>    
    );

}