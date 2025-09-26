import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './SideMenuProfile.css';
import Logo from '../../assets/logoPositive.svg';
import ButtonText from '../buttonText/ButtonText';
import ButtonProfile from '../buttonProfile/ButtonProfile';

export default function SideMenuProfile() {
    const location = useLocation();
    const isSelected = (path) => location.pathname === path;
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch('http://localhost:8080/patients');
                const data = await response.json();
                setProfiles(data);
            } catch {
                setProfiles([]);
            }
        };
        fetchProfiles();
    }, []);

    return (
        <aside className="menu-admin">
            <div className="menu-admin__container">
                <div className="logo__container">
                    <Link to="/home">
                        <img src={Logo} alt="logotype" className="logo" />
                    </Link>
                </div>
                <div className="menu-admin__buttons">
                    {profiles.length > 0 ? (
                        profiles.map(profile => (
                            <Link key={profile.id} to={`/patients/${profile.id}`}>
                                <ButtonText isSelected={isSelected(`/patients/${profile.id}`)}>
                                    {profile.name}
                                </ButtonText>
                            </Link>
                        ))
                    ) : (
                        <ButtonText disabled>No hay perfiles</ButtonText>
                    )}
                </div>
                <div className="menu-admin__profile">
                    <Link to="/profile">
                        <ButtonProfile isSelected={isSelected("/profile")}>Margarita</ButtonProfile>
                    </Link>
                </div>
            </div>
        </aside>
    );
}