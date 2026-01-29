import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import Courses from './pages/admin/Courses';
import Assignments from './pages/admin/Assignments';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import CoursePlayer from './pages/employee/CoursePlayer';

const Reports = () => <div className="text-2xl font-bold">Reports - Coming Soon</div>;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<Layout />}>
                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/employees" element={<Employees />} />
                  <Route path="/admin/courses" element={<Courses />} />
                  <Route path="/admin/assignments" element={<Assignments />} />
                  <Route path="/admin/reports" element={<Reports />} />
                </Route>

                {/* Employee Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
                  <Route path="/dashboard" element={<EmployeeDashboard />} />
                  <Route path="/my-trainings" element={<EmployeeDashboard />} />
                  <Route path="/course/:id" element={<CoursePlayer />} />
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
