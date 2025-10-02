import React, { useEffect, useState } from "react";
import "./AppointmentsWidget.css";
import AppointmentCard from "../appointmentCard/AppointmentCard";
import EditDeleteModal from "../editDeleteModal/EditDeleteModal";
import EditAppt from "../editAppt/EditAppt";
import DeleteModal from "../deleteModal/DeleteModal"; // Nuevo componente
import { getAllAppointments, updateAppointmentStatus, deleteAppointment } from "../../services/APIAppointment";

export default function AppointmentsWidget({ onAppointmentClick }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Nuevo estado

  // Cargar todas las citas
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllAppointments();
        setAppointments(data);
      } catch (err) {
        console.error("Error al cargar citas:", err);
        setError("No se pudieron cargar las citas");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Cambiar estado de la cita
  const handleStatusChange = async (appointment, newStatus) => {
    try {
      await updateAppointmentStatus(appointment.id, newStatus, appointment);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointment.id ? { ...appt, status: newStatus } : appt
        )
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setError("No se pudo actualizar el estado de la cita");
    }
  };

  // Abrir modal de opciones
  const handleMoreOptions = (appointment) => {
    console.log("Abriendo EditDeleteModal para:", appointment);
    setSelectedAppointment(appointment);
  };

  // Cerrar modal de opciones
  const handleCloseModal = () => {
    console.log("Cerrando EditDeleteModal");
    setSelectedAppointment(null);
  };

  // Al clicar en "Editar" dentro de EditDeleteModal
  const handleGoToEdit = () => {
    console.log("Ejecutando handleGoToEdit, abriendo EditAppt para:", selectedAppointment);
    setIsEditModalOpen(true);
  };

  // Cerrar modal de edición
  const handleCloseEdit = () => {
    console.log("Cerrando EditAppt");
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
  };

  // Abrir modal de eliminación
  const handleGoToDelete = () => {
    console.log("Ejecutando handleGoToDelete, abriendo DeleteModal para:", selectedAppointment);
    setIsDeleteModalOpen(true);
  };

  // Cerrar modal de eliminación
  const handleCloseDelete = () => {
    console.log("Cerrando DeleteModal");
    setIsDeleteModalOpen(false);
    setSelectedAppointment(null);
  };

  // Eliminar cita
  const handleDelete = async () => {
    try {
      console.log("Eliminando cita:", selectedAppointment);
      await deleteAppointment(selectedAppointment.id);
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== selectedAppointment.id)
      );
      handleCloseDelete();
    } catch (err) {
      console.error("Error al eliminar cita:", err);
      setError("No se pudo eliminar la cita");
    }
  };

  // Actualizar citas después de guardar cambios
  const handleSaveEdit = (updatedData) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === selectedAppointment.id ? { ...appt, ...updatedData } : appt
      )
    );
  };

  if (loading) return <p>Cargando historial de citas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="appointments-widget">
      <h2 className="appointments-widget__title">Citas</h2>

      <div className="appointments-widget__list">
        {appointments.length === 0 ? (
          <p>No hay citas registradas.</p>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointmentDatetime={appointment.appointmentDatetime}
              patientName={appointment.patientName}
              reason={appointment.reason}
              status={appointment.status}
              type={appointment.type}
              onClick={() => onAppointmentClick?.(appointment)}
              onOptionsClick={() => handleMoreOptions(appointment)}
              appointment={appointment}
              onStatusChange={(newStatus) =>
                handleStatusChange(appointment, newStatus)
              }
            />
          ))
        )}
      </div>

      {/* Modal de opciones (Editar / Eliminar) */}
      {selectedAppointment && !isEditModalOpen && !isDeleteModalOpen && (
        <EditDeleteModal
          appointment={selectedAppointment}
          onGoToEdit={handleGoToEdit}
          onGoToDelete={handleGoToDelete}
          onClose={handleCloseModal}
          position="bottom-right"
        />
      )}

      {/* Modal de edición de cita */}
      {isEditModalOpen && selectedAppointment && (
        <>
          {console.log("Intentando renderizar EditAppt para:", selectedAppointment)}
          <EditAppt
            isOpen={isEditModalOpen}
            appointment={selectedAppointment}
            onClose={handleCloseEdit}
            onSave={handleSaveEdit}
          />
        </>
      )}

      {/* Modal de eliminación de cita */}
      {isDeleteModalOpen && selectedAppointment && (
        <>
          {console.log("Intentando renderizar DeleteModal para:", selectedAppointment)}
          <DeleteModal
            appointment={selectedAppointment}
            onConfirm={handleDelete}
            onCancel={handleCloseDelete}
          />
        </>
      )}
    </div>
  );
}