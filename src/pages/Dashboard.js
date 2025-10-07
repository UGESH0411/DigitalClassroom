import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import ClassCard from '../components/ClassCard';
import CreateClassModal from '../components/CreateClassModal';
import JoinClassModal from '../components/JoinClassModal';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    if (profile.role === 'teacher') {
      // Teacher: classes created by them
      const q = query(collection(db, 'classes'), where('createdBy', '==', user.uid));
      const unsub = onSnapshot(q, snap => {
        setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
      return unsub;
    } else {
      // Student: fetch classMembers, then fetch each class doc
      const q = query(collection(db, 'classMembers'), where('userId', '==', user.uid));
      const unsub = onSnapshot(q, async snap => {
        const classItems = await Promise.all(
          snap.docs.map(async d => {
            const data = d.data();
            if (!data.classId) return null;
            const clsSnap = await getDoc(doc(db, 'classes', data.classId));
            if (!clsSnap.exists()) return null;
            return { id: clsSnap.id, ...clsSnap.data() };
          })
        );
        setClasses(classItems.filter(Boolean));
        setLoading(false);
      });
      return unsub;
    }
  }, [profile, user]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Welcome, {profile.displayName || 'User'}</h1>
        <div className="flex gap-2">
          {profile.role === 'teacher' && <CreateClassModal />}
          <JoinClassModal />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && <div>Loading classes...</div>}
        {!loading && classes.length === 0 && <div>No classes yet.</div>}
        {classes.map(c => (
          <ClassCard key={c.id} data={c} myRole={profile.role} />
        ))}
      </div>
    </div>
  );
}
