import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBox from "../components/SearchBox";
import Loading from "../components/Loading";
import {
  getAllAppointments,
  createAppointment,
  cancelAppointment,
  completeAppointment,
  deleteAppointment,
} from "../api/appointments.api";
import { getAllPatients } from "../api/patients.api";
import { getAllDoctors } from "../api/doctors.api";
import { getAllServices } from "../api/services.api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    serviceId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter((apt) => {
      const patientName = patients.find((p) => p.id === apt.patientId)?.fullName || "";
      const doctorName = doctors.find((d) => d.id === apt.doctorId)?.fullName || "";
      return (
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredAppointments(filtered);
  }, [searchTerm, appointments, patients, doctors]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, patRes, docRes, srvRes] = await Promise.all([
        getAllAppointments(),
        getAllPatients(),
        getAllDoctors(),
        getAllServices(),
      ]);
      setAppointments(aptRes.data);
      setFilteredAppointments(aptRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
      setServices(srvRes.data);
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
      await createAppointment({
        ...formData,
        appointmentDateTime: `${formData.appointmentDate}T${formData.appointmentTime}`,
      });
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleComplete = async (appointmentId) => {
    if (!window.confirm("Mark this appointment as completed?")) return;

    try {
      await completeAppointment(appointmentId);
      fetchData();
    } catch (err) {
      setError("Failed to complete appointment");
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }

    try {
      await cancelAppointment(selectedAppointment.id, cancelReason);
      fetchData();
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedAppointment(null);
    } catch (err) {
      setError("Failed to cancel appointment");
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await deleteAppointment(appointmentId);
      fetchData();
    } catch (err) {
      setError("Failed to delete appointment");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      patientId: "",
      doctorId: "",
      serviceId: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Scheduled: "badge-info",
      Completed: "badge-success",
      Cancelled: "badge-danger",
      Pending: "badge-warning",
    };
    return `badge ${statusMap[status] || "badge-primary"}`;
  };

  const columns = [
    {
      header: "Patient",
      accessor: "patientId",
      render: (row) => patients.find((p) => p.id === row.patientId)?.fullName || "N/A",
    },
    {
      header: "Doctor",
      accessor: "doctorId",
      render: (row) => doctors.find((d) => d.id === row.doctorId)?.fullName || "N/A",
    },
    {
      header: "Service",
      accessor: "serviceId",
      render: (row) => services.find((s) => s.id === row.serviceId)?.name || "N/A",
    },
    {
      header: "Date & Time",
      accessor: "appointmentDateTime",
      render: (row) =>
        row.appointmentDateTime
          ? new Date(row.appointmentDateTime).toLocaleString()
          : "N/A",
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
        <h1 className="page-title">Appointments</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Appointment
        </button>
      </div>

      <div className="card">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search appointments..."
        />

        <Table
          columns={columns}
          data={filteredAppointments}
          actions={(row) => (
            <>
              {row.status === "Scheduled" && (
                <>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleComplete(row.id)}
                  >
                    Complete
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleCancelClick(row)}
                  >
                    Cancel
                  </button>
                </>
              )}
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id)}>
                Delete
              </button>
            </>
          )}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="New Appointment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Create
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select
              name="patientId"
              className="form-select"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Doctor *</label>
            <select
              name="doctorId"
              className="form-select"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Service *</label>
            <select
              name="serviceId"
              className="form-select"
              value={formData.serviceId}
              onChange={handleChange}
              required
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              name="appointmentDate"
              className="form-input"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time *</label>
            <input
              type="time"
              name="appointmentTime"
              className="form-input"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
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

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Appointment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>
              Close
            </button>
            <button className="btn btn-danger" onClick={handleCancelSubmit}>
              Cancel Appointment
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Cancellation Reason *</label>
          <textarea
            className="form-textarea"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
            required
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Appointments;