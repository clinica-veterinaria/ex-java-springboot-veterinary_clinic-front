import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddTreatment from "../../components/addTreatment/AddTreatment";

describe("AddTreatment", () => {
  test("no renderiza nada si isOpen es false", () => {
    render(<AddTreatment isOpen={false} />);
    expect(screen.queryByText(/Añadir tratamiento/i)).not.toBeInTheDocument();
  });

  test("renderiza todos los campos y botones si isOpen es true", () => {
    render(<AddTreatment isOpen={true} />);
    expect(screen.getByText(/Añadir tratamiento/i)).toBeInTheDocument();
    // Inputs y textarea por placeholder
    expect(screen.getAllByPlaceholderText(/Ej: Infección/i)[0]).toBeInTheDocument(); // input motivo
    expect(screen.getAllByPlaceholderText(/Ej: Infección por hongos/i)[0]).toBeInTheDocument(); // textarea descripcion
    expect(screen.getAllByPlaceholderText(/Ej: Ketoconazol/i)[0]).toBeInTheDocument(); // input tratamiento
    expect(screen.getAllByPlaceholderText(/Ej: 7 días/i)[0]).toBeInTheDocument(); // input duración
    expect(screen.getAllByPlaceholderText(/Ej: 1\/día en ayunas/i)[0]).toBeInTheDocument(); // input frecuencia
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
    expect(screen.getByText(/Guardar/i)).toBeInTheDocument();
  });

  test("actualiza los campos del formulario", () => {
    render(<AddTreatment isOpen={true} />);
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: Infección/i)[0], { target: { value: "Otitis" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: Infección por hongos/i)[0], { target: { value: "Otitis externa" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: Ketoconazol/i)[0], { target: { value: "Amoxicilina" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: 7 días/i)[0], { target: { value: "10 días" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: 1\/día en ayunas/i)[0], { target: { value: "2/día" } });

    expect(screen.getAllByPlaceholderText(/Ej: Infección/i)[0]).toHaveValue("Otitis");
    expect(screen.getAllByPlaceholderText(/Ej: Infección por hongos/i)[0]).toHaveValue("Otitis externa");
    expect(screen.getAllByPlaceholderText(/Ej: Ketoconazol/i)[0]).toHaveValue("Amoxicilina");
    expect(screen.getAllByPlaceholderText(/Ej: 7 días/i)[0]).toHaveValue("10 días");
    expect(screen.getAllByPlaceholderText(/Ej: 1\/día en ayunas/i)[0]).toHaveValue("2/día");
  });

  test("llama a onSave y onClose al guardar", () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    render(<AddTreatment isOpen={true} onSave={onSave} onClose={onClose} />);
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: Infección/i)[0], { target: { value: "Otitis" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: Infección por hongos/i)[0], { target: { value: "Otitis externa" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: Ketoconazol/i)[0], { target: { value: "Amoxicilina" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: 7 días/i)[0], { target: { value: "10 días" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: 1\/día en ayunas/i)[0], { target: { value: "2/día" } });

    fireEvent.click(screen.getByText(/Guardar/i));
    expect(onSave).toHaveBeenCalledWith({
      motivo: "Otitis",
      descripcion: "Otitis externa",
      tratamiento: "Amoxicilina",
      duracion: "10 días",
      frecuencia: "2/día",
    });
    expect(onClose).toHaveBeenCalled();
  });

  test("resetea el formulario y llama a onClose al cancelar", () => {
    const onClose = jest.fn();
    render(<AddTreatment isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getAllByPlaceholderText(/Ej: Infección/i)[0], { target: { value: "Otitis" } });
    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(onClose).toHaveBeenCalled();
    expect(screen.getAllByPlaceholderText(/Ej: Infección/i)[0]).toHaveValue("");
    expect(screen.getAllByPlaceholderText(/Ej: Infección por hongos/i)[0]).toHaveValue("");
    expect(screen.getAllByPlaceholderText(/Ej: Ketoconazol/i)[0]).toHaveValue("");
    expect(screen.getAllByPlaceholderText(/Ej: 7 días/i)[0]).toHaveValue("");
    expect(screen.getAllByPlaceholderText(/Ej: 1\/día en ayunas/i)[0]).toHaveValue("");
  });
});