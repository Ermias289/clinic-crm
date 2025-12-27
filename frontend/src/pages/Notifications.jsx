import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { getUserNotifications, markAsRead, sendNotification } from "../api/notifications.api";
import { getAllUsers } from "../api/users.api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    message: "",
    type: "Info",
  });
  const [error, setError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notifRes, usersRes] = await Promise.all([
        getUserNotifications(currentUser.id || "1"),
        getAllUsers(),
      ]);
      setNotifications(notifRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      fetchData();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await sendNotification(formData);
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      userId: "",
      title: "",
      message: "",
      type: "Info",
    });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <DashboardLayout><Loading /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Send Notification
        </button>
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <p className="empty-state-text">No notifications</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: "16px",
                  background: notif.isRead ? "#ffffff" : "#e0f2fe",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 600 }}>
                      {notif.title}
                    </h4>
                    <p style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "14px" }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <span
                      className="badge badge-primary"
                      style={{ marginLeft: "16px" }}
                    >
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Send Notification"
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Send
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label className="form-label">Recipient *</label>
            <select
              name="userId"
              className="form-select"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              name="message"
              className="form-textarea"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Success">Success</option>
              <option value="Error">Error</option>
            </select>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Notifications;