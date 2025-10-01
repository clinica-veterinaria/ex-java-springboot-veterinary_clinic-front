import React, { useState, useEffect } from "react";
import './HomePage.css';
import { useNavigate, useLocation } from "react-router-dom";
import CardHome from "../components/cardsHome/CardHome";
import NextAppointment from "../components/nextAppointment/NextAppointment";
import SmallCalendarWidget from "../components/smallCalendarWidget/SmallCalendarWidget";
import { getUpcomingAppointments, getAllAppointments } from '../services/APIAppointment';

export default function HomePage(){
    const [nextAppointments, setNextAppointments] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const location = useLocation();
    const isSelected = (path) => location.pathname === path;

    // Get next 3 appointments from backend
    const fetchNextAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getUpcomingAppointments(3);
            setNextAppointments(data.appointments || []);
            
        } catch (error) {
            console.error('Error fetching next appointments:', error);
            setError("Error al cargar las citas. Por favor, inténtelo de nuevo.");
            setNextAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNextAppointments();
    }, []);

    const fetchAllAppointments = async () => {
        try {
            const data = await getAllAppointments();
            setAllAppointments(data || []);
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            setAllAppointments([]);
        }
    };

    useEffect(() => {
        fetchNextAppointments();
        fetchAllAppointments();
    }, []);

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day} ${getMonthName(date.getMonth())} ${hours}:${minutes}h`;
    };

    const getMonthName = (monthIndex) => {
        const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
                       'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        return months[monthIndex];
    };

    const handleAppointmentClick = () => {};

    return(
        <div className="home-page">
            <main className="home-page__main">
                <div className="home-page__container">
                    <div className="home-page__content">
                        <div className="home-page__planning">
                            <div className="home-page__week-view">
                                <SmallCalendarWidget appointments={allAppointments}/>
                            </div>    
                            <div className="home-page__next-appointments">
                                <div className="home-page__title">
                                    <h2>Próximas citas</h2>
                                </div>
                                <div className="home-page__appointments-list">
                                    {loading ? (
                                        <div className="home-page__loading">Cargando citas...</div>
                                    ) : error ? (
                                        <div className="home-page__error">{error}</div>
                                    ) : nextAppointments.length > 0 ? (
                                        nextAppointments.map((appointment) => (
                                            <NextAppointment
                                                key={appointment.id}
                                                appointmentDatetime={formatDateTime(appointment.appointmentDatetime)}
                                                patient={appointment.patientName}
                                                reason={appointment.reason}
                                                type={appointment.type}
                                                onClick={() => handleAppointmentClick(appointment)}
                                            />
                                        ))
                                    ) : (
                                        <div className="home-page__no-appointments">
                                            No hay citas programadas
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="home-page__cards">
                                <CardHome variant="appointments" isSelected={isSelected("/appointments")} onClick={() => navigate('/admin/appointments')}/>
                                <CardHome variant="patients" isSelected={isSelected("/patients")} onClick={() => navigate('/admin/patients')}/>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}