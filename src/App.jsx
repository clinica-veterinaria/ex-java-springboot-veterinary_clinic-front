import React, { useState } from 'react';
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
import AppointmentsPage from './pages/AppointmentsPage';
import EditAppt from './components/editAppt/EditAppt';


function App() {
  return (
    <BrowserRouter>
      <AppointmentsPage />
      <EditAppt />
    </BrowserRouter>
  )
}

export default App
