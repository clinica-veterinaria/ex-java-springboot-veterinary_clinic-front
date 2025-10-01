import React, {useMemo} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'moment/locale/es';
import moment from 'moment';
import 'moment/locale/es';
import './SmallCalendarWidget.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function SmallCalendarWidget({ appointments = [], onSelectSlot }) {
    moment.locale('es');
    const localizer = momentLocalizer(moment);

    const events = useMemo(() => {
      if (!appointments || appointments.length === 0) return [];

      return appointments.map(apt => {
          const startDate = new Date(apt.appointmentDatetime);
          const endDate = new Date(startDate.getTime() + 20 * 60 * 1000);

          return {
              id: apt.id,
              title: `${apt.patientName}`,
              start: startDate,
              end: endDate,
              resource: apt
          };
      });
  }, [appointments]);

  const handleSelectSlot = (slotInfo) => {
      if (onSelectSlot) {
          const localDate = new Date(
              slotInfo.start.getFullYear(),
              slotInfo.start.getMonth(),
              slotInfo.start.getDate(),
              slotInfo.start.getHours(),
              slotInfo.start.getMinutes()
          );
          onSelectSlot(localDate);
      }
  };

  const getCurrentWeekStart = () => {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
      return new Date(now.setDate(diff));
  };

  return (
    <div className="small-calendar-widget">
            <Calendar 
                localizer={localizer}
                events={events}
                views={['work_week']} 
                defaultView="work_week"
                date={getCurrentWeekStart()} 
                toolbar={false}
                min={new Date(2024, 0, 1, 8, 0)}
                max={new Date(2024, 0, 1, 17, 0)}
                step={20}
                timeslots={3}
                showMultiDayTimes={false}
                formats={{
                    timeGutterFormat: 'HH:mm',
                    dayFormat: 'ddd DD'
                }}
                selectable
                onSelectSlot={handleSelectSlot}
                culture="es"
            />
        </div>
  );
}