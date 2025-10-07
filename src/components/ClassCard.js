import React from 'react';
import { Link } from 'react-router-dom';

export default function ClassCard({ data, myRole }) {
  // Ensure title and section are displayed correctly
  const title = data.name || 'Untitled Class';
  const subtitle = data.section || data.subject || '';
  const id = data.id;

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link to={`/class/${id}`} className="px-3 py-1 border rounded hover:bg-gray-100 transition">Open</Link>
        </div>
      </div>
    </div>
  );
}
