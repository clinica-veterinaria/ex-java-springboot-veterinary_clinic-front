import React from "react";
import './SignoutEditModal.css';


export default function SignoutEditModal({ onGoToEdit, onGoToSignout, onClose }) {
    return (
        <div className="signoutEdit__overlay" onClick={onClose}>
            <div 
                className="signoutEdit__container" 
                role="dialog" 
                aria-modal="true" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="signoutEdit__actions">
                    <button 
                        type="button" 
                        className="signoutEdit__link" 
                        onClick={onGoToEdit}
                    >
                        Editar perfil
                    </button>
                    <button 
                        type="button" 
                        className="signoutEdit__link" 
                        onClick={onGoToSignout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
