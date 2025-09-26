import React, { useState, useEffect } from 'react';
import './PatientPage.css';
import { CardPatient } from '../components/cardPatient/CardPatient';
import { registerPatient } from '../services/APIPatient';
import SideMenuAdmin from '../components/sideMenuAdmin/SideMenuAdmin';
import ButtonAdd from '../components/buttonAdd/ButtonAdd';
import AlphabetIndex from '../components/alphabetIndex/AlphabetIndex';
import Navbar from '../components/navbar/Navbar'
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import AddPetModal from '../components/petModal/PetModal';
import { Ellipsis } from 'lucide-react';
import Button from '../components/buttons/Button';
import DeleteModal from '../components/deleteModal/DeleteModal';

const PatientPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeLetter, setActiveLetter] = useState('');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPatients, setSelectedPatients] = useState(new Set());
    const [feedback, setFeedback] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    // Pacientes reales desde backend
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        // Cargar todos los pacientes al montar
        fetch('http://localhost:8080/patients')
            .then(res => res.json())
            .then(data => setPatients(data))
            .catch(() => setFeedback({ message: 'Error al cargar pacientes', type: 'error' }));
    }, []);

    // Calcular letras disponibles
    const availableLetters = [...new Set(patients.map(p => p.name.charAt(0).toUpperCase()))];

    
    const handlePatientClick = (patient) => {
        if (!isSelectionMode) {
            console.log('Ver perfil de:', patient);
        }
    };

    const handleLetterClick = (letter) => {
        setActiveLetter(letter === activeLetter ? '' : letter);
    };

    const handleSelectionChange = (patientId, isSelected) => {
        const newSelected = new Set(selectedPatients);
        if (isSelected) {
            newSelected.add(patientId);
        } else {
            newSelected.delete(patientId);
        }
        setSelectedPatients(newSelected);
    };

  const handleDeleteSelected = () => {
        if (selectedPatients.size === 0) return;
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        const remainingPatients = patients.filter(p => !selectedPatients.has(p.id));
        setPatients(remainingPatients);
        setSelectedPatients(new Set());
        setIsSelectionMode(false);
        setFeedback({
            message: `${selectedPatients.size} paciente${selectedPatients.size > 1 ? 's eliminados' : ' eliminado'} con éxito ✅`,
            type: "success"
        });
        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleCancelSelection = () => {
        setSelectedPatients(new Set());
        setIsSelectionMode(false);
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) {
            setSelectedPatients(new Set());
        }
    };

    const handleOpenAdd = () => {
        console.log("Click detectado en +");
        setShowAddModal(true);
    }



    // Guardar paciente usando la API real
    const handleSaveAppointment = async (newPatientData) => {
        try {
            const saved = await registerPatient(newPatientData);
            setPatients(prev => [...prev, saved]);
            setShowAddModal(false);
            setFeedback({ message: `${saved.name} añadido con éxito ✅`, type: 'success' });
        } catch {
            setFeedback({ message: 'Error al registrar paciente', type: 'error' });
        }
    };

    const sortedPatients = [...patients].sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const filteredPatients = activeLetter
        ? sortedPatients.filter((p) => p.name.charAt(0).toUpperCase() === activeLetter)
        : sortedPatients;

    return (
        <div className="patients-page">

            {/* CONTENIDO PRINCIPAL */}
            <main className="main-content">
                <div className="content-area">

                    {/* HEADER CON TÍTULO Y BOTÓN */}
                    <div className="page-title">
                        <h1 >Pacientes</h1>
                    </div>

                    <div className="content-with-alphabet">
                        <AlphabetIndex
                            activeLetter={activeLetter}
                            onLetterClick={handleLetterClick}
                            availableLetters={availableLetters}
                            className="alphabet-index__pages"
                        />
                        <div className="patients-content">
                            <div className="patient-grid">
                                <div className="patient-grid__container">
                                    <div className="page-actions">
                                        {!isSelectionMode ? (
                                            // Botón de opciones (3 puntos)
                                            <button
                                                className="icon-button"
                                                onClick={toggleSelectionMode}
                                                title="Seleccionar pacientes"
                                            >
                                                <Ellipsis size={20} />
                                            </button>
                                        ) : (
                                            // Barra de selección cuando está activo el modo
                                            <div className="selection-toolbar">
                                                <span className="selection-info">
                                                    Haz clic sobre todos los pacientes que quieras eliminar.
                                                    Recuerda que esta acción no se puede deshacer.
                                                </span>
                                                <div className="selection-actions">
                                                    <Button
                                                        onClick={handleCancelSelection}
                                                        variant='secondary'
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        onClick={handleDeleteSelected}
                                                        disabled={selectedPatients.size === 0}
                                                        variant='primary'
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="patient-grid__cards">
                                        {filteredPatients.map((patient) => (
                                            <CardPatient
                                                key={patient.id}
                                                name={patient.name}
                                                photo={patient.photo}
                                                species={patient.species}
                                                onClick={() => handlePatientClick(patient)}
                                                isSelectionMode={isSelectionMode}
                                                isSelected={selectedPatients.has(patient.id)}
                                                onSelectionChange={(isSelected) =>
                                                    handleSelectionChange(patient.id, isSelected)
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="add-patient">
                        <ButtonAdd onClick={handleOpenAdd} />
                    </div>
                </div>
            </main>

            {showAddModal && (
                <AddPetModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleSaveAppointment}
                />
            )}
            {feedback && (
                <FeedbackModal message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
            )}

            {showDeleteModal && (
                <DeleteModal
                    onCancel={cancelDelete}
                    onConfirm={confirmDelete}
                />
)}

        </div>
    );
}

export default PatientPage;