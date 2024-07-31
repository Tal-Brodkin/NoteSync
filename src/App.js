import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Notes from './components/Notes';
import { AuthProvider, AuthContext } from './components/AuthContext'; // Import AuthProvider and AuthContext
import 'bootstrap/dist/css/bootstrap.min.css';

function ProtectedRoute({ element }) {
  const { currentUser } = React.useContext(AuthContext);
  return currentUser ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notes" element={<ProtectedRoute element={<Notes />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;