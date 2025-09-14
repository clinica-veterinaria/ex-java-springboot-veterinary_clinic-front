import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './SideMenuAdmin.css';
import Logo from '../../assets/logoPositive.svg';
import ButtonText from '../buttonText/ButtonText';
import ButtonProfile from '../buttonProfile/ButtonProfile';

export default function SideMenuAdmin() {
    const navigate = useNavigate();
    const location = useLocation();

    // Para navegar y asegurarnos de que el botón está seleccionado
    const handleNavigation = (path) => {
        navigate(path);
    };
  
    const isSelected = (path) => location.pathname === path;

    return(
        <aside className="menu-admin">
            <div className="menu-admin__container">
                <div className="menu-admin__logo">
                <Link to="/home">
                    <img src={Logo} alt="logotype" className="logo"></img>
                </Link>
                </div>
                <div className="menu-admin__buttons">
                    <ButtonText onClick={() => handleNavigation("/home")} isSelected={isSelected("/home")}>Home</ButtonText>
                    <ButtonText onClick={() => handleNavigation("/calendar")} isSelected={isSelected("/calendar")}>Calendario</ButtonText>
                    <ButtonText onClick={() => handleNavigation("/appointments")} isSelected={isSelected("/appointments")}>Citas</ButtonText>
                    <ButtonText onClick={() => handleNavigation("/patients")} isSelected={isSelected("/patients")}>Pacientes</ButtonText>
                </div>
                <div className="menu-admin__profile">
                    <ButtonProfile onClick={() => handleNavigation("/profille")} isSelected={isSelected("/profile")}>Margarita</ButtonProfile>
                </div>
            </div>
        </aside>
    );
}