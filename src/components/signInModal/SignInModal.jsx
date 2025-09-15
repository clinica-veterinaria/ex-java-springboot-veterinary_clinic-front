import React from "react";
import './SignInModal.css';
import Button from '../buttons/Button';

export default function SignInModal({ children, onCancel, onSave }) {
    return(
        <div className="signin-modal">
            <div className="signin-modal__title">
                <h2>Regístrate</h2>
            </div>
            <div className="signin-modal__content">
                <div className="signin-modal__image-container">

                </div>
            </div>
            <div className="signin-modal__buttons">
                <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button variant="primary "onClick={onSave}>Guardar</Button>
            </div>

        </div>
    );
}