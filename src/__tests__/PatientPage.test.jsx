import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PatientPage from "../pages/PatientPage";
import { MemoryRouter } from "react-router-dom";

// Mocks de componentes hijos (named export)
jest.mock("../components/cardPatient/CardPatient", () => ({
  CardPatient: (props) => (
    <div
      data-testid="card-patient"
      data-selected={props.isSelected}
      onClick={props.onClick}
    >
      {props.name}
      <button data-testid="select-patient" onClick={() => props.onSelectionChange(!props.isSelected)}>
        Select
      </button>
    </div>
  )
}));
jest.mock("../components/buttonAdd/ButtonAdd", () => (props) => (
  <button data-testid="button-add" onClick={props.onClick}>+</button>
));
jest.mock("../components/alphabetIndex/AlphabetIndex", () => (props) => (
  <div data-testid="alphabet-index">
    {props.availableLetters.map((l) => (
      <button key={l} data-testid={`letter-${l}`} onClick={() => props.onLetterClick(l)}>
        {l}
      </button>
    ))}
  </div>
));
jest.mock("../components/feedbackModal/FeedbackModal", () => (props) => (
  <div data-testid="feedback-modal">{props.message}
    <button data-testid="close-feedback" onClick={props.onClose}>Cerrar</button>
  </div>
));
jest.mock("../components/petModal/PetModal", () => (props) => (
  props.isOpen ? (
    <div data-testid="add-pet-modal">
      <button data-testid="save-patient" onClick={() => props.onSave({ id: 99, name: "NuevoPaciente" })}>Guardar</button>
      <button data-testid="close-add-pet" onClick={props.onClose}>Cerrar</button>
    </div>
  ) : null
));
jest.mock("../components/deleteModal/DeleteModal", () => (props) => (
  <div data-testid="delete-modal">
    <button data-testid="cancel-delete" onClick={props.onCancel}>Cancelar</button>
    <button data-testid="confirm-delete" onClick={props.onConfirm}>Eliminar</button>
  </div>
));
jest.mock("../components/buttons/Button", () => (props) => (
  <button data-testid={`button-${props.variant}`} onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
));
jest.mock("lucide-react", () => ({
  Ellipsis: () => <span data-testid="ellipsis">...</span>
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../context/SearchContext", () => ({
  useSearch: () => ({
    searchTerm: "",
    filters: [],
  }),
}));

jest.mock("../services/APIPatient", () => ({
  getPatients: jest.fn(),
  registerPatient: jest.fn(),
  deletePatient: jest.fn(),
  updatePatient: jest.fn(),
  searchPatients: jest.fn(),
}));

import {
  getPatients,
  deletePatient,
  searchPatients,
} from "../services/APIPatient";

describe("PatientPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPatients.mockResolvedValue([
      { id: 1, name: "Ana", species: "Perro", photo: "" },
      { id: 2, name: "Beto", species: "Gato", photo: "" },
      { id: 3, name: "Carlos", species: "Perro", photo: "" },
    ]);
    searchPatients.mockResolvedValue([
      { id: 1, name: "Ana", species: "Perro", photo: "" },
      { id: 2, name: "Beto", species: "Gato", photo: "" },
    ]);
    deletePatient.mockResolvedValue({});
  });

  test("renderiza título, botón añadir y cards de pacientes", async () => {
    render(<MemoryRouter><PatientPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Pacientes/i })).toBeInTheDocument();
    expect(screen.getByTestId("button-add")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByTestId("card-patient").length).toBeGreaterThan(0));
  });

  test("muestra el índice alfabético con letras disponibles", async () => {
    render(<MemoryRouter><PatientPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByTestId("alphabet-index")).toBeInTheDocument());
    expect(screen.getByTestId("letter-A")).toBeInTheDocument();
    expect(screen.getByTestId("letter-B")).toBeInTheDocument();
    expect(screen.getByTestId("letter-C")).toBeInTheDocument();
  });

  test("filtra pacientes por letra", async () => {
    render(<MemoryRouter><PatientPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByTestId("letter-B")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("letter-B"));
    expect(screen.getAllByTestId("card-patient")).toHaveLength(1);
    expect(screen.getByText("Beto")).toBeInTheDocument();
  });

  test("abre el modal de añadir paciente al hacer click en +", async () => {
    render(<MemoryRouter><PatientPage /></MemoryRouter>);
    fireEvent.click(screen.getByTestId("button-add"));
    expect(await screen.findByTestId("add-pet-modal")).toBeInTheDocument();
  });

  

  test("cierra el feedback modal al hacer click en cerrar", async () => {
    render(<MemoryRouter><PatientPage /></MemoryRouter>);
    fireEvent.click(screen.getByTestId("button-add"));
    fireEvent.click(await screen.findByTestId("save-patient"));
    await waitFor(() => expect(screen.getByTestId("feedback-modal")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("close-feedback"));
    expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument();
  });

  test("activa modo selección y selecciona pacientes", async () => {
    render(<MemoryRouter><PatientPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getAllByTestId("card-patient").length).toBeGreaterThan(0));
    fireEvent.click(screen.getByTestId("ellipsis"));
    fireEvent.click(screen.getAllByTestId("select-patient")[0]);
    fireEvent.click(screen.getAllByTestId("select-patient")[1]);
    expect(screen.getByTestId("button-primary")).not.toBeDisabled();
  });

  
  
  test("navega al detalle de paciente al hacer click en card", async () => {
    render(<MemoryRouter><PatientPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getAllByTestId("card-patient").length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByTestId("card-patient")[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/patients/1", expect.anything());
  });

  test("muestra feedback de error si falla la carga", async () => {
    getPatients.mockRejectedValueOnce(new Error("Error"));
    render(<MemoryRouter><PatientPage /></MemoryRouter>);
    expect(await screen.findByTestId("feedback-modal")).toHaveTextContent(/Error al cargar pacientes/i);
  });

  
});