import React from 'react';
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppointmentsPage from './pages/AppointmentsPage';
import HomePage from './pages/HomePage';
import MainLayout from './components/mainLayout/MainLayout';
import PatientPage from './pages/PatientPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import SignInPage from './pages/SignInPage';
import AuthHandler from './pages/AuthHandler';


function App() {


  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="patients" element={<PatientPage />} />
        </Route>
        <Route path="login" element={<AuthHandler isLoginView={true} />} />
        <Route path="signin" element={<AuthHandler isLoginView={false} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App