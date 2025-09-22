import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
import AppointmentDetailsUser from './components/appointmentDetailsUser/AppointmentDetailsUser';

function App() {
  return (
    <BrowserRouter>
      <AppointmentDetailsUser 
      petName="Pepita"
      description="Revisión anual y vacuna"
      appointmentDate="2025-09-11"
      appointmentTime="12:00"
      />
    </BrowserRouter>
  )
}

export default App
