import React from 'react';
import type { ComplaintStatus } from '../types';

export const StatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  const styles: Record<ComplaintStatus, string> = {
    'Submitted': 'bg-blue-100 text-blue-700 border-blue-200',
    'Under Review': 'bg-purple-100 text-purple-700 border-purple-200',
    'Assigned': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'In Progress': 'bg-orange-100 text-orange-700 border-orange-200',
    'Resolved': 'bg-green-100 text-green-700 border-green-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200',
    'Escalated': 'bg-red-600 text-white border-red-700',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status}
    </span>
  );
};
