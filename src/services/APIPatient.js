// // services/APIPatient.js
// const API_URL = "http://localhost:8080"; // Backend Spring Boot

// export async function registerPatient(patient) {
//   try {
//     console.log("Enviando datos al backend:", patient); // ✅ Para debugging
    
//     // ✅ Estructurar datos según PatientRequestDTO esperado
//     const patientData = {
//       name: patient.name,
//       gender: patient.gender,
//       breed: patient.breed,
//       age: patient.age, // String según tu DTO
//       ownerName: patient.ownerName,
//       ownerDNI: patient.ownerDNI,
//       phone: patient.phone,
//       email: patient.email
//     };

//     console.log("Datos estructurados para enviar:", patientData);
    
//     const response = await fetch(`${API_URL}/patients`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(patientData),
//     });

//     console.log("Response status:", response.status); // ✅ Para debugging

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Error response:", errorText);
//       throw new Error(`Error ${response.status}: ${errorText}`);
//     }

//     const result = await response.json();
//     console.log("Respuesta del backend:", result); // ✅ Para debugging
//     return result;
    
//   } catch (error) {
//     console.error("Error en registerPatient:", error);
//     throw error; // Re-lanzar para que el modal lo maneje
//   }
// }

// // ✅ Función para probar la conexión con el backend
// export async function testConnection() {
//   try {
//     const response = await fetch(`${API_URL}/patients`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error ${response.status}: ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log("✅ Conexión exitosa con backend:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Error de conexión:", error);
//     throw error;
//   }
// }

// // ✅ Función de prueba con datos dummy
// export async function testPatientCreation() {
//   const testPatient = {
//     name: "Firulais Test",
//     gender: "Macho",
//     breed: "Pastor Alemán",
//     age: "3 años",
//     ownerName: "Juan Pérez Test",
//     ownerDNI: "12345678-A",
//     phone: "666777888",
//     email: "test@example.com"
//   };

//   try {
//     const result = await registerPatient(testPatient);
//     console.log("✅ Test paciente creado:", result);
//     return result;
//   } catch (error) {
//     console.error("❌ Error en test de creación:", error);
//     throw error;
//   }
// }