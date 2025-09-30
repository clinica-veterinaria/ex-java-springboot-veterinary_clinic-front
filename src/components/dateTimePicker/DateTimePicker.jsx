import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import './DateTimePicker.css';

const DateTimePicker = ({ 
    type = 'date', // 'date' o 'time'
    value, 
    onChange, 
    selectedDate, 
    availableSlots = [],
    appointmentType = 'estandar'
}) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showTimeSlots, setShowTimeSlots] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // schedule
    const WORKING_HOURS = {
        start: 9, // 9:00 AM
        end: 17, // 5:00 PM (last date 4:40 P.M.)
        standardDuration: 20, // mins
        urgencyDuration: 30, // mins
        workingDays: [1, 2, 3, 4, 5] // monday to friday
    };

    // Generate available time slots
    const generateTimeSlots = (date, type) => {
        if (!date) return [];

        const slots = [];
        const { start, end, standardDuration, urgencyDuration } = WORKING_HOURS;
        const duration = type === 'urgencia' ? urgencyDuration : standardDuration;
        
        for (let hour = start; hour < end; hour++) {
            for (let minutes = 0; minutes < 60; minutes += duration) {
                // Make sure the date will finish before closing time
                const endTime = hour * 60 + minutes + duration;
                if (endTime <= end * 60) {
                    const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    slots.push(timeString);
                }
            }
        }
        return slots;
    };

    // Make sure a date is available
    const isDateAvailable = (date) => {
        const dayOfWeek = date.getDay();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return WORKING_HOURS.workingDays.includes(dayOfWeek) && date >= today;
    };

    // Make sure if a slot is occupied
    const isTimeSlotOccupied = (date, time, type) => {
        if (!availableSlots || availableSlots.length === 0) return false;
        
        const dateString = date.toISOString().split('T')[0];
        const duration = type === 'urgencia' ? WORKING_HOURS.urgencyDuration : WORKING_HOURS.standardDuration;
        
        const [hours, minutes] = time.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + duration;
        
        return availableSlots.some(slot => {
            if (slot.date !== dateString) return false;
            
            const [slotHours, slotMinutes] = slot.time.split(':').map(Number);
            const slotStart = slotHours * 60 + slotMinutes;
            const slotEnd = slotStart + (slot.type === 'urgencia' ? WORKING_HOURS.urgencyDuration : WORKING_HOURS.standardDuration);
            
            // Make sure if there is overlap
            return (startMinutes < slotEnd && endMinutes > slotStart);
        });
    };

    // get calendar dates
    const getCalendarDates = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dates = [];

        // past month dates
        const firstDayWeek = firstDay.getDay();
        const startDay = firstDayWeek === 0 ? 6 : firstDayWeek - 1; // Ajustar para que lunes sea 0
        
        for (let i = startDay - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            dates.push({ date, isCurrentMonth: false });
        }

        // current month days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            dates.push({ date, isCurrentMonth: true });
        }

        // complete last week if necessary
        while (dates.length < 42) {
            const lastDate = dates[dates.length - 1].date;
            const nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + 1);
            dates.push({ date: nextDate, isCurrentMonth: false });
        }

        return dates;
    };

    // handle date selection 
    const handleDateSelect = (date) => {
        if (isDateAvailable(date)) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            onChange(`${year}-${month}-${day}`);
            setShowCalendar(false);
        }
    };

    // handle time selection 
    const handleTimeSelect = (time) => {
        onChange(time);
        setShowTimeSlots(false);
    };

    // navigate throw months
    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    };

    const calendarDates = getCalendarDates();
    const timeSlots = type === 'time' && selectedDate ? 
        generateTimeSlots(new Date(selectedDate), appointmentType) : [];
    const today = new Date();

    if (type === 'date') {
        return (
            <div className="datetime-picker">
                <div className="datetime-input" onClick={() => setShowCalendar(!showCalendar)}>
                    <Calendar className="datetime-icon" />
                    <span className="datetime-value">
                        {value ? new Date(value).toLocaleDateString('es-ES') : 'Seleccionar fecha'}
                    </span>
                </div>

                {showCalendar && (
                    <div className="datetime-dropdown">
                        <div className="calendar-header">
                            <button onClick={() => navigateMonth(-1)} className="nav-button">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="month-year">
                                {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={() => navigateMonth(1)} className="nav-button">
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="calendar-weekdays">
                            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                                <div key={day} className="weekday">{day}</div>
                            ))}
                        </div>

                        <div className="calendar-dates">
                            {calendarDates.map(({ date, isCurrentMonth }, index) => {
                                const isToday = date.toDateString() === today.toDateString();
                                const isSelected = value === date.toISOString().split('T')[0];
                                const isAvailable = isDateAvailable(date);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleDateSelect(date)}
                                        disabled={!isAvailable}
                                        className={`
                                            calendar-date
                                            ${!isCurrentMonth ? 'other-month' : ''}
                                            ${isToday ? 'today' : ''}
                                            ${isSelected ? 'selected' : ''}
                                            ${!isAvailable ? 'disabled' : ''}
                                        `}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="calendar-footer">
                            <small>Disponible de lunes a viernes</small>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (type === 'time') {
        return (
            <div className="datetime-picker">
                <div className="datetime-input" onClick={() => setShowTimeSlots(!showTimeSlots)}>
                    <Clock className="datetime-icon" />
                    <span className="datetime-value">
                        {value || 'Seleccionar hora'}
                    </span>
                </div>

                {showTimeSlots && (
                    <div className="datetime-dropdown time-slots">
                        <div className="time-slots-header">
                            <span>Horarios disponibles</span>
                            <small>
                                Duración: {appointmentType === 'urgencia' ? '30' : '20'} minutos
                            </small>
                        </div>
                        
                        {!selectedDate ? (
                            <div className="no-date-selected">
                                Primero selecciona una fecha
                            </div>
                        ) : timeSlots.length === 0 ? (
                            <div className="no-slots">
                                No hay horarios disponibles para esta fecha
                            </div>
                        ) : (
                            <div className="time-slots-grid">
                                {timeSlots.map(time => {
                                    const isOccupied = isTimeSlotOccupied(
                                        new Date(selectedDate), 
                                        time, 
                                        appointmentType
                                    );
                                    
                                    return (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeSelect(time)}
                                            disabled={isOccupied}
                                            className={`
                                                time-slot
                                                ${value === time ? 'selected' : ''}
                                                ${isOccupied ? 'occupied' : ''}
                                            `}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default DateTimePicker;