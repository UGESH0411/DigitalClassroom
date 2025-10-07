import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/dashboard');
    } catch(err) {
      setError(err.message);
    }
  };

  const google = async () => {
    try {
      await loginWithGoogle();
      nav('/dashboard');
    } catch(err) { setError(err.message); }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
      <button onClick={google} className="w-full mt-3 border p-2 rounded">Sign in with Google</button>
      <p className="mt-3 text-sm">Don't have an account? <Link className="text-blue-600" to="/register">Register</Link></p>
    </div>
  );
}
