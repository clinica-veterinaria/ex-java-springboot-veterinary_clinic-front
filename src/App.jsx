import React, { useState } from 'react';
import './App.css'
import './components/styles/Variables.css';
import SideMenuAdmin from './components/sideMenuAdmin/SideMenuAdmin';
import { BrowserRouter } from 'react-router-dom';
import SearchInput from './components/searchInput/SearchInput';
import AddPetModal from './components/petModal/PetModal';
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
      <SideMenuAdmin></SideMenuAdmin>
      <SearchInput></SearchInput>
      
      {/* ✅ Panel de pruebas y controles */}
      <div style={{ margin: "20px", padding: "20px", border: "1px solid #ccc" }}>
        <h3>🧪 Panel de Pruebas Backend</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button onClick={handleTestConnection}>
            Probar Conexión
          </button>
          <button onClick={handleTestCreation}>
            Crear Paciente Test
          </button>
          <button onClick={openModal}>
            Añadir Mascota
          </button>
        </div>
        
        {connectionStatus && (
          <div style={{ 
            padding: "10px", 
            backgroundColor: connectionStatus.includes("✅") ? "#d4edda" : "#f8d7da",
            color: connectionStatus.includes("✅") ? "#155724" : "#721c24",
            borderRadius: "4px"
          }}>
            {connectionStatus}
          </div>
        )}
      </div>
      
      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {lastSaved && (
        <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#d4edda", borderRadius: "4px" }}>
          <h3>✅ Último paciente guardado:</h3>
          <pre style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "4px" }}>
            {JSON.stringify(lastSaved, null, 2)}
          </pre>
        </div>
      )}
    </BrowserRouter>
  )
}

export default App