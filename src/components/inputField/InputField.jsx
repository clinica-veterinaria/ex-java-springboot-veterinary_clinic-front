import React from "react";
import './InputField.css';

export default function InputField({ label, placeholder, type= "text", ...props}) {
    return(
        <div className="input-field">
            <label className="input-field__label">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="input-field__input"
                {...props}/>
        </div>    
    );

}