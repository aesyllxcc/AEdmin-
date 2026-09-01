import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Globe,
  FileText, 
  Play, 
  MoreVertical, 
  Copy, 
  Archive, 
  Trash2, 
  Edit,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  FolderKanban,
  FolderPlus,
  Building2,
  ListChecks,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Link as LinkIcon,
  Tag,
  AlertTriangle,
  RotateCcw,
  Layers,
  BarChart3
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TaskModal } from "@/components/modals/TaskModal";
import { ProjectModal } from "@/components/modals/ProjectModal";
import { Task, Project, PriorityLevel, TaskStatus } from "@/types";
import { convertFreelancerToClientTime, getClientEffectiveLocation } from "@/utils/timezoneUtils";

export default function Operations() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialFilter = searchParams.get('filter') || 'all';

  const { 
    tasks, 
    clients, 
    projects, 
    timeEntries,
    approvals,
    toggleTaskStatus, 
    deleteTask, 
    archiveTask, 
    restoreTask, 
    duplicateTask, 
    deleteProject,
    archiveProject,
    restoreProject,
    duplicateProject,
    startTimer 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'due_date' | 'title' | 'client'>('score');

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [expandedNotesTaskId, setExpandedNotesTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tasks' | 'projects'>('tasks');

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const todayStr = new Date().toISOString().split('T')[0];

  // Close project dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (task.isArchived && statusFilter !== 'archived') return false;
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.notes && task.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.projectName && task.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.tags && task.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesClient = clientFilter === 'all' || task.clientId === clientFilter;
    const matchesProject = projectFilter === 'all' || task.projectId === projectFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    let matchesStatus = true;
    if (statusFilter === 'all') matchesStatus = !task.isArchived;
    else if (statusFilter === 'archived') matchesStatus = Boolean(task.isArchived);
    else if (statusFilter === 'overdue') matchesStatus = task.dueDate < todayStr && task.status !== 'completed';
    else matchesStatus = task.status === statusFilter;

    return matchesSearch && matchesClient && matchesProject && matchesPriority && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'score') return (b.calculatedScore || 0) - (a.calculatedScore || 0);
    if (sortBy === 'due_date') return a.dueDate.localeCompare(b.dueDate);
    if (sortBy === 'client') return a.clientName.localeCompare(b.clientName);
    return a.title.localeCompare(b.title);
  });

  const filteredProjects = projects.filter(p => {
    if (clientFilter !== 'all' && p.clientId !== clientFilter) return false;
    return true;
  });

  const activeProject = projects.find(p => p.id === projectFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-card-blue/30 text-blue-900 text-xs font-semibold tracking-wide flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-700" />
              MASTER OPERATIONS HUB
            </span>
            <span className="text-xs text-text-muted font-medium">
              {tasks.filter(t => !t.isArchived && t.status !== 'completed').length} Active Tasks
            </span>
            <span className="text-xs text-text-muted font-medium">•</span>
            <span className="text-xs text-text-muted font-medium">
              {projects.filter(p => !p.isArchived).length} Projects Running
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">Master Task & Project Operations</h1>
          <p className="text-sm text-text-muted mt-1">
            Centralized cross-client operational engine with multi-attribute urgency calculation, inline project management, and live asset links.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Project Add */}
          <button
            onClick={() => {
              setProjectToEdit(null);
              setProjectModalOpen(true);
            }}
            className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-border-subtle text-text-main rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <FolderPlus className="w-3.5 h-3.5 text-purple-600" />
            New Project
          </button>

          {/* New Master Task */}
          <button
            onClick={() => { setTaskToEdit(null); setTaskModalOpen(true); }}
            className="px-5 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New Master Task
          </button>
        </div>
      </div>

      {/* Primary Control & Filter Bar with Inline Project Dropdown Management */}
      <div className="p-4 bg-white rounded-[24px] border border-border-subtle shadow-xs space-y-4">
        
        {/* Top Row: Search & Client & Project Management Dropdown & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search tasks, notes, links, tags..."
              className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-card-blue"
            />
          </div>

          {/* Client Filter */}
          <div>
            <select
              value={clientFilter}
              onChange={e => {
                setClientFilter(e.target.value);
                setProjectFilter('all');
              }}
              className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="all">🏢 All Client Workspaces</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          {/* Enhanced Project Dropdown with Direct Creation & Inline Project Actions */}
          <div className="relative" ref={projectDropdownRef}>
            <button
              type="button"
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold text-text-main flex items-center justify-between text-left hover:border-purple-300 transition-colors"
            >
              <span className="flex items-center gap-1.5 truncate">
                <FolderKanban className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">
                  {projectFilter === 'all' ? '📁 All Projects' : activeProject?.name || 'Select Project'}
                </span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Interactive Project Dropdown Menu */}
            {projectDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-border-subtle shadow-xl z-30 p-2 text-xs space-y-1 max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150 min-w-[280px]">
                
                {/* Header Action: Create New Project */}
                <button
                  type="button"
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    setProjectToEdit(null);
                    setProjectModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold transition-colors mb-1"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-purple-600" />
                    Create New Project
                  </span>
                  <span className="text-[10px] bg-purple-200/80 px-1.5 py-0.5 rounded text-purple-950 font-mono">+New</span>
                </button>

                {/* All Projects Option */}
                <button
                  type="button"
                  onClick={() => {
                    setProjectFilter('all');
                    setProjectDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-colors ${
                    projectFilter === 'all' ? 'bg-sidebar-bg text-white font-semibold' : 'hover:bg-gray-50 text-text-main'
                  }`}
                >
                  <span>📁 All Projects ({projects.length})</span>
                  {projectFilter === 'all' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div className="h-px bg-border-subtle my-1" />

                {/* List of projects with quick actions */}
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Client Projects
                </div>

                {filteredProjects.map(project => {
                  const client = clients.find(c => c.id === project.clientId);
                  const isSelected = projectFilter === project.id;
                  const isArchived = project.status === 'archived' || project.isArchived;

                  return (
                    <div 
                      key={project.id}
                      className={`group flex items-center justify-between p-2 rounded-xl transition-colors ${
                        isSelected ? 'bg-purple-50/80 border border-purple-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setProjectFilter(project.id);
                          setProjectDropdownOpen(false);
                        }}
                        className="flex-1 min-w-0 text-left pr-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${client?.avatarColor || 'bg-gray-100'} text-text-main`}>
                            {client?.code || 'CLI'}
                          </span>
                          <span className={`font-semibold truncate text-xs ${isSelected ? 'text-purple-950 font-bold' : 'text-text-main'}`}>
                            {project.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                          <span>{project.progress || 0}% Done</span>
                          <span>•</span>
                          <span className="capitalize">{project.status.replace('_', ' ')}</span>
                          {isArchived && <span className="text-amber-600 font-bold">(Archived)</span>}
                        </div>
                      </button>

                      {/* Project Action Toolbar inside Dropdown */}
                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToEdit(project);
                            setProjectDropdownOpen(false);
                            setProjectModalOpen(true);
                          }}
                          title="Edit Project Details"
                          className="p-1 hover:bg-white rounded text-gray-500 hover:text-purple-700 shadow-xs transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateProject(project.id);
                          }}
                          title="Duplicate Project"
                          className="p-1 hover:bg-white rounded text-gray-500 hover:text-blue-700 shadow-xs transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {!isArchived ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              archiveProject(project.id);
                            }}
                            title="Archive Project"
                            className="p-1 hover:bg-white rounded text-gray-500 hover:text-amber-700 shadow-xs transition-colors"
                          >
                            <Archive className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreProject(project.id);
                            }}
                            title="Restore Project"
                            className="p-1 hover:bg-white rounded text-gray-500 hover:text-emerald-700 shadow-xs transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete project "${project.name}"?`)) {
                              deleteProject(project.id);
                              if (projectFilter === project.id) setProjectFilter('all');
                            }
                          }}
                          title="Delete Project"
                          className="p-1 hover:bg-white rounded text-gray-500 hover:text-rose-600 shadow-xs transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* Priority Filter & Sort Combo */}
          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-1/2 px-2.5 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="all">⚡ All Priorities</option>
              <option value="urgent">Urgent / Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-1/2 px-2.5 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="score">Score (High-Low)</option>
              <option value="due_date">Due Date</option>
              <option value="client">Client</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>

        </div>

        {/* Active Project Banner if selected */}
        {activeProject && (
          <div className="p-3.5 bg-gradient-to-r from-purple-50/80 via-blue-50/40 to-transparent rounded-2xl border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-purple-950">{activeProject.name}</span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-semibold px-2 py-0.5 rounded-full capitalize">
                    {activeProject.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Deadline: {activeProject.deadline}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                  {activeProject.description || activeProject.scope || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeProject.driveFolderLink && (
                <a
                  href={activeProject.driveFolderLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-border-subtle text-xs font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-1 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" /> Drive Vault
                </a>
              )}
              {activeProject.reviewLink && (
                <a
                  href={activeProject.reviewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-border-subtle text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Review Link
                </a>
              )}
              <button
                onClick={() => {
                  setProjectToEdit(activeProject);
                  setProjectModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 flex items-center gap-1 shadow-2xs"
              >
                <Edit className="w-3.5 h-3.5" /> Manage Project
              </button>
              <button
                onClick={() => setProjectFilter('all')}
                className="text-xs text-text-muted hover:text-text-main px-2 py-1"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Status Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-border-subtle custom-scrollbar">
          {[
            { id: 'all', label: 'All Active' },
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'waiting_client', label: 'Waiting for Client' },
            { id: 'waiting_approval', label: 'Waiting for Approval' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'completed', label: 'Completed' },
            { id: 'archived', label: 'Archived' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === st.id 
                  ? 'bg-sidebar-bg text-white shadow-xs' 
                  : 'bg-[#FDFBF7] border border-border-subtle text-text-muted hover:text-text-main'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* Task List Master Feed with Rich Operational Record Cards */}
      <div className="space-y-3.5">
        {sortedTasks.map(task => {
          const client = clients.find(c => c.id === task.clientId);
          const project = projects.find(p => p.id === task.projectId);
          const isOverdue = task.dueDate < todayStr && task.status !== 'completed';
          const isNotesExpanded = expandedNotesTaskId === task.id;

          // Find linked time entries
          const taskTime = timeEntries.filter(t => t.taskId === task.id);
          const totalHoursLogged = taskTime.reduce((sum, e) => sum + e.hours, 0);

          // Find linked approvals
          const linkedApprovals = approvals.filter(a => a.clientId === task.clientId && (a.title.toLowerCase().includes(task.title.toLowerCase()) || task.title.toLowerCase().includes(a.title.toLowerCase())));

          return (
            <div 
              key={task.id}
              className={`p-5 rounded-[24px] border transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 group ${
                task.status === 'completed'
                  ? 'bg-gray-50/70 border-border-subtle opacity-75'
                  : isOverdue 
                  ? 'bg-red-50/30 border-red-200 shadow-xs' 
                  : 'bg-white border-border-subtle hover:border-gray-300 shadow-xs hover:shadow-sm'
              }`}
            >
              {/* Left Column: Checkbox & Main Info */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1 text-gray-400 hover:text-sidebar-bg transition-colors shrink-0"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-5 h-5 group-hover:border-sidebar-bg" />
                  )}
                </button>

                {/* Task Body */}
                <div className="flex-1 min-w-0 space-y-2">
                  
                  {/* Client & Project & Status Header Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Client Badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${client?.avatarColor || 'bg-gray-100'} text-text-main border border-black/5`}>
                      {task.clientName}
                    </span>
                    
                    {/* Project Information */}
                    {project ? (
                      <button
                        onClick={() => setProjectFilter(project.id)}
                        className="text-[10px] font-semibold text-purple-900 bg-purple-100/80 hover:bg-purple-200 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 transition-colors"
                        title="Filter by this project"
                      >
                        <FolderKanban className="w-3 h-3 text-purple-600" />
                        {project.name}
                        {project.progress !== undefined && (
                          <span className="bg-purple-200/80 text-purple-950 font-mono px-1 rounded text-[9px]">
                            {project.progress}%
                          </span>
                        )}
                      </button>
                    ) : task.projectName ? (
                      <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        {task.projectName}
                      </span>
                    ) : null}

                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      task.status === 'in_progress' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      task.status === 'waiting_client' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                      task.status === 'waiting_approval' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                      task.status === 'completed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>

                    {/* Priority Level */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      task.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {task.priority}
                    </span>

                    {/* Calculated Priority Score */}
                    <span className="text-[10px] font-bold text-amber-900 bg-card-yellow/50 px-2.5 py-0.5 rounded-full ml-auto">
                      Score: {task.calculatedScore} / 100
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => { setTaskToEdit(task); setTaskModalOpen(true); }}
                    className={`text-sm font-semibold cursor-pointer hover:text-card-blue transition-colors ${
                      task.status === 'completed' ? 'line-through text-text-muted' : 'text-text-main'
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Operational Notes */}
                  {task.notes && (
                    <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-border-subtle text-xs text-text-muted leading-relaxed">
                      <p className={isNotesExpanded ? '' : 'line-clamp-2'}>
                        {task.notes}
                      </p>
                      {task.notes.length > 120 && (
                        <button
                          type="button"
                          onClick={() => setExpandedNotesTaskId(isNotesExpanded ? null : task.id)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 mt-1"
                        >
                          {isNotesExpanded ? 'Show less' : 'Read full operational notes...'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Metadata Row: Due dates & Timezone conversion & Hours & Links */}
                  <div className="flex items-center gap-3 flex-wrap text-xs text-text-muted pt-1">
                    
                    {/* Due Date */}
                    <span className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      Due {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''} {isOverdue && '(OVERDUE)'}
                    </span>

                    {/* Dual Timezone Conversion Badge for Client */}
                    {client && (
                      <span className="flex items-center gap-1 bg-purple-50 text-purple-900 border border-purple-200/80 px-2 py-0.5 rounded-md font-mono text-[11px]">
                        <Globe className="w-3 h-3 text-purple-600" />
                        <span>
                          Client: {convertFreelancerToClientTime(task.dueDate, task.dueTime || '17:00', client).clientTimeStr} ({getClientEffectiveLocation(client).city})
                        </span>
                      </span>
                    )}

                    {/* Hours Logged / Estimated */}
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {totalHoursLogged > 0 ? (
                        <span className="font-semibold text-emerald-700">{totalHoursLogged}h logged</span>
                      ) : (
                        `Est. ${task.estimatedHours}h`
                      )}
                    </span>

                    {/* Direct Asset Links */}
                    {task.driveLink && (
                      <a 
                        href={task.driveLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-card-blue hover:underline flex items-center gap-1 font-semibold text-[11px] bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100"
                      >
                        <FileText className="w-3 h-3" /> Drive Asset Vault
                      </a>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-md border border-border-subtle">
                        #{tag}
                      </span>
                    ))}

                    {/* Related Records Indicator */}
                    {linkedApprovals.length > 0 && (
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 font-semibold">
                        {linkedApprovals.length} Linked Review
                      </span>
                    )}

                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 self-end md:self-start">
                <button
                  onClick={() => startTimer({ clientId: task.clientId, projectId: task.projectId, taskId: task.id, notes: task.title })}
                  className="p-2 rounded-full hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"
                  title="Start Live Workday Timer"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === task.id && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl border border-border-subtle shadow-xl p-2 z-20 text-xs space-y-1 animate-in fade-in duration-150">
                      <button
                        onClick={() => { setTaskToEdit(task); setTaskModalOpen(true); setActiveMenuId(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-text-main font-medium"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Task
                      </button>
                      
                      {task.projectId && (
                        <button
                          onClick={() => {
                            const p = projects.find(prj => prj.id === task.projectId);
                            if (p) {
                              setProjectToEdit(p);
                              setProjectModalOpen(true);
                            }
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-50 text-purple-900 font-medium"
                        >
                          <FolderKanban className="w-3.5 h-3.5" /> Edit Project
                        </button>
                      )}

                      <button
                        onClick={() => { duplicateTask(task.id); setActiveMenuId(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-text-main font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                      </button>

                      {!task.isArchived ? (
                        <button
                          onClick={() => { archiveTask(task.id); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-900 font-medium"
                        >
                          <Archive className="w-3.5 h-3.5" /> Archive
                        </button>
                      ) : (
                        <button
                          onClick={() => { restoreTask(task.id); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-900 font-medium"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restore Task
                        </button>
                      )}

                      <button
                        onClick={() => { deleteTask(task.id); setActiveMenuId(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}

        {sortedTasks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[28px] border border-border-subtle">
            <CheckCircle2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-text-main">No Tasks Match Filter</h3>
            <p className="text-xs text-text-muted mt-1">Adjust filters or create a new master task or project.</p>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal 
        isOpen={taskModalOpen} 
        onClose={() => setTaskModalOpen(false)} 
        taskToEdit={taskToEdit} 
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        projectToEdit={projectToEdit}
        defaultClientId={clientFilter !== 'all' ? clientFilter : undefined}
      />

    </div>
  );
}
