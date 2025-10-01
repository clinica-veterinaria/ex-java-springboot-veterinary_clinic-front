import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalendarPage from "../pages/CalendarPage";
jest.mock("../components/calendarMonth/CalendarMonth", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="calendar-month">
      <button data-testid="select-date" onClick={() => props.onDateSelect(new Date("2025-10-02"))}>Seleccionar fecha</button>
    </div>
  ),
}));
jest.mock("../components/addAppt/AddAppt", () => ({
  __esModule: true,
  default: (props) =>
    props.isOpen ? (
      <div data-testid="add-appt-modal">
        <button data-testid="save-appt" onClick={() => props.onSave({ appointmentDatetime: "2025-10-02T10:00:00", patientName: "Luna", reason: "Vacuna", type: "standard", status: "pendiente" })}>Guardar cita</button>
        <button data-testid="close-appt" onClick={props.onClose}>Cerrar</button>
      </div>
    ) : null,
}));
jest.mock("../components/buttonAdd/ButtonAdd", () => ({
  __esModule: true,
  default: (props) => (
    <button data-testid="button-add" onClick={props.onClick}>+</button>
  ),
}));
jest.mock("../components/appointmentCard/AppointmentCard", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="appointment-card" onClick={() => props.onClick()}>
      <span>{props.patientName}</span>
      <button data-testid="options" onClick={() => props.onOptionsClick(props.appointment)}>Opciones</button>
      <button data-testid="status" onClick={() => props.onStatusChange("atendido")}>Cambiar estado</button>
    </div>
  ),
}));
jest.mock("../components/feedbackModal/FeedbackModal", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="feedback-modal">
      {props.message}
      <button data-testid="close-feedback" onClick={props.onClose}>Cerrar</button>
    </div>
  ),
}));
jest.mock("../components/editAppt/EditAppt", () => ({
  __esModule: true,
  default: (props) =>
    props.isOpen ? (
      <div data-testid="edit-appt-modal">
        <button data-testid="save-edit" onClick={() => props.onSave({ reason: "Editada" })}>Guardar edición</button>
        <button data-testid="close-edit" onClick={props.onClose}>Cerrar</button>
      </div>
    ) : null,
}));
jest.mock("../components/deleteModal/DeleteModal", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="delete-modal">
      <button data-testid="cancel-delete" onClick={props.onCancel}>Cancelar</button>
      <button data-testid="confirm-delete" onClick={props.onConfirm}>Eliminar</button>
    </div>
  ),
}));
jest.mock("../components/editDeleteModal/EditDeleteModal", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="edit-delete-modal">
      <button data-testid="go-edit" onClick={props.onGoToEdit}>Editar</button>
      <button data-testid="go-delete" onClick={props.onGoToDelete}>Eliminar</button>
      <button data-testid="close-options" onClick={props.onClose}>Cerrar</button>
    </div>
  ),
}));
jest.mock("../components/appointmentDetailsAdmin/AppointmentDetailsAdmin", () => ({
  __esModule: true,
  default: (props) =>
    props.isOpen ? (
      <div data-testid="details-modal">
        <span>{props.patient}</span>
        <button data-testid="close-details" onClick={props.onClose}>Cerrar</button>
        <button data-testid="status-details" onClick={() => props.onStatusChange("atendido")}>Cambiar estado</button>
      </div>
    ) : null,
}));

// Mock de servicios
const mockGetAllAppointments = jest.fn();
const mockCreateAppointment = jest.fn();
const mockUpdateAppointment = jest.fn();
const mockDeleteAppointment = jest.fn();
const mockUpdateAppointmentStatus = jest.fn();

jest.mock("../services/APIAppointment", () => ({
  getAllAppointments: (...args) => mockGetAllAppointments(...args),
  createAppointment: (...args) => mockCreateAppointment(...args),
  updateAppointment: (...args) => mockUpdateAppointment(...args),
  deleteAppointment: (...args) => mockDeleteAppointment(...args),
  updateAppointmentStatus: (...args) => mockUpdateAppointmentStatus(...args),
}));

describe("CalendarPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllAppointments.mockResolvedValue([
      {
        id: 1,
        appointmentDatetime: "2025-10-01T09:00:00",
        patientName: "Luna",
        reason: "Consulta anual",
        type: "standard",
        status: "pendiente",
      },
      {
        id: 2,
        appointmentDatetime: "2025-10-02T10:00:00",
        patientName: "Beto",
        reason: "Vacuna",
        type: "standard",
        status: "pendiente",
      },
    ]);
    mockCreateAppointment.mockResolvedValue({});
    mockUpdateAppointment.mockResolvedValue({});
    mockDeleteAppointment.mockResolvedValue({});
    mockUpdateAppointmentStatus.mockResolvedValue({});
  });

  test("renderiza el calendario y la lista de citas del día", async () => {
    render(<CalendarPage />);
    expect(screen.getByTestId("calendar-month")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Calendario/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId("appointment-card")).toBeInTheDocument());
    expect(screen.getByText("Luna")).toBeInTheDocument();
  });

  test("filtra citas al seleccionar una fecha", async () => {
    render(<CalendarPage />);
    await waitFor(() => expect(screen.getByTestId("calendar-month")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("select-date"));
    await waitFor(() => expect(screen.getByText("Beto")).toBeInTheDocument());
  });

  test("muestra mensaje si no hay citas en el día", async () => {
    mockGetAllAppointments.mockResolvedValueOnce([]);
    render(<CalendarPage />);
    await waitFor(() => expect(screen.getByText(/No hay citas programadas para este día/i)).toBeInTheDocument());
  });

  test("abre el modal de añadir cita y guarda", async () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByTestId("button-add"));
    expect(screen.getByTestId("add-appt-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("save-appt"));
    await waitFor(() => expect(mockCreateAppointment).toHaveBeenCalled());
    expect(screen.getByTestId("feedback-modal")).toHaveTextContent(/Cita añadida/i);
  });

  test("cierra el feedback modal al hacer click en cerrar", async () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByTestId("button-add"));
    fireEvent.click(screen.getByTestId("save-appt"));
    await waitFor(() => expect(screen.getByTestId("feedback-modal")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("close-feedback"));
    expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument();
  });

  test("cierra el modal de detalles al hacer click en cerrar", async () => {
    render(<CalendarPage />);
    await waitFor(() => expect(screen.getByTestId("appointment-card")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Luna"));
    expect(screen.getByTestId("details-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-details"));
    expect(screen.queryByTestId("details-modal")).not.toBeInTheDocument();
  });

  test("cierra el modal de edición al hacer click en cerrar", async () => {
    render(<CalendarPage />);
    await waitFor(() => expect(screen.getByTestId("appointment-card")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("options"));
    fireEvent.click(screen.getByTestId("go-edit"));
    expect(screen.getByTestId("edit-appt-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-edit"));
    expect(screen.queryByTestId("edit-appt-modal")).not.toBeInTheDocument();
  });

  test("cierra el modal de eliminar al hacer click en cancelar", async () => {
    render(<CalendarPage />);
    await waitFor(() => expect(screen.getByTestId("appointment-card")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("options"));
    fireEvent.click(screen.getByTestId("go-delete"));
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("cancel-delete"));
    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });

  test("cierra el modal de opciones al hacer click en cerrar", async () => {
    render(<CalendarPage />);
    await waitFor(() => expect(screen.getByTestId("appointment-card")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("options"));
    expect(screen.getByTestId("edit-delete-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-options"));
    expect(screen.queryByTestId("edit-delete-modal")).not.toBeInTheDocument();
  });

  test("muestra loading mientras carga citas", async () => {
    mockGetAllAppointments.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));
    render(<CalendarPage />);
    expect(screen.getByText(/Cargando citas/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/No hay citas programadas para este día/i)).toBeInTheDocument());
  });

  test("muestra correctamente varias citas en el mismo día", async () => {
    mockGetAllAppointments.mockResolvedValue([
      {
        id: 1,
        appointmentDatetime: "2025-10-01T09:00:00",
        patientName: "Luna",
        reason: "Consulta anual",
        type: "standard",
        status: "pendiente",
      },
      {
        id: 3,
        appointmentDatetime: "2025-10-01T12:00:00",
        patientName: "Max",
        reason: "Control",
        type: "standard",
        status: "pendiente",
      }
    ]);
    render(<CalendarPage />);
    await waitFor(() => expect(screen.getAllByTestId("appointment-card")).toHaveLength(2));
    expect(screen.getByText("Luna")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
  });

  test("puede abrir y cerrar todos los modales sin error", async () => {
    render(<CalendarPage />);
    // Add modal
    fireEvent.click(screen.getByTestId("button-add"));
    expect(screen.getByTestId("add-appt-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-appt"));
    expect(screen.queryByTestId("add-appt-modal")).not.toBeInTheDocument();

    // Details modal
    await waitFor(() => expect(screen.getByTestId("appointment-card")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Luna"));
    expect(screen.getByTestId("details-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-details"));
    expect(screen.queryByTestId("details-modal")).not.toBeInTheDocument();

    // Options modal
    fireEvent.click(screen.getByTestId("appointment-card"));
    fireEvent.click(screen.getByTestId("options"));
    expect(screen.getByTestId("edit-delete-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-options"));
    expect(screen.queryByTestId("edit-delete-modal")).not.toBeInTheDocument();

    // Edit modal
    fireEvent.click(screen.getByTestId("appointment-card"));
    fireEvent.click(screen.getByTestId("options"));
    fireEvent.click(screen.getByTestId("go-edit"));
    expect(screen.getByTestId("edit-appt-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-edit"));
    expect(screen.queryByTestId("edit-appt-modal")).not.toBeInTheDocument();

    // Delete modal
    fireEvent.click(screen.getByTestId("appointment-card"));
    fireEvent.click(screen.getByTestId("options"));
    fireEvent.click(screen.getByTestId("go-delete"));
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("cancel-delete"));
    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });

  test("muestra feedback de error si falla la carga de citas", async () => {
    mockGetAllAppointments.mockRejectedValueOnce(new Error("Error"));
    render(<CalendarPage />);
    await waitFor(() => expect(screen.getByTestId("feedback-modal")).toHaveTextContent(/Error al cargar las citas/i));
  });

  test("muestra feedback de error si falla la creación de cita", async () => {
    mockCreateAppointment.mockRejectedValueOnce(new Error("Error"));
    render(<CalendarPage />);
    fireEvent.click(screen.getByTestId("button-add"));
    fireEvent.click(screen.getByTestId("save-appt"));
    await waitFor(() => expect(screen.getByTestId("feedback-modal")).toHaveTextContent(/Error al crear la cita/i));
  });

  test("muestra feedback de error si falla la edición de cita", async () => {
    mockUpdateAppointment.mockRejectedValueOnce(new Error("Error"));
    render(<CalendarPage />);
    fireEvent.click(screen.getByTestId("button-add"));
    fireEvent.click(screen.getByTestId("save-appt"));
    await waitFor(() => expect(screen.getByTestId("feedback-modal")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("close-feedback"));
    fireEvent.click(screen.getByTestId("appointment-card"));
    fireEvent.click(screen.getByTestId("options"));
    fireEvent.click(screen.getByTestId("go-edit"));
    fireEvent.click(screen.getByTestId("save-edit"));
    await waitFor(() => expect(screen.getByTestId("feedback-modal")).toHaveTextContent(/Error al editar la cita/i));
  });

  
});