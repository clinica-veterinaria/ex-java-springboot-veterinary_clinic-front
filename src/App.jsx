import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import ButtonStatus from './components/buttonStatus/ButtonStatus';

function App() {

  return (
    <BrowserRouter>
      <SideMenuAdmin></SideMenuAdmin>
      <SearchInput></SearchInput>
      <ButtonStatus 
  initialStatus="pendiente"
  appointmentDate="2025-09-15" // Fecha pasada
  onStatusChange={(newStatus) => console.log(newStatus)}
/>
    </BrowserRouter>
  )
}

export default App
