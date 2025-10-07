import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

export default function CreateClassModal(){
  const { profile, user } = useAuth();
  const [open,setOpen]=useState(false);
  const [name,setName]=useState('');
  const [section,setSection]=useState('');
  const [err,setErr]=useState('');

  const createClass = async () => {
    if (!name) { setErr('Name required'); return; }
    const code = Math.random().toString(36).substring(2,8).toUpperCase();
    await addDoc(collection(db, 'classes'), {
      name, section, code, createdBy: user.uid, createdAt: serverTimestamp()
    });
    setOpen(false); setName(''); setSection('');
  };

  if (profile?.role !== 'teacher') return null;

  return (
    <>
      <button onClick={()=>setOpen(true)} className="px-3 py-1 bg-blue-600 text-white rounded">Create Class</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="font-semibold mb-2">Create Class</h3>
            {err && <div className="text-red-600">{err}</div>}
            <input className="w-full p-2 border rounded mb-2" placeholder="Class name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="w-full p-2 border rounded mb-2" placeholder="Section/Subject" value={section} onChange={e=>setSection(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 border rounded" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={createClass}>Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
