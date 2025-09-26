import React, { useState, useEffect } from "react";
import './AppointmentsPage.css';
import AppointmentsWidget from "../components/appointmentsWidget/AppointmentsWidget";
import AddAppt from '../components/addAppt/AddAppt';
import ButtonAdd from '../components/buttonAdd/ButtonAdd';
import AppointmentCard from "../components/appointmentCard/AppointmentCard";
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import EditAppt from "../components/editAppt/EditAppt";
import DeleteModal from "../components/deleteModal/DeleteModal";
import EditDeleteModal from "../components/editDeleteModal/EditDeleteModal";
import { getUpcomingAppointments, createAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus } from '../services/APIAppointment';

export default function AppointmentsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const [nextAppointments, setNextAppointments] = useState([]);

  // GET- Upcoming appointments
  useEffect(() => {loadAppointments();}, []);

  const loadAppointments = async () => {
    try {
      const data = await getUpcomingAppointments(3);
      setNextAppointments(data.appointments || data); // depende del backend
    } catch {
      setFeedback({ message: "Error al cargar las próximas citas", type: "error" });
    }
  };
  const handleOpenAdd = () => setShowAddModal(true);

  // POST - Create appointment
  // Guardar cita usando la API real
  const handleSaveAppointment = async (appointmentData) => {
    try {
      await createAppointment(appointmentData);
      setShowAddModal(false);
      setFeedback({ message: "Cita añadida con éxito ✅", type: "success" });
      loadAppointments();
    } catch {
      setFeedback({ message: "Error al crear la cita", type: "error" });
    }
  };

  const handleOpenOptionsModal = (appt) => {
    setSelectedAppointment(appt);
    setShowOptionsModal(true);
  };

  const handleOpenEdit = (appt) => {
    setSelectedAppointment(appt);
    setShowOptionsModal(false);
    setShowEditModal(true);
  };

  // PUT - Edit appointment
  const handleEditAppointment = async (updatedData) => {
    try {
      await updateAppointment(selectedAppointment.id, updatedData);
      setShowEditModal(false);
      setFeedback({ message: "Cita editada con éxito ✏️", type: "success" });
      loadAppointments();
    } catch (error) {
      console.error("Error editando cita:", error);
      setFeedback({ message: "Error al editar la cita", type: "error" });
    }
  };

  // PUT - Update status
  const handleStatusChange = async (appt, newStatus) => {
    try {
      await updateAppointmentStatus(appt.id, newStatus);
      setFeedback({ message: `Cita marcada como ${newStatus} ✅`, type: "success" });
      loadAppointments();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      setFeedback({ message: "Error al cambiar el estado", type: "error" });
    }
  };

  const handleDeleteAppointment = (appt) => {
    setSelectedAppointment(appt);
    setShowOptionsModal(false);
    setShowDeleteModal(true);
  };

  // DELETE - Delete appointment
  const handleConfirmDelete = async () => {
    try {
      await deleteAppointment(selectedAppointment.id);
      setShowDeleteModal(false);
      setFeedback({ message: "Cita eliminada 🗑️", type: "success" });
      loadAppointments();
    } catch (error) {
      console.error("Error eliminando cita:", error);
      setFeedback({ message: "Error al eliminar la cita", type: "error" });
    }
  };

  const handleCancelDelete = () => setShowDeleteModal(false);

    return(
        <div className="appointments-page">
            <main className="appointments-page__main">
                <div className="appointments-page__container">
                    <div className="appointments-page__title">
                        <h1>Citas</h1>
                    </div>
                    <div className="appointments-page__content">
                        <AppointmentsWidget appointments={nextAppointments} onMoreOptions={handleOpenOptionsModal}/>

                        <div className="appointments-page__next">
                            <h2 className="appointments-page__subtitle">Próximas citas</h2>
                                {nextAppointments.map(appt => (
                                <AppointmentCard
                                    key={appt.id}
                                    appointmentDatetime={appt.date}
                                    patient={appt.patient}
                                    reason={appt.reason}
                                    type={appt.type}
                                    status={appt.status}
                                    isNextAppointment={false}
                                    onClick={() => console.log("Ver detalles")}
                                    appointment={appt}
                                    onOptionsClick={handleOpenOptionsModal}
                                    onStatusChange={(newStatus) => handleStatusChange(appt, newStatus)} />
                                ))}
                        </div>

                        <div className="appointments-page__flying-button">
                            <ButtonAdd onClick={handleOpenAdd}/>
                        </div>
                    </div>
                    
                </div>
            </main>
            {showAddModal && (
            <AddAppt isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveAppointment} />
            )}

            {feedback && (
            <FeedbackModal message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)}/>
            )}

            {/* Edit/Delete modal */}
            {showOptionsModal && (
                <EditDeleteModal
                    onGoToEdit={() => handleOpenEdit(selectedAppointment)}
                    onGoToDelete={() => handleDeleteAppointment(selectedAppointment)}
                    onClose={() => setShowOptionsModal(false)}
                />
            )}

            {/* edditAppt modal */}
            {showEditModal && (
                <EditAppt
                    isOpen={showEditModal}
                    appointment={selectedAppointment}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleEditAppointment}
                />
            )}

            {/* delete modal */}
            {showDeleteModal && (
                <DeleteModal
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}

        </div>
    );

}