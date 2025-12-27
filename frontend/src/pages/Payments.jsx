import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBox from "../components/SearchBox";
import Loading from "../components/Loading";
import { getAllPayments, processPayment } from "../api/payments.api";
import { getAllAppointments } from "../api/appointments.api";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    appointmentId: "",
    amount: "",
    paymentMethod: "",
    transactionId: "",
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = payments.filter(
      (payment) =>
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, aptRes] = await Promise.all([
        getAllPayments(),
        getAllAppointments(),
      ]);
      setPayments(payRes.data);
      setFilteredPayments(payRes.data);
      setAppointments(aptRes.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await processPayment(formData);
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      appointmentId: "",
      amount: "",
      paymentMethod: "",
      transactionId: "",
      notes: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Paid: "badge-success",
      Pending: "badge-warning",
      Failed: "badge-danger",
      Refunded: "badge-info",
    };
    return `badge ${statusMap[status] || "badge-primary"}`;
  };

  const columns = [
    {
      header: "Transaction ID",
      accessor: "transactionId",
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => `$${row.amount?.toFixed(2) || "0.00"}`,
    },
    {
      header: "Payment Method",
      accessor: "paymentMethod",
    },
    {
      header: "Date",
      accessor: "paymentDate",
      render: (row) =>
        row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : "N/A",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <span className={getStatusBadge(row.status)}>{row.status}</span>,
    },
  ];

  if (loading) return <DashboardLayout><Loading /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Process Payment
        </button>
      </div>

      <div className="card">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search payments..."
        />

        <Table columns={columns} data={filteredPayments} />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Process Payment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Process
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label className="form-label">Appointment *</label>
            <select
              name="appointmentId"
              className="form-select"
              value={formData.appointmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Appointment</option>
              {appointments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.id} - {new Date(apt.appointmentDateTime).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Amount *</label>
            <input
              type="number"
              name="amount"
              className="form-input"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method *</label>
            <select
              name="paymentMethod"
              className="form-select"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              className="form-input"
              value={formData.transactionId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              className="form-textarea"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Payments;