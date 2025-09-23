import React, { useState } from 'react';
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import { testConnection, testPatientCreation } from './services/APIPatient';
import PatientPage from './pages/PatientPage';


function App() {

  return (
    <BrowserRouter>
    <PatientPage />
    </BrowserRouter>
  )
}

export default App