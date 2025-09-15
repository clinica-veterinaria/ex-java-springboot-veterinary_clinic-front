import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import CardHome from './components/cardsHome/CardHome';

function App() {

  return (
    <BrowserRouter>
      <SideMenuAdmin></SideMenuAdmin>
      <SearchInput></SearchInput>
      <CardHome variant="appointments"></CardHome>
   
    </BrowserRouter>
  )
}

export default App
