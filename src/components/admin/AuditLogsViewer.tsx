import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Clock, ArrowRight } from 'lucide-react';
import { SystemActionLog } from '@/types';

interface AuditLogsViewerProps {
  logs: SystemActionLog[];
}

export function AuditLogsViewer({ logs }: AuditLogsViewerProps) {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  const filtered = logs.filter(l => {
    const matchesModule = moduleFilter === 'all' ? true : l.module === moduleFilter;
    const matchesSearch = 
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      (l.targetName && l.targetName.toLowerCase().includes(search.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
      case 'provision_account':
        return 'bg-emerald-100 text-emerald-800';
      case 'delete':
        return 'bg-rose-100 text-rose-800';
      case 'update':
      case 'password_reset':
        return 'bg-amber-100 text-amber-800';
      case 'payment_verified':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['all', 'auth', 'finance', 'system'].map(mod => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                moduleFilter === mod
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-[#ECE6DD] hover:bg-stone-50'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search action logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white border border-[#ECE6DD] rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-stone-900 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Logs Table */}
      {filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-[#ECE6DD] text-center text-xs text-stone-500">
          No audit logs matching query.
        </div>
      ) : (
        <div className="bg-white border border-[#ECE6DD] rounded-2xl overflow-hidden divide-y divide-[#ECE6DD] text-xs">
          {filtered.map(log => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-stone-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getActionBadge(log.actionType)}`}>
                    {log.actionType}
                  </span>
                  <span className="font-semibold text-stone-900">{log.description}</span>
                </div>
                <div className="text-stone-500 text-[11px]">
                  Performed by <strong className="text-stone-700">{log.actorName}</strong> ({log.actorRole}) · Module: <span className="font-mono text-stone-600">{log.module}</span>
                </div>
              </div>

              <div className="text-stone-400 font-mono text-[11px] shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
