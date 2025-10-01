import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentCard from "../../components/appointmentCard/AppointmentCard";

// Mock ButtonStatus
jest.mock("../../components/buttonStatus/ButtonStatus", () => ({
  __esModule: true,
  default: ({ initialStatus, onStatusChange }) => (
    <button
      data-testid="button-status"
      onClick={() => onStatusChange("atendido")}
    >
      Estado: {initialStatus}
    </button>
  ),
}));

// Mock FontAwesomeIcon
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: (props) => <span data-testid="fa-ellipsis" {...props} />,
}));

describe("AppointmentCard", () => {
  const baseProps = {
    appointmentDatetime: "2025-10-01T09:00:00",
    patientName: "Luna",
    reason: "Consulta anual",
    status: "pendiente",
    type: "standard",
    onOptionsClick: jest.fn(),
    onClick: jest.fn(),
    appointment: { id: 1 },
    onStatusChange: jest.fn(),
  };

  test("renderiza datos básicos", () => {
    render(<AppointmentCard {...baseProps} />);
    expect(screen.getByText("Luna")).toBeInTheDocument();
    expect(screen.getByText("Consulta anual")).toBeInTheDocument();
    expect(screen.getByText(/OCT/)).toBeInTheDocument(); // Fecha formateada
    expect(screen.getByTestId("button-status")).toBeInTheDocument();
    expect(screen.getByTestId("fa-ellipsis")).toBeInTheDocument();
  });

  test("llama a onClick al hacer click en la card", () => {
    render(<AppointmentCard {...baseProps} />);
    fireEvent.click(screen.getByText("Luna"));
    expect(baseProps.onClick).toHaveBeenCalled();
  });

  test("llama a onStatusChange al cambiar estado", () => {
    render(<AppointmentCard {...baseProps} />);
    fireEvent.click(screen.getByTestId("button-status"));
    expect(baseProps.onStatusChange).toHaveBeenCalledWith("atendido");
  });

  test("llama a onOptionsClick al hacer click en el icono", () => {
    render(<AppointmentCard {...baseProps} />);
    fireEvent.click(screen.getByTestId("fa-ellipsis"));
    expect(baseProps.onOptionsClick).toHaveBeenCalledWith(baseProps.appointment);
  });

  test("no muestra botón de estado ni icono si isNextAppointment es true", () => {
    render(<AppointmentCard {...baseProps} isNextAppointment={true} />);
    expect(screen.queryByTestId("button-status")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fa-ellipsis")).not.toBeInTheDocument();
  });

  test("no muestra icono si status es 'atendido'", () => {
    render(<AppointmentCard {...baseProps} status="atendido" />);
    expect(screen.queryByTestId("fa-ellipsis")).not.toBeInTheDocument();
  });

  test("muestra estilos de urgente si type es 'urgente'", () => {
    render(<AppointmentCard {...baseProps} type="urgente" />);
    const card = screen.getByText("Luna").closest(".appointment-card");
    expect(card.className).toMatch(/appointment-card__urgent/);
  });

  test("muestra estilos de expirado si status es 'expirada'", () => {
    render(<AppointmentCard {...baseProps} status="expirada" />);
    const card = screen.getByText("Luna").closest(".appointment-card__expired");
    expect(card).toBeInTheDocument();
    expect(screen.queryByTestId("button-status")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fa-ellipsis")).not.toBeInTheDocument();
  });

  test("muestra 'Fecha no definida' si appointmentDatetime es falsy", () => {
    render(<AppointmentCard {...baseProps} appointmentDatetime={null} />);
    expect(screen.getByText("Fecha no definida")).toBeInTheDocument();
  });

  test("si appointmentDatetime es inválido, muestra el string original", () => {
    render(<AppointmentCard {...baseProps} appointmentDatetime="no-es-fecha" />);
    expect(screen.getByText("no-es-fecha")).toBeInTheDocument();
  });
});