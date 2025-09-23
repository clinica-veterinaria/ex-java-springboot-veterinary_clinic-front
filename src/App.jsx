import React, { useState } from 'react';
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import { testConnection, testPatientCreation } from './services/APIPatient';


function App() {
  // ✅ Corregido: usar nombres consistentes
  const [isModalOpen, setIsModalOpen] = useState(true); // Cambiado a false por defecto
  const [lastSaved, setLastSaved] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const handleSave = (patient) => {
    console.log("Paciente guardado en backend ✅:", patient);
    setLastSaved(patient);
    // ✅ Cerrar el modal después de guardar
    setIsModalOpen(false);
  };

  // ✅ Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // ✅ Función para probar conexión
  const handleTestConnection = async () => {
    try {
      setConnectionStatus("Probando conexión...");
      const data = await testConnection();
      setConnectionStatus(`✅ Conectado: ${data.length} pacientes encontrados`);
    } catch (error) {
      setConnectionStatus(`❌ Error: ${error.message}`);
    }
  };

  // ✅ Función para probar creación
  const handleTestCreation = async () => {
    try {
      setConnectionStatus("Creando paciente de prueba...");
      const patient = await testPatientCreation();
      setConnectionStatus(`✅ Paciente creado: ${patient.name}`);
      setLastSaved(patient);
    } catch (error) {
      setConnectionStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <BrowserRouter>
    </BrowserRouter>
  )
}

export default App