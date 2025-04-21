import { Outlet } from 'react-router-dom'
import Footer from '../../components/layout/Footer/footer'
import Navbar from '../../components/layout/Navbar/Navbar'
import Sidebar from '../../components/layout/Sidebar/Sidebar'
import '../../styles/AdminPage.css'

const AdminPage = () => {
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
  