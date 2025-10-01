import React from 'react';
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppointmentsPage from './pages/AppointmentsPage';
import HomePage from './pages/HomePage';
import MainLayout from './components/mainLayout/MainLayout';
import PatientPage from './pages/PatientPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import SignInPage from './pages/SignInPage';
import HomeUserPage from './pages/HomeUserPage';
import UserLayout from './components/userLayout/UserLayout';
import AuthHandler from './pages/AuthHandler';
import PatientProfile from './pages/PatientProfile';
import { SearchProvider } from './context/SearchContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Routes>
          {/* Ruta raíz redirige según autenticación */}
          <Route path="/" element={<RootRedirect />} />

          {/* ADMIN ROUTES - Protegidas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="patients" element={<PatientPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="patients/:id" element={<PatientProfile />} />
          </Route>

          {/* USER ROUTES - Protegidas */}
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeUserPage />} />
          </Route>

          {/* AUTH - Público */}
          <Route path="/login" element={<AuthHandler isLoginView={true} />} />
          <Route path="/signin" element={<AuthHandler isLoginView={false} />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  )
}

function RootRedirect() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRoleNormalized = user.role?.replace('ROLE_', '') || user.role;
  const redirectPath = userRoleNormalized === 'ADMIN' ? '/admin' : '/user';
  
  console.log('🔍 RootRedirect - Usuario:', user);
  console.log('🔍 RootRedirect - Rol normalizado:', userRoleNormalized);
  console.log('🔍 RootRedirect - Redirigiendo a:', redirectPath);
  
  return <Navigate to={redirectPath} replace />;
}

export default App