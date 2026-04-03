import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { Card, getAllCards, requestCard, reactivateCard, RequestCardPayload } from "../api/cards";

export const CardsPage: React.FC = () => {
  const { logout } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<RequestCardPayload>({
    patientId: 0,
    cardTypeId: 0,
    requestRemark: ""
  });

  const loadCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCards();
      setCards(data);
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCards();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await requestCard(form);
      setForm({ patientId: 0, cardTypeId: 0, requestRemark: "" });
      await loadCards();
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to request card");
    } finally {
      setCreating(false);
    }
  };

  const onReactivate = async (id: number) => {
    try {
      await reactivateCard(id);
      await loadCards();
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to reactivate card");
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
          <Link to="/cards">Cards</Link>
          <Link to="/payments">Payments</Link>
        </nav>
        <button className="secondary" onClick={logout}>
          Log out
        </button>
      </aside>

      <main className="content">
        <h1>Cards</h1>

        <section className="card">
          <h2>Request new card</h2>
          <form className="grid" onSubmit={onSubmit}>
            <label>
              Patient ID
              <input
                type="number"
                value={form.patientId || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, patientId: Number(e.target.value) || 0 }))
                }
                required
              />
            </label>
            <label>
              Card type ID
              <input
                type="number"
                value={form.cardTypeId || 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cardTypeId: Number(e.target.value) || 0 }))
                }
                required
              />
            </label>
            <label>
              Remark
              <input
                value={form.requestRemark ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, requestRemark: e.target.value ?? "" }))
                }
              />
            </label>
            <button type="submit" disabled={creating}>
              {creating ? "Requesting..." : "Request card"}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Existing cards</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reference</th>
                  <th>Card type</th>
                  <th>Patient</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.reference}</td>
                    <td>{c.cardTypeId}</td>
                    <td>{c.patientId}</td>
                    <td>
                      <button type="button" className="secondary" onClick={() => onReactivate(c.id)}>
                        Reactivate
                      </button>
                    </td>
                  </tr>
                ))}
                {cards.length === 0 && (
                  <tr>
                    <td colSpan={5}>No cards yet.</td>
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

