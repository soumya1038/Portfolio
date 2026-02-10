import { Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './pages/viewer/Portfolio';
import ProjectDetail from './pages/viewer/ProjectDetail';
import Dashboard from './pages/owner/Dashboard';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/common/ErrorBoundary';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
