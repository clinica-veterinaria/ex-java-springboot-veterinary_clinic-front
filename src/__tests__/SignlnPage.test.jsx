import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInPage from "../pages/SignInPage";
import { MemoryRouter } from "react-router-dom";

// Mock de componentes hijos
jest.mock("../components/signInModal/SignInModal", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="sign-in-modal">
      <button data-testid="save-user" onClick={() => props.onSave({ username: "test", password: "1234" })}>Registrar</button>
      <button data-testid="cancel-user" onClick={props.onCancel}>Cancelar</button>
      {props.isLoading && <span data-testid="loading">Cargando...</span>}
      {props.error && <span data-testid="error">{props.error}</span>}
    </div>
  ),
}));
jest.mock("../assets/logoPositive.svg", () => "logo-mock.svg");
jest.mock("lucide-react", () => ({
  PawPrint: (props) => <span data-testid="paw-print" {...props}>🐾</span>
}));

// Mock de servicio
const mockRegisterUser = jest.fn();
jest.mock("../services/APIRegister", () => ({
  registerUser: (...args) => mockRegisterUser(...args),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignInPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza logo, huellas y el modal", () => {
    render(<MemoryRouter><SignInPage /></MemoryRouter>);
    expect(screen.getByAltText(/Oliwa Logo/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("paw-print").length).toBe(200);
    expect(screen.getByTestId("sign-in-modal")).toBeInTheDocument();
  });

  test("muestra loading cuando se registra", async () => {
    mockRegisterUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<MemoryRouter><SignInPage /></MemoryRouter>);
    fireEvent.click(screen.getByTestId("save-user"));
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    await waitFor(() => expect(mockRegisterUser).toHaveBeenCalled());
  });

  test("redirige al home tras registro exitoso", async () => {
    mockRegisterUser.mockResolvedValue({});
    render(<MemoryRouter><SignInPage /></MemoryRouter>);
    fireEvent.click(screen.getByTestId("save-user"));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/home"));
  });

  test("muestra error si el registro falla", async () => {
    mockRegisterUser.mockRejectedValueOnce(new Error("Usuario ya existe"));
    render(<MemoryRouter><SignInPage /></MemoryRouter>);
    fireEvent.click(screen.getByTestId("save-user"));
    expect(await screen.findByTestId("error")).toHaveTextContent(/Usuario ya existe/i);
  });

  test("no hace nada al cancelar", () => {
    render(<MemoryRouter><SignInPage /></MemoryRouter>);
    fireEvent.click(screen.getByTestId("cancel-user"));
    // No hay efecto esperado, solo que no explote
    expect(screen.getByTestId("sign-in-modal")).toBeInTheDocument();
  });
});