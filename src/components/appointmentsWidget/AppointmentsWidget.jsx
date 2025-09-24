import React, {useState} from "react";
import './AppointmentsWidget.css';
import AppointmentCard from '../appointmentCard/AppointmentCard';
import AppointmentDetailsAdmin from '../appointmentDetailsAdmin/AppointmentDetailsAdmin';

export default function AppointmentsWidget({ appointments = [], onMoreOptions }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <>
      <div className="appointments-widget">
        {/* Header */}
        <h2 className="appointments-widget__title">
          Citas de hoy
        </h2>
        
        {/* Appointments List */}
        <div className="appointments-widget__list">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointmentDatetime={appointment.appointmentDatetime}
              patient={appointment.patient}
              reason={appointment.reason}
              status={appointment.status}
              type={appointment.type}
              onClick={() => handleAppointmentClick(appointment)}
              onOptionsClick={() => onMoreOptions?.(appointment)}
              appointment={appointment}
            />
          ))}
        </div>
      </div>


    </>
  );
};