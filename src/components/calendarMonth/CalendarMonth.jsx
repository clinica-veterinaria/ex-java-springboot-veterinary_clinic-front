import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarMonth.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    showMore: total => `+ Ver más (${total})`
};

export default function MyCalendar({
    appointments = [],
    onDateSelect = () => { },
    onEventSelect = () => { }
}) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');

    useEffect(() => {
        console.log("Fecha seleccionada:", selectedDate);
    }, [selectedDate]);

    const events = useMemo(() => {
        if (!appointments || appointments.length === 0) return [];

        return appointments.map(apt => {
            const startDate = moment(apt.appointmentDatetime || apt.date);
            const duration = apt.type === 'urgencia' ? 30 : 20;
            const endDate = moment(startDate).add(duration, 'minutes');

            return {
                id: apt.id,
                title: `${apt.patientName} - ${apt.reason || apt.type}`,
                start: startDate.toDate(),
                end: endDate.toDate(),
                patient: apt.patientName,
                type: apt.reason || apt.type,
                status: apt.status,
                resource: apt 
            };
        });
    }, [appointments]);

    const handleSelectSlot = (slotInfo) => {
        const selectedDay = moment(slotInfo.start).startOf('day').toDate();
        setSelectedDate(selectedDay);
        onDateSelect(selectedDay);
    };

    const handleSelectEvent = (event) => {
        console.log('Evento seleccionado:', event);

        const originalAppointment = appointments.find(apt => apt.id === event.id);
        if (originalAppointment) {
            onEventSelect(originalAppointment);
        }
    };

    // Change calendar view
    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    // Navigate between dates
    const handleNavigate = (date) => {
        const normalizedDate = moment(date).startOf('day').toDate();        
        setSelectedDate(normalizedDate);
        onDateSelect(normalizedDate);
    };

    return (
        <div className="calendar-container-full">
            {/* Main calendar */}
            <div className="calendar-wrapper">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, width: 1000, minWidth: 600 }}
                    className="calendar-style"
                    messages={messages}
                    view={currentView}
                    onView={handleViewChange}
                    onNavigate={handleNavigate}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable={true}
                    popup={true}
                    step={20}
                    timeslots={3}
                    min={new Date(0, 0, 0, 9, 0, 0)} 
                    max={new Date(0, 0, 0, 17, 0, 0)}
                    formats={{
                        dayFormat: 'DD',
                        monthHeaderFormat: 'MMMM YYYY',
                        dayHeaderFormat: 'dddd DD/MM',
                        dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                            localizer.format(start, 'DD MMMM', culture) + ' - ' +
                            localizer.format(end, 'DD MMMM YYYY', culture),
                        timeGutterFormat: 'HH:mm',
                        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                            localizer.format(start, 'HH:mm', culture) + ' - ' +
                            localizer.format(end, 'HH:mm', culture)
                    }}
                    culture="es"
                />
            </div>           
        </div>
    );
}