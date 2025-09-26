import React from 'react';
import './PatientRecord.css';

/**
 * Componente que muestra el historial clínico del paciente.
 * Está preparado para recibir datos de un backend.
 * * @param {object} props
 * @param {string} props.title - 
 * @param {Array<object> | null} props.records 
 * @param {boolean} [props.loading=false] 
 */
export default function PatientRecord({ title, records, loading = false }) {

    if (loading) {
        return (
            <div className="patient-record-container patient-record-container--loading">
                <h2 className="patient-record__title">{title || "Historial clínico"}</h2>
                <p className="patient-record__loading">Cargando historial...</p>
            </div>
        );
    }

    if (!records || records.length === 0) {
        return (
            <div className="patient-record-container patient-record-container--empty">
                <h2 className="patient-record__title">{title || "Historial clínico"}</h2>
                <p className="patient-record__no-data">No hay registros clínicos.</p>
            </div>
        );
    }

    return (
        <div className="patient-record-container">
            <h2 className="patient-record__title">{title || "Historial clínico"}</h2>

            <div className="patient-record__list">
                {records.map((record, index) => (
                    <div key={index} className="patient-record__item">
                        <p className="patient-record__date-type">
                            <span className="patient-record__date">{record.date}</span>
                            <span className="patient-record__type">{record.type}</span>
                        </p>
                        <div className="patient-record__description-box">
                            {record.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}