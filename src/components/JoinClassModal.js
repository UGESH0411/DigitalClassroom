import React, { useState } from 'react';
import { collection, query, where, getDocs, addDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function JoinClassModal(){
  const [open,setOpen]=useState(false);
  const [code,setCode]=useState('');
  const [msg,setMsg]=useState('');
  const { user } = useAuth();

  const join = async () => {
    setMsg('');
    if (!code) return setMsg('Enter class code');
    const q = query(collection(db, 'classes'), where('code', '==', code));
    const snap = await getDocs(q);
    if (snap.empty) return setMsg('Class not found');
    const cls = snap.docs[0];
    // create classMembers doc
    await addDoc(collection(db, 'classMembers'), {
      classId: cls.id,
      classRef: doc(db, 'classes', cls.id),
      userId: user.uid,
      joinedAt: new Date()
    });
    setMsg('Joined!');
    setOpen(false);
    setCode('');
  };

  return (
    <>
      <button onClick={()=>setOpen(true)} className="px-3 py-1 border rounded">Join Class</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="font-semibold mb-2">Join Class with Code</h3>
            {msg && <div className="text-sm text-green-700">{msg}</div>}
            <input className="w-full p-2 border rounded mb-2" placeholder="CODE" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 border rounded" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={join}>Join</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
