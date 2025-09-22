import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
import AppointmentDetailsAdmin from './components/appointmentDetailsAdmin/AppointmentDetailsAdmin';
import AppointmentCard from './components/appointmentCard/AppointmentCard';
import FeedbackModal from './components/feedbackModal/FeedbackModal';

function App() {
  return (
    <BrowserRouter>
    <FeedbackModal 
    message="Eliminado con éxito"
    type= "success"
    />
    </BrowserRouter>
  )
}

export default App
