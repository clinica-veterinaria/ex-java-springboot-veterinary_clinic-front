import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import "./PatientProfile.css";

import PatientWidget from "../components/patientWidget/PatientWidget";
import PatientRecord from "../components/patientRecord/PatientRecord";
import AppointmentWidget from "../components/appointmentsWidget/AppointmentsWidget";
import { getPatients, deletePatient } from "../services/APIPatient";
import { createTreatment, getTreatmentsByPatient } from "../services/APITreatment";
import EditPatient from "../components/editPatient/EditPatient";
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import ButtonAdd from "../components/buttonAdd/ButtonAdd";
import AddAppt from "../components/addAppt/AddAppt";
import AddTreatment from "../components/addTreatment/AddTreatment";
import AddSelectModal from "../components/addSelectModal/AddSelectModal";
import DeleteModal from "../components/deleteModal/DeleteModal";

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const [selectedPatient, setSelectedPatient] = useState(
    location.state?.patient || null // Intenta obtener el paciente del estado de la ruta
  );
  // Solo se necesita cargar si el paciente NO vino en el estado de la ruta
  const [loading, setLoading] = useState(!location.state?.patient); 

  const [treatments, setTreatments] = useState([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (selectedPatient) {
        setLoading(false);
        return; 
    }

    const fetchPatientById = async () => {
      try {
        
        const patientData = await getPatients(id);
        setSelectedPatient(patientData);
      } catch (error) {
        console.error("Error cargando paciente por ID:", error);
        setSelectedPatient(null); 
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientById();
  }, [id, selectedPatient]); // Se ejecuta si el ID cambia o si el paciente se carga/desea actualizar


  // --- LÓGICA DE CARGA DE TRATAMIENTOS ---
  useEffect(() => {
    // Solo carga tratamientos si tenemos un paciente seleccionado
    if (!selectedPatient) {
        setTreatmentsLoading(false);
        return;
    };
      
    const fetchTreatments = async () => {
      setTreatmentsLoading(true);
      try {
        // Usamos el ID del paciente ya cargado
        const data = await getTreatmentsByPatient(selectedPatient.id); 
        const formattedRecords = data.map(t => ({
          date: new Date(t.treatmentDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
          type: t.treatment || "Tratamiento",
          description: t.medication || t.description || ""
        }));
        setTreatments(formattedRecords);
      } catch (error) {
        console.error("Error cargando tratamientos:", error);
        setTreatments([]);
      } finally {
        setTreatmentsLoading(false);
      }
    };
    fetchTreatments();
  }, [selectedPatient]); 

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
    setModalType(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePatient(selectedPatient.id);
      setFeedback({ message: "Paciente eliminado ✅", type: "success" });
      setShowDeleteModal(false);
      // Redirigir a /admin/patients después de eliminar
      navigate("/admin/patients"); 
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      setFeedback({ message: "Error al eliminar ❌", type: "error" });
      setShowDeleteModal(false);
    }
  };

  const handleAddTreatment = async (treatmentData) => {
    try {
      const treatmentToSend = {
        patientId: selectedPatient.id,
        treatment: treatmentData.tratamiento,
        medication: treatmentData.descripcion,
        dosage: treatmentData.frecuencia || null,
        treatmentDate: new Date().toISOString(),
      };

      const newTreatment = await createTreatment(treatmentToSend);

      const formattedRecord = {
        date: new Date(newTreatment.treatmentDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
        type: newTreatment.treatment || "Tratamiento",
        description: newTreatment.medication || newTreatment.description || ""
      };
      setTreatments(prev => [formattedRecord, ...prev]);

      setFeedback({ message: "Tratamiento añadido ✅", type: "success" });
      handleAddModalClose();
    } catch (error) {
      console.error("Error al añadir tratamiento:", error);
      setFeedback({ message: "Error al añadir tratamiento ❌", type: "error" });
    }
  };

  return (
    <div className="patient-profile__content">
      {/* Widget del paciente */}
      <PatientWidget
        patient={selectedPatient} // Usamos el paciente ya cargado
        onEdit={(patientToEdit) => {
          setSelectedPatient(patientToEdit);
          setShowEditModal(true);
        }}
        onDelete={(patientToDelete) => {
          setSelectedPatient(patientToDelete);
          setShowDeleteModal(true);
        }}
      />

      {/* Contenedores de historial y citas */}
      <div className="patient-profile__lower-container">
        <PatientRecord 
          title="Historial clínico" 
          records={treatments} 
          loading={treatmentsLoading} 
        />
        <div className="patient-profile__appointments-container">
          {/* Asegúrate de que AppointmentWidget maneje el ID del paciente */}
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

      {/* Modal de confirmación de borrado */}
      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
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
          onClose={handleAddModalClose}
          onSave={handleAddTreatment}
        />
      )}

      {/* Botón flotante */}
      <div className="patient-profile__add-button">
        <ButtonAdd
          onClick={() => {
            setShowAddModal(true);
            setModalType(null);
          }}
        />
      </div>
    </div>
  );
};

export default PatientProfile;
