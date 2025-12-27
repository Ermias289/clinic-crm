import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Loading from "../components/Loading";
import {
  getClinicSettings,
  updateClinicSettings,
  getWorkingHours,
  updateWorkingHours,
} from "../api/settings.api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("clinic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [clinicSettings, setClinicSettings] = useState({
    clinicName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { open: "09:00", close: "17:00", isOpen: true },
    tuesday: { open: "09:00", close: "17:00", isOpen: true },
    wednesday: { open: "09:00", close: "17:00", isOpen: true },
    thursday: { open: "09:00", close: "17:00", isOpen: true },
    friday: { open: "09:00", close: "17:00", isOpen: true },
    saturday: { open: "09:00", close: "13:00", isOpen: true },
    sunday: { open: "09:00", close: "17:00", isOpen: false },
  });

  useEffect(() => {
    if (activeTab === "clinic") {
      fetchClinicSettings();
    } else if (activeTab === "hours") {
      fetchWorkingHours();
    }
  }, [activeTab]);

  const fetchClinicSettings = async () => {
    try {
      setLoading(true);
      const response = await getClinicSettings();
      setClinicSettings(response.data);
    } catch (err) {
      console.error("Failed to fetch clinic settings", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkingHours = async () => {
    try {
      setLoading(true);
      const response = await getWorkingHours();
      if (response.data) {
        setWorkingHours(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch working hours", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClinicSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateClinicSettings(clinicSettings);
      setSuccess("Clinic settings updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    }
  };

  const handleWorkingHoursSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateWorkingHours(workingHours);
      setSuccess("Working hours updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update working hours");
    }
  };

  const handleClinicChange = (e) => {
    setClinicSettings({ ...clinicSettings, [e.target.name]: e.target.value });
  };

  const handleHoursChange = (day, field, value) => {
    setWorkingHours({
      ...workingHours,
      [day]: { ...workingHours[day], [field]: value },
    });
  };

  if (loading && activeTab === "clinic" && !clinicSettings.clinicName) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "clinic" ? "active" : ""}`}
            onClick={() => setActiveTab("clinic")}
          >
            Clinic Settings
          </button>
          <button
            className={`tab ${activeTab === "hours" ? "active" : ""}`}
            onClick={() => setActiveTab("hours")}
          >
            Working Hours
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {activeTab === "clinic" && (
          <form onSubmit={handleClinicSubmit} style={{ marginTop: "24px" }}>
            <div className="form-group">
              <label className="form-label">Clinic Name *</label>
              <input
                type="text"
                name="clinicName"
                className="form-input"
                value={clinicSettings.clinicName}
                onChange={handleClinicChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                className="form-textarea"
                value={clinicSettings.address}
                onChange={handleClinicChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={clinicSettings.phone}
                onChange={handleClinicChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={clinicSettings.email}
                onChange={handleClinicChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="url"
                name="website"
                className="form-input"
                value={clinicSettings.website}
                onChange={handleClinicChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </form>
        )}

        {activeTab === "hours" && (
          <form onSubmit={handleWorkingHoursSubmit} style={{ marginTop: "24px" }}>
            {Object.keys(workingHours).map((day) => (
              <div
                key={day}
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr 1fr 100px",
                  gap: "16px",
                  alignItems: "center",
                  marginBottom: "16px",
                  padding: "12px",
                  background: "#f5f6fa",
                  borderRadius: "8px",
                }}
              >
                <label style={{ fontWeight: 600, textTransform: "capitalize" }}>{day}</label>
                <div>
                  <input
                    type="time"
                    className="form-input"
                    value={workingHours[day].open}
                    onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                    disabled={!workingHours[day].isOpen}
                  />
                </div>
                <div>
                  <input
                    type="time"
                    className="form-input"
                    value={workingHours[day].close}
                    onChange={(e) => handleHoursChange(day, "close", e.target.value)}
                    disabled={!workingHours[day].isOpen}
                  />
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      checked={workingHours[day].isOpen}
                      onChange={(e) => handleHoursChange(day, "isOpen", e.target.checked)}
                    />
                    Open
                  </label>
                </div>
              </div>
            ))}

            <button type="submit" className="btn btn-primary">
              Save Working Hours
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;