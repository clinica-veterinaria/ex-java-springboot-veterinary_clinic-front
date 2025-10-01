import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './SideMenuAdmin.css';
import Logo from '../../assets/logoPositive.svg';
import ButtonText from '../buttonText/ButtonText';
import ButtonProfile from '../buttonProfile/ButtonProfile';
import SignoutEditModal from "../SignoutEditModal/SignoutEditModal";
import EditProfile from "../editProfile/Editprofile";
import { logoutUser } from '../../services/APILogin';



export default function SideMenuAdmin() {
    const location = useLocation();
    const isSelected = (path) => location.pathname === path;
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    const handleGoToEdit = () => {
        setIsModalOpen(false);
        setIsEditProfileOpen(true);
    };

    const handleCloseEditProfile = () => {
        setIsEditProfileOpen(false);
    };

    const handleSaveProfile = (userData, photo) => {
        console.log("Guardando perfil:", userData, photo);
        // Aquí puedes llamar a tu servicio updateUser(userData, photo)
        setIsEditProfileOpen(false);
    };

    const handleSignout = async () => {
        await logoutUser(); 
        navigate('/login', { replace: true });
    };

    // ⚠️ Simulación de usuario (reemplaza con datos reales de contexto/API)
    const currentUser = {
        name: "Margarita",
        dni: "12345678A",
        email: "margarita@example.com",
        phone: "666666666",
        photo: null,
    };

    return (
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
                    <button
                        type="button"
                        className="menu-admin__profile-btn"
                        onClick={handleOpenModal}
                    >
                        <ButtonProfile isSelected={isSelected("/profile")}>
                            {currentUser.name}
                        </ButtonProfile>
                    </button>
                </div>
            </div>

            {/* Modal de opciones */}
            {isModalOpen && (
                <SignoutEditModal
                    onGoToEdit={handleGoToEdit}
                    onGoToSignout={handleSignout}
                    onClose={handleCloseModal}
                />
            )}

            {/* Modal de editar perfil */}
            {isEditProfileOpen && (
                <EditProfile
                    isOpen={isEditProfileOpen}
                    onClose={handleCloseEditProfile}
                    onSave={handleSaveProfile}
                    user={currentUser}
                />
            )}
        </aside>
    );
}
