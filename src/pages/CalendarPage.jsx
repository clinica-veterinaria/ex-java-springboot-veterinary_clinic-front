import React, { useState } from 'react';
import './CalendarPage.css'
import MyCalendar from '../components/calendarMonth/CalendarMonth';

export default function CalendarPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const [nextcalendar, setNextcalendar] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET- Upcoming calendar
    useEffect(() => { loadcalendar(); }, []);

    const loadcalendar = async () => {
        try {
            setLoading(true);
            const data = await getUpcomingcalendar(3);
            setNextcalendar(data.calendar || data); // depends backend names
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
            await createAppointment(appointmentData);
            setShowAddModal(false);
            setFeedback({ message: "Cita añadida con éxito ✅", type: "success" });
            loadcalendar();
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
            await updateAppointment(selectedAppointment.id, updatedData);
            setShowEditModal(false);
            setFeedback({ message: "Cita editada con éxito ✏️", type: "success" });
            loadcalendar();
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
            await deleteAppointment(selectedAppointment.id);
            setShowDeleteModal(false);
            setFeedback({ message: "Cita eliminada 🗑️", type: "success" });
            loadcalendar();
        } catch (error) {
            console.error("Error eliminando cita:", error);
            setFeedback({ message: "Error al eliminar la cita", type: "error" });
        }
    };

    const handleCancelDelete = () => setShowDeleteModal(false);


    return(
        <div>
            <main className="calendar-page__main">
                            <div className="calendar-page__container">
                                <div className="calendar-page__title">
                                    <h1>Citas</h1>
                                </div>
                                <div className="calendar-page__content">
                                    <MyCalendar />            
                                    <div className="calendar-page__next">
                                        <h2 className="calendar-page__subtitle">Próximas citas</h2>
                                            {nextcalendar.map(appt => (
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
                                                onOptionsClick={handleOpenOptionsModal} />
                                            ))}
                                    </div>
            
                                    <div className="calendar-page__flying-button">
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