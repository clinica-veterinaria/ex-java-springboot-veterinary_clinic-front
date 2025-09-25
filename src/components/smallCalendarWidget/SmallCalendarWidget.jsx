import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'moment/locale/es';
import moment from 'moment';
import 'moment/locale/es';
import './SmallCalendarWidget.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function SmallCalendarWidget() {
    const myEventsList = [];

    moment.locale('es');
    const localizer = momentLocalizer(moment);

  return (
    <div className="small-calendar-widget">
      <Calendar localizer={localizer}
        events={myEventsList}
        views={['week']}
        defaultView="week"
        toolbar={false}
        min={new Date(2024, 0, 1, 8, 0)}
        max={new Date(2024, 0, 1, 17, 0)}
        step={20}
        timeslots={3}
        showMultiDayTimes={false}
        formats={{timeGutterFormat: 'HH:mm',
        dayFormat: 'ddd DD'}}/>
    </div>
  );
}