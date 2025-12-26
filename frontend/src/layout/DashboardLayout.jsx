import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
          <div className="user-info">
            <img
              src={user?.avatar || "https://via.placeholder.com/40"}
              alt="avatar"
              className="user-avatar"
            />
            {user && <span className="user-name">{user.fullName || user.email}</span>}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
