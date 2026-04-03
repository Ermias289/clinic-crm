import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import {
  getAppointmentReport,
  getMostBookedServices,
  DashboardDTO,
  MostBookedServicesDTO
} from "../api/dashboard";

type DayKey = keyof DashboardDTO;

const dayOrder: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

export const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const [report, setReport] = useState<DashboardDTO | null>(null);
  const [mostBooked, setMostBooked] = useState<MostBookedServicesDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rep, top] = await Promise.all([
          getAppointmentReport({}),
          getMostBookedServices()
        ]);
        setReport(rep);
        setMostBooked(top);
      } catch (err: any) {
        setError(err?.response?.data ?? "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const totalScheduled =
    report &&
    dayOrder.reduce(
      (sum, day) => sum + (report[day]?.scheduledAppointmentsCount ?? 0),
      0
    );
  const totalCompleted =
    report &&
    dayOrder.reduce(
      (sum, day) => sum + (report[day]?.completedAppointmentsCount ?? 0),
      0
    );
  const totalCanceled =
    report &&
    dayOrder.reduce(
      (sum, day) => sum + (report[day]?.canceledAppointmentsCount ?? 0),
      0
    );

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
        <h1>Dashboard</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <section className="card">
              <h2>This week&apos;s appointments</h2>
              <div className="grid">
                <div>
                  <div className="subtitle">Scheduled</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>
                    {totalScheduled ?? 0}
                  </div>
                </div>
                <div>
                  <div className="subtitle">Completed</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>
                    {totalCompleted ?? 0}
                  </div>
                </div>
                <div>
                  <div className="subtitle">Canceled</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>
                    {totalCanceled ?? 0}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Scheduled</th>
                      <th>Completed</th>
                      <th>Canceled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report &&
                      dayOrder.map((day) => {
                        const d = report[day];
                        return (
                          <tr key={day}>
                            <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                            <td>{d?.scheduledAppointmentsCount ?? 0}</td>
                            <td>{d?.completedAppointmentsCount ?? 0}</td>
                            <td>{d?.canceledAppointmentsCount ?? 0}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card">
              <h2>Most booked services</h2>
              {mostBooked && mostBooked.topServices.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mostBooked.topServices.map((s) => (
                      <tr key={s.id}>
                        <td>{s.serviceName}</td>
                        <td>{s.bookingCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data yet.</p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

