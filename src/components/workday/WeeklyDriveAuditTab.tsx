import React, { useState } from 'react';
import { 
  FolderCheck, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  RotateCcw, 
  Archive, 
  Lock, 
  Layers, 
  Clock, 
  Check, 
  Copy, 
  Calendar,
  Search,
  HardDrive
} from 'lucide-react';
import { Client, DriveAuditRecord } from '@/types';

interface WeeklyDriveAuditTabProps {
  clients: Client[];
  userFullName: string;
}

interface AuditStep {
  id: string;
  stepNumber: number;
  title: string;
  category: 'Hierarchy' | 'Naming' | 'Permissions' | 'Archiving' | 'Sync' | 'SignOff';
  summary: string;
  items: { id: string; label: string; detail: string; completed: boolean }[];
}

export const WeeklyDriveAuditTab: React.FC<WeeklyDriveAuditTabProps> = ({
  clients,
  userFullName
}) => {
  const activeClients = clients.filter(c => c.status === 'active');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [copiedName, setCopiedName] = useState(false);

  // File Naming Helper State
  const [namingClientCode, setNamingClientCode] = useState(clients[0]?.code || 'ARKG');
  const [namingProject, setNamingProject] = useState('PitchDeck');
  const [namingDocType, setNamingDocType] = useState('Presentation');
  const [namingDate, setNamingDate] = useState(() => new Date().toISOString().split('T')[0].replace(/-/g, ''));
  const [namingVersion, setNamingVersion] = useState('v1.0');

  const generatedFileName = `${namingClientCode}_${namingProject}_${namingDocType}_${namingDate}_${namingVersion}`;

  // Audit Steps Checklist
  const [auditSteps, setAuditSteps] = useState<AuditStep[]>([
    {
      id: 'step_1',
      stepNumber: 1,
      category: 'Hierarchy',
      title: 'Client Folder Hierarchy & Ingestion Check',
      summary: 'Inspect client Google Drive root directories and verify standard subfolder structures.',
      items: [
        {
          id: 's1_1',
          label: 'Scan "00_INBOX / Dropzone" in each client drive',
          detail: 'Check for unorganized files uploaded by client or team during the week; triage to proper folders.',
          completed: true
        },
        {
          id: 's1_2',
          label: 'Verify standard folder structure is maintained',
          detail: 'Ensure 01_Deliverables, 02_Resources, 03_MeetingNotes, 04_Contracts, 99_Archive are present.',
          completed: true
        },
        {
          id: 's1_3',
          label: 'Relocate stray files on root drive level',
          detail: 'No loose files allowed in root Google Drive workspace.',
          completed: false
        }
      ]
    },
    {
      id: 'step_2',
      stepNumber: 2,
      category: 'Naming',
      title: 'File Naming Standardization Audit',
      summary: 'Ensure 100% adherence to AEDMIN executive file naming standards across all active deliverables.',
      items: [
        {
          id: 's2_1',
          label: 'Enforce standard format: [Client]_[Project]_[DocType]_[YYYYMMDD]_[v#]',
          detail: 'Eliminate underscores, double spaces, or vague names like "Document (1).pdf" or "Untitled".',
          completed: true
        },
        {
          id: 's2_2',
          label: 'Update version tags on modified deliverables',
          detail: 'Ensure latest files reflect v1.1, v2.0 or FINAL tag; rename deprecated versions.',
          completed: false
        },
        {
          id: 's2_3',
          label: 'Check date stamps on recurring reports',
          detail: 'Weekly briefings and EOD files must match accurate ISO date codes.',
          completed: false
        }
      ]
    },
    {
      id: 'step_3',
      stepNumber: 3,
      category: 'Permissions',
      title: 'Permission & Sharing Hygiene Audit',
      summary: 'Review sharing links and ensure confidential client documents have strict access controls.',
      items: [
        {
          id: 's3_1',
          label: 'Audit "Anyone with the link can view/edit" links',
          detail: 'Revoke open link access on financial, tax, and NDA-covered folders; change to restricted/invited users only.',
          completed: false
        },
        {
          id: 's3_2',
          label: 'Offboard temporary vendor/contractor access',
          detail: 'Remove contractor email access for completed project sprints.',
          completed: false
        },
        {
          id: 's3_3',
          label: 'Confirm client executive has Owner/Editor permissions',
          detail: 'Verify primary client email has persistent access to their dedicated workspace.',
          completed: true
        }
      ]
    },
    {
      id: 'step_4',
      stepNumber: 4,
      category: 'Archiving',
      title: 'Asset Archiving & Storage Optimization',
      summary: 'Move completed milestones to archive and purge temporary drafts to free drive quota.',
      items: [
        {
          id: 's4_1',
          label: 'Move completed sprint folders to 99_Archive',
          detail: 'Keep active working folders focused purely on current in-flight deliverables.',
          completed: false
        },
        {
          id: 's4_2',
          label: 'Empty Google Drive Trash if storage is above 80%',
          detail: 'Permanently remove deleted duplicates and raw export temp files.',
          completed: false
        }
      ]
    },
    {
      id: 'step_5',
      stepNumber: 5,
      category: 'Sync',
      title: 'AEDMIN Workspace Link Synchronization',
      summary: 'Ensure Google Drive links inside AEDMIN client cards and deliverables are active and up-to-date.',
      items: [
        {
          id: 's5_1',
          label: 'Verify client Google Drive Root URLs in AEDMIN',
          detail: 'Test "Open Drive" button in Client Directory to ensure URL redirects accurately.',
          completed: true
        },
        {
          id: 's5_2',
          label: 'Sync deliverable preview links in Client Portal',
          detail: 'Ensure pending approval items have working Google Doc/Drive review URLs.',
          completed: false
        }
      ]
    },
    {
      id: 'step_6',
      stepNumber: 6,
      category: 'SignOff',
      title: 'Weekly Audit Sign-Off & Status Logging',
      summary: 'Complete executive audit sign-off, stamp completion timestamp, and log audit notes.',
      items: [
        {
          id: 's6_1',
          label: 'Executive Assistant sign-off on drive integrity',
          detail: 'Confirm all 5 prerequisite audit steps are checked and verified.',
          completed: false
        },
        {
          id: 's6_2',
          label: 'Log notes and schedule next Friday audit',
          detail: 'Record any client-specific filing notes or pending access requests.',
          completed: false
        }
      ]
    }
  ]);

  // Audit History Log
  const [auditHistory, setAuditHistory] = useState<DriveAuditRecord[]>([
    {
      id: 'audit_01',
      auditDate: '2026-08-22',
      auditorName: userFullName || 'Executive Assistant',
      clientFolderCount: 3,
      filesCleanedCount: 18,
      permissionsRevokedCount: 2,
      storageOptimizedMB: 420,
      status: 'completed',
      summaryNotes: 'Cleaned loose PDF exports for Arkgate and Stark Media. Revoked public links on Q3 financial forecasts.',
      completedSteps: ['Hierarchy', 'Naming', 'Permissions', 'Archiving', 'Sync', 'SignOff']
    },
    {
      id: 'audit_02',
      auditDate: '2026-08-15',
      auditorName: userFullName || 'Executive Assistant',
      clientFolderCount: 3,
      filesCleanedCount: 12,
      permissionsRevokedCount: 1,
      storageOptimizedMB: 280,
      status: 'completed',
      summaryNotes: 'Archived Wayne Tech sprint 1 assets. Renamed 6 video assets to AEDMIN standard.',
      completedSteps: ['Hierarchy', 'Naming', 'Permissions', 'Archiving', 'Sync', 'SignOff']
    }
  ]);

  const [auditNotes, setAuditNotes] = useState('');
  const [signedOff, setSignedOff] = useState(false);

  const toggleItem = (stepId: string, itemId: string) => {
    setAuditSteps(prev => prev.map(step => {
      if (step.id !== stepId) return step;
      return {
        ...step,
        items: step.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, completed: !item.completed };
        })
      };
    }));
  };

  const totalItems = auditSteps.flatMap(s => s.items).length;
  const completedItems = auditSteps.flatMap(s => s.items).filter(i => i.completed).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  const handleCopyFileName = () => {
    navigator.clipboard.writeText(generatedFileName);
    setCopiedName(true);
    setTimeout(() => setCopiedName(false), 2000);
  };

  const handleCompleteAuditSignOff = () => {
    const newRecord: DriveAuditRecord = {
      id: `audit_${Date.now()}`,
      auditDate: new Date().toISOString().split('T')[0],
      auditorName: userFullName || 'Executive Assistant',
      clientFolderCount: activeClients.length,
      filesCleanedCount: 14,
      permissionsRevokedCount: 1,
      storageOptimizedMB: 310,
      status: 'completed',
      summaryNotes: auditNotes || 'Weekly Drive hygiene audit completed with all naming and permission checks cleared.',
      completedSteps: ['Hierarchy', 'Naming', 'Permissions', 'Archiving', 'Sync', 'SignOff']
    };

    setAuditHistory([newRecord, ...auditHistory]);
    setSignedOff(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Progress & Context */}
      <div className="bg-white p-6 rounded-[28px] border border-[#ECE6DD] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              Weekly Google Drive File Audit & Hygiene
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Every Friday Operational Standard
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#18191D]">
            Structured File Management & Storage Governance
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Maintain pristine client Google Drive workspaces. Eliminate loose files, standardize nomenclature, revoke stale vendor links, and ensure client deliverable links are active.
          </p>
        </div>

        {/* Audit KPI Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#ECE6DD] text-center min-w-[110px]">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Compliance</span>
            <span className="text-2xl font-black text-blue-700 block mt-0.5">{progressPercent}%</span>
            <span className="text-[10px] text-stone-500 font-medium">{completedItems}/{totalItems} Items Checked</span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#ECE6DD] text-center min-w-[110px]">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Drive Folders</span>
            <span className="text-2xl font-black text-[#18191D] block mt-0.5">{activeClients.length}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Active Workspaces</span>
          </div>
        </div>
      </div>

      {/* Interactive File Naming Standard Generator Box */}
      <div className="bg-linear-to-r from-purple-50/70 to-blue-50/70 p-5 rounded-2xl border border-purple-200/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-950">
              Standardized File Naming Generator
            </h3>
          </div>
          <span className="text-[11px] text-purple-800 font-mono">
            Format: [Client]_[Project]_[DocType]_[YYYYMMDD]_[v#]
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-stone-600 block mb-1">Client Code</label>
            <input
              type="text"
              value={namingClientCode}
              onChange={e => setNamingClientCode(e.target.value.toUpperCase())}
              className="w-full text-xs font-mono font-bold p-2 bg-white rounded-xl border border-purple-200 focus:outline-none"
              placeholder="e.g. ARKG"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 block mb-1">Project / Module</label>
            <input
              type="text"
              value={namingProject}
              onChange={e => setNamingProject(e.target.value.replace(/\s+/g, ''))}
              className="w-full text-xs font-mono p-2 bg-white rounded-xl border border-purple-200 focus:outline-none"
              placeholder="e.g. PitchDeck"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 block mb-1">Document Type</label>
            <input
              type="text"
              value={namingDocType}
              onChange={e => setNamingDocType(e.target.value.replace(/\s+/g, ''))}
              className="w-full text-xs font-mono p-2 bg-white rounded-xl border border-purple-200 focus:outline-none"
              placeholder="e.g. Presentation"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 block mb-1">Date Stamp (YYYYMMDD)</label>
            <input
              type="text"
              value={namingDate}
              onChange={e => setNamingDate(e.target.value)}
              className="w-full text-xs font-mono p-2 bg-white rounded-xl border border-purple-200 focus:outline-none"
              placeholder="e.g. 20260830"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 block mb-1">Version</label>
            <input
              type="text"
              value={namingVersion}
              onChange={e => setNamingVersion(e.target.value)}
              className="w-full text-xs font-mono p-2 bg-white rounded-xl border border-purple-200 focus:outline-none"
              placeholder="e.g. v1.0"
            />
          </div>
        </div>

        {/* Output & Copy Button */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-purple-200">
          <span className="font-mono text-xs font-bold text-purple-900 truncate">
            {generatedFileName}
          </span>
          <button
            onClick={handleCopyFileName}
            className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 transition-colors shrink-0 shadow-2xs"
          >
            {copiedName ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedName ? 'Copied' : 'Copy File Name'}</span>
          </button>
        </div>
      </div>

      {/* Client Quick Links Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h3 className="text-sm font-bold text-[#18191D] flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-blue-600" />
          Active Client Workspaces to Audit
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {activeClients.map(client => (
            <a
              key={client.id}
              href={client.googleDriveFolderUrl || `https://drive.google.com/drive/folders/${client.code}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#ECE6DD] hover:border-blue-300 rounded-xl text-xs font-semibold text-[#18191D] transition-colors shadow-2xs"
            >
              <span>{client.name} Drive</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Detailed Audit Step Cards */}
      <div className="space-y-4">
        {auditSteps.map(step => {
          const stepCompletedCount = step.items.filter(i => i.completed).length;
          const isStepDone = stepCompletedCount === step.items.length;

          return (
            <div
              key={step.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                isStepDone ? 'border-emerald-200 bg-emerald-50/10' : 'border-[#ECE6DD]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isStepDone ? 'bg-emerald-600 text-white' : 'bg-[#18191D] text-white'
                  }`}>
                    {step.stepNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#18191D]">{step.title}</h4>
                    <p className="text-xs text-stone-500">{step.summary}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                  isStepDone ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                }`}>
                  {stepCompletedCount}/{step.items.length} Completed
                </span>
              </div>

              {/* Checklist Items */}
              <div className="mt-3.5 space-y-2.5">
                {step.items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(step.id, item.id)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border border-transparent hover:border-stone-200"
                  >
                    <button className="mt-0.5 text-stone-400 hover:text-[#18191D] transition-colors shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-300" />
                      )}
                    </button>
                    <div className="space-y-0.5">
                      <p className={`text-xs font-bold ${item.completed ? 'text-stone-500 line-through' : 'text-[#18191D]'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sign-off & Completion Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DD] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-[#18191D]">
              Weekly Audit Executive Sign-Off
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Logged by {userFullName || 'Super Administrator'}
          </span>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Weekly Audit Notes / Observations (Optional)
          </label>
          <textarea
            rows={2}
            value={auditNotes}
            onChange={e => setAuditNotes(e.target.value)}
            placeholder="e.g. All 3 client drives reorganized. Removed duplicate pitch decks for Arkgate. Checked all permissions."
            className="w-full text-xs p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-stone-500">
            Clicking sign-off stores this completed audit record into your compliance history and resets the schedule.
          </p>

          <button
            onClick={handleCompleteAuditSignOff}
            disabled={signedOff || progressPercent < 100}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 ${
              signedOff 
                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                : progressPercent === 100
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{signedOff ? 'Audit Signed Off & Logged' : 'Complete Weekly Sign-Off'}</span>
          </button>
        </div>
      </div>

      {/* Audit History Log */}
      <div className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-400" />
          Past Weekly Audit History & Compliance Logs ({auditHistory.length})
        </h3>

        <div className="space-y-2.5">
          {auditHistory.map(rec => (
            <div key={rec.id} className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#18191D]">{rec.auditDate}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    {rec.status}
                  </span>
                  <span className="text-[11px] text-stone-500">by {rec.auditorName}</span>
                </div>
                <p className="text-xs text-stone-600">{rec.summaryNotes}</p>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono shrink-0">
                <span>{rec.filesCleanedCount} files cleaned</span>
                <span>•</span>
                <span>{rec.storageOptimizedMB} MB optimized</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
