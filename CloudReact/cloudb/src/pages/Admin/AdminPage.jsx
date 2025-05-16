import { Outlet } from 'react-router-dom'
import Footer from '../../components/layout/Footer/footer'
import Navbar from '../../components/layout/Navbar/Navbar'
import Sidebar from '../../components/layout/Sidebar/Sidebar'
import '../../styles/AdminPage.css'
import { useSelector } from 'react-redux'
import useSessionInactivityHandler from '../../components/layout/Navbar/useSessionInactivityHandler'

const AdminPage = () => {
  const token = useSelector(state => state.auth.token);
  
  // Initialize the session inactivity handler
  useSessionInactivityHandler();
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className='dashboard'>
      <Navbar />
      <div className='dashboard-content'>
        <Sidebar />
        <div className='main-area'>
          <div className='outlet-content'>
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default AdminPage
  