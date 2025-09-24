import React from "react";
import { Link, useLocation } from "react-router-dom";
import './SideMenuAdmin.css';
import Logo from '../../assets/logoPositive.svg';
import ButtonText from '../buttonText/ButtonText';
import ButtonProfile from '../buttonProfile/ButtonProfile';

export default function SideMenuAdmin() {
    const location = useLocation();
    const isSelected = (path) => location.pathname === path;

    return(
        <aside className="menu-admin">
            <div className="menu-admin__container">
                <div className="logo__container">
                    <Link to="/home">
                        <img src={Logo} alt="logotype" className="logo"></img>
                    </Link>
                </div>
                <div className="menu-admin__buttons">
                    <Link to="/home">
                        <ButtonText isSelected={isSelected("/home")}>Home</ButtonText>
                    </Link>
                    <Link to="/calendar">
                        <ButtonText isSelected={isSelected("/calendar")}>Calendario</ButtonText>
                    </Link>
                    <Link to="/appointments">
                        <ButtonText isSelected={isSelected("/appointments")}>Citas</ButtonText>
                    </Link>
                    <Link to="/patients">
                        <ButtonText isSelected={isSelected("/patients")}>Pacientes</ButtonText>
                    </Link>
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