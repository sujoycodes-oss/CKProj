import ProtectedRoute from "./ProtectedRoutes/protectedRoute"
import Login from "./pages/Login/Login"
// import AdminDashboard from "./component/AdminDashboard"
import { BrowserRouter, Route, Routes } from "react-router-dom"
// import Sidebar from "./component/Sidebar"
import AdminPage from "./pages/Admin/AdminPage"
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard"
// import { AddUserForm } from "./component/AddUserForm"
import AddNewUser from "./components/features/UserManagement/AddNewUser"
import AwsServices from "./pages/AwsServices"
import CostExplorer from "./pages/CostExplorer"
// import Onboarding from "./pages/Onboarding"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import FirstPage from "./pages/FirstPage"
import OnboardingDashboard from "./pages/Onboarding/OnboardingDashboard"
import ThankYouPage from "./pages/ThankYou"
import EditUser from "./components/features/UserManagement/EditUser"
// import OnboardingDashboard from "./pages/OnboardingDashboard"
// import { useSelector } from "react-redux"
// import { useDispatch } from "react-redux"
// import { useEffect } from "react"
// import { loadUserFromToken } from "./redux/actions/authActions"

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(loadUserFromToken());
  // }, [dispatch]);

  // const { isAuthenticated } = useSelector(state => state.auth);

  // if (!sessionStorage.getItem('persist:root')) return null;

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/admin/*'
            element={
              <ProtectedRoute requiredRole='ADMIN'>
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path='add-user' element={<AddNewUser />} />
            <Route path="edit-user/:id" element={<EditUser />} />
            <Route path='cost-explorer' element={<CostExplorer />} />
            <Route path='aws-services' element={<AwsServices />} />
            <Route path="onboarding-dashboard" element={<OnboardingDashboard />}/>
            <Route path="thank-you" element={<ThankYouPage/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
