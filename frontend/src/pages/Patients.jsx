import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBox from "../components/SearchBox";
import Loading from "../components/Loading";
import { getAllPatients, createPatient, updatePatient } from "../api/patients.api";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber?.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await getAllPatients();
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (err) {
      setError("Failed to fetch patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData);
      } else {
        await createPatient(formData);
      }
      fetchPatients();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      fullName: patient.fullName || "",
      email: patient.email || "",
      phoneNumber: patient.phoneNumber || "",
      dateOfBirth: patient.dateOfBirth?.split("T")[0] || "",
      gender: patient.gender || "",
      address: patient.address || "",
      emergencyContact: patient.emergencyContact || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPatient(null);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      emergencyContact: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const columns = [
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phoneNumber" },
    {
      header: "Date of Birth",
      accessor: "dateOfBirth",
      render: (row) => row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString() : "N/A",
    },
    { header: "Gender", accessor: "gender" },
  ];

  if (loading) return <DashboardLayout><Loading /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Patients Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Patient
        </button>
      </div>

      <div className="card">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search patients..."
        />

        <Table
          columns={columns}
          data={filteredPatients}
          actions={(row) => (
            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(row)}>
              Edit
            </button>
          )}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingPatient ? "Edit Patient" : "Add New Patient"}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingPatient ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              className="form-input"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className="form-textarea"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Contact</label>
            <input
              type="tel"
              name="emergencyContact"
              className="form-input"
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Patients;