import React, {useState} from "react";
import './AppointmentsWidget.css';
import AppointmentCard from '../appointmentCard/AppointmentCard';
import AppointmentDetailsAdmin from '../appointmentDetailsAdmin/AppointmentDetailsAdmin';

export default function AppointmentsWidget({ appointments = [], onMoreOptions }) {
    const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultAppointments = [
    {
      id: 1,
      appointmentDatetime: '12 SEP 12:00h',
      patient: 'Pepita',
      reason: 'Revisión',
      status: 'pendiente',
      type: 'normal'
    },
    {
      id: 2,
      appointmentDatetime: '12 SEP 14:30h',
      patient: 'Firulais',
      reason: 'Vacunación',
      status: 'pendiente',
      type: 'urgente'
    },
    {
      id: 3,
      appointmentDatetime: '12 SEP 16:00h',
      patient: 'Michi',
      reason: 'Control rutinario',
      status: 'atendido',
      type: 'normal'
    }
  ];

  const appointmentsToShow = appointments.length > 0 ? appointments : defaultAppointments;

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
          {appointmentsToShow.map((appointment) => (
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

      {/* Appointment Details */}
      {isModalOpen && selectedAppointment && (
        <AppointmentDetailsAdmin
          onClose={handleCloseModal}
          patient={selectedAppointment.patient}
          appointmentDatetime={selectedAppointment.appointmentDatetime}
          reason={selectedAppointment.reason}
          icon={selectedAppointment.icon}
        />
      )}
    </>
  );
};