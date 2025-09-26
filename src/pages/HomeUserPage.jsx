import React, { useState, useEffect } from "react";
import './HomePage.css';
import { Link, useLocation } from "react-router-dom";
import CardHome from "../components/cardsHome/CardHome";
import ButtonAdd from "../components/buttonAdd/ButtonAdd";
import SideMenuProfile from "../components/sideMenuProfile/SideMenuProfile"; // Importa el nuevo menú lateral

export default function HomePage() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const isSelected = (path) => location.pathname === path;

    // Obtener perfiles (pacientes) del backend
    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/patients');
            const data = await response.json();
            setProfiles(data);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    return (
        <div className="home-page">
            <SideMenuProfile /> {/* Usa el menú lateral de perfiles */}
            <main className="home-page__main">
                <div className="home-page__container">
                    <div className="home-page__content">
                        <ButtonAdd />
                        <div className="home-page__cards">
                            {loading ? (
                                <div className="home-page__loading">Cargando perfiles...</div>
                            ) : profiles.length > 0 ? (
                                profiles.map(profile => (
                                    <Link
                                        key={profile.id}
                                        to={`/patients/${profile.id}`}
                                    >
                                        <CardHome
                                            variant="profile"
                                            isSelected={isSelected(`/patients/${profile.id}`)}
                                            name={profile.name}
                                            breed={profile.breed}
                                            age={profile.age}
                                            gender={profile.gender}
                                        />
                                    </Link>
                                ))
                            ) : (
                                <div className="home-page__no-profiles">
                                    No hay perfiles creados
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}