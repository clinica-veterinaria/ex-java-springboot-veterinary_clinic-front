import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PatientProfile from "../pages/PatientProfile";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mocks de componentes hijos (named export si corresponde)
jest.mock("../components/patientWidget/PatientWidget", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="patient-widget">
      <button data-testid="edit-patient" onClick={() => props.onEdit(props.patient)}>Editar</button>
      <button data-testid="delete-patient" onClick={() => props.onDelete(props.patient)}>Eliminar</button>
    </div>
  ),
}));
jest.mock("../components/patientRecord/PatientRecord", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="patient-record">
      {props.loading ? "Cargando historial..." : "Historial"}
    </div>
  ),
}));
jest.mock("../components/appointmentsWidget/AppointmentsWidget", () => ({
  __esModule: true,
  default: () => <div data-testid="appointments-widget">Citas</div>,
}));
jest.mock("../components/editPatient/EditPatient", () => ({
  __esModule: true,
  default: (props) =>
    props.isOpen ? (
      <div data-testid="edit-patient-modal">
        <button data-testid="save-edit" onClick={() => props.onSave({ ...props.patient, name: "Paciente Editado" })}>Guardar</button>
        <button data-testid="close-edit" onClick={props.onClose}>Cerrar</button>
      </div>
    ) : null,
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
jest.mock("../components/buttonAdd/ButtonAdd", () => ({
  __esModule: true,
  default: (props) => (
    <button data-testid="button-add" onClick={props.onClick}>+</button>
  ),
}));
jest.mock("../components/addAppt/AddAppt", () => ({
  __esModule: true,
  default: (props) =>
    props.isOpen ? (
      <div data-testid="add-appt-modal">
        <button data-testid="save-appt" onClick={props.onSave}>Guardar cita</button>
        <button data-testid="close-appt" onClick={props.onClose}>Cerrar</button>
      </div>
    ) : null,
}));
jest.mock("../components/addTreatment/AddTreatment", () => ({
  __esModule: true,
  default: (props) =>
    props.isOpen ? (
      <div data-testid="add-treatment-modal">
        <button data-testid="save-treatment" onClick={() => props.onSave({ tratamiento: "Vacuna", descripcion: "Rabia", frecuencia: "1 vez" })}>Guardar tratamiento</button>
        <button data-testid="close-treatment" onClick={props.onClose}>Cerrar</button>
      </div>
    ) : null,
}));
jest.mock("../components/addSelectModal/AddSelectModal", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="add-select-modal">
      <button data-testid="select-appt" onClick={() => { props.setModalType("appt"); }}>Cita</button>
      <button data-testid="select-treatment" onClick={() => { props.setModalType("treatment"); }}>Tratamiento</button>
      <button data-testid="close-select" onClick={() => props.setShowAddModal(false)}>Cerrar</button>
    </div>
  ),
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

// Mocks de servicios
jest.mock("../services/APIPatient", () => ({
  getPatients: jest.fn(),
  deletePatient: jest.fn(),
}));
jest.mock("../services/APITreatment", () => ({
  createTreatment: jest.fn(),
  getTreatmentsByPatient: jest.fn(),
}));

import { getPatients, deletePatient } from "../services/APIPatient";
import { createTreatment, getTreatmentsByPatient } from "../services/APITreatment";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
}));

describe("PatientProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPatients.mockResolvedValue([
      { id: 1, name: "Paciente Uno", species: "Perro", photo: "" },
      { id: 2, name: "Paciente Dos", species: "Gato", photo: "" },
    ]);
    getTreatmentsByPatient.mockResolvedValue([
      { treatmentDate: new Date().toISOString(), treatment: "Vacuna", medication: "Rabia" },
    ]);
    createTreatment.mockResolvedValue({
      treatmentDate: new Date().toISOString(),
      treatment: "Vacuna",
      medication: "Rabia",
    });
    deletePatient.mockResolvedValue({});
    mockNavigate.mockClear();
  });

  test("muestra loading y luego el perfil del paciente", async () => {
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("patient-widget")).toBeInTheDocument());
    expect(screen.getByTestId("patient-record")).toBeInTheDocument();
    expect(screen.getByTestId("appointments-widget")).toBeInTheDocument();
  });

  test("muestra mensaje si el paciente no existe", async () => {
    getPatients.mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/Paciente no encontrado/i)).toBeInTheDocument());
  });

  test("abre y guarda edición de paciente", async () => {
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId("patient-widget")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("edit-patient"));
    expect(screen.getByTestId("edit-patient-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("save-edit"));
    expect(await screen.findByTestId("feedback-modal")).toHaveTextContent(/actualizado/i);
  });

  test("abre y cierra el modal de edición", async () => {
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId("patient-widget")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("edit-patient"));
    expect(screen.getByTestId("edit-patient-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-edit"));
    expect(screen.queryByTestId("edit-patient-modal")).not.toBeInTheDocument();
  });

  test("abre y confirma borrado de paciente", async () => {
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId("patient-widget")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("delete-patient"));
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("confirm-delete"));
    expect(await screen.findByTestId("feedback-modal")).toHaveTextContent(/eliminado/i);
    expect(mockNavigate).toHaveBeenCalledWith("/patients");
  });

  test("muestra feedback de error si falla el borrado", async () => {
    deletePatient.mockRejectedValueOnce(new Error("Error"));
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId("patient-widget")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("delete-patient"));
    fireEvent.click(screen.getByTestId("confirm-delete"));
    expect(await screen.findByTestId("feedback-modal")).toHaveTextContent(/Error al eliminar/i);
  });

  test("abre el modal de añadir y selecciona tipo", async () => {
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId("button-add")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("button-add"));
    expect(screen.getByTestId("add-select-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("select-appt"));
    expect(screen.getByTestId("add-appt-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-appt"));
    fireEvent.click(screen.getByTestId("button-add"));
    fireEvent.click(screen.getByTestId("select-treatment"));
    expect(screen.getByTestId("add-treatment-modal")).toBeInTheDocument();
  });

  test("guarda tratamiento y muestra feedback", async () => {
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId("button-add")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("button-add"));
    fireEvent.click(screen.getByTestId("select-treatment"));
    fireEvent.click(screen.getByTestId("save-treatment"));
    expect(await screen.findByTestId("feedback-modal")).toHaveTextContent(/Tratamiento añadido/i);
  });

  test("guarda cita y muestra feedback", async () => {
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId("button-add")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("button-add"));
    fireEvent.click(screen.getByTestId("select-appt"));
    fireEvent.click(screen.getByTestId("save-appt"));
    expect(await screen.findByTestId("feedback-modal")).toHaveTextContent(/Cita añadida/i);
  });

  test("cierra el feedback modal", async () => {
    render(
      <MemoryRouter initialEntries={["/patients/1"]}>
        <Routes>
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId("patient-widget")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("edit-patient"));
    fireEvent.click(screen.getByTestId("save-edit"));
    await waitFor(() => expect(screen.getByTestId("feedback-modal")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("close-feedback"));
    expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument();
  });
});