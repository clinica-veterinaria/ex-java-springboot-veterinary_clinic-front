import React from 'react';
import { Outlet } from 'react-router-dom';
import SideMenuAdmin from '../sideMenuAdmin/SideMenuAdmin';
import Navbar from '../navbar/Navbar';
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="main-layout__container">
            <aside className="menu-admin">
                <SideMenuAdmin />
            </aside>
            <div className="main-layout__main-content">
                <header className="navbar">
                    <Navbar />
                </header>
                <main className="main-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}