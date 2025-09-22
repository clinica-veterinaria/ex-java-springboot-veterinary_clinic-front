import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import SignInPage from './pages/SignInPage';
import { CardPatient } from './components/cardPatient/CardPatient';
import PatientPage from './pages/PatientPage';


function App() {
  return (
    <BrowserRouter>
     <PatientPage></PatientPage>
    </BrowserRouter>
  )
}

export default App
