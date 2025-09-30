import React, { useState, useMemo } from 'react';
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

    const events = useMemo(() => {
        if (!appointments || appointments.length === 0) return [];

        return appointments.map(apt => {
            const startDate = new Date(apt.appointmentDatetime || apt.date);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hora

            console.log('Procesando cita:', {
                patient: apt.patientName,
                dateOriginal: apt.appointmentDatetime,
                dateProcessed: startDate,
                dateString: startDate.toDateString()
            }); // DEBUG

            return {
                id: apt.id,
                title: `${apt.patientName} - ${apt.reason || apt.type}`,
                start: startDate,
                end: endDate,
                patient: apt.patientName,
                type: apt.reason || apt.type,
                status: apt.status,
                resource: apt 
            };
        });
    }, [appointments]);

    const handleSelectSlot = (slotInfo) => {
        const selectedDay = slotInfo.start;
        
        const normalizedDate = new Date(selectedDay);
        normalizedDate.setHours(0, 0, 0, 0);
        
        setSelectedDate(normalizedDate);
        
        console.log('Fecha clickeada:', normalizedDate.toDateString()); // DEBUG
        console.log('Timestamp:', normalizedDate.getTime()); // DEBUG

        onDateSelect(normalizedDate);
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
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        
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
                    step={30}
                    timeslots={2}
                    min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
                    max={new Date(0, 0, 0, 20, 0, 0)} // 8:00 PM
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