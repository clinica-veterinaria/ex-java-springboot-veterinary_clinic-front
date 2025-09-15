import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import FilterGroup from './components/filterGroup/FilterGroup';

function App() {

  return (
    <BrowserRouter>
      <SideMenuAdmin></SideMenuAdmin>
      <SearchInput></SearchInput>
      <FilterGroup></FilterGroup>
    </BrowserRouter>
  )
}

export default App
