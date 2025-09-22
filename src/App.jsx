import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
import AppointmentsWidget from './components/appointmentsWidget/AppointmentsWidget';

function App() {
  return (
    <BrowserRouter>
    <AppointmentsWidget />
    </BrowserRouter>
  )
}

export default App
