import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./PatientProfile.css";

import PatientWidget from "../components/patientWidget/PatientWidget";
import PatientRecord from "../components/patientRecord/PatientRecord";
import AppointmentWidget from "../components/appointmentsWidget/AppointmentsWidget";
import { getPatients } from "../services/APIPatient";
import EditPatient from "../components/editPatient/EditPatient";
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import ButtonAdd from "../components/buttonAdd/ButtonAdd";
import AddAppt from "../components/addAppt/AddAppt";
import AddTreatment from "../components/addTreatment/AddTreatment";
import AddSelectModal from "../components/addSelectModal/AddSelectModal";

const MOCK_RECORDS = [
  { date: "12 SEP 2025", type: "Consulta", description: "Revisión por aumento de peso" },
  { date: "12 SEP 2025", type: "Consulta", description: "Revisión general" },
  { date: "05 AGO 2025", type: "Vacuna", description: "Vacunación anual (Rabia)" },
  { date: "01 JUL 2025", type: "Análisis", description: "Análisis de sangre rutinario" },
];

const PatientProfile = () => {
  const { id } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null); // null | "appt" | "treatment"

  // Cargar paciente
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatients();
        const patientFound = data.find((p) => String(p.id) === String(id));
        setSelectedPatient(patientFound || null);
      } catch (error) {
        console.error("Error cargando paciente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) return <div className="patient-profile__loading">Cargando...</div>;
  if (!selectedPatient)
    return (
      <div className="patient-profile__not-found">
        <p>Paciente no encontrado ❌</p>
      </div>
    );

  const handlePatientSave = (updatedPatient) => {
    setSelectedPatient(updatedPatient);
    setFeedback({ message: "Paciente actualizado ✅", type: "success" });
    setShowEditModal(false);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setModalType(null); // Resetear modalType al cerrar cualquier modal
  };

  return (
    <div className="patient-profile__content">
      {/* Widget del paciente */}
      <PatientWidget
        patient={selectedPatient}
        onEdit={(patientToEdit) => {
          setSelectedPatient(patientToEdit);
          setShowEditModal(true);
        }}
      />

      {/* Contenedores de historial y citas */}
      <div className="patient-profile__lower-container">
        <PatientRecord title="Historial clínico" records={MOCK_RECORDS} />
        <div className="patient-profile__appointments-container">
          <AppointmentWidget patientId={selectedPatient.id} />
        </div>
      </div>

      {/* Modal de edición del paciente */}
      {showEditModal && (
        <EditPatient
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handlePatientSave}
          patient={selectedPatient}
        />
      )}

      {/* Feedback */}
      {feedback && (
        <FeedbackModal
          message={feedback.message}
          type={feedback.type}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Modal de selección de añadir */}
      {showAddModal && modalType === null && (
        <AddSelectModal
          setModalType={setModalType}
          setShowAddModal={setShowAddModal}
        />
      )}

      {/* Modal añadir cita */}
      {showAddModal && modalType === "appt" && (
        <AddAppt
          isOpen={showAddModal}
          patientId={selectedPatient.id}
          onClose={handleAddModalClose}
          onSave={() => {
            setFeedback({ message: "Cita añadida ✅", type: "success" });
            handleAddModalClose();
          }}
        />
      )}

      {/* Modal añadir tratamiento */}
      {showAddModal && modalType === "treatment" && (
        <AddTreatment
          isOpen={showAddModal}
          patientId={selectedPatient.id}
          onClose={handleAddModalClose}
          onSave={() => {
            setFeedback({ message: "Tratamiento añadido ✅", type: "success" });
            handleAddModalClose();
          }}
        />
      )}

      {/* Botón flotante */}
      <div className="patient-profile__add-button">
        <ButtonAdd onClick={() => {
          setShowAddModal(true);
          setModalType(null); // Asegurar que se muestra AddSelectModal primero
        }} />
      </div>
    </div>
  );
};

export default PatientProfile;