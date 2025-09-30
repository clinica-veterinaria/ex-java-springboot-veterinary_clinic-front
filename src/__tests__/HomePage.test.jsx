// src/__tests__/HomePage.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import '@testing-library/jest-dom';


// Mocks de componentes hijos
jest.mock("../components/cardsHome/CardHome", () => ({ variant, isSelected }) => (
  <div data-testid={`card-${variant}`} data-selected={isSelected}>
    Card {variant}
  </div>
));

jest.mock("../components/nextAppointment/NextAppointment", () => (props) => (
  <div data-testid="next-appointment">
    {props.patient} - {props.reason} - {props.appointmentDatetime}
  </div>
));

jest.mock("../components/smallCalendarWidget/SmallCalendarWidget", () => () => (
  <div data-testid="small-calendar">Calendario</div>
));

describe("HomePage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("muestra el estado de carga al inicio", () => {
    globalThis.fetch.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando citas/i)).toBeInTheDocument();
  });

  test("muestra próximas citas cuando fetch devuelve datos", async () => {
    const mockAppointments = [
      {
        id: 1,
        datetime: new Date(Date.now() + 3600 * 1000).toISOString(),
        patient_name: "Juan Pérez",
        reason: "Vacuna",
        type: "consulta",
      },
    ];

    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockAppointments),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("next-appointment")).toBeInTheDocument());
    expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument();
    expect(screen.getByText(/Vacuna/i)).toBeInTheDocument();
  });

  test("muestra mensaje cuando no hay citas futuras", async () => {
    const pastAppointments = [
      {
        id: 2,
        datetime: new Date(Date.now() - 3600 * 1000).toISOString(),
        patient_name: "Paciente Antiguo",
        reason: "Chequeo",
        type: "consulta",
      },
    ];

    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(pastAppointments),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/No hay citas programadas/i)).toBeInTheDocument()
    );
  });

  test("renderiza los CardHome y el calendario", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    render(
      <MemoryRouter initialEntries={["/appointments"]}>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("small-calendar")).toBeInTheDocument());
    expect(screen.getByTestId("card-appointments")).toBeInTheDocument();
    expect(screen.getByTestId("card-patients")).toBeInTheDocument();
  });
});
