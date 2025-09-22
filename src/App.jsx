import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
import AppointmentDetailsAdmin from './components/appointmentDetailsAdmin/AppointmentDetailsAdmin';
import AppointmentCard from './components/appointmentCard/AppointmentCard';

function App() {
  return (
    <BrowserRouter>
    <AppointmentCard 
    appointmentDate="2025-11-09"
    petName="Pepita"
    reason="Revisión"
    />
    </BrowserRouter>
  )
}

export default App
