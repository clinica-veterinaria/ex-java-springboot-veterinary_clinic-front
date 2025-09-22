import React from "react";
import './AppointmentsPage.css';
import AppointmentsWidget from "../components/appointmentsWidget/AppointmentsWidget";
import SideMenuAdmin from '../components/sideMenuAdmin/SideMenuAdmin';
import FilterGroup from '../components/filterGroup/FilterGroup';
import SearchInput from '../components/searchInput/SearchInput';
import { Filter } from "lucide-react";

export default function AppointmentsPage() {
    return(
        <div className="appointments-page">
            <aside>
                <SideMenuAdmin />
            </aside>
            <main className="appointments-page__main">
                <div className="appointments-page__navbar">
                    <FilterGroup />
                    <SearchInput />
                </div>
                <div className="appointments-page__container">
                    <div className="appointments-page__title">
                        <h1>Citas</h1>
                    </div>
                    <div className="appointments-page__content">
                        <AppointmentsWidget />
                    </div>
                </div>
            </main>
        </div>
    );

}