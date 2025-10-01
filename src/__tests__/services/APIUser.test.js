import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/APIUser";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("APIUser service", () => {
  const API_URL = "http://localhost:8080/users";

  test("getAllUsers returns users list", async () => {
    const mockData = [{ id: 1, name: "Ana" }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getAllUsers();
    expect(global.fetch).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual(mockData);
  });

  test("getAllUsers throws error on failure", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(getAllUsers()).rejects.toThrow("Error fetching users");
  });

  test("getUserById returns user", async () => {
    const mockData = { id: 2, name: "Beto" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getUserById(2);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/2`);
    expect(result).toEqual(mockData);
  });

  test("getUserById throws error on failure", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(getUserById(99)).rejects.toThrow("Error fetching user by ID");
  });

  test("getUserByEmail returns user", async () => {
    const mockData = { id: 3, name: "Carlos" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getUserByEmail("carlos@email.com");
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/email/carlos@email.com`);
    expect(result).toEqual(mockData);
  });

  test("getUserByEmail throws error on failure", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(getUserByEmail("fail@email.com")).rejects.toThrow("Error fetching user by email");
  });

  test("createUser (JSON) returns created user", async () => {
    const userData = { name: "Diana" };
    const mockResult = { id: 4, name: "Diana" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await createUser(userData);
    expect(global.fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }));
    expect(result).toEqual(mockResult);
  });

  test("createUser (FormData) returns created user", async () => {
    const userData = { name: "Elena" };
    const photoFile = new File([""], "photo.jpg");
    const mockResult = { id: 5, name: "Elena" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await createUser(userData, photoFile);
    expect(global.fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: "POST",
      headers: {},
      body: expect.any(FormData),
    }));
    expect(result).toEqual(mockResult);
  });

  test("createUser throws error on failure", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(createUser({ name: "fail" })).rejects.toThrow("Error creating user");
  });

  test("updateUser (JSON) returns updated user", async () => {
    const updatedData = { name: "Fabián" };
    const mockResult = { id: 6, name: "Fabián" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await updateUser(6, updatedData);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/6`, expect.objectContaining({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    }));
    expect(result).toEqual(mockResult);
  });

  test("updateUser (FormData) returns updated user", async () => {
    const updatedData = { name: "Gabriel" };
    const photoFile = new File([""], "photo.jpg");
    const mockResult = { id: 7, name: "Gabriel" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await updateUser(7, updatedData, photoFile);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/7`, expect.objectContaining({
      method: "PUT",
      headers: {},
      body: expect.any(FormData),
    }));
    expect(result).toEqual(mockResult);
  });

  test("updateUser throws error on failure", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(updateUser(99, { name: "fail" })).rejects.toThrow("Error updating user");
  });

  test("deleteUser returns null if status 204", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => ({}),
    });

    const result = await deleteUser(1);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/1`, { method: "DELETE" });
    expect(result).toBeNull();
  });

  test("deleteUser returns json if status not 204", async () => {
    const mockResult = { deleted: true };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResult,
    });

    const result = await deleteUser(2);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/2`, { method: "DELETE" });
    expect(result).toEqual(mockResult);
  });

  test("deleteUser throws error on failure", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(deleteUser(99)).rejects.toThrow("Error deleting user");
  });
});