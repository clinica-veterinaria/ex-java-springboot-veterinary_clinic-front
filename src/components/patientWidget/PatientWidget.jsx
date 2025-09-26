import React, { useState, useRef, useEffect } from "react";
import "./PatientWidget.css";
import { MoreHorizontal } from "lucide-react";
import EditDeleteModal from "../editDeleteModal/EditDeleteModal";

export default function PatientWidget({ patient, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleToggleMenu = () => setMenuOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleEditClick = () => {
        setMenuOpen(false);
        onEdit?.(patient);
    };


    const handleDeleteClick = () => {
        setMenuOpen(false);
        onDelete?.(patient);
    };


    return (
        <div className="patient-widget">
            <div className="patient-widget__photo-section">
                <img
                    src={patient.photo
                        ? `data:image/png;base64,${patient.photo}`
                        : "/default-patient.jpg"}
                    alt={patient.name}
                    className="patient-widget__photo"
                />
            </div>

            <div className="patient-widget__info-section">
                <div className="patient-widget__header">
                    <h3>{patient.name}</h3>
                    <div className="patient-widget__menu" ref={menuRef}>
                        <MoreHorizontal size={20} onClick={handleToggleMenu} />
                        {menuOpen && (
                            <EditDeleteModal
                                onGoToEdit={handleEditClick}
                                onGoToDelete={handleDeleteClick}
                                onClose={() => setMenuOpen(false)}
                                position="bottom-right"
                            />
                        )}

                    </div>
                </div>

                <div className="patient-widget__data-grid">
                    <div className="patient-widget__column">
                        <p>{patient.species}</p>
                        <p>{patient.breed}</p>
                        <p>{patient.age}</p>
                        <p>{patient.gender}</p>
                    </div>
                    <div className="patient-widget__column">
                        <p>{patient.id}</p>
                        <p>{patient.tutorDni}</p>
                        <p>{patient.tutorName}</p>
                        <p>{patient.tutorPhone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}