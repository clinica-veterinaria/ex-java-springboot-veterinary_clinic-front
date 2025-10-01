import { registerUser } from "../../services/APIRegister";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("registerUser", () => {
  const API_URL = "http://localhost:8080/auth/register";
  const formData = new FormData();
  formData.append("username", "testuser");
  formData.append("password", "1234");

  test("devuelve texto si el registro es exitoso", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "Usuario registrado correctamente",
    });

    const result = await registerUser(formData);
    expect(global.fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: "POST",
      body: formData,
    }));
    expect(result).toBe("Usuario registrado correctamente");
  });

  test("lanza error si el registro falla y muestra el mensaje", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "Usuario ya existe",
    });

    await expect(registerUser(formData)).rejects.toThrow("Usuario ya existe");
  });

  test("lanza error genérico si el registro falla y no hay mensaje", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "",
    });

    await expect(registerUser(formData)).rejects.toThrow("⚠️ Error al registrar el usuario");
  });

  test("lanza error si fetch falla", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    await expect(registerUser(formData)).rejects.toThrow("Network error");
  });
});