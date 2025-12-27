import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">Clinic CRM</h2>

      <nav>
        <NavLink to="/dashboard" className="nav-link">
          📊 Dashboard
        </NavLink>

        <NavLink to="/dashboard/appointments" className="nav-link">
          📅 Appointments
        </NavLink>

        <NavLink to="/dashboard/patients" className="nav-link">
          🏥 Patients
        </NavLink>

        <NavLink to="/dashboard/doctors" className="nav-link">
          👨‍⚕️ Doctors
        </NavLink>

        <NavLink to="/dashboard/services" className="nav-link">
          🔬 Services
        </NavLink>

        <NavLink to="/dashboard/payments" className="nav-link">
          💳 Payments
        </NavLink>

        <NavLink to="/dashboard/users" className="nav-link">
          👥 Users
        </NavLink>

        <NavLink to="/dashboard/reports" className="nav-link">
          📈 Reports
        </NavLink>

        <NavLink to="/dashboard/notifications" className="nav-link">
          🔔 Notifications
        </NavLink>

        <NavLink to="/dashboard/settings" className="nav-link">
          ⚙️ Settings
        </NavLink>

        <NavLink to="/dashboard/card-types" className="nav-link">
          💳 Card Types
        </NavLink>

        <NavLink to="/dashboard/branches" className="nav-link">
          🏢 Branches
        </NavLink>
      </nav>

      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
