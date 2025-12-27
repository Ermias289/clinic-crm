import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBox from "../components/SearchBox";
import Loading from "../components/Loading";
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from "../api/doctors.api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(
      (doctor) =>
        doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await getAllDoctors();
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (err) {
      setError("Failed to fetch doctors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, formData);
      } else {
        await createDoctor(formData);
      }
      fetchDoctors();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      fullName: doctor.fullName || "",
      email: doctor.email || "",
      phoneNumber: doctor.phoneNumber || "",
      specialization: doctor.specialization || "",
      licenseNumber: doctor.licenseNumber || "",
      yearsOfExperience: doctor.yearsOfExperience || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await deleteDoctor(doctorId);
      fetchDoctors();
    } catch (err) {
      setError("Failed to delete doctor");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      specialization: "",
      licenseNumber: "",
      yearsOfExperience: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const columns = [
    { header: "Name", accessor: "fullName" },
    { header: "Specialization", accessor: "specialization" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phoneNumber" },
    { header: "License #", accessor: "licenseNumber" },
    { header: "Experience", accessor: "yearsOfExperience", render: (row) => `${row.yearsOfExperience || 0} years` },
  ];

  if (loading) return <DashboardLayout><Loading /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Medical Professionals</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Doctor
        </button>
      </div>

      <div className="card">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search doctors..."
        />

        <Table
          columns={columns}
          data={filteredDoctors}
          actions={(row) => (
            <>
              <button className="btn btn-sm btn-primary" onClick={() => handleEdit(row)}>
                Edit
              </button>
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
        title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingDoctor ? "Update" : "Create"}
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
            <label className="form-label">Specialization *</label>
            <input
              type="text"
              name="specialization"
              className="form-input"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              className="form-input"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              className="form-input"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              min="0"
            />
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Doctors;