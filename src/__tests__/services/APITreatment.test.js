import {
  getTreatments,
  getTreatmentsByPatient,
  createTreatment,
} from "../../services/APITreatment";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("APITreatment service", () => {
  const API_URL = "http://localhost:8080/treatments";

  test("getTreatments devuelve la lista de tratamientos", async () => {
    const mockData = [{ id: 1, tratamiento: "Vacuna" }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getTreatments();
    expect(global.fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }));
    expect(result).toEqual(mockData);
  });

  test("getTreatments lanza error si la respuesta no es ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server error",
    });
    await expect(getTreatments()).rejects.toThrow("Error 500: Server error");
  });

  test("getTreatmentsByPatient devuelve tratamientos del paciente", async () => {
    const mockData = [{ id: 2, tratamiento: "Desparasitación" }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getTreatmentsByPatient(123);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/patient/123`, expect.objectContaining({
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }));
    expect(result).toEqual(mockData);
  });

  test("getTreatmentsByPatient lanza error si la respuesta no es ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "No encontrado",
    });
    await expect(getTreatmentsByPatient(999)).rejects.toThrow("Error 404: No encontrado");
  });

  test("createTreatment crea tratamiento y devuelve el resultado", async () => {
    const treatmentData = { tratamiento: "Vacuna", descripcion: "Rabia" };
    const mockResult = { id: 3, tratamiento: "Vacuna" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await createTreatment(treatmentData);
    expect(global.fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(treatmentData),
    }));
    expect(result).toEqual(mockResult);
  });

  test("createTreatment lanza error si la respuesta no es ok y muestra el texto", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Datos inválidos",
    });
    await expect(createTreatment({ tratamiento: "X" })).rejects.toThrow("Error 400: Datos inválidos");
  });

  test("createTreatment lanza error si fetch falla", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    await expect(createTreatment({ tratamiento: "X" })).rejects.toThrow("Network error");
  });
});