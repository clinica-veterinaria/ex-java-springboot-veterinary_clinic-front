import React, { useState } from 'react';
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import { testConnection, testPatientCreation } from './services/APIPatient';
import AppointmentsPage from './pages/AppointmentsPage';
import HomePage from './pages/HomePage';


function App() {

  return (
    <BrowserRouter>
    <HomePage />
    {/*<AppointmentsPage />*/}
    </BrowserRouter>
  )
}

export default App