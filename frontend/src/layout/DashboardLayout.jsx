import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.content}>{children}</main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f4f6f8",
  },
  content: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
  },
};

export default DashboardLayout;
