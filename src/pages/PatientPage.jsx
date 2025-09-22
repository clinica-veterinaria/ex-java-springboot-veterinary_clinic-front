import React, { useState } from 'react';
import './PatientPage.css';
import { CardPatient } from '../components/cardPatient/CardPatient';
import SideMenuAdmin from '../components/sideMenuAdmin/SideMenuAdmin';
import FilterGroup from '../components/filterGroup/FilterGroup';
import ButtonAdd from '../components/buttonAdd/ButtonAdd';

const PatientPage = () => {
  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState(new Set());

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
    { id: 10, name: "Simba", photo: null, species: "Gato" }
  ]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Handlers
  const handlePatientClick = (patient) => {
    if (!isSelectionMode) {
      console.log('Ver perfil de:', patient);
      // Navegar al perfil del paciente
    }
  };

  const handleAddPatient = () => {
    console.log('Añadir nuevo paciente');
    // Navegar a crear paciente
  };

  const handleLetterClick = (letter) => {
    setActiveLetter(letter === activeLetter ? '' : letter);
    // Scroll to patients starting with this letter
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
      console.log('Eliminando pacientes:', Array.from(selectedPatients));
      setSelectedPatients(new Set());
      setIsSelectionMode(false);
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

  return (
    <div className="patients-page">
      <SideMenuAdmin />

      {/* ALPHABET INDEX FIJO */}
      <div className="alphabet-index">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={`alphabet-letter ${activeLetter === letter ? 'alphabet-letter--active' : ''}`}
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        <div className="content-area">
          {/* HEADER CON FILTROS Y BÚSQUEDA */}
          <header className="page-header">
            <div className="page-header__filters">
              <FilterGroup />
              
              <div className="search-container">
                <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar pacientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </header>


          {/* BOTÓN PARA ACTIVAR MODO SELECCIÓN */}
        <div className="page-text">

         <h2 className="page-title">Pacientes</h2>
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
          {/* GRID DE PACIENTES CENTRADO */}
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
      </div>

      {/* BOTÓN FLOTANTE PARA AÑADIR */}
      <div className="add-patient">
      <ButtonAdd  className="add-patient"/>
      </div>
    </div>
  );
};

export default PatientPage;