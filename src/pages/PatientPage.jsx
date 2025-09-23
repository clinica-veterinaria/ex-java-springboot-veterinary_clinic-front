import React, { useState } from 'react';
import './PatientPage.css';
import { CardPatient } from '../components/cardPatient/CardPatient';
import SideMenuAdmin from '../components/sideMenuAdmin/SideMenuAdmin';
import ButtonAdd from '../components/buttonAdd/ButtonAdd';
import AlphabetIndex from '../components/alphabetIndex/AlphabetIndex';
import Navbar from '../components/navbar/Navbar'
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import AddPetModal from '../components/petModal/PetModal';

const PatientPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeLetter, setActiveLetter] = useState('');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPatients, setSelectedPatients] = useState(new Set());
    const [feedback, setFeedback] = useState(null);
    

    // Datos de ejemplo
    const [patients] = useState([
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
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
        { id: 10, name: "Simba", photo: null, species: "Gato" },
    ]);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Handlers
    const handlePatientClick = (patient) => {
        if (!isSelectionMode) {
            console.log('Ver perfil de:', patient);
            // Navegar al perfil del paciente
        }
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
    const handleSaveAppointment = () => {
        setShowAddModal(false);
        setFeedback({ message: "Paciente añadido con éxito ✅", type: "success" });
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

                    <h1 className="page-title">Pacientes</h1>
                    {/* BOTÓN PARA ACTIVAR MODO SELECCIÓN */}
                    <div className="page-text">
                        {!isSelectionMode && (
                            <div style={{ textAlign: 'right', marginBottom: 'var(--space-card)' }}>
                                <button
                                    className="selection-button selection-button--select"
                                    onClick={toggleSelectionMode}
                                >
                                    Seleccionar pacientes
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="content-with-alphabet">
                        <AlphabetIndex
                            className="alphabet-index__pages"
                        />
                        <div className="patients-content">
                            <div className="patient-grid">
                                <div className="patient-grid__container">
                                    <div className="patient-grid__cards">
                                        {patients.map((patient) => (
                                            <CardPatient
                                                key={patient.id}
                                                name={patient.name}
                                                photo={patient.photo}
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
            </main >
            {showAddModal && (
                <AddPetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveAppointment} />
            )}
            {feedback && (
                <FeedbackModal message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
            )}

        </div>


    );
}

export default PatientPage;