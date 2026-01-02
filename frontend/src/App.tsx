import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IdeaListPage from './pages/IdeaListPage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import IdeaFormPage from './pages/IdeaFormPage';

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* 公共路由 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* 受保护的路由 */}
              <Route path="/" element={<ProtectedRoute><IdeaListPage /></ProtectedRoute>} />
              <Route path="/ideas" element={<ProtectedRoute><IdeaListPage /></ProtectedRoute>} />
              <Route path="/ideas/:id" element={<ProtectedRoute><IdeaDetailPage /></ProtectedRoute>} />
              <Route path="/ideas/new" element={<ProtectedRoute><IdeaFormPage /></ProtectedRoute>} />
              <Route path="/ideas/edit/:id" element={<ProtectedRoute><IdeaFormPage /></ProtectedRoute>} />
              
              {/* 默认路由重定向 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
