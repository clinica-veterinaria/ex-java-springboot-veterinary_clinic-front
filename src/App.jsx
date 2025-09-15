import React, { useState } from 'react';
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import AddAppointmentModal from './components/addAppt/AddAppt';

function App() {
  const [showModal, setShowModal] = useState(true);


  return (
    <BrowserRouter>
      <SideMenuAdmin></SideMenuAdmin>
      <SearchInput></SearchInput>

<AddAppointmentModal 
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSave={(data) => console.log(data)}

/>    </BrowserRouter>
  )
}

export default App
