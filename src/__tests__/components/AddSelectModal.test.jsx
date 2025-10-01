import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddSelectModal from "../../components/addSelectModal/AddSelectModal";

describe("AddSelectModal", () => {
  test("renderiza los botones de añadir cita y tratamiento", () => {
    const setModalType = jest.fn();
    const setShowAddModal = jest.fn();
    render(<AddSelectModal setModalType={setModalType} setShowAddModal={setShowAddModal} />);
    expect(screen.getByText(/Añadir cita/i)).toBeInTheDocument();
    expect(screen.getByText(/Añadir tratamiento/i)).toBeInTheDocument();
  });

  test("al hacer click en Añadir cita llama a setModalType y setShowAddModal", () => {
    const setModalType = jest.fn();
    const setShowAddModal = jest.fn();
    render(<AddSelectModal setModalType={setModalType} setShowAddModal={setShowAddModal} />);
    fireEvent.click(screen.getByText(/Añadir cita/i));
    expect(setModalType).toHaveBeenCalledWith("appt");
    expect(setShowAddModal).toHaveBeenCalledWith(true);
  });

  test("al hacer click en Añadir tratamiento llama a setModalType y setShowAddModal", () => {
    const setModalType = jest.fn();
    const setShowAddModal = jest.fn();
    render(<AddSelectModal setModalType={setModalType} setShowAddModal={setShowAddModal} />);
    fireEvent.click(screen.getByText(/Añadir tratamiento/i));
    expect(setModalType).toHaveBeenCalledWith("treatment");
    expect(setShowAddModal).toHaveBeenCalledWith(true);
  });

  test("al hacer click en el overlay llama a setShowAddModal(false)", () => {
    const setModalType = jest.fn();
    const setShowAddModal = jest.fn();
    render(<AddSelectModal setModalType={setModalType} setShowAddModal={setShowAddModal} />);
    fireEvent.click(screen.getByRole("dialog").parentElement);
    expect(setShowAddModal).toHaveBeenCalledWith(false);
  });

  test("al hacer click en el contenedor no cierra el modal", () => {
    const setModalType = jest.fn();
    const setShowAddModal = jest.fn();
    render(<AddSelectModal setModalType={setModalType} setShowAddModal={setShowAddModal} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(setShowAddModal).not.toHaveBeenCalledWith(false);
  });
});