import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import LoginPage from './pages/LoginPage';


function App() {
const handleLogin = (credentials) => {
    console.log('Datos del login:', credentials);
    // Aquí procesarías el login
  };

  const handleGoToRegister = () => {
    console.log('Ir al registro');
    // Aquí navegarías al registro
  };


  return (
    <BrowserRouter>
      <SideMenuAdmin></SideMenuAdmin>
      <SearchInput></SearchInput>
    </BrowserRouter>
  )
}

export default App
