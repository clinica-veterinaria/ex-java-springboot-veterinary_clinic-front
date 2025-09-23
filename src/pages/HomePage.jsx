import React from "react";
import './HomePage.css';
import SideMenuAdmin from "../components/sideMenuAdmin/SideMenuAdmin";
import Navbar from "../components/navbar/Navbar";
import CardHome from "../components/cardsHome/CardHome";
import AppointmentCard from "../components/appointmentCard/AppointmentCard";

export default function HomePage(){
    return(
        <div className="home-page">
            <main className="home-page__main">
                <div className="home-page__container">
                    <div className="home-page__content">
                        <div className="home-page__planning">
                            <div className="home-page__week-view">
                                <div className="home-page__title">
                                    <h2>Semana</h2>
                                </div>
                            

                            </div>    
                            <div className="home-page__next-appointments">
                                <div className="home-page__title">
                                    <h2>Próximas citas</h2>
                                </div>
                            
                            </div>
                        </div>
                        <div className="home-page__cards">
                            <CardHome variant="appointments" />
                            <CardHome variant="patients"/>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

{/* calendario vista semana!!!!!! */}