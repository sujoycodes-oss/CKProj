import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserList from '../../../components/features/UserManagement/UserList';
import '../../../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const role = useSelector(state => state.auth.role);

  const handleAddUser = () => {
    navigate('/admin/add-user');
  };

  const isReadOnly = role === 'READ_ONLY';

  return (
    <div className='users-dashboard'>
      <div className='set-users'>
        <h1>Users</h1>
        <div className='floating-top'>
          <button
            className={`whole-btn ${isReadOnly ? 'readonly-disabled' : ''}`}
            onClick={handleAddUser}
            disabled={isReadOnly}
            style={{
              display: isReadOnly ? 'none' : 'block'
            }}
          >
            <FaPlus className='fa-plus' /> Add New User
          </button>
        </div>
        <div className='user-list'>
          <UserList />
        </div>
      </div>
    </div >
  );
}

export default AdminDashboard;
