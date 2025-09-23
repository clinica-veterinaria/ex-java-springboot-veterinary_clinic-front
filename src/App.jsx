import React from 'react';
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
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