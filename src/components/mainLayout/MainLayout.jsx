import React from 'react';
import { Outlet } from 'react-router-dom';
import SideMenuAdmin from '../sideMenuAdmin/SideMenuAdmin';
import Navbar from '../navbar/Navbar';
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="main-layout__container">
            <SideMenuAdmin />
            <div className="main-layout__main-content">
                <Navbar />
                <main className="main-layout__page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}