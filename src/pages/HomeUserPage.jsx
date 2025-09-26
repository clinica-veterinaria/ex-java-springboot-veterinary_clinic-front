import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { Ellipsis } from "lucide-react";
import ButtonAdd from "../components/buttonAdd/ButtonAdd";
import SideMenuProfile from "../components/sideMenuProfile/SideMenuProfile";
import AddPetModal from "../components/petModal/PetModal";
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import DeleteModal from "../components/deleteModal/DeleteModal";
import { CardPatient } from "../components/cardPatient/CardPatient";
import {
  getPatients,
  registerPatient,
  deletePatient,
  updatePatient,
} from "../services/APIPatient";

export default function HomeUserPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState(new Set());
  const [activeLetter, setActiveLetter] = useState(null);

  // Obtener pacientes del backend
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Guardar paciente (crear o editar)
  const handlePatientSave = async (savedPatient) => {
    if (!savedPatient) return;
    try {
      let updatedList;
      if (patients.some((p) => p.id === savedPatient.id)) {
        // Editar paciente
        await updatePatient(savedPatient.id, savedPatient);
        updatedList = patients.map((p) =>
          p.id === savedPatient.id ? savedPatient : p
        );
        setFeedback({
          message: `${savedPatient.name} actualizado ✅`,
          type: "success",
        });
      } else {
        // Crear paciente
        const newPatient = await registerPatient(savedPatient);
        updatedList = [...patients, newPatient];
        setFeedback({
          message: `${savedPatient.name} añadido ✅`,
          type: "success",
        });
      }
      setPatients(updatedList);
    } catch (error) {
      setFeedback({
        message: "Error al guardar el paciente",
        type: "error",
      });
    }
    setShowAddModal(false);
    setCurrentPatient(null);
  };

  // Abrir modal para agregar paciente
  const handleOpenAdd = () => {
    setCurrentPatient(null);
    setShowAddModal(true);
  };

  // Abrir modal para editar paciente
  const handlePatientClick = (patient) => {
    setCurrentPatient(patient);
    setShowAddModal(true);
  };

  // Selección de pacientes
  const handleSelectionChange = (patientId, isSelected) => {
    const newSelected = new Set(selectedPatients);
    if (isSelected) {
      newSelected.add(patientId);
    } else {
      newSelected.delete(patientId);
    }
    setSelectedPatients(newSelected);
  };

  // Eliminar paciente desde el botón de la card
  const handleDeleteButton = (patient) => {
    setCurrentPatient(patient);
    setShowDeleteModal(true);
  };

  // Eliminar paciente desde CardPatient (si tienes lógica de selección múltiple)
  const handleDeletePatient = (patient) => {
    setCurrentPatient(patient);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await deletePatient(currentPatient.id);
      setPatients((prev) => prev.filter((p) => p.id !== currentPatient.id));
      setFeedback({
        message: `${currentPatient.name} eliminado ✅`,
        type: "success",
      });
    } catch (error) {
      setFeedback({
        message: "Error al eliminar el paciente",
        type: "error",
      });
    }
    setShowDeleteModal(false);
    setCurrentPatient(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentPatient(null);
  };

  // Ordenar y filtrar pacientes por letra
  const sortedPatients = [...patients].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const filteredPatients = activeLetter
    ? sortedPatients.filter(
        (p) => p.name.charAt(0).toUpperCase() === activeLetter
      )
    : sortedPatients;

  // Toggle selección múltiple (si lo necesitas)
  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => !prev);
    setSelectedPatients(new Set());
  };

  return (
    <div className="home-page">
      
      <main className="home-page__main">
        <div className="home-page__container">
          <div className="home-page__content">
            <div className="add-patient">
              <ButtonAdd onClick={handleOpenAdd} />
            </div>
            <div className="patient-grid__cards">
              {loading ? (
                <div className="home-page__loading">Cargando pacientes...</div>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div key={patient.id} className="patient-card-wrapper" style={{ position: "relative" }}>
                    <CardPatient
                      name={patient.name}
                      photo={patient.photo}
                      species={patient.species}
                      onClick={() => handlePatientClick(patient)}
                      onDelete={() => handleDeletePatient(patient)}
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedPatients.has(patient.id)}
                      onSelectionChange={(isSelected) =>
                        handleSelectionChange(patient.id, isSelected)
                      }
                    />
                    <button
                      className="icon-button"
                      onClick={() => handleDeleteButton(patient)}
                      title="Eliminar paciente"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                      }}
                    >
                      <Ellipsis size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="home-page__no-profiles">
                  No hay pacientes creados
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {showAddModal && (
        <AddPetModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setCurrentPatient(null);
          }}
          onSave={handlePatientSave}
          editPatient={currentPatient}
        />
      )}
      {feedback && (
        <FeedbackModal
          message={feedback.message}
          type={feedback.type}
          onClose={() => setFeedback(null)}
        />
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