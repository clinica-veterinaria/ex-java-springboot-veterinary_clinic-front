import React from "react";
import './DeleteModal.css';
import Button from '../buttons/Button';

export default function DeleteModal({ onCancel, onConfirm }) {
    return(
        <div className="delete-modal__overlay" onClick={onCancel}>
        <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal__title">
                <h3>Eliminar</h3>
            </div>
            <div className="delete-modal__text">
                <p>¿Estás seguro de que quieres borrar?</p>
            </div>
            <div className="delete-modal__buttons">
                <Button variant="secondary" onClick={onCancel}>Atrás</Button>
                <Button variant="primary" onClick={onConfirm}>Eliminar</Button>
            </div>
        </div>
        </div>
    );
}