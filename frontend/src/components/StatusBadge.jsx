import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

/**
 * Returns human-readable situation and styling for an issue status
 */
export const getStatusSituation = (status) => {
  const s = (status || '').toLowerCase().trim();

  if (s === 'resolved' || s === 'completed') {
    return {
      situation: 'Completed',
      label: 'Completed',
      badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      dotClass: 'bg-emerald-400',
      icon: CheckCircle2
    };
  }

  if (s === 'progress' || s === 'in-progress' || s === 'review') {
    return {
      situation: 'Pending',
      label: 'In Progress (Pending)',
      badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
      dotClass: 'bg-amber-400 animate-pulse',
      icon: Clock
    };
  }

  return {
    situation: 'Pending',
    label: 'Pending',
    badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    dotClass: 'bg-amber-400',
    icon: AlertCircle
  };
};

/**
 * Clean, readable situation badge showing Pending or Completed
 */
const StatusBadge = ({ status, showSimple = false, className = '' }) => {
  const { situation, label, badgeClass, dotClass } = getStatusSituation(status);
  const displayText = showSimple ? situation : (situation === 'Completed' ? 'Completed' : (status === 'progress' ? 'In Progress' : 'Pending'));

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border tracking-wide select-none ${badgeClass} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
      <span className="font-medium">{displayText}</span>
    </span>
  );
};

export default StatusBadge;
