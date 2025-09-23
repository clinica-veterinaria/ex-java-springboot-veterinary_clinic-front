import React, { useState } from 'react';
import './PatientPage.css';
import { CardPatient } from '../components/cardPatient/CardPatient';
import SideMenuAdmin from '../components/sideMenuAdmin/SideMenuAdmin';
import ButtonAdd from '../components/buttonAdd/ButtonAdd';
import AlphabetIndex from '../components/alphabetIndex/AlphabetIndex';
import Navbar from '../components/navbar/Navbar'
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import AddPetModal from '../components/petModal/PetModal';
import { Ellipsis } from 'lucide-react';
import Button from '../components/buttons/Button';

const PatientPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeLetter, setActiveLetter] = useState('');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPatients, setSelectedPatients] = useState(new Set());
    const [feedback, setFeedback] = useState(null);

    // Datos de ejemplo - corregir IDs duplicados
    const [patients, setPatients] = useState([
        { id: 1, name: "Pepita", photo: null, species: "Perro" },
        { id: 2, name: "Max", photo: null, species: "Perro" },
        { id: 3, name: "Luna", photo: null, species: "Gato" },
        { id: 4, name: "Rocky", photo: null, species: "Perro" },
        { id: 5, name: "Bella", photo: null, species: "Gato" },
        { id: 6, name: "Charlie", photo: null, species: "Perro" },
        { id: 7, name: "Milo", photo: null, species: "Perro" },
        { id: 8, name: "Coco", photo: null, species: "Perro" },
        { id: 9, name: "Nala", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 11, name: "Simba", photo: null, species: "Gato" },
        { id: 12, name: "Simba", photo: null, species: "Gato" },
        { id: 13, name: "Simba", photo: null, species: "Gato" },
        { id: 14, name: "Simba", photo: null, species: "Gato" },
        { id: 15, name: "Simba", photo: null, species: "Gato" },
        { id: 16, name: "Simba", photo: null, species: "Gato" },
        { id: 17, name: "Simba", photo: null, species: "Gato" },
        { id: 18, name: "Simba", photo: null, species: "Gato" },
        { id: 19, name: "Simba", photo: null, species: "Gato" },
        { id: 20, name: "Simba", photo: null, species: "Gato" },
    ]);

    // Calcular letras disponibles
    const availableLetters = [...new Set(patients.map(p => p.name.charAt(0).toUpperCase()))];

    // Handlers
    const handlePatientClick = (patient) => {
        if (!isSelectionMode) {
            console.log('Ver perfil de:', patient);
            // Navegar al perfil del paciente
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

    const handleSelectAll = () => {
        if (selectedPatients.size === patients.length) {
            setSelectedPatients(new Set());
        } else {
            setSelectedPatients(new Set(patients.map(p => p.id)));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedPatients.size === 0) return;

        const selectedNames = patients
            .filter(p => selectedPatients.has(p.id))
            .map(p => p.name)
            .join(', ');

        const confirmed = window.confirm(
            `¿Estás seguro de que quieres eliminar ${selectedPatients.size === 1 ? 'al paciente' : 'a los pacientes'}: ${selectedNames}?`
        );

        if (confirmed) {
            // Eliminar pacientes seleccionados
            const remainingPatients = patients.filter(p => !selectedPatients.has(p.id));
            setPatients(remainingPatients);
            setSelectedPatients(new Set());
            setIsSelectionMode(false);
            setFeedback({
                message: `${selectedPatients.size} paciente${selectedPatients.size > 1 ? 's eliminados' : ' eliminado'} con éxito ✅`,
                type: "success"
            });
        }
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

    const handleSaveAppointment = (newPatientData) => {
        // Los datos ya vienen estructurados desde el modal
        const newPatient = {
            ...newPatientData, // Spread todos los datos del modal
            // Si necesitas generar un ID único cuando la API no lo devuelve:
            id: newPatientData.id || Date.now() + Math.random()
        };

        setPatients(prevPatients => [...prevPatients, newPatient]);
        setShowAddModal(false);
        setFeedback({
            message: `${newPatient.name} añadido con éxito ✅`,
            type: "success"
        });
    };

    return (
        <div className="patients-page">
            <aside className="patients-page__navbar">
                <SideMenuAdmin />
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="main-content">
                <div className="content-area">
                    <div className="page-header">
                        <Navbar />
                    </div>

                    {/* HEADER CON TÍTULO Y BOTÓN */}
                    <div className="page-header-section">
                        <h1 className="page-title">Pacientes</h1>

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
                                        {patients.map((patient) => (
                                            <CardPatient
                                                key={patient.id}
                                                name={patient.name}
                                                photo={patient.photo}
                                                species={patient.species} // Nueva prop
                                                onClick={() => handlePatientClick(patient)}
                                                isSelectionMode={isSelectionMode}
                                                isSelected={selectedPatients.has(patient.id)}
                                                onSelectionChange={(isSelected) => handleSelectionChange(patient.id, isSelected)}
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
        </div>
    );
}

export default PatientPage;