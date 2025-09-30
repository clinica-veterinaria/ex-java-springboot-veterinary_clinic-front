import {
  formatDateTime,
  getUpcomingAppointments,
  getAvailableSlots,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  updateAppointmentType,
  deleteAppointment,
} from '../../services/APIAppointment';   // 👈 este es el nombre correcto

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe('formatDateTime', () => {
  test('formatea correctamente una fecha', () => {
    const date = new Date('2025-09-30T14:45:00').toISOString();
    expect(formatDateTime(date)).toBe('30 SEP, 14:45h');
  });

  test('devuelve string vacío si no hay fecha', () => {
    expect(formatDateTime(null)).toBe('');
  });
});

describe('getUpcomingAppointments', () => {
  test('devuelve citas formateadas', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        appointments: [{ appointmentDatetime: '2025-09-30T10:00:00' }],
      }),
    });

    const data = await getUpcomingAppointments(2);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/appointments/upcoming?limit=2'
    );
    expect(data.appointments[0].appointmentDatetime).toMatch(/SEP/);
  });

  test('lanza error si la respuesta no es ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(getUpcomingAppointments()).rejects.toThrow(
      'Error fetching appointments'
    );
  });
});

describe('getAvailableSlots', () => {
  test('devuelve máximo 10 slots', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ slots: Array(15).fill('10:00') }),
    });

    const slots = await getAvailableSlots('2025-09-30');
    expect(slots).toHaveLength(10);
  });

  test('devuelve [] si hay error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    const slots = await getAvailableSlots('2025-09-30');
    expect(slots).toEqual([]);
  });
});

describe('createAppointment', () => {
  test('crea cita correctamente', async () => {
    const appointment = { id: 1, pet: 'Fido' };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => appointment,
    });

    const result = await createAppointment(appointment);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/appointments',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      })
    );
    expect(result).toEqual(appointment);
  });

  test('lanza error si falla', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(createAppointment({})).rejects.toThrow('Error creating appointment');
  });
});

describe('updateAppointment', () => {
  test('actualiza cita', async () => {
    const updated = { id: 1, pet: 'Mimi' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updated,
    });

    const result = await updateAppointment(1, updated);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/appointments/1',
      expect.objectContaining({
        method: 'PUT',
      })
    );
    expect(result).toEqual(updated);
  });
});

describe('updateAppointmentStatus y updateAppointmentType', () => {
  test('updateAppointmentStatus llama updateAppointment con status', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'DONE' }) });
    const result = await updateAppointmentStatus(1, 'DONE');
    expect(result).toEqual({ status: 'DONE' });
  });

  test('updateAppointmentType llama updateAppointment con type', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ type: 'CHECKUP' }) });
    const result = await updateAppointmentType(1, 'CHECKUP');
    expect(result).toEqual({ type: 'CHECKUP' });
  });
});

describe('deleteAppointment', () => {
  test('devuelve null si status 204', async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 204 });
    const result = await deleteAppointment(1);
    expect(result).toBeNull();
  });

  test('devuelve json si no es 204', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    const result = await deleteAppointment(2);
    expect(result).toEqual({ success: true });
  });

  test('lanza error si falla', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(deleteAppointment(3)).rejects.toThrow('Error deleting appointment');
  });
});
