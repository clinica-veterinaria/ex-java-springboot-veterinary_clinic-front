import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarMonth.css';
import { MoreHorizontal } from 'lucide-react';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

// Traducciones para el calendario
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

    // Convertir appointments a events del calendario usando useMemo
    const events = useMemo(() => {
        if (!appointments || appointments.length === 0) return [];

        return appointments.map(apt => {
            const startDate = new Date(apt.date);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hora

            return {
                id: apt.id,
                title: `${apt.patient} - ${apt.reason || apt.type}`,
                start: startDate,
                end: endDate,
                patient: apt.patient,
                type: apt.reason || apt.type,
                status: apt.status,
                resource: apt // Datos completos para uso posterior
            };
        });
    }, [appointments]);

    // Filtrar eventos del día seleccionado
    const selectedEvents = useMemo(() => {
        return events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === selectedDate.toDateString();
        });
    }, [events, selectedDate]);

    // Manejar selección de día/slot
    const handleSelectSlot = (slotInfo) => {
        const selectedDay = slotInfo.start;
        setSelectedDate(selectedDay);

        // Notificar al componente padre
        onDateSelect(selectedDay);
    };

    // Manejar selección de evento
    const handleSelectEvent = (event) => {
        console.log('Evento seleccionado:', event);

        // Notificar al componente padre con el evento original
        const originalAppointment = appointments.find(apt => apt.id === event.id);
        if (originalAppointment) {
            onEventSelect(originalAppointment);
        }
    };

    // Cambiar vista del calendario
    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    // Navegar entre fechas
    const handleNavigate = (date) => {
        setSelectedDate(date);
        onDateSelect(date);
    };

    // Formatear fecha seleccionada
    const formatSelectedDate = () => {
        return selectedDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Obtener texto del status en español
    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmada',
            'completed': 'Completada',
            'cancelled': 'Cancelada'
        };
        return statusMap[status] || status;
    };


    // Manejar click en botón de opciones de cita
    const handleAppointmentOptions = (appointment) => {
        // Buscar la cita original en appointments
        const originalAppointment = appointments.find(apt => apt.id === appointment.id);
        if (originalAppointment) {
            onEventSelect(originalAppointment);
        }
    };

    

    return (
        <div className="calendar-container-full">
            {/* Calendario principal */}
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