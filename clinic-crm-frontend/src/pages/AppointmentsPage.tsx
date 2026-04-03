import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import {
  getAllAppointments,
  createAppointment,
  AppointmentSummary,
  AddAppointmentRequest
} from "../api/appointments";
import { getMedicalProfessionals, getMedicalServices, MedicalProfessional, MedicalService } from "../api/medical";
import { getFreeSlots, FreeSlot } from "../api/slots";

export const AppointmentsPage: React.FC = () => {
  const { logout } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [slots, setSlots] = useState<FreeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AddAppointmentRequest>({
    dentistryId: 0,
    medicalProfessionalId: 0,
    patientId: undefined,
    branchId: undefined,
    reservationTime: "",
    day: new Date().toISOString().slice(0, 10)
  });

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await loadAppointments();
      try {
        const [docs, servs] = await Promise.all([
          getMedicalProfessionals(),
          getMedicalServices()
        ]);
        setDoctors(docs);
        setServices(servs);
      } catch (err) {
        // ignore for now; errors will surface on use
      }
    })();
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      if (!form.medicalProfessionalId || !form.day || !form.branchId) {
        setSlots([]);
        return;
      }
      try {
        const data = await getFreeSlots({
          docId: form.medicalProfessionalId,
          day: form.day,
          branchId: form.branchId
        });
        setSlots(data);
      } catch {
        setSlots([]);
      }
    };
    void loadSlots();
  }, [form.medicalProfessionalId, form.day, form.branchId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await createAppointment(form);
      await loadAppointments();
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to create appointment");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <h2>Clinic CRM</h2>
        <nav>
          <Link to="/dashboard">Overview</Link>
          <Link to="/patients">Patients</Link>
          <Link to="/appointments">Appointments</Link>
        </nav>
        <button className="secondary" onClick={logout}>
          Log out
        </button>
      </aside>

      <main className="content">
        <h1>Appointments</h1>

        <section className="card">
          <h2>New appointment</h2>
          <form className="grid" onSubmit={onSubmit}>
            <label>
              Patient ID (optional)
              <input
                type="number"
                value={form.patientId ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    patientId: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
              />
            </label>
            <label>
              Service
              <select
                value={form.dentistryId || 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dentistryId: Number(e.target.value) || 0 }))
                }
                required
              >
                <option value={0}>Select service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Doctor
              <select
                value={form.medicalProfessionalId || 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    medicalProfessionalId: Number(e.target.value) || 0
                  }))
                }
                required
              >
                <option value={0}>Select doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fName} {d.lName} — {d.specialty}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Branch ID
              <input
                type="number"
                value={form.branchId ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    branchId: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
                required
              />
            </label>
            <label>
              Day
              <input
                type="date"
                value={form.day}
                onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                required
              />
            </label>
            <label>
              Free slot
              <select
                value={form.reservationTime}
                onChange={(e) => setForm((f) => ({ ...f, reservationTime: e.target.value }))}
                required
              >
                <option value="">Select a time</option>
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={creating}>
              {creating ? "Booking..." : "Book appointment"}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Existing appointments</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.patientId}</td>
                    <td>{a.medicalProfessionalId}</td>
                    <td>{a.day}</td>
                    <td>{a.reservationTime}</td>
                    <td>{a.status ?? ""}</td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5}>No appointments yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

