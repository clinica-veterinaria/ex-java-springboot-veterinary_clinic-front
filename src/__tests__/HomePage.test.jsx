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

// Mock del servicio APIAppointment
jest.mock("../services/APIAppointment", () => ({
  getUpcomingAppointments: jest.fn(),
}));

import { getUpcomingAppointments } from "../services/APIAppointment";

describe("HomePage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("muestra el estado de carga al inicio", () => {
    // Promesa pendiente para simular loading
    getUpcomingAppointments.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando citas/i)).toBeInTheDocument();
  });

  test("muestra próximas citas cuando fetch devuelve datos", async () => {
    getUpcomingAppointments.mockResolvedValue({
      appointments: [
        {
          id: 1,
          appointmentDatetime: "2025-09-30T10:00:00",
          patientName: "Juan Pérez",
          reason: "Vacuna",
          type: "consulta",
        },
      ],
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("next-appointment")).toBeInTheDocument());
    expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument();
    expect(screen.getByText(/Vacuna/i)).toBeInTheDocument();
    expect(screen.getByText(/30 SEP/i)).toBeInTheDocument();
  });

  test("muestra mensaje cuando no hay citas futuras", async () => {
    getUpcomingAppointments.mockResolvedValue({
      appointments: [],
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
    getUpcomingAppointments.mockResolvedValue({
      appointments: [],
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

  test("muestra mensaje de error si la API falla", async () => {
    getUpcomingAppointments.mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Error al cargar las citas/i)).toBeInTheDocument()
    );
  });
});