import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import DeleteModal from './components/deleteModal/DeleteModal';

function App() {

  return (
    <BrowserRouter>
      <SideMenuAdmin></SideMenuAdmin>
      <SearchInput></SearchInput>
      <DeleteModal></DeleteModal>
   
    </BrowserRouter>
  )
}

export default App
