import { Routes, Route, Navigate } from 'react-router-dom';
import { useMockData } from './context/MockDataContext';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import RaiseComplaint from './pages/student/RaiseComplaint';
import TrackComplaint from './pages/student/TrackComplaint';
import FacultyDashboard from './pages/faculty/Dashboard';
import ComplaintDetails from './pages/faculty/ComplaintDetails';
import AdminDashboard from './pages/admin/Dashboard';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { currentUser } = useMockData();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to their respective dashboard if they try to access wrong role route
    return <Navigate to={`/${currentUser.role}`} replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { currentUser } = useMockData();

  return (
    <div className="min-h-screen bg-light-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/raise" element={
          <ProtectedRoute allowedRoles={['student']}>
            <RaiseComplaint />
          </ProtectedRoute>
        } />
        <Route path="/student/track/:id" element={
          <ProtectedRoute allowedRoles={['student']}>
            <TrackComplaint />
          </ProtectedRoute>
        } />

        {/* Faculty Routes */}
        <Route path="/faculty" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/faculty/complaint/:id" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <ComplaintDetails />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Default route based on auth */}
        <Route path="*" element={
          currentUser ? <Navigate to={`/${currentUser.role}`} replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </div>
  );
}

export default App;
