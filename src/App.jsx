import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import SignInPage from './pages/SignInPage';
import { CardPatient } from './components/cardPatient/CardPatient';


function App() {
  return (
    <BrowserRouter>
     
      <CardPatient></CardPatient>
    </BrowserRouter>
  )
}

export default App
