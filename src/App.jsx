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
import HomeUserPage from './pages/HomeUserPage';
import UserLayout from './components/userLayout/UserLayout';
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <PrivateRoute role="admin">
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="home"
              element={
                <PrivateRoute role="admin">
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="patients" element={<PatientPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signin" element={<SignInPage />} />
          </Route>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<HomeUserPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <HomePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;