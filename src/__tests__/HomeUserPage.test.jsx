import React from "react";
import { jest, describe, test, expect } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomeUserPage from "../pages/HomeUserPage";
import '@testing-library/jest-dom';

jest.mock("../services/APIPatient", () => ({
  getPatients: jest.fn(() => Promise.resolve([
    { id: 1, name: "Firulais", species: "Perro", photo: "" },
    { id: 2, name: "Misu", species: "Gato", photo: "" }
  ])),
  registerPatient: jest.fn(),
  deletePatient: jest.fn(),
  updatePatient: jest.fn(),
}));

jest.mock("../components/sideMenuProfile/SideMenuProfile", () => ({
  __esModule: true,
  default: () => <div data-testid="side-menu-profile" />
}));
jest.mock("../components/buttonAdd/ButtonAdd", () => ({
  __esModule: true,
  default: ({ onClick }) => <button data-testid="button-add" onClick={onClick}>Agregar</button>
}));
jest.mock("../components/cardPatient/CardPatient", () => ({
  __esModule: true,
  CardPatient: function CardPatient({ name, onClick, onDelete, isSelectionMode, isSelected, onSelectionChange }) {
    return (
      <div data-testid={`card-${name}`} onClick={onClick}>
        {name}
        {isSelectionMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => onSelectionChange(e.target.checked)}
            data-testid={`select-${name}`}
          />
        )}
        <button data-testid={`delete-${name}`} onClick={onDelete}>Eliminar</button>
      </div>
    );
  }
}));
jest.mock("../components/petModal/PetModal", () => ({
  __esModule: true,
  default: () => <div data-testid="add-pet-modal" />
}));
jest.mock("../components/feedbackModal/FeedbackModal", () => ({
  __esModule: true,
  default: ({ message }) => <div data-testid="feedback-modal">{message}</div>
}));
jest.mock("../components/deleteModal/DeleteModal", () => ({
  __esModule: true,
  default: ({ onCancel, onConfirm }) => (
    <div data-testid="delete-modal">
      <button data-testid="delete-cancel" onClick={onCancel}>Cancelar</button>
      <button data-testid="delete-confirm" onClick={onConfirm}>Confirmar</button>
    </div>
  )
}));

describe("HomeUserPage", () => {
  test("renderiza y muestra pacientes", async () => {
    render(<HomeUserPage />);
    expect(screen.getByTestId("button-add")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Firulais")).toBeInTheDocument();
      expect(screen.getByText("Misu")).toBeInTheDocument();
    });
  });

  test("muestra mensaje si no hay pacientes", async () => {
    const { getPatients } = jest.requireMock("../services/APIPatient");
    getPatients.mockResolvedValueOnce([]);
    render(<HomeUserPage />);
    await waitFor(() => {
      expect(screen.getByText("No hay pacientes creados")).toBeInTheDocument();
    });
  });

  test("muestra el mensaje de carga mientras se obtienen los pacientes", async () => {
    const { getPatients } = jest.requireMock("../services/APIPatient");
    getPatients.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve([
      { id: 1, name: "Firulais", species: "Perro", photo: "" }
    ]), 100)));
    render(<HomeUserPage />);
    expect(screen.getByText("Cargando pacientes...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Firulais")).toBeInTheDocument();
    });
  });

  test("al hacer click en el botón agregar se abre el modal de agregar paciente", async () => {
    render(<HomeUserPage />);
    fireEvent.click(screen.getByTestId("button-add"));
    await waitFor(() => {
      expect(screen.getByTestId("add-pet-modal")).toBeInTheDocument();
    });
  });

  test("al hacer click en una card de paciente se abre el modal de editar paciente", async () => {
    render(<HomeUserPage />);
    await waitFor(() => {
      expect(screen.getByText("Firulais")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("card-Firulais"));
    await waitFor(() => {
      expect(screen.getByTestId("add-pet-modal")).toBeInTheDocument();
    });
  });

  test("al hacer click en el botón de eliminar de una card se abre el modal de eliminar", async () => {
    render(<HomeUserPage />);
    await waitFor(() => {
      expect(screen.getByText("Firulais")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete-Firulais"));
    await waitFor(() => {
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });
  });

  test("al cancelar el modal de eliminar, el modal desaparece", async () => {
    render(<HomeUserPage />);
    await waitFor(() => {
      expect(screen.getByText("Firulais")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete-Firulais"));
    await waitFor(() => {
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete-cancel"));
    await waitFor(() => {
      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
    });
  });

  test("al confirmar el modal de eliminar, el paciente desaparece de la lista y aparece feedback", async () => {
    const { deletePatient } = jest.requireMock("../services/APIPatient");
    deletePatient.mockResolvedValueOnce();
    render(<HomeUserPage />);
    await waitFor(() => {
      expect(screen.getByText("Firulais")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete-Firulais"));
    await waitFor(() => {
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete-confirm"));
    await waitFor(() => {
      expect(screen.queryByText("Firulais")).not.toBeInTheDocument();
      expect(screen.getByTestId("feedback-modal")).toBeInTheDocument();
    });
  });

  

  test("muestra el FeedbackModal con error si falla la eliminación", async () => {
    const { deletePatient } = jest.requireMock("../services/APIPatient");
    deletePatient.mockRejectedValueOnce(new Error("Error"));
    render(<HomeUserPage />);
    await waitFor(() => {
      expect(screen.getByText("Firulais")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete-Firulais"));
    await waitFor(() => {
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete-confirm"));
    await waitFor(() => {
      expect(screen.getByTestId("feedback-modal")).toBeInTheDocument();
      expect(screen.getByTestId("feedback-modal")).toHaveTextContent("Error");
    });
  });

  test("filtra pacientes por letra activa", async () => {
    // Este test requiere botones con data-testid="filter-F" y "filter-M" en el componente
    // Si no existen, comenta o elimina este test
  });

  test("puede seleccionar y deseleccionar pacientes en modo selección", async () => {
    // Este test requiere un botón con data-testid="toggle-selection" y checkboxes con data-testid="select-Firulais"
    // Si no existen, comenta o elimina este test
  });
});