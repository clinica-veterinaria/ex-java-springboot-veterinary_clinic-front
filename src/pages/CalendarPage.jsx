import React from "react";
import { useState, useEffect } from 'react';
import './CalendarPage.css';
import MyCalendar from '../components/calendarMonth/CalendarMonth';
import AddAppt from '../components/addAppt/AddAppt';
import ButtonAdd from '../components/buttonAdd/ButtonAdd';
import AppointmentCard from "../components/appointmentCard/AppointmentCard";
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import EditAppt from "../components/editAppt/EditAppt";
import DeleteModal from "../components/deleteModal/DeleteModal";
import EditDeleteModal from "../components/editDeleteModal/EditDeleteModal";
import AppointmentDetailsAdmin from '../components/appointmentDetailsAdmin/AppointmentDetailsAdmin';
import { getAllAppointments, createAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus } from '../services/APIAppointment';

export default function CalendarPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [allAppointments, setAllAppointments] = useState([]); // TODAS las citas
    const [dayAppointments, setDayAppointments] = useState([]); // Citas del día seleccionado
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        loadAllAppointments();
    }, []);

    useEffect(() => {
        filterAppointmentsByDate(selectedDate);
    }, [selectedDate, allAppointments]);

    const loadAllAppointments = async () => {
        try {
            setLoading(true);
            const data = await getAllAppointments();
            console.log('Todas las citas cargadas:', data.length); // DEBUG
            setAllAppointments(data || []);
        } catch (error) {
            console.error("Error cargando citas:", error);
            setFeedback({ message: "Error al cargar las citas", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Filtrar citas por fecha seleccionada
    const filterAppointmentsByDate = (date) => {
        console.log('🔍 Filtrando para fecha:', date.toDateString()); // DEBUG
        
        const filtered = allAppointments.filter(apt => {
            const aptDate = new Date(apt.appointmentDatetime);
            
            const normalizedAptDate = new Date(
                aptDate.getFullYear(),
                aptDate.getMonth(),
                aptDate.getDate()
            );
            
            const normalizedSelectedDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
            
            const match = normalizedAptDate.getTime() === normalizedSelectedDate.getTime();
            
            if (match) {
                console.log('✅ Match encontrado:', apt.patientName, aptDate.toDateString()); // DEBUG
            }
            
            return match;
        });
        setDayAppointments(filtered);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleOpenAdd = () => setShowAddModal(true);
    const handleOpenDetails = (appt) => { setSelectedAppointment(appt); setShowDetailsModal(true); };
    const handleOpenOptionsModal = (appt) => { setSelectedAppointment(appt); setShowOptionsModal(true); };
    const handleOpenEdit = (appt) => { setSelectedAppointment(appt); setShowOptionsModal(false); setShowEditModal(true); };
    const handleDeleteAppointment = (appt) => { setSelectedAppointment(appt); setShowOptionsModal(false); setShowDeleteModal(true); };
    const handleCancelDelete = () => setShowDeleteModal(false);

    // POST - Create appointment
    const handleSaveAppointment = async (appointmentData) => {
        try {
            await createAppointment(appointmentData);
            setShowAddModal(false);
            setFeedback({ message: "Cita añadida con éxito ✅", type: "success" });
            loadAllAppointments(); // Reload all appointments
        } catch (error) {
            console.error("Error creando cita:", error);
            setFeedback({ message: "Error al crear la cita", type: "error" });
        }
    };

    // PUT - Edit appointment
    const handleEditAppointment = async (updatedData) => {
        try {
            await updateAppointment(selectedAppointment.id, updatedData);
            setShowEditModal(false);
            setFeedback({ message: "Cita editada con éxito ✏️", type: "success" });
            loadAllAppointments();// Reload all appointments
        } catch (error) {
            console.error("Error editando cita:", error);
            setFeedback({ message: "Error al editar la cita", type: "error" });
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteAppointment(selectedAppointment.id);
            setShowDeleteModal(false);
            setFeedback({ message: "Cita eliminada 🗑️", type: "success" });
            loadAllAppointments(); // Reload all appointments
        } catch (error) {
            console.error("Error eliminando cita:", error);
            setFeedback({ message: "Error al eliminar la cita", type: "error" });
        }
    };

    const handleStatusChange = async (appointment, newStatus) => {
        try {
            await updateAppointmentStatus(appointment.id, newStatus, appointment);
            setFeedback({ message: "Estado actualizado correctamente", type: "success" });
            loadAllAppointments(); // Reload all appointments
        } catch (error) {
            console.error("Error cambiando estado:", error);
            setFeedback({ message: "Error al cambiar el estado", type: "error" });
        }
    };

    return (
        <div className="calendar-page">
            <main className="calendar-main-content">
                <div className="calendar-content-area">
                    <div className="calendar-header">
                        <h1>Calendario</h1>
                    </div>
                    <div className="appointment-container">
                        {/* Calendario principal - Pasar TODAS las citas */}
                        <MyCalendar
                            appointments={allAppointments}
                            onDateSelect={handleDateSelect}
                        />
                        {/* Appointment list day selected */}
                        <div className="calendar-page__next">
                            <h2 className="calendar-page__subtitle">
                                Citas de {selectedDate.toLocaleDateString('es-ES', {
                                    weekday: 'long', 
                                    day: 'numeric', 
                                    month: 'long'
                                })}
                            </h2>
                            {loading ? (
                                <p className="calendar-page__loading-message">Cargando citas...</p>
                            ) : dayAppointments.length > 0 ? (
                                dayAppointments.map(appt => (
                                    <AppointmentCard
                                        key={appt.id}
                                        appointmentDatetime={appt.appointmentDatetime}
                                        patientName={appt.patientName}
                                        reason={appt.reason}
                                        type={appt.type}
                                        status={appt.status}
                                        isNextAppointment={false}
                                        onClick={() => handleOpenDetails(appt)}
                                        appointment={appt}
                                        onOptionsClick={handleOpenOptionsModal}
                                        onStatusChange={(newStatus) => handleStatusChange(appt, newStatus)}
                                    />
                                ))
                            ) : (
                                <p className="no-appointments">No hay citas programadas para este día</p>
                            )}
                        </div>
                    </div>
                    <div className="appointments-page__flying-button">
                        <ButtonAdd onClick={handleOpenAdd} />
                    </div>
                </div>
            </main>

            {/* Overlays */}
            {showAddModal && (
                <AddAppt
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleSaveAppointment}
                />
            )}

            {feedback && (
                <FeedbackModal
                    message={feedback.message}
                    type={feedback.type}
                    onClose={() => setFeedback(null)}
                />
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
            
            {showDetailsModal && selectedAppointment && (
                <AppointmentDetailsAdmin
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    patient={selectedAppointment.patientName}
                    appointmentDatetime={selectedAppointment.appointmentDatetime}
                    reason={selectedAppointment.reason}
                    type={selectedAppointment.type} 
                    status={selectedAppointment.status}
                    onStatusChange={(newStatus) => handleStatusChange(selectedAppointment, newStatus)}
                />
            )}
        </div>
    );
}