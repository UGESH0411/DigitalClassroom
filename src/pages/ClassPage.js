import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function ClassPage(){
  const { id } = useParams();
  const [classDoc, setClassDoc] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuth();
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const clsRef = doc(db, 'classes', id);
    getDoc(clsRef).then(snap => setClassDoc({ id: snap.id, ...snap.data() }));
    const q = query(collection(db, 'posts'), where('classId', '==', id));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d=>({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      
      // Check file type (optional - allow common document and image types)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('File type not supported. Please upload PDF, Word, Excel, PowerPoint, text, or image files.');
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const postAnnouncement = async () => {
    if (!content.trim() && !file) {
      alert('Please enter content or select a file');
      return;
    }

    setUploading(true);
    try {
      let fileURL = '';
      if (file) {
        console.log('Starting file upload...', file.name);
        const sref = ref(storage, `classFiles/${id}/${Date.now()}_${file.name}`);
        
        try {
          const uploadTask = uploadBytesResumable(sref, file);
          
          // Wait for upload to complete
          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
              },
              (error) => {
                console.error('Upload failed:', error);
                reject(error);
              },
              () => {
                console.log('Upload completed successfully');
                resolve();
              }
            );
          });
          
          fileURL = await getDownloadURL(sref);
          console.log('File URL obtained:', fileURL);
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          alert('Failed to upload file. Please try again.');
          return;
        }
      }
      
      await addDoc(collection(db, 'posts'), {
        classId: id,
        authorId: user.uid,
        authorName: profile.displayName || '',
        content,
        fileURL,
        fileName: file ? file.name : '',
        createdAt: serverTimestamp(),
        type: 'announcement'
      });
      
      setContent(''); 
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      console.log('Post created successfully');
    } catch (error) {
      console.error('Error posting announcement:', error);
      alert('Failed to post announcement. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!classDoc) return <div>Loading class...</div>;

  return (
    <div>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold">{classDoc.name}</h2>
        <p className="text-sm text-gray-500">Code: <strong>{classDoc.code}</strong></p>
      </div>

      {profile?.role === 'teacher' && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-semibold mb-2">Create Announcement / Assignment</h3>
          <textarea 
            className="w-full p-2 border rounded mb-2" 
            value={content} 
            onChange={e=>setContent(e.target.value)} 
            placeholder="Write announcement or assignment details"
            rows="3"
          ></textarea>
          <div className="mb-2">
            <input 
              type="file" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button 
              className="px-3 py-1 border rounded"
              onClick={() => {
                setContent('');
                setFile(null);
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
              }}
              disabled={uploading}
            >
              Cancel
            </button>
            <button 
              className={`px-3 py-1 rounded text-white ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={postAnnouncement}
              disabled={uploading}
            >
              {uploading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading && <div>Loading posts...</div>}
        {posts.map(p => (
          <div key={p.id} className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-600">{p.authorName} • {p.createdAt?.toDate?.()?.toLocaleString?.() || ''}</div>
            <div className="mt-2">{p.content}</div>
            {p.fileURL && (
              <div className="mt-2">
                <a 
                  href={p.fileURL} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  📎 {p.fileName || 'Attached file'}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
