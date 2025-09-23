import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarMonth.css'

const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Cita con el veterinario',
    start: new Date(2025, 8, 24, 10, 0),
    end: new Date(2025, 8, 24, 11, 0),
  },
  {
    title: 'Reunión de equipo',
    start: new Date(2025, 8, 25, 14, 0),
    end: new Date(2025, 8, 25, 15, 0),
  },
];

export default function MyCalendar() {
  return (
    <div style={{ height: 490, width: 770 }} className="calendar-style">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
      />
    </div>
  );
}
