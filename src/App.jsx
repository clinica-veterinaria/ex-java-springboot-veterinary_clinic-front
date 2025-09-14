import React from 'react'
import ButtonAdd from './components/buttonAdd/ButtonAdd'
import './App.css'
import './components/styles/Variables.css';
import Button from './components/buttons/Button';
import ButtonProfile from './components/buttonProfile/ButtonProfile';

function App() {

  return (
    <>
      <ButtonAdd></ButtonAdd>
      <Button variant="primary">HOLA</Button>
      <ButtonProfile>Margarita</ButtonProfile>
    </>
  )
}

export default App
