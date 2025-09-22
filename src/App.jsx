import React, { useState } from 'react';
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
import AppointmentsPage from './pages/AppointmentsPage';
import { CardPatient } from './components/cardPatient/CardPatient';
import PatientPage from './pages/PatientPage';
function App() {
  return (
    <BrowserRouter>
      <AppointmentsPage />
    </BrowserRouter>
  )
}

export default App
