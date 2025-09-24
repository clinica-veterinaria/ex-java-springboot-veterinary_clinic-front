import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './SmallCalendarWidget.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function SmallCalendarWidget() {
    const myEventsList = [];
    const localizer = momentLocalizer(moment);

  return (
    <div className="small-calendar-widget">
      <Calendar localizer={localizer} events={myEventsList} views={['week']} defaultView="week" toolbar={false} />
    </div>
  );
}