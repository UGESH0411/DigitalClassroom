import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register(){
  const { register } = useAuth();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [displayName,setDisplayName]=useState('');
  const [role,setRole]=useState('student');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(email,password,displayName,role);
      nav('/dashboard');
    } catch(err) {
      setErr(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {err && <div className="text-red-600">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Full name" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div>
          <label className="mr-3"><input type="radio" checked={role==='student'} onChange={()=>setRole('student')} /> Student</label>
          <label><input type="radio" checked={role==='teacher'} onChange={()=>setRole('teacher')} /> Teacher</label>
        </div>
        <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
