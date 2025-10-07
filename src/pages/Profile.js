import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export default function Profile(){
  const { user, profile } = useAuth();
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [msg, setMsg] = useState('');

  const upload = async () => {
    if (!file) return setMsg('Select an image');
    const sref = ref(storage, `avatars/${user.uid}_${file.name}`);
    const task = uploadBytesResumable(sref, file);
    await task;
    const url = await getDownloadURL(sref);
    // update auth profile and firestore
    await updateProfile(auth.currentUser, { photoURL: url, displayName });
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, { photoURL: url, displayName });
    setMsg('Profile updated');
  };

  return (
    <div className="max-w-md bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Profile</h2>
      <div className="mb-2">Name</div>
      <input className="w-full p-2 border rounded mb-2" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
      <div className="mb-2">Profile picture</div>
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <div className="flex gap-2 mt-3">
        <button className="px-3 py-1 border rounded" onClick={()=>setMsg('')}>Cancel</button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={upload}>Save</button>
      </div>
      {msg && <div className="mt-2 text-green-700">{msg}</div>}
    </div>
  );
}
