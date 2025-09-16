import React from 'react'
import './App.css'
import './components/styles/Variables.css';
import { BrowserRouter } from 'react-router-dom';
import SignInPage from './pages/SignInPage';


function App() {
  return (
    <BrowserRouter>
      <SignInPage></SignInPage>
    </BrowserRouter>
  )
}

export default App
