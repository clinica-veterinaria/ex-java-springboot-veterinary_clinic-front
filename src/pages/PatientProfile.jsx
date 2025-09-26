import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PatientProfile.css";
import PatientWidget from "../components/patientWidget/PatientWidget";
import PatientRecord from "../components/patientRecord/PatientRecord";
import AppointmentWidget from "../components/appointmentsWidget/AppointmentsWidget";
import { getPatients } from "../services/APIPatient";
import EditPatient from "../components/editPatient/EditPatient";
import FeedbackModal from "../components/feedbackModal/FeedbackModal";

const MOCK_RECORDS = [
  {
    date: "12 SEP 2025",
    type: "Consulta",
    description: "Revisión por aumento de peso",
  },
  { date: "12 SEP 2025", type: "Consulta", description: "Revisión general" },
  {
    date: "05 AGO 2025",
    type: "Vacuna",
    description: "Vacunación anual (Rabia)",
  },
  {
    date: "01 JUL 2025",
    type: "Análisis",
    description: "Análisis de sangre rutinario",
  },
];

const PatientProfile = () => {
  const { id } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

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

  if (loading)
    return <div className="patient-profile__loading">Cargando...</div>;
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

  return (
    <div className="patient-profile__content">
      <PatientWidget
        patient={selectedPatient}
        onEdit={(patientToEdit) => {
          setSelectedPatient(patientToEdit);
          setShowEditModal(true);
        }}
      />

      <div className="patient-profile__lower-container">
        <PatientRecord title="Historial clínico" records={MOCK_RECORDS} />
        <div className="patient-profile__appointments-container">
          <AppointmentWidget patientId={selectedPatient.id} />
        </div>
      </div>

      {showEditModal && (
        <EditPatient
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handlePatientSave}
          patient={selectedPatient}
        />
      )}

      {feedback && (
        <FeedbackModal
          message={feedback.message}
          type={feedback.type}
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
};

export default PatientProfile;
