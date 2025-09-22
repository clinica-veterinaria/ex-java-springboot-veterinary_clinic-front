import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
import AppointmentDetailsAdmin from './components/appointmentDetailsAdmin/AppointmentDetailsAdmin';

function App() {
  return (
    <BrowserRouter>
      <AppointmentDetailsAdmin 
      petName="Pepita"
      description="Revisión anual y vacuna"
      appointmentDate="2025-11-09"
      appointmentTime="12:00"/>
    </BrowserRouter>
  )
}

export default App
