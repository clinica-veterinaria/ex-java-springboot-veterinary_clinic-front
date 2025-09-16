import React, { useState } from 'react';
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import AddPetModal from './components/petModal/PetModal';

function App() {

  const [showModal, setShowModal] = useState(true);
  return (
    <BrowserRouter>
      <SideMenuAdmin></SideMenuAdmin>
      <SearchInput></SearchInput>
      <AddPetModal 
  isOpen={true}
  onClose={() => setShowModal(false)}
  onSave={(petData) => {
    console.log('Nueva mascota:', petData);
    // Procesar datos de la mascota
  }}
/>
    </BrowserRouter>
  )
}

export default App
