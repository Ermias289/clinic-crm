import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>Clinic CRM</h2>

      <nav>
        <NavLink to="/dashboard" style={styles.link}>
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/card-types" style={styles.link}>
          Card Types
        </NavLink>

        <NavLink to="/dashboard/branches" style={styles.link}>
          Branches
        </NavLink>
      </nav>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "230px",
    background: "#1e293b",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    textAlign: "center",
    marginBottom: "30px",
  },
  link: {
    display: "block",
    padding: "10px",
    color: "#cbd5e1",
    textDecoration: "none",
    borderRadius: "6px",
    marginBottom: "8px",
  },
  logout: {
    marginTop: "auto",
    padding: "10px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Sidebar;
