import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import {
  getAllPayments,
  getPaymentsByStatus,
  getPaymentsByCardId,
  createPaymentRequest,
  PaymentSummary,
  CreatePaymentPayload
} from "../api/payments";

export const PaymentsPage: React.FC = () => {
  const { logout } = useAuth();
  const [payments, setPayments] = useState<PaymentSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCardId, setFilterCardId] = useState<string>("");
  const [form, setForm] = useState<CreatePaymentPayload>({
    id: 0,
    requestedAmount: 0,
    paymentProof: "",
    isInsuranceCovered: false,
    paymentTypeId: undefined
  });

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: PaymentSummary[];
      if (filterCardId) {
        data = await getPaymentsByCardId(Number(filterCardId));
      } else if (filterStatus) {
        data = await getPaymentsByStatus(filterStatus);
      } else {
        data = await getAllPayments();
      }
      setPayments(data);
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await createPaymentRequest(form);
      await loadPayments();
    } catch (err: any) {
      setError(err?.response?.data ?? "Failed to create payment request");
    } finally {
      setCreating(false);
    }
  };

  const onApplyFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadPayments();
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
        <h1>Payments</h1>

        <section className="card">
          <h2>New payment request</h2>
          <form className="grid" onSubmit={onSubmit}>
            <label>
              Payment ID (for card)
              <input
                type="number"
                value={form.id || 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    id: Number(e.target.value) || 0
                  }))
                }
                required
              />
            </label>
            <label>
              Requested amount
              <input
                type="number"
                value={form.requestedAmount}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    requestedAmount: Number(e.target.value) || 0
                  }))
                }
                required
              />
            </label>
            <label>
              Payment type ID
              <input
                type="number"
                value={form.paymentTypeId ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    paymentTypeId: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
              />
            </label>
            <label>
              Insurance covered?
              <input
                type="checkbox"
                checked={form.isInsuranceCovered ?? false}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    isInsuranceCovered: e.target.checked
                  }))
                }
              />
            </label>
            <label>
              Payment proof URL
              <input
                value={form.paymentProof ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    paymentProof: e.target.value ?? ""
                  }))
                }
              />
            </label>
            <button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create request"}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Filter</h2>
          <form className="grid" onSubmit={onApplyFilter}>
            <label>
              Status
              <input
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                placeholder="e.g. PENDING"
              />
            </label>
            <label>
              Card ID
              <input
                type="number"
                value={filterCardId}
                onChange={(e) => setFilterCardId(e.target.value)}
              />
            </label>
            <button type="submit">Apply</button>
          </form>
        </section>

        <section className="card">
          <h2>Payments</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Card</th>
                  <th>Expected</th>
                  <th>Paid</th>
                  <th>Unpaid</th>
                  <th>Requested</th>
                  <th>Payment type</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.reference}</td>
                    <td>{p.status}</td>
                    <td>{p.cardId}</td>
                    <td>{p.expectedAmount}</td>
                    <td>{p.paidAmount}</td>
                    <td>{p.unpaidAmount}</td>
                    <td>{p.requestedAmount}</td>
                    <td>{p.paymentTypeId ?? ""}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={9}>No payments yet.</td>
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

