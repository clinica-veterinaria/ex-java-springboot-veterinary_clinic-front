import React from "react";
import './SignInModal.css';
import Button from '../buttons/Button';

export default function SignInModal() {
    return(
        <div className="signin-modal">
            <div className="signin-modal__buttons">
                <Button variant="secondary">Cancelar</Button>
                <Button variant="primary">Cancelar</Button>
            </div>

        </div>
    );
}