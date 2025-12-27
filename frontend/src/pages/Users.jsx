import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBox from "../components/SearchBox";
import Loading from "../components/Loading";
import { getAllUsers, createUser, updateUser, deleteUser } from "../api/users.api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    userRole: "USER",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      userRole: user.userRole || "USER",
      password: "",
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      userRole: "USER",
      password: "",
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
      header: "Role",
      accessor: "userRole",
      render: (row) => <span className="badge badge-primary">{row.userRole}</span>,
    },
    {
      header: "Status",
      accessor: "isConfirmed",
      render: (row) => (
        <span className={`badge ${row.isConfirmed ? "badge-success" : "badge-warning"}`}>
          {row.isConfirmed ? "Active" : "Pending"}
        </span>
      ),
    },
  ];

  if (loading) return <DashboardLayout><Loading /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Users Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add User
        </button>
      </div>

      <div className="card">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, email, or phone..."
        />

        <Table
          columns={columns}
          data={filteredUsers}
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
        title={editingUser ? "Edit User" : "Add New User"}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingUser ? "Update" : "Create"}
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
            <label className="form-label">Role *</label>
            <select
              name="userRole"
              className="form-select"
              value={formData.userRole}
              onChange={handleChange}
              required
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          {!editingUser && (
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required={!editingUser}
              />
            </div>
          )}
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Users;