import React from 'react';
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { testConnection, testPatientCreation } from './services/APIPatient';
import AppointmentsPage from './pages/AppointmentsPage';
import HomePage from './pages/HomePage';
import MainLayout from './components/mainLayout/MainLayout';
import PatientPage from './pages/PatientPage';
import LoginPage from './pages/LoginPage';
import SignInPage from './pages/SignInPage';


function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="patients" element={<PatientPage />} />
          
          <Route path="login" element={<LoginPage />} />
          <Route path="signin" element={<SignInPage />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App