import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoutes'
import Layout from './components/Layout'


import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import AdminClinicInfo from './pages/admin/AdminClinicInfo'
import AdminUsers from './pages/admin/AdminUsers'
import PatientAppointments from './pages/patient/PatientAppointments'
import BookAppointment from './pages/patient/BookAppointment'
import AppointmentDetail from './pages/patient/AppointmentDetail'
import PatientPrescriptions from './pages/patient/PatientPrescriptions'
import PatientReports from './pages/patient/PatientReports'
import ReceptionistQueue from './pages/receptionist/ReceptionistQueue'
import DoctorQueue from './pages/doctor/DoctorQueue'
import AddPrescription from './pages/doctor/AddPrescription'
import AddReport from './pages/doctor/AddReport'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

        
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin */}
            <Route path="/admin/clinic" element={<ProtectedRoute allowedRoles={["admin"]}><AdminClinicInfo /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />

            {/* Patient */}
            <Route path="/appointments" element={<ProtectedRoute allowedRoles={["patient"]}><PatientAppointments /></ProtectedRoute>} />
            <Route path="/appointments/book" element={<ProtectedRoute allowedRoles={["patient"]}><BookAppointment /></ProtectedRoute>} />
            <Route path="/appointments/:id" element={<ProtectedRoute allowedRoles={["patient"]}><AppointmentDetail /></ProtectedRoute>} />
            <Route path="/prescriptions" element={<ProtectedRoute allowedRoles={["patient"]}><PatientPrescriptions /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={["patient"]}><PatientReports /></ProtectedRoute>} />

            {/* Receptionist */}
            <Route path="/queue" element={<ProtectedRoute allowedRoles={["receptionist"]}><ReceptionistQueue /></ProtectedRoute>} />

            {/* Doctor */}
            <Route path="/doctor/queue" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorQueue /></ProtectedRoute>} />
            <Route path="/doctor/prescriptions/:appointmentId" element={<ProtectedRoute allowedRoles={["doctor"]}><AddPrescription /></ProtectedRoute>} />
            <Route path="/doctor/reports/:appointmentId" element={<ProtectedRoute allowedRoles={["doctor"]}><AddReport /></ProtectedRoute>} />
          </Route>

          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
