import React, { useState, useEffect } from "react";
import './HomePage.css';
import { Link, useLocation } from "react-router-dom";
import CardHome from "../components/cardsHome/CardHome";
import NextAppointment from "../components/nextAppointment/NextAppointment";
import SmallCalendarWidget from "../components/smallCalendarWidget/SmallCalendarWidget";

export default function HomePage(){
    const [nextAppointments, setNextAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const isSelected = (path) => location.pathname === path;

    // Get next 3 appointments from backend
    const fetchNextAppointments = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/appointments/next?limit=3');
            const data = await response.json();
            
            // filter by date and time
            const futureAppointments = data
                .filter(appointment => {
                    const appointmentDate = new Date(appointment.datetime);
                    return appointmentDate > new Date();
                })
                .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                .slice(0, 3);

            setNextAppointments(futureAppointments);
        } catch (error) {
            console.error('Error fetching next appointments:', error);
            setNextAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNextAppointments();
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
                                <SmallCalendarWidget />
                            </div>    
                            <div className="home-page__next-appointments">
                                <div className="home-page__title">
                                    <h2>Próximas citas</h2>
                                </div>
                                <div className="home-page__appointments-list">
                                    {loading ? (
                                        <div className="home-page__loading">Cargando citas...</div>
                                    ) : nextAppointments.length > 0 ? (
                                        nextAppointments.map((appointment) => (
                                            <NextAppointment
                                            key={appointment.id}
                                            appointmentDatetime={formatDateTime(appointment.datetime)}
                                            patient={appointment.patient_name || appointment.pet_name}
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
                            <Link to="/appointments">
                                <CardHome variant="appointments" isSelected={isSelected("/appointments")}/>
                            </Link>
                            <Link to="/patients">
                                <CardHome variant="patients" isSelected={isSelected("/patients")}/>
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}