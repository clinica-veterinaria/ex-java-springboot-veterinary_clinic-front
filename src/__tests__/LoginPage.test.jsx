import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { MemoryRouter } from 'react-router-dom';

// Mock de SVG y navegación
jest.mock('../assets/logoPositive.svg', () => 'logo.svg');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage', () => {
  let onLoginMock;

  beforeEach(() => {
    onLoginMock = jest.fn();
    mockNavigate.mockClear();
    render(
      <MemoryRouter>
        <LoginPage onLogin={onLoginMock} />
      </MemoryRouter>
    );
  });

  test('renderiza los inputs y botones correctamente', () => {
    expect(screen.getByPlaceholderText(/Email o DNI/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Regístrate aquí/i })).toBeInTheDocument();
  });

  test('muestra error si los campos están vacíos y se envía el formulario', () => {
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    expect(screen.getByText(/El Email o DNI es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/La contraseña es obligatoria/i)).toBeInTheDocument();
    expect(onLoginMock).not.toHaveBeenCalled();
  });

  test('muestra error si Email/DNI o contraseña no son válidos', () => {
    fireEvent.change(screen.getByPlaceholderText(/Email o DNI/i), { target: { value: 'invalid' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    expect(screen.getByText(/Introduce un Email o DNI válido/i)).toBeInTheDocument();
    expect(screen.getByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    expect(onLoginMock).not.toHaveBeenCalled();
  });

  test('llama a onLogin con datos correctos', () => {
    fireEvent.change(screen.getByPlaceholderText(/Email o DNI/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    expect(onLoginMock).toHaveBeenCalledWith({
      identifier: 'test@example.com',
      password: '123456'
    });
  });

  test('redirige al registro cuando se hace click en registrar', () => {
    fireEvent.click(screen.getByRole('button', { name: /Regístrate aquí/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  test('permite mostrar y ocultar la contraseña', () => {
    const passwordInput = screen.getByPlaceholderText(/Contraseña/i);
    // Busca el botón por clase, ya que no tiene texto
    const toggleButton = passwordInput.parentElement.querySelector('.input-icon--clickable');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});