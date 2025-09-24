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
import { AppointmentsService } from '../services/apiService'; // <-- NUEVO SERVICE

export default function AppointmentsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const [nextAppointments, setNextAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET- Upcoming appointments
    useEffect(() => { loadAppointments(); }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            // Reemplazamos la función antigua por la del service unificado
            const data = await AppointmentsService.getAll(); // si quieres limit 3, se puede filtrar aquí
            setNextAppointments(data.slice(0, 3)); // limitamos a 3 citas próximas
        } catch (error) {
            console.error("Error al cargar las próximas citas:", error);
            setFeedback({ message: "Error al cargar las próximas citas", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => setShowAddModal(true);

    // POST - Create appointment
    const handleSaveAppointment = async (appointmentData) => {
        try {
            await AppointmentsService.create(appointmentData);
            setShowAddModal(false);
            setFeedback({ message: "Cita añadida con éxito ✅", type: "success" });
            loadAppointments();
        } catch (error) {
            console.error("Error creando cita:", error);
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
            await AppointmentsService.update(selectedAppointment.id, updatedData);
            setShowEditModal(false);
            setFeedback({ message: "Cita editada con éxito ✏️", type: "success" });
            loadAppointments();
        } catch (error) {
            console.error("Error editando cita:", error);
            setFeedback({ message: "Error al editar la cita", type: "error" });
        }
    };

    // DELETE - Delete appointment
    const handleConfirmDelete = async () => {
        try {
            await AppointmentsService.delete(selectedAppointment.id);
            setShowDeleteModal(false);
            setFeedback({ message: "Cita eliminada 🗑️", type: "success" });
            loadAppointments();
        } catch (error) {
            console.error("Error eliminando cita:", error);
            setFeedback({ message: "Error al eliminar la cita", type: "error" });
        }
    };

    const handleStatusChange = async (appt, newStatus) => {
        try {
            await AppointmentsService.update(appt.id, { status: newStatus }); // usamos update con solo status
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

    const handleCancelDelete = () => setShowDeleteModal(false);

    return (
        <div className="appointments-page">
            <main className="appointments-page__main">
                <div className="appointments-page__container">
                    <div className="appointments-page__title">
                        <h1>Citas</h1>
                    </div>
                    <div className="appointments-page__content">
                        <AppointmentsWidget appointments={nextAppointments} onMoreOptions={handleOpenOptionsModal} />

                        <div className="appointments-page__next">
                            <h2 className="appointments-page__subtitle">Próximas citas</h2>
                            {nextAppointments.map(appt => (
                                <AppointmentCard
                                    key={appt.id}
                                    appointmentDatetime={appt.date || appt.appointmentDatetime} // ajusta según tu back
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
                            <ButtonAdd onClick={handleOpenAdd} />
                        </div>
                    </div>

                </div>
            </main>

            {showAddModal && (
                <AddAppt isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveAppointment} />
            )}

            {feedback && (
                <FeedbackModal message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
            )}

            {showOptionsModal && (
                <EditDeleteModal
                    onGoToEdit={() => handleOpenEdit(selectedAppointment)}
                    onGoToDelete={() => handleDeleteAppointment(selectedAppointment)}
                    onClose={() => setShowOptionsModal(false)}
                />
            )}

            {showEditModal && (
                <EditAppt
                    isOpen={showEditModal}
                    appointment={selectedAppointment}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleEditAppointment}
                />
            )}

            {showDeleteModal && (
                <DeleteModal
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}
