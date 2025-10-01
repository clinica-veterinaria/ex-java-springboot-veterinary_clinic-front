import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AlphabetIndex from "../../components/alphabetIndex/AlphabetIndex";

describe("AlphabetIndex", () => {
  test("renderiza todas las letras del alfabeto", () => {
    render(<AlphabetIndex />);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letters.forEach(letter => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  test("deshabilita las letras no disponibles", () => {
    render(<AlphabetIndex availableLetters={["A", "C", "Z"]} />);
    const enabledA = screen.getByText("A");
    const disabledB = screen.getByText("B");
    const enabledC = screen.getByText("C");
    expect(enabledA).not.toBeDisabled();
    expect(disabledB).toBeDisabled();
    expect(enabledC).not.toBeDisabled();
    expect(screen.getByText("Z")).not.toBeDisabled();
  });

  test("marca la letra activa", () => {
    render(<AlphabetIndex activeLetter="D" />);
    const activeD = screen.getByText("D");
    expect(activeD.className).toMatch(/alphabet-letter--active/);
  });

  test("llama a onLetterClick con la letra seleccionada", () => {
    const onLetterClick = jest.fn();
    render(<AlphabetIndex onLetterClick={onLetterClick} />);
    fireEvent.click(screen.getByText("F"));
    expect(onLetterClick).toHaveBeenCalledWith("F");
  });

  test("si se hace click en la letra activa, llama a onLetterClick con ''", () => {
    const onLetterClick = jest.fn();
    render(<AlphabetIndex activeLetter="G" onLetterClick={onLetterClick} />);
    fireEvent.click(screen.getByText("G"));
    expect(onLetterClick).toHaveBeenCalledWith("");
  });


  test("los botones tienen el título correcto", () => {
    render(<AlphabetIndex />);
    expect(screen.getByTitle("Ir a pacientes que empiecen por A")).toBeInTheDocument();
    expect(screen.getByTitle("Ir a pacientes que empiecen por Z")).toBeInTheDocument();
  });
});