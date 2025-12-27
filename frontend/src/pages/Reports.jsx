import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Loading from "../components/Loading";
import {
  getAppointmentsReport,
  getRevenueReport,
  getPatientHistoryReport,
} from "../api/reports.api";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");

  const [appointmentsFilter, setAppointmentsFilter] = useState({
    startDate: "",
    endDate: "",
    status: "",
    doctorId: "",
  });

  const [revenueFilter, setRevenueFilter] = useState({
    startDate: "",
    endDate: "",
    serviceId: "",
    doctorId: "",
  });

  const [patientId, setPatientId] = useState("");

  const generateAppointmentsReport = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAppointmentsReport(appointmentsFilter);
      setReportData(response.data);
    } catch (err) {
      setError("Failed to generate report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateRevenueReport = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getRevenueReport(revenueFilter);
      setReportData(response.data);
    } catch (err) {
      setError("Failed to generate report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePatientHistoryReport = async () => {
    if (!patientId) {
      setError("Please enter a patient ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getPatientHistoryReport(patientId);
      setReportData(response.data);
    } catch (err) {
      setError("Failed to generate report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
      </div>

      <div className="card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("appointments");
              setReportData(null);
              setError("");
            }}
          >
            Appointments Report
          </button>
          <button
            className={`tab ${activeTab === "revenue" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("revenue");
              setReportData(null);
              setError("");
            }}
          >
            Revenue Report
          </button>
          <button
            className={`tab ${activeTab === "patient" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("patient");
              setReportData(null);
              setError("");
            }}
          >
            Patient History
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {activeTab === "appointments" && (
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ marginBottom: "16px" }}>Appointments Report</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={appointmentsFilter.startDate}
                  onChange={(e) =>
                    setAppointmentsFilter({ ...appointmentsFilter, startDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={appointmentsFilter.endDate}
                  onChange={(e) =>
                    setAppointmentsFilter({ ...appointmentsFilter, endDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={appointmentsFilter.status}
                  onChange={(e) =>
                    setAppointmentsFilter({ ...appointmentsFilter, status: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Doctor ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={appointmentsFilter.doctorId}
                  onChange={(e) =>
                    setAppointmentsFilter({ ...appointmentsFilter, doctorId: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={generateAppointmentsReport}
              style={{ marginTop: "16px" }}
            >
              Generate Report
            </button>
          </div>
        )}

        {activeTab === "revenue" && (
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ marginBottom: "16px" }}>Revenue Report</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={revenueFilter.startDate}
                  onChange={(e) =>
                    setRevenueFilter({ ...revenueFilter, startDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={revenueFilter.endDate}
                  onChange={(e) =>
                    setRevenueFilter({ ...revenueFilter, endDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={revenueFilter.serviceId}
                  onChange={(e) =>
                    setRevenueFilter({ ...revenueFilter, serviceId: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Doctor ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={revenueFilter.doctorId}
                  onChange={(e) =>
                    setRevenueFilter({ ...revenueFilter, doctorId: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={generateRevenueReport}
              style={{ marginTop: "16px" }}
            >
              Generate Report
            </button>
          </div>
        )}

        {activeTab === "patient" && (
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ marginBottom: "16px" }}>Patient History Report</h3>
            <div className="form-group" style={{ maxWidth: "400px" }}>
              <label className="form-label">Patient ID</label>
              <input
                type="text"
                className="form-input"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={generatePatientHistoryReport}
              style={{ marginTop: "16px" }}
            >
              Generate Report
            </button>
          </div>
        )}

        {loading && <Loading />}

        {reportData && !loading && (
          <div style={{ marginTop: "24px", padding: "20px", background: "#f5f6fa", borderRadius: "8px" }}>
            <h4 style={{ marginBottom: "16px" }}>Report Results</h4>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;