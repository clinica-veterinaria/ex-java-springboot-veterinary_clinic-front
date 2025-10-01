import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddAppt from "../../components/addAppt/AddAppt";

// Mocks de componentes hijos
jest.mock("../../components/buttonType/ButtonType", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="button-type">
      <button data-testid="type-estandar" onClick={() => props.onChange("estandar")}>Estandar</button>
      <button data-testid="type-urgente" onClick={() => props.onChange("urgente")}>Urgente</button>
    </div>
  ),
}));
jest.mock("../../components/buttons/Button", () => ({
  __esModule: true,
  default: (props) => (
    <button data-testid={`button-${props.variant}`} onClick={props.onClick}>{props.children}</button>
  ),
}));
jest.mock("../../components/dateTimePicker/DateTimePicker", () => ({
  __esModule: true,
  default: (props) => (
    <input
      data-testid={`dtp-${props.type}`}
      type={props.type}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
    />
  ),
}));

// Mock de servicios
const mockGetAvailableSlots = jest.fn();
const mockCreateAppointment = jest.fn();
jest.mock("../../services/APIAppointment", () => ({
  getAvailableSlots: (...args) => mockGetAvailableSlots(...args),
  createAppointment: (...args) => mockCreateAppointment(...args),
}));

describe("AddAppt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAvailableSlots.mockResolvedValue(["09:00", "10:00"]);
    mockCreateAppointment.mockResolvedValue({});
  });

  test("no renderiza nada si isOpen es false", () => {
    render(<AddAppt isOpen={false} />);
    expect(screen.queryByText(/Añadir cita/i)).not.toBeInTheDocument();
  });

  test("renderiza todos los campos y botones si isOpen es true", () => {
    render(<AddAppt isOpen={true} />);
    expect(screen.getByText(/Añadir cita/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej: Valentín/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej: 15032/i)).toBeInTheDocument();
    expect(screen.getByTestId("dtp-date")).toBeInTheDocument();
    expect(screen.getByTestId("dtp-time")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej: Revisión del año/i)).toBeInTheDocument();
    expect(screen.getByTestId("button-type")).toBeInTheDocument();
    expect(screen.getByTestId("button-secondary")).toBeInTheDocument();
    expect(screen.getByTestId("button-primary")).toBeInTheDocument();
  });

  test("actualiza los campos del formulario", () => {
    render(<AddAppt isOpen={true} />);
    fireEvent.change(screen.getByPlaceholderText(/Ej: Valentín/i), { target: { value: "Luna" } });
    fireEvent.change(screen.getByPlaceholderText(/Ej: 15032/i), { target: { value: "123" } });
    fireEvent.change(screen.getByTestId("dtp-date"), { target: { value: "2025-10-01" } });
    fireEvent.change(screen.getByTestId("dtp-time"), { target: { value: "09:00" } });
    fireEvent.change(screen.getByPlaceholderText(/Ej: Revisión del año/i), { target: { value: "Consulta anual" } });
    fireEvent.click(screen.getByTestId("type-urgente"));
    expect(screen.getByPlaceholderText(/Ej: Valentín/i)).toHaveValue("Luna");
    expect(screen.getByPlaceholderText(/Ej: 15032/i)).toHaveValue("123");
    expect(screen.getByTestId("dtp-date")).toHaveValue("2025-10-01");
    expect(screen.getByTestId("dtp-time")).toHaveValue("09:00");
    expect(screen.getByPlaceholderText(/Ej: Revisión del año/i)).toHaveValue("Consulta anual");
  });

  test("llama a onSave y onClose al guardar cita correctamente", async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    render(<AddAppt isOpen={true} onSave={onSave} onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText(/Ej: Valentín/i), { target: { value: "Luna" } });
    fireEvent.change(screen.getByPlaceholderText(/Ej: 15032/i), { target: { value: "123" } });
    fireEvent.change(screen.getByTestId("dtp-date"), { target: { value: "2025-10-01" } });
    fireEvent.change(screen.getByTestId("dtp-time"), { target: { value: "09:00" } });
    fireEvent.change(screen.getByPlaceholderText(/Ej: Revisión del año/i), { target: { value: "Consulta anual" } });
    fireEvent.click(screen.getByTestId("button-primary"));
    await waitFor(() => expect(mockCreateAppointment).toHaveBeenCalledWith({
      appointmentDatetime: "2025-10-01T09:00:00",
      type: "STANDARD",
      reason: "Consulta anual",
      patientId: 123,
    }));
    expect(onSave).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  test("muestra alert si falta algún campo obligatorio", () => {
    window.alert = jest.fn();
    render(<AddAppt isOpen={true} />);
    fireEvent.click(screen.getByTestId("button-primary"));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Por favor, completa la fecha, hora y paciente."));
  });

  test("llama a onClose y resetea el formulario al cancelar", () => {
    const onClose = jest.fn();
    render(<AddAppt isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText(/Ej: Valentín/i), { target: { value: "Luna" } });
    fireEvent.click(screen.getByTestId("button-secondary"));
    expect(onClose).toHaveBeenCalled();
    expect(screen.getByPlaceholderText(/Ej: Valentín/i)).toHaveValue("");
  });

  test("muestra alert si ocurre error al crear cita", async () => {
    window.alert = jest.fn();
    mockCreateAppointment.mockRejectedValueOnce(new Error("Error grave"));
    render(<AddAppt isOpen={true} />);
    fireEvent.change(screen.getByPlaceholderText(/Ej: Valentín/i), { target: { value: "Luna" } });
    fireEvent.change(screen.getByPlaceholderText(/Ej: 15032/i), { target: { value: "123" } });
    fireEvent.change(screen.getByTestId("dtp-date"), { target: { value: "2025-10-01" } });
    fireEvent.change(screen.getByTestId("dtp-time"), { target: { value: "09:00" } });
    fireEvent.click(screen.getByTestId("button-primary"));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Error al crear la cita")));
  });
});