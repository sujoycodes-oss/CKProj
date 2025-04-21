import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import UserList from '../../../components/features/UserManagement/UserList';
import '../../../styles/AdminDashboard.css';


function AdminDashboard() {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate('/admin/add-user');
  }

  return (
    <div className='users-dashboard'>
      <div className='set-users'>
        <div className='floating-top'>
          <h1>Users</h1>
          <button className='whole-btn' onClick={handleAddUser}>
            <FaPlus className='fa-plus' /> Add New User
          </button>
        </div>
        <div className='user-list'>
          <UserList />
        </div>
      </div>
    </div>

  )
}

export default AdminDashboard
