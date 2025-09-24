import { useState, useEffect } from 'react';
import './CalendarPage.css'
import MyCalendar from '../components/calendarMonth/CalendarMonth';
import SideMenuAdmin from '../components/sideMenuAdmin/SideMenuAdmin';
import Navbar from '../components/navbar/Navbar';
import AddAppt from '../components/addAppt/AddAppt';
import ButtonAdd from '../components/buttonAdd/ButtonAdd';
import AppointmentCard from "../components/appointmentCard/AppointmentCard";
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import EditAppt from "../components/editAppt/EditAppt";
import DeleteModal from "../components/deleteModal/DeleteModal";
import EditDeleteModal from "../components/editDeleteModal/EditDeleteModal";
import { getUpcomingAppointments, createAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus } from '../services/APIAppointment';

export default function CalendarPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [feedback, setFeedback] = useState(null);
    // const [nextAppointments, setNextAppointments] = useState([]);
    const [loading, setLoading] = useState(true);


    const [nextAppointments, setNextAppointments] = useState([
    {
      id: 1,
      date: '2025-09-24T10:00:00',
      patient: 'Pepita',
      reason: 'Revisión',
      status: 'pending',
    },
    {
      id: 2,
      date: '2025-09-25T14:30:00',
      patient: 'Max',
      reason: 'Vacunación',
      status: 'confirmed',
    },
    {
      id: 3,
      date: '2025-09-26T16:00:00',
      patient: 'Luna',
      reason: 'Consulta',
      status: 'pending',
    },
  ]);
    // GET - Upcoming appointments
    useEffect(() => { 
        loadAppointments(); 
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            // Descomenta cuando tengas el backend funcionando
            // const data = await getUpcomingAppointments(10);
            // setNextAppointments(data.appointments || data);
            
            // Datos temporales para evitar errores
            
        } catch (error) {
            console.error("Error al cargar las próximas citas:", error);
            setFeedback({ message: "Error al cargar las próximas citas", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Filtrar citas del día seleccionado
    const getAppointmentsForDate = (date) => {
        return nextAppointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate.toDateString() === date.toDateString();
        });
    };

    const handleOpenAdd = () => setShowAddModal(true);

    // POST - Create appointment
    const handleSaveAppointment = async (appointmentData) => {
        try {
            // Descomenta cuando tengas el backend
            // await createAppointment(appointmentData);
            
            // Temporal - simular creación
            const newAppointment = {
                id: Date.now(),
                date: appointmentData.date,
                patient: appointmentData.patient,
                reason: appointmentData.reason,
                type: appointmentData.type,
                status: 'pending'
            };
            setNextAppointments(prev => [...prev, newAppointment]);
            
            setShowAddModal(false);
            setFeedback({ message: "Cita añadida con éxito ✅", type: "success" });
            // loadAppointments(); // Descomenta cuando uses el backend
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
            // Descomenta cuando tengas el backend
            // await updateAppointment(selectedAppointment.id, updatedData);
            
            // Temporal - simular edición
            setNextAppointments(prev => 
                prev.map(apt => 
                    apt.id === selectedAppointment.id 
                        ? { ...apt, ...updatedData }
                        : apt
                )
            );
            
            setShowEditModal(false);
            setFeedback({ message: "Cita editada con éxito ✏️", type: "success" });
            // loadAppointments(); // Descomenta cuando uses el backend
        } catch (error) {
            console.error("Error editando cita:", error);
            setFeedback({ message: "Error al editar la cita", type: "error" });
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
            // Descomenta cuando tengas el backend
            // await deleteAppointment(selectedAppointment.id);
            
            // Temporal - simular eliminación
            setNextAppointments(prev => 
                prev.filter(apt => apt.id !== selectedAppointment.id)
            );
            
            setShowDeleteModal(false);
            setFeedback({ message: "Cita eliminada 🗑️", type: "success" });
            // loadAppointments(); // Descomenta cuando uses el backend
        } catch (error) {
            console.error("Error eliminando cita:", error);
            setFeedback({ message: "Error al eliminar la cita", type: "error" });
        }
    };

    const handleCancelDelete = () => setShowDeleteModal(false);

    // Cambio de status de cita
    const handleStatusChange = async (appointment, newStatus) => {
        try {
            // Descomenta cuando tengas el backend
            // await updateAppointmentStatus(appointment.id, newStatus);
            
            // Temporal - simular cambio de status
            setNextAppointments(prev => 
                prev.map(apt => 
                    apt.id === appointment.id 
                        ? { ...apt, status: newStatus }
                        : apt
                )
            );
            
            setFeedback({ message: "Estado actualizado correctamente", type: "success" });
        } catch (error) {
            console.error("Error cambiando estado:", error);
            setFeedback({ message: "Error al cambiar el estado", type: "error" });
        }
    };

    // Handler para cuando se selecciona una fecha en el calendario
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    // Handler para cuando se selecciona un evento en el calendario
    const handleEventSelect = (event) => {
        const appointment = nextAppointments.find(apt => apt.id === event.id);
        if (appointment) {
            setSelectedAppointment(appointment);
            // Opcional: abrir modal de opciones automáticamente
            // setShowOptionsModal(true);
        }
    };

    return (
        <div className="calendar-page">
            <main className="calendar-main-content">

                <div className="calendar-content-area">
                    <div className="calendar-header">
                        <h1 className="calendar-title">Calendario</h1>
                    </div>
                    <div className="appointment-container">
                    {/* Calendario principal */}
                    <MyCalendar 
                        appointments={nextAppointments}
                        onDateSelect={handleDateSelect}
                        onEventSelect={handleEventSelect}
                    />

                    
                    {/* Lista de citas del día seleccionado */}
                    <div className="calendar-page__next">
                        <h2 className="calendar-page__subtitle">
                            Citas de {selectedDate.toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                            })}
                        </h2>
                        
                        {loading ? (
                            <p>Cargando citas...</p>
                        ) : getAppointmentsForDate(selectedDate).length > 0 ? (
                            getAppointmentsForDate(selectedDate).map(appt => (
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

            {/* Modales */}
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

            {/* Edit/Delete modal */}
            {showOptionsModal && (
                <EditDeleteModal
                    onGoToEdit={() => handleOpenEdit(selectedAppointment)}
                    onGoToDelete={() => handleDeleteAppointment(selectedAppointment)}
                    onClose={() => setShowOptionsModal(false)}
                />
            )}

            {/* Edit appointment modal */}
            {showEditModal && (
                <EditAppt
                    isOpen={showEditModal}
                    appointment={selectedAppointment}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleEditAppointment}
                />
            )}

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <DeleteModal
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}