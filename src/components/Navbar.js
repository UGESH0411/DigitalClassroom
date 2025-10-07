import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="font-bold text-lg">Digital Classroom</Link>
          <span className="text-sm text-gray-500">{profile?.role ? profile.role.toUpperCase() : ''}</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button className="px-3 py-1 border rounded" onClick={() => nav('/dashboard')}>Dashboard</button>
              <Link to="/profile" className="px-3 py-1 border rounded">Profile</Link>
              <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-blue-600 text-white rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
