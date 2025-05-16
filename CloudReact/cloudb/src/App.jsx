import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from "./ProtectedRoutes/protectedRoute"
import AddNewUser from "./components/features/UserManagement/AddNewUser"
import EditUser from "./components/features/UserManagement/EditUser"
import AdminPage from "./pages/Admin/AdminPage"
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard"
import CostExplorer from "./pages/CostExplorer"
import Login from "./pages/Login/Login"
import OnboardingDashboard from "./pages/Onboarding/OnboardingDashboard"
import ThankYouPage from "./pages/Onboarding/pages/ThankYou"
import ResourcesPage from "./pages/AWS/ResourcePage"
import { useSelector } from "react-redux"
import SessionTimeoutModal from "./components/layout/Navbar/sessionTimeOutModal"



function App() {
  const isAuthenticated = useSelector(state => state.auth.token);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="add-user" element={<AddNewUser />} />
            <Route path="edit-user/:id" element={<EditUser />} />
            <Route path="cost-explorer" element={<CostExplorer />} />
            <Route path="aws-services" element={<ResourcesPage />} />
            <Route path="onboarding-dashboard" element={<OnboardingDashboard />} />
            <Route path="thank-you" element={<ThankYouPage />} />
          </Route>

          {/* Read-Only Routes */}
          <Route
            path="/readonly"
            element={
              <ProtectedRoute requiredRole="READ_ONLY">
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="cost-explorer" element={<CostExplorer />} />
            <Route path="aws-services" element={<ResourcesPage />} />
          </Route>

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route path="cost-explorer" element={<CostExplorer />} />
            <Route path="aws-services" element={<ResourcesPage />} />
          </Route>
        </Routes>
        {isAuthenticated && <SessionTimeoutModal />}
      </BrowserRouter>
    </>
  );
}

export default App;