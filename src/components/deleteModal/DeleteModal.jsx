import React from "react";
import './DeleteModal.css';
import Button from '../buttons/Button';

export default function DeleteModal() {
    return(
        <div className="delete-modal">
            <div className="delete-modal__title">
                <h3>Eliminar</h3>
            </div>
            <div className="delete-modal__text">
                <p>¿Estás seguro de que quieres borrar?</p>
            </div>
            <div className="delete-modal__buttons">
                <Button variant="secondary">Atrás</Button>
                <Button variant="primary">Eliminar</Button>
            </div>
        </div>
    );
}