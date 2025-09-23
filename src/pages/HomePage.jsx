import React from "react";
import './HomePage.css';
import SideMenuAdmin from "../components/sideMenuAdmin/SideMenuAdmin";
import Navbar from "../components/navbar/Navbar";
import CardHome from "../components/cardsHome/CardHome";

export default function HomePage(){
    return(
        <div className="home-page">
            <aside>
                <SideMenuAdmin />
            </aside>
            <main className="home-page__main">
                <div className="home-page__navbar">
                    <Navbar />
                </div>
                <div className="home-page__container">
                    <div className="home-page__content">
                        <div className="home-page__planning">
                            <div className="home-page__week-view">

                            </div>
                            <div className="home-page__next-appointments">
                                
                            </div>
                        </div>
                        <div className="home-page__cards">
                            <CardHome variant="appointments" />
                            <CardHome variant="pets"/>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

{/* calendario vista semana!!!!!! */}