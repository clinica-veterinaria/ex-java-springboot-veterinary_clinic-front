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
import AppointmentDetailsAdmin from "../components/appointmentDetailsAdmin/AppointmentDetailsAdmin";
import { getAppointmentsByDate, updateAppointment, deleteAppointment, updateAppointmentStatus, searchAppointments} from '../services/APIAppointment';
import { useSearch } from '../context/SearchContext';

export default function AppointmentsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { searchTerm, filters } = useSearch();


  const [todayAppointments, setTodayAppointments] = useState([]);
  const [tomorrowAppointments, setTomorrowAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allAppointments, setAllAppointments] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);


  useEffect(() => {
    if (searchTerm || filters.length > 0) {
      fetchAppointmentsWithFilters();
    } else {
      loadAppointments();
    }
  }, [searchTerm, filters]);


  async function fetchAppointmentsWithFilters() {
    setLoading(true);
    setIsSearchActive(true);
    try {
      const searchParams = {
        search: searchTerm || null,
        type: filters.includes("Urgencia") ? "URGENT" :
              filters.includes("Estándar") ? "STANDARD" : null,
        status: null,
        sortBy: filters.includes("Ordenar por fecha") ? "fecha" : null,
      };

      const data = await searchAppointments(searchParams);
      setAllAppointments(data);
      
      // Limpiar las secciones de hoy/mañana cuando se busca
      setTodayAppointments([]);
      setTomorrowAppointments([]);
    } catch (error) {
      console.error("Error al buscar citas:", error);
      setFeedback({ message: "Error al buscar citas ❌", type: "error" });
    } finally {
      setLoading(false);
    }
  }

    useEffect(() => { 
      loadAppointments(); 
    }, []);

  // GET- Appointments by date
  const loadAppointments = async () => {
    try {
        setLoading(true);

        const now = new Date();
        const todayISO = now.toISOString().split('T')[0];

        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrowISO = tomorrowDate.toISOString().split('T')[0];

        const todayData = await getAppointmentsByDate(todayISO);
        const tomorrowData = await getAppointmentsByDate(tomorrowISO);

        setTodayAppointments(todayData);
        setTomorrowAppointments(tomorrowData);

    } catch (error) {
        console.error("Error al cargar las citas:", error);
        setFeedback({ message: "Error al cargar las citas", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  const refreshAppointments = () => {
    loadAppointments();
    setShowAddModal(false); 
  };

  const handleOpenAdd = () => setShowAddModal(true);
  const handleAppointmentClick = (appt) => { setSelectedAppointment(appt); setShowDetailsModal(true); };
  const handleOpenOptionsModal = (appt) => { setSelectedAppointment(appt); setShowOptionsModal(true); };
  const handleOpenEdit = (appt) => { setSelectedAppointment(appt); setShowOptionsModal(false); setShowEditModal(true); };
  const handleDeleteAppointment = (appt) => { setSelectedAppointment(appt); setShowOptionsModal(false); setShowDeleteModal(true); };
  const handleCancelDelete = () => setShowDeleteModal(false);

  // Save appointment - GET in "AddAppt modal"
  const handleSaveAppointment = () => {
    setFeedback({ 
      message: "Cita añadida con éxito ✅", 
      type: "success" 
    });
    refreshAppointments();
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
      await updateAppointmentStatus(appt.id, newStatus, appt);
      setFeedback({ message: `Cita marcada como ${newStatus} ✅`, type: "success" });
      loadAppointments();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      setFeedback({ message: "Error al cambiar el estado", type: "error" });
    }
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


  return (
    <div className="appointments-page">
      <main className="appointments-page__main">
        <div className="appointments-page__container">
          <div className="appointments-page__title">
            <h1>Citas</h1>
          </div>
          <div className="appointments-page__content">
            <AppointmentsWidget appointments={todayAppointments} onMoreOptions={handleOpenOptionsModal} onAppointmentClick={handleAppointmentClick} onStatusChange={handleStatusChange} />

                        <div className="appointments-page__next">
                        <h2 className="appointments-page__subtitle">Próximas citas</h2>
                            {loading ? (
                                <p className="loading-message">Cargando citas...</p>
                            ) : (
                              tomorrowAppointments.map(appt => (
                                    <AppointmentCard
                                        key={appt.id}
                                        appointmentDatetime={appt.appointmentDatetime}   
                                        patientName={appt.patientName}
                                        reason={appt.reason}
                                        type={appt.type}
                                        status={appt.status}
                                        isNextAppointment={false}
                                        onClick={() => handleAppointmentClick(appt)}
                                        appointment={appt}
                                        onOptionsClick={handleOpenOptionsModal}
                                        onStatusChange={(newStatus) => handleStatusChange(appt, newStatus)} 
                                    />
                                ))
                            )}
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

            {/* Edit/Delete modal */}
            {showOptionsModal && (
                <EditDeleteModal onGoToEdit={() => handleOpenEdit(selectedAppointment)} onGoToDelete={() => handleDeleteAppointment(selectedAppointment)} onClose={() => setShowOptionsModal(false)}/>
            )}

      {feedback && (
        <FeedbackModal message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
      )}

            {/* show details modal */}
            {showDetailsModal && selectedAppointment && (
                <AppointmentDetailsAdmin onClose={() => setShowDetailsModal(false)} patientName={selectedAppointment.patientName} appointmentDatetime={selectedAppointment.appointmentDatetime} reason={selectedAppointment.reason} type={selectedAppointment.type} status={selectedAppointment.status} onStatusChange={(newStatus) => handleStatusChange(selectedAppointment, newStatus)}/>
            )}

            {/* edditAppt modal */}
            {showEditModal && (
                <EditAppt isOpen={showEditModal} appointment={selectedAppointment} onClose={() => setShowEditModal(false)} onSave={handleEditAppointment}/>
            )}

            {/* delete modal */}
            {showDeleteModal && (
                <DeleteModal onCancel={handleCancelDelete} onConfirm={handleConfirmDelete}/>
            )}
        </div>
    );

}