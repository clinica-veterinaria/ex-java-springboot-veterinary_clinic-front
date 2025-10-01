import {
  getPatients,
  registerPatient,
  updatePatient,
  deletePatient,
  searchPatients,
} from "../../services/APIPatient";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("APIPatient service", () => {
  const API_URL = "http://localhost:8080/patients";

  test("getPatients devuelve la lista de pacientes", async () => {
    const mockData = [{ id: 1, name: "Ana" }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getPatients();
    expect(global.fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }));
    expect(result).toEqual(mockData);
  });

  test("getPatients lanza error si la respuesta no es ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server error",
    });
    await expect(getPatients()).rejects.toThrow("Error 500: Server error");
  });

  test("registerPatient envía datos y devuelve el paciente creado", async () => {
    const patientData = { name: "Beto" };
    const imageFile = new File([""], "photo.jpg");
    const mockResult = { id: 2, name: "Beto" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await registerPatient(patientData, imageFile);
    expect(global.fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: "POST",
      body: expect.any(FormData),
    }));
    expect(result).toEqual(mockResult);
  });

  test("registerPatient lanza error si la respuesta no es ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Datos inválidos",
    });
    await expect(registerPatient({ name: "Beto" })).rejects.toThrow("Error 400: Datos inválidos");
  });

  test("updatePatient actualiza y devuelve el paciente", async () => {
    const updatedData = { name: "Carlos" };
    const mockResult = { id: 3, name: "Carlos" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await updatePatient(3, updatedData);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/3`, expect.objectContaining({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    }));
    expect(result).toEqual(mockResult);
  });

  test("updatePatient lanza error si la respuesta no es ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "No encontrado",
    });
    await expect(updatePatient(99, { name: "X" })).rejects.toThrow("Error 404: No encontrado");
  });

  test("deletePatient elimina y devuelve true", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "",
    });

    const result = await deletePatient(1);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/1`, expect.objectContaining({
      method: "DELETE",
    }));
    expect(result).toBe(true);
  });

  test("deletePatient lanza error si la respuesta no es ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => "No autorizado",
    });
    await expect(deletePatient(1)).rejects.toThrow("Error 403: No autorizado");
  });

  test("searchPatients construye la URL y devuelve resultados", async () => {
    const mockData = [{ id: 1, name: "Ana" }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const params = { search: "Ana", species: "perro", gender: "hembra", sortBy: "fecha" };
    const url = `${API_URL}?search=Ana&species=perro&gender=hembra&sortBy=fecha`;
    const result = await searchPatients(params);
    expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }));
    expect(result).toEqual(mockData);
  });

  test("searchPatients lanza error si la respuesta no es ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    await expect(searchPatients({ search: "Ana" })).rejects.toThrow("Error 500");
  });
});