import DashboardLayout from "../layout/DashboardLayout";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Patients",
        data: [12, 19, 8, 15, 10],
        backgroundColor: "#2563eb",
      },
    ],
  };

  const pieData = {
    labels: ["Card Type A", "Card Type B", "Card Type C"],
    datasets: [
      {
        label: "Card Distribution",
        data: [12, 7, 5],
        backgroundColor: ["#2563eb", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <DashboardLayout>
      <h1>Welcome to Clinic CRM</h1>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "24px" }}>
        <div style={{ flex: 1, minWidth: "300px", background: "#fff", padding: "20px", borderRadius: "12px" }}>
          <h3>Patients per Month</h3>
          <Bar data={barData} />
        </div>

        <div style={{ flex: 1, minWidth: "300px", background: "#fff", padding: "20px", borderRadius: "12px" }}>
          <h3>Card Types Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
