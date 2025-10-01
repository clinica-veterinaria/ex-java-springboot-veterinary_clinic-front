import { loginUser } from "../../services/APILogin";

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("loginUser", () => {
  const API_URL = "http://localhost:8080/auth/login";
  const loginData = { username: "test", password: "1234" };

  test("devuelve datos si el login es exitoso", async () => {
    const mockResponse = { message: "Login exitoso", token: "jwt-token" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await loginUser(loginData);
    expect(global.fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    }));
    expect(result).toEqual(mockResponse);
  });

  test("lanza error si credenciales incorrectas (401)", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Credenciales incorrectas",
    });

    await expect(loginUser(loginData)).rejects.toThrow("Credenciales incorrectas");
  });

  test("lanza error si el servidor falla (500)", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "",
    });

    await expect(loginUser(loginData)).rejects.toThrow("Error 500 al iniciar sesión.");
  });

  test("lanza error si fetch falla", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    await expect(loginUser(loginData)).rejects.toThrow("Network error");
  });
});