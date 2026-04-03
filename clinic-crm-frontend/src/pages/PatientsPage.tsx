import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { getAllPatients, createPatient, PatientSummary, AddPatientRequest } from "../api/patients";

export const PatientsPage: React.FC = () => {
  const { logout } = useAuth();
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AddPatientRequest>({
    fName: "",
    mName: "",
    lName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    address: "",
    city: "",
    subCity: "",
    country: "",
    dateOfBirth: "",
    requiresUserAccount: false
  });

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPatients();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await createPatient(form);
      setForm({
        fName: "",
        mName: "",
        lName: "",
        phoneNumber: "",
        email: "",
        gender: "",
        address: "",
        city: "",
        subCity: "",
        country: "",
        dateOfBirth: "",
        requiresUserAccount: false
      });
      await loadPatients();
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to create patient");
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
        <h1>Patients</h1>

        <section className="card">
          <h2>New patient</h2>
          <form className="grid" onSubmit={onSubmit}>
            <label>
              First name
              <input
                value={form.fName ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, fName: e.target.value }))}
                required
              />
            </label>
            <label>
              Middle name
              <input
                value={form.mName ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, mName: e.target.value }))}
              />
            </label>
            <label>
              Last name
              <input
                value={form.lName ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, lName: e.target.value }))}
                required
              />
            </label>
            <label>
              Phone
              <input
                value={form.phoneNumber}
                onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
            <label>
              Gender
              <select
                value={form.gender ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Date of birth
              <input
                type="date"
                value={form.dateOfBirth ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
              />
            </label>
            <label>
              Country
              <input
                value={form.country ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              />
            </label>
            <label>
              City
              <input
                value={form.city ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </label>
            <label>
              Sub-city
              <input
                value={form.subCity ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, subCity: e.target.value }))}
              />
            </label>
            <label>
              Address
              <input
                value={form.address ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </label>
            <label>
              Create user account?
              <input
                type="checkbox"
                checked={form.requiresUserAccount ?? false}
                onChange={(e) =>
                  setForm((f) => ({ ...f, requiresUserAccount: e.target.checked }))
                }
              />
            </label>
            <button type="submit" disabled={creating}>
              {creating ? "Saving..." : "Create"}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Existing patients</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      {p.firstName} {p.lastName}
                    </td>
                    <td>{p.phoneNumber}</td>
                    <td>{p.email}</td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={4}>No patients yet.</td>
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

