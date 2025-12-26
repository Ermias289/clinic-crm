// Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">Clinic CRM</h2>

      <nav>
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/card-types" className="nav-link">
          Card Types
        </NavLink>

        <NavLink to="/dashboard/branches" className="nav-link">
          Branches
        </NavLink>

        {/* Settings with dropdown */}
        <div className="settings-container">
          <div
            className="nav-link"
            onClick={() => setShowSettings(!showSettings)}
            >
            Settings {showSettings ? "▾" : "▸"}
        </div>
          {showSettings && (
            <div className="dropdown">
              <NavLink to="/dashboard/settings/profile" className="dropdown-item">
                Profile
              </NavLink>
              <NavLink to="/dashboard/settings/notifications" className="dropdown-item">
                Notifications
              </NavLink>
              <NavLink to="/dashboard/settings/preferences" className="dropdown-item">
                Preferences
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
