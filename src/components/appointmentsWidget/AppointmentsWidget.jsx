import React from "react";
import './AppointmentsWidget.css';
import AppointmentCard from '../appointmentCard/AppointmentCard';

export default function AppointmentsWidget({ appointments = [], onMoreOptions, onAppointmentClick }) {
  return (
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
            patientName={appointment.patientName}
            reason={appointment.reason}
            status={appointment.status}
            type={appointment.type}
            onClick={() => onAppointmentClick(appointment)} 
            onOptionsClick={() => onMoreOptions?.(appointment)}
            appointment={appointment}
          />
        ))}
      </div>
    </div>
  );
};