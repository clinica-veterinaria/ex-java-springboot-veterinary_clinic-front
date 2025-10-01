import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './SideMenuProfile.css';
import Logo from '../../assets/logoPositive.svg';
import ButtonText from '../buttonText/ButtonText';
import ButtonProfile from '../buttonProfile/ButtonProfile';
import SignoutEditModal from "../SignoutEditModal/SignoutEditModal";
import EditProfile from "../editProfile/Editprofile";
import { logoutUser } from '../../services/APILogin';


export default function SideMenuProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const isSelected = (path) => location.pathname === path;
    const [profiles, setProfiles] = useState([]);
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
        console.log("Guardando perfil de usuario:", userData, photo);
        setIsEditProfileOpen(false);
    };

    const handleSignout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Error al cerrar sesión, forzando redirección:", error);
        }
        localStorage.removeItem('authToken');
        navigate('/login', { replace: true });
    };


    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const token = localStorage.getItem('authToken');

                const response = await fetch('http://localhost:8080/patients', {
                    method: 'GET',
                    headers: {

                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    console.error("Authentication failed. Redirecting to login.");
                    setProfiles([]);
                    return;
                }

                const data = await response.json();
                setProfiles(data);
            } catch (error) {
                console.error("Fetch error:", error);
                setProfiles([]);
            }
        };
        fetchProfiles();
    }, []);

    // ⚠️ Simulación de usuario (reemplaza con datos reales de contexto/API)
    const currentUser = {
        name: "User",
        dni: "12345677A",
        email: "user@test.com",
        phone: "666666667",
        photo: null,
    };

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