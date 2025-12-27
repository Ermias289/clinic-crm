import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBox from "../components/SearchBox";
import Loading from "../components/Loading";
import { getAllServices, createService, deleteService } from "../api/services.api";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAllServices();
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (err) {
      setError("Failed to fetch services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createService(formData);
      fetchServices();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteService(serviceId);
      fetchServices();
    } catch (err) {
      setError("Failed to delete service");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const columns = [
    { header: "Service Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Price",
      accessor: "price",
      render: (row) => `$${row.price?.toFixed(2) || "0.00"}`,
    },
    {
      header: "Duration",
      accessor: "duration",
      render: (row) => `${row.duration || 0} min`,
    },
  ];

  if (loading) return <DashboardLayout><Loading /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Medical Services</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Service
        </button>
      </div>

      <div className="card">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search services..."
        />

        <Table
          columns={columns}
          data={filteredServices}
          actions={(row) => (
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id)}>
              Delete
            </button>
          )}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Add New Service"
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
            <label className="form-label">Service Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price *</label>
            <input
              type="number"
              name="price"
              className="form-input"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              className="form-input"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Services;