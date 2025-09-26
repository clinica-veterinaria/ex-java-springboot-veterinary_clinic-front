import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../navbar/Navbar';
import './UserLayout.css';
import SideMenuProfile from '../sideMenuProfile/SideMenuProfile';

export default function UserLayout() {
    return (
        <div className="main-layout__container">
            <aside className="menu-admin">
                <SideMenuProfile />
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