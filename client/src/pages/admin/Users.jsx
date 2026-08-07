import React, { useState, useEffect } from 'react';
import visitorService from '../../services/visitorService.js';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentUser, setCurrentUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'receptionist',
    employeeId: '',
  });

  const fetchData = async () => {
    try {
      const usersData = await visitorService.getUsers();
      setUsers(usersData);

      const employeesData = await visitorService.getEmployees({ status: 'active' });
      setEmployees(employeesData);
    } catch (err) {
      setError('Failed to fetch user profiles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      username: '',
      password: '',
      role: 'receptionist',
      employeeId: '',
    });
    setModalType('add');
    setShowModal(true);
  };

  const handleOpenEditModal = (usr) => {
    setCurrentUser(usr);
    setFormData({
      username: usr.username,
      password: '', // Clear so we don't display hashed password, user can enter new password to update
      role: usr.role,
      employeeId: usr.employeeId?._id || '',
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Clear employeeId if role is changed from employee
      ...(name === 'role' && value !== 'employee' ? { employeeId: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Additional validations
    if (formData.role === 'employee' && !formData.employeeId) {
      setError('Please associate this account with an Employee profile');
      return;
    }

    try {
      const payload = { ...formData };
      if (modalType === 'edit' && !payload.password) {
        delete payload.password; // Do not update password if left blank
      }

      if (modalType === 'add') {
        await visitorService.createUser(payload);
        setSuccess('Login account created successfully');
      } else {
        await visitorService.updateUser(currentUser._id, payload);
        setSuccess('Account updated successfully');
      }
      fetchData();
      handleCloseModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (usr) => {
    if (window.confirm(`Are you sure you want to delete user "${usr.username}"?`)) {
      try {
        await visitorService.deleteUser(usr._id);
        setSuccess('User account deleted');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Deletion failed');
      }
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1>Manage User Accounts</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <span>🔑</span> Create Account
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <div className="spinner"></div>
          </div>
        ) : users.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No user accounts found. Click "Create Account" to add one.
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Associated Employee</th>
                  <th>Department</th>
                  <th>Account Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr) => (
                  <tr key={usr._id}>
                    <td style={{ fontWeight: '600' }}>{usr.username}</td>
                    <td>
                      <span className={`badge badge-${usr.role === 'admin' ? 'approved' : usr.role === 'receptionist' ? 'info' : 'pending'}`}>
                        {usr.role}
                      </span>
                    </td>
                    <td>{usr.employeeId ? usr.employeeId.name : <em style={{ color: 'var(--text-muted)' }}>None</em>}</td>
                    <td>{usr.employeeId ? usr.employeeId.department : <em style={{ color: 'var(--text-muted)' }}>N/A</em>}</td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(usr.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(usr)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(usr)}
                          disabled={usr.username === 'admin'} // Protect primary admin seeding
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Account Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Create New User Account' : 'Edit User Settings'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Login Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Enter login username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Password {modalType === 'edit' && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(Leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder={modalType === 'add' ? 'Enter temporary password' : 'Enter new password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalType === 'add'}
                  />
                </div>

                <div className="form-group">
                  <label>User Role</label>
                  <select
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="admin">Administrator</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="employee">Employee Host</option>
                  </select>
                </div>

                {formData.role === 'employee' && (
                  <div className="form-group">
                    <label>Link to Employee Profile</label>
                    <select
                      name="employeeId"
                      className="form-control"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Choose Employee profile --</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.department} - {emp.designation})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalType === 'add' ? 'Create Account' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
