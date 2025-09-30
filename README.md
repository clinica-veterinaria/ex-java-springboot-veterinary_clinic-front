# Oliwa Frontend 🐶🐱
![Home Page preview](src/assets/homepage.png)

Aplicación frontend del sistema de gestión de pacientes de la clínica veterinaria **Oliwa**.  
Este módulo permite a administradores y clientes interactuar con la aplicación: gestionar pacientes, programar citas y consultar información de manera sencilla.

## User flows
### Admin flow
```mermaid
flowchart TD
    %% Login & Registro
    A[Login] --> B[Registro]
    B[Registro] --> A[Login]

    A --> C[Home]
    B --> C[Home]

    %% Home a secciones
    C --> D[Calendario]
    C --> E[Citas]
    C --> F[Pacientes]

    %% Citas
    E --> E1[Ver citas hoy/mañana]
    E --> E2[Crear cita]
    E --> E3[Editar cita]
    E --> E4[Eliminar cita]

    %% Calendario
    D --> D1[Seleccionar fecha]
    D --> D2[Ver citas del día]
    D --> D3[Crear cita]
    D --> D4[Editar cita]
    D --> D5[Eliminar cita]

    %% Pacientes
    F --> F1[Listar pacientes]
    F --> F2[Añadir paciente]
    F --> F3[Eliminar paciente]
    F --> F4[Acceder a ficha paciente]

    %% Ficha paciente
    F4 --> F5[Editar paciente]
    F4 --> F6[Ver detalles de paciente]

    %% Acceso desde cita a ficha paciente
    E3 --> F4
    E1 --> F4
    D2 --> F4
```

### User flow
```mermaid
flowchart TD
    %% Login & Registro
    A[Login] --> B[Registro]
    B[Registro] --> A[Login]
    A --> C[Home Usuario]
    B --> C[Home Usuario]

    %% Home Usuario
    C --> C1[Ver mascotas]
    C --> C2[Añadir mascota]
    C --> C3[Eliminar mascota]
    C --> C4[Switch entre mascotas]

    %% Ficha de mascota
    C1 --> D[Ficha mascota]
    C4 --> D

    D --> D1[Editar mascota]
    D --> D2[Eliminar mascota]
    D --> D3[Añadir cita]
    D --> D4[Editar cita]
    D --> D5[Eliminar cita]
```

## 🛠️ Tecnologías

- React
- CSS Modules
- Fetch API para consumir el backend
- React Router para navegación

## 📦 Requisitos previos

```
- Node.js >= 22.15
- npm >= 10.9.2
- Acceso al backend del proyecto (repositorio [aquí](https://github.com/clinica-veterinaria/ex-java-springboot-veterinary_clinic-back))
```

## 🚀 Instalación y ejecución

1. Clonar el repositorio:
   ```
   git clone https://github.com/clinica-veterinaria/ex-java-springboot-veterinary_clinic-front.git
    ```

2. Entrar en la carpeta del clone

3. Instalar dependencias:
    ```
    npm install
    ````

4. Levantar el servidor
    ```
    npm run dev
    ```

5. Abrir en el navegador
    ```
    http://localhost:5173
    ```


## 📋 Funcionalidades principales

- Gestión de pacientes:
  - Listar, añadir, modificar y eliminar (solo admin).
  - Visualizar datos de un paciente desde su número de identificación o DNI del tutor.
  - Adjuntar imagen de perfil del paciente.

- Gestión de citas:
  - Listar, añadir, modificar y eliminar.
  - Restricciones:
    - Máximo 10 citas por día.
    - Cambio automático a estado *pasada* si no se atiende.
    - Eliminación automática de citas pasadas cada 3 meses.
  - Notificación por correo al programar, modificar o eliminar la cita.

## 🧪 Cobertura de tests
<img width="auto" height="400" alt="test coverage" src="https://github.com/user-attachments/assets/05ce9b25-88c0-4e96-97c9-f43b7f698c7a" />

