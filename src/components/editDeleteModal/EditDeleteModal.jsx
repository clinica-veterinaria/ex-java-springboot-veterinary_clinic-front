import React from "react";
import './EditDeleteModal.css';

export default function EditDeleteModal({ onGoToEdit, onGoToDelete, onClose }) {
    return(
        <div className="editDelete__overlay" onClick={onClose}>
            <div className="editDelete__container" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <div className="editDelete__actions">
                    <button type="button" className="modal-options__link" onClick={onGoToEdit}>Editar</button>
                    <button type="button" className="modal-options__link" onClick={onGoToDelete}>Eliminar</button>
                </div>
            </div>
        </div>
    );

}