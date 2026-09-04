import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  HardDrive, 
  Sparkles,
  Save,
  Globe,
  Bell,
  Camera,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  FileText,
  Briefcase,
  Link as LinkIcon,
  ExternalLink,
  Plus,
  Lock,
  Key,
  Shield,
  Award,
  Share2,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  HelpCircle
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { COMMON_TIMEZONES } from "@/utils/timezoneUtils";
import { UserRole } from "@/types";

export default function Settings() {
  const { 
    userProfile, 
    updateUserProfile, 
    openTour,
    exportBackupJSON, 
    importBackupJSON, 
    resetToDefaultSeed 
  } = useApp();

  const { 
    currentUser, 
    userAccounts, 
    createUserAccount, 
    deleteUserAccount, 
    auditLogs,
    isSuperAdmin,
    changePassword,
    activeTenantId
  } = useAuth();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'profile' | 'career' | 'portfolio' | 'security' | 'backup'>('profile');

  // Self Password Change State
  const [newPasswordSelf, setNewPasswordSelf] = useState('');
  const [confirmPasswordSelf, setConfirmPasswordSelf] = useState('');
  const [showSelfPassword, setShowSelfPassword] = useState(false);
  const [selfPassSuccess, setSelfPassSuccess] = useState('');
  const [selfPassError, setSelfPassError] = useState('');

  // Profile fields
  const [fullName, setFullName] = useState(userProfile?.fullName || "Ellysa May M. Del Prado");
  const [title, setTitle] = useState(userProfile?.title || "Executive Assistant & Strategic Business Partner");
  const [email, setEmail] = useState(userProfile?.email || "hello.aespace@gmail.com");
  const [agencyName, setAgencyName] = useState(userProfile?.agencyName || "AEDMIN Executive Studio");
  const [defaultHourlyRate, setDefaultHourlyRate] = useState(userProfile?.defaultHourlyRate ?? 150);
  const [currency, setCurrency] = useState(userProfile?.currency || "USD");
  const [timezone, setTimezone] = useState(userProfile?.timezone || "Asia/Manila");
  const [bio, setBio] = useState(userProfile?.bio || "High-impact Executive Business Partner orchestrating C-suite operations, cross-timezone communications, strategic workflows, and executive deliverables.");
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || "");
  const [skills, setSkills] = useState<string[]>(userProfile?.executiveSkills || [
    "C-Suite Calendar Management",
    "Cross-Timezone Operations",
    "Executive Briefings",
    "Financial & Retainer Reconciliation",
    "Stakeholder Alignment",
    "SOP & Systems Architecture"
  ]);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Resume & CV State
  const [resumeFileName, setResumeFileName] = useState(userProfile?.resumeFileName || "Ellysa_Del_Prado_Executive_Resume.pdf");
  const [resumeUrl, setResumeUrl] = useState(userProfile?.resumeUrl || "https://drive.google.com/file/d/sample-resume/view");
  const [resumeLastUpdated, setResumeLastUpdated] = useState(userProfile?.resumeLastUpdated || new Date().toISOString().split('T')[0]);
  const [cvFileName, setCvFileName] = useState(userProfile?.cvFileName || "Ellysa_Del_Prado_Full_CV_Portfolio.pdf");
  const [cvUrl, setCvUrl] = useState(userProfile?.cvUrl || "https://drive.google.com/file/d/sample-cv/view");

  // Portfolio Links
  const [portfolioLinks, setPortfolioLinks] = useState(userProfile?.portfolioLinks || [
    { id: 'p1', title: 'Executive Operations Case Studies', url: 'https://notion.so/executive-ops-showcase', platform: 'Notion', description: 'Comprehensive system breakdowns for scaleups & founder offices.' },
    { id: 'p2', title: 'Interactive Client Deliverables Vault', url: 'https://drive.google.com/drive/folders/sample-vault', platform: 'Google Drive', description: 'Quarterly board decks, financial models, and SOP playbooks.' }
  ]);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortPlatform, setNewPortPlatform] = useState('Notion');
  const [newPortDesc, setNewPortDesc] = useState('');

  // Social Links
  const [socialLinks, setSocialLinks] = useState(userProfile?.socialLinks || [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/ellysa-del-prado', label: 'LinkedIn Profile' },
    { platform: 'Website', url: 'https://aespace.studio', label: 'Studio Portfolio' },
    { platform: 'X / Twitter', url: 'https://x.com/aespace', label: 'Executive Insights' }
  ]);
  const [newSocialPlatform, setNewSocialPlatform] = useState('LinkedIn');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialLabel, setNewSocialLabel] = useState('');

  // Career Documents & Certifications
  const [careerDocs, setCareerDocs] = useState(userProfile?.careerDocuments || [
    { id: 'cd1', name: 'Certified Executive Business Partner (CEBP)', type: 'Certification', url: 'https://credentials.example.com/cebp', uploadedDate: '2025-11-15', description: 'Advanced C-Suite stakeholder management certification.' },
    { id: 'cd2', name: 'Master Confidentiality & NDA Accreditation', type: 'Accreditation', url: 'https://credentials.example.com/nda', uploadedDate: '2025-08-20', description: 'Strict privacy & compliance protocol standard.' },
    { id: 'cd3', name: 'Executive Reference Letter - Series B Founder', type: 'Recommendation', url: 'https://drive.google.com/sample-rec.pdf', uploadedDate: '2026-02-10', description: 'Recommendation detailing 100% on-time deliverable execution.' }
  ]);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Certification');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');

  // User Account Management (Admin Only)
  const [newAccFullName, setNewAccFullName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');
  const [newAccRole, setNewAccRole] = useState<UserRole>('Executive Assistant');
  const [accCreateSuccess, setAccCreateSuccess] = useState<string | null>(null);
  const [accCreateError, setAccCreateError] = useState<string | null>(null);

  // Status & Feedback
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || "Ellysa May M. Del Prado");
      setTitle(userProfile.title || "Executive Assistant & Strategic Business Partner");
      setEmail(userProfile.email || "hello.aespace@gmail.com");
      setAgencyName(userProfile.agencyName || "AEDMIN Executive Studio");
      setDefaultHourlyRate(userProfile.defaultHourlyRate ?? 150);
      setCurrency(userProfile.currency || "USD");
      setTimezone(userProfile.timezone || "Asia/Manila");
      setBio(userProfile.bio || "");
      setAvatarUrl(userProfile.avatarUrl || "");
      if (userProfile.executiveSkills) setSkills(userProfile.executiveSkills);
      if (userProfile.resumeFileName) setResumeFileName(userProfile.resumeFileName);
      if (userProfile.resumeUrl) setResumeUrl(userProfile.resumeUrl);
      if (userProfile.cvFileName) setCvFileName(userProfile.cvFileName);
      if (userProfile.cvUrl) setCvUrl(userProfile.cvUrl);
      if (userProfile.portfolioLinks) setPortfolioLinks(userProfile.portfolioLinks);
      if (userProfile.socialLinks) setSocialLinks(userProfile.socialLinks);
      if (userProfile.careerDocuments) setCareerDocs(userProfile.careerDocuments);
    }
  }, [userProfile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: fullName || "Ellysa May M. Del Prado",
      title: title || "Executive Assistant & Strategic Business Partner",
      email: email || "hello.aespace@gmail.com",
      agencyName: agencyName || "AEDMIN Executive Studio",
      defaultHourlyRate: Number(defaultHourlyRate) || 150,
      currency,
      timezone,
      bio,
      executiveSkills: skills,
      resumeFileName,
      resumeUrl,
      resumeLastUpdated,
      cvFileName,
      cvUrl,
      portfolioLinks,
      socialLinks,
      careerDocuments: careerDocs,
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleImageFile = (file: File) => {
    setImageError(null);
    const maxSizeBytes = 100 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setImageError(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 100 MB maximum limit.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setImageError("Please upload a valid image file (.jpg, .png, .webp, .svg, .gif).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        updateUserProfile({ avatarUrl: dataUrl });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    };
    reader.onerror = () => {
      setImageError("Failed to read image file. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  const handleResumeFile = (file: File) => {
    setResumeFileName(file.name);
    const now = new Date().toISOString().split('T')[0];
    setResumeLastUpdated(now);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setResumeUrl(dataUrl);
        updateUserProfile({
          resumeFileName: file.name,
          resumeUrl: dataUrl,
          resumeLastUpdated: now
        });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim() || skills.includes(newSkillInput.trim())) return;
    const updated = [...skills, newSkillInput.trim()];
    setSkills(updated);
    setNewSkillInput("");
    updateUserProfile({ executiveSkills: updated });
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    updateUserProfile({ executiveSkills: updated });
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim() || !newPortUrl.trim()) return;
    const newItem = {
      id: `port_${Date.now()}`,
      title: newPortTitle.trim(),
      url: newPortUrl.trim(),
      platform: newPortPlatform,
      description: newPortDesc.trim()
    };
    const updated = [...portfolioLinks, newItem];
    setPortfolioLinks(updated);
    setNewPortTitle('');
    setNewPortUrl('');
    setNewPortDesc('');
    updateUserProfile({ portfolioLinks: updated });
  };

  const handleRemovePortfolio = (id: string) => {
    const updated = portfolioLinks.filter(p => p.id !== id);
    setPortfolioLinks(updated);
    updateUserProfile({ portfolioLinks: updated });
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialUrl.trim()) return;
    const newItem = {
      platform: newSocialPlatform,
      url: newSocialUrl.trim(),
      label: newSocialLabel.trim() || newSocialPlatform
    };
    const updated = [...socialLinks, newItem];
    setSocialLinks(updated);
    setNewSocialUrl('');
    setNewSocialLabel('');
    updateUserProfile({ socialLinks: updated });
  };

  const handleRemoveSocial = (index: number) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updated);
    updateUserProfile({ socialLinks: updated });
  };

  const handleAddCareerDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocUrl.trim()) return;
    const newItem = {
      id: `doc_${Date.now()}`,
      name: newDocName.trim(),
      type: newDocType,
      url: newDocUrl.trim(),
      uploadedDate: new Date().toISOString().split('T')[0],
      description: newDocDesc.trim()
    };
    const updated = [...careerDocs, newItem];
    setCareerDocs(updated);
    setNewDocName('');
    setNewDocUrl('');
    setNewDocDesc('');
    updateUserProfile({ careerDocuments: updated });
  };

  const handleRemoveCareerDoc = (id: string) => {
    const updated = careerDocs.filter(d => d.id !== id);
    setCareerDocs(updated);
    updateUserProfile({ careerDocuments: updated });
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccCreateError(null);
    setAccCreateSuccess(null);
    if (!newAccFullName || !newAccEmail || !newAccPassword) {
      setAccCreateError("Please complete all required account fields.");
      return;
    }
    const res = await createUserAccount({
      fullName: newAccFullName,
      email: newAccEmail,
      password: newAccPassword,
      role: newAccRole
    });
    if (res.success) {
      setAccCreateSuccess(`Account for ${newAccEmail} successfully created with ${newAccRole} role.`);
      setNewAccFullName('');
      setNewAccEmail('');
      setNewAccPassword('');
      setTimeout(() => setAccCreateSuccess(null), 4000);
    } else {
      setAccCreateError(res.message || "Failed to create user account.");
    }
  };

  const handleSelfPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelfPassError('');
    setSelfPassSuccess('');

    if (newPasswordSelf.length < 8) {
      setSelfPassError('New password must be at least 8 characters long.');
      return;
    }

    if (newPasswordSelf !== confirmPasswordSelf) {
      setSelfPassError('New password and confirmation password do not match.');
      return;
    }

    try {
      const res = await changePassword(newPasswordSelf);
      if (res.success) {
        setSelfPassSuccess('Your password has been updated and encrypted.');
        setNewPasswordSelf('');
        setConfirmPasswordSelf('');
        setTimeout(() => setSelfPassSuccess(''), 4000);
      } else {
        setSelfPassError(res.message || 'Failed to change password.');
      }
    } catch (err: any) {
      setSelfPassError(err?.message || 'An error occurred while updating password.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackupJSON(content);
      }
    };
    reader.readAsText(file);
  };

  const isOwner = currentUser?.role === 'Owner' || currentUser?.role === 'Administrator' || !currentUser;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#ECE6DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#18191D] text-white text-xs font-bold tracking-wide uppercase">
              Executive Profile & Security Hub
            </span>
            <span className="text-xs text-stone-500 font-medium">
              AEDMIN Freelancer Operating System
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#18191D] mt-1.5">
            Profile, Career & System Controls
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage your executive brand identity, upload resume/CV, link portfolios, and administer role-based access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openTour()}
            className="px-4 py-2 bg-white hover:bg-stone-100 text-[#18191D] border border-[#ECE6DD] rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-700" />
            <span>Launch App Tour</span>
          </button>

          {savedSuccess && (
            <span className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-200 shadow-2xs">
              <Check className="w-4 h-4 text-emerald-600" /> Changes Saved Successfully
            </span>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#ECE6DD] gap-6 overflow-x-auto">
        {[
          { id: 'profile', label: 'Executive Identity & Bio' },
          { id: 'career', label: `Resume, CV & Documents (${careerDocs.length})` },
          { id: 'portfolio', label: `Portfolio & Web Links (${portfolioLinks.length + socialLinks.length})` },
          { id: 'security', label: 'Access Control & Security' },
          { id: 'backup', label: 'Data Portability & Backup' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-[#18191D] text-[#18191D]' 
                : 'border-transparent text-stone-400 hover:text-[#18191D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. EXECUTIVE IDENTITY & BIO */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Custom Photo Upload Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                <div>
                  <h3 className="text-base font-bold text-[#18191D]">Executive Portrait & Insignia</h3>
                  <p className="text-xs text-stone-500">
                    Upload your custom executive photo or studio insignia (supports high-res images up to 100 MB).
                  </p>
                </div>
              </div>

              {imageError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  {imageError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Live Preview */}
                <div className="relative group shrink-0">
                  <img 
                    src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"} 
                    alt={fullName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-stone-200"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs"
                    title="Upload new portrait"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] font-bold mt-1">Upload</span>
                  </button>
                </div>

                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 w-full border-2 border-dashed rounded-3xl p-5 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-stone-200 hover:border-stone-400 bg-[#FAF8F5] hover:bg-stone-50'
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file);
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#ECE6DD] flex items-center justify-center text-stone-700 shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-[#18191D]">
                      Click to browse or drag and drop custom portrait
                    </p>
                    <p className="text-[11px] text-stone-500">
                      PNG, JPG, WebP, SVG or GIF • Max file size: <strong>100 MB</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Profile Form */}
            <form onSubmit={handleSaveProfile} className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                <div>
                  <h3 className="text-base font-bold text-[#18191D]">Executive Profile & Agency Branding</h3>
                  <p className="text-xs text-stone-500">Information displayed on client portals, invoices, and reports.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Full Name / Operator Name</label>
                  <input 
                    type="text" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold text-[#18191D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Executive Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold text-[#18191D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Primary Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold text-[#18191D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Studio / Agency Brand Name</label>
                  <input 
                    type="text" 
                    value={agencyName} 
                    onChange={e => setAgencyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold text-[#18191D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Default Hourly Rate ($)</label>
                  <input 
                    type="number" 
                    value={defaultHourlyRate} 
                    onChange={e => setDefaultHourlyRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-mono font-bold text-[#18191D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Primary Timezone</label>
                  <select 
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold text-[#18191D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {COMMON_TIMEZONES.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.city} ({tz.label})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-stone-700 uppercase mb-1">Executive Bio / Professional Overview</label>
                <textarea 
                  rows={3} 
                  value={bio} 
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-medium text-[#18191D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Describe your executive background, specialized niches, and high-impact competencies..."
                />
              </div>

              {/* Skills Tags */}
              <div className="text-xs space-y-2">
                <label className="block font-bold text-stone-700 uppercase">Core Executive Skills & Competencies</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 bg-[#FAF8F5] border border-[#ECE6DD] text-stone-800 rounded-full font-semibold flex items-center gap-1.5 text-xs"
                    >
                      <span>{skill}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-stone-400 hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input 
                    type="text" 
                    value={newSkillInput} 
                    onChange={e => setNewSkillInput(e.target.value)}
                    placeholder="Add executive skill (e.g. Board Room Presentations)..."
                    className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl text-xs font-semibold focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-[#18191D] text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#ECE6DD]">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#18191D] hover:bg-black text-white font-bold rounded-full text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>

          </div>

          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Summary Badge */}
            <div className="bg-[#18191D] text-white p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"} 
                  alt={fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <h4 className="font-extrabold text-sm">{fullName}</h4>
                  <p className="text-[11px] text-stone-300">{title}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-400">Email:</span>
                  <span className="font-semibold text-white truncate max-w-[170px]">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Studio:</span>
                  <span className="font-semibold text-white">{agencyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Base Rate:</span>
                  <span className="font-mono font-bold text-emerald-400">${defaultHourlyRate}/hr</span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Profile Management Navigation
              </h4>
              <div className="space-y-2 text-xs">
                <button 
                  onClick={() => setActiveTab('career')} 
                  className="w-full p-2.5 bg-[#FAF8F5] hover:bg-stone-100 rounded-xl text-left font-bold text-[#18191D] flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-700" /> Resume & CV Manager
                  </span>
                  <span className="text-[10px] text-stone-400">View</span>
                </button>
                <button 
                  onClick={() => setActiveTab('portfolio')} 
                  className="w-full p-2.5 bg-[#FAF8F5] hover:bg-stone-100 rounded-xl text-left font-bold text-[#18191D] flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-700" /> Portfolio & Web Links
                  </span>
                  <span className="text-[10px] text-stone-400">View</span>
                </button>
                <button 
                  onClick={() => setActiveTab('security')} 
                  className="w-full p-2.5 bg-[#FAF8F5] hover:bg-stone-100 rounded-xl text-left font-bold text-[#18191D] flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" /> Security & Admin RBAC
                  </span>
                  <span className="text-[10px] text-stone-400">View</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. RESUME, CV & CAREER DOCUMENTS */}
      {activeTab === 'career' && (
        <div className="space-y-6">
          
          {/* Resume & CV Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Executive Resume Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-900 border border-purple-100 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#18191D]">Executive Resume</h3>
                    <p className="text-[11px] text-stone-500">1-2 Page Targeted Executive Summary</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-stone-400">Updated {resumeLastUpdated}</span>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18191D] truncate">{resumeFileName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">PDF / DOC</span>
                </div>
                <input 
                  type="url" 
                  value={resumeUrl}
                  onChange={e => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  ref={resumeInputRef} 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleResumeFile(file);
                  }}
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  className="flex-1 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload New File
                </button>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-white border border-[#ECE6DD] hover:bg-stone-50 text-[#18191D] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open
                  </a>
                )}
              </div>
            </div>

            {/* Comprehensive Curriculum Vitae (CV) Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#18191D]">Full Curriculum Vitae (CV)</h3>
                    <p className="text-[11px] text-stone-500">Comprehensive Career History & Governance</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-stone-400">Master Record</span>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18191D] truncate">{cvFileName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold">PDF / DOC</span>
                </div>
                <input 
                  type="url" 
                  value={cvUrl}
                  onChange={e => setCvUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateUserProfile({ cvUrl, cvFileName });
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 2500);
                  }}
                  className="flex-1 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" /> Save CV Link
                </button>
                {cvUrl && (
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-white border border-[#ECE6DD] hover:bg-stone-50 text-[#18191D] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Career Documents & Certifications Vault */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <h3 className="text-base font-bold text-[#18191D]">Career Documents, Certifications & Credentials</h3>
                <p className="text-xs text-stone-500">
                  Store executive certifications, degrees, NDA compliance records, and letters of recommendation.
                </p>
              </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {careerDocs.map(doc => (
                <div key={doc.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] flex flex-col justify-between gap-3 relative group">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#ECE6DD] text-stone-600 uppercase">
                        {doc.type}
                      </span>
                      <button 
                        onClick={() => handleRemoveCareerDoc(doc.id)} 
                        className="text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-[#18191D] leading-snug">{doc.name}</h4>
                    {doc.description && <p className="text-[11px] text-stone-500 line-clamp-2">{doc.description}</p>}
                    <span className="text-[10px] text-stone-400 block pt-1">Added: {doc.uploadedDate}</span>
                  </div>

                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-2 bg-white border border-[#ECE6DD] hover:bg-stone-100 text-[#18191D] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Credential
                  </a>
                </div>
              ))}
            </div>

            {/* Add Document Form */}
            <form onSubmit={handleAddCareerDoc} className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Add Career Credential or Document</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  required
                  value={newDocName}
                  onChange={e => setNewDocName(e.target.value)}
                  placeholder="Document Title (e.g. Harvard Business School Leadership)"
                  className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                />
                <select
                  value={newDocType}
                  onChange={e => setNewDocType(e.target.value)}
                  className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                >
                  <option value="Certification">Executive Certification</option>
                  <option value="Degree">Degree / Diploma</option>
                  <option value="Accreditation">Accreditation / NDA Compliance</option>
                  <option value="Recommendation">Letter of Recommendation</option>
                  <option value="Award">Award / Honor</option>
                </select>
                <input 
                  type="url" 
                  required
                  value={newDocUrl}
                  onChange={e => setNewDocUrl(e.target.value)}
                  placeholder="Document / Verification URL"
                  className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={newDocDesc}
                  onChange={e => setNewDocDesc(e.target.value)}
                  placeholder="Brief note or issuing body..."
                  className="flex-1 text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Credential
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

      {/* 3. PORTFOLIO & WEB PRESENCE */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          
          {/* Portfolio Links Grid */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <h3 className="text-base font-bold text-[#18191D]">Portfolio Showcase & Case Study Hubs</h3>
                <p className="text-xs text-stone-500">Live links to your Notion vaults, Google Drive deliverables, and design portfolios.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioLinks.map(port => (
                <div key={port.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] flex flex-col justify-between gap-3 relative group">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#ECE6DD] text-stone-700">
                        {port.platform}
                      </span>
                      <button 
                        onClick={() => handleRemovePortfolio(port.id)}
                        className="text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Remove portfolio link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-[#18191D]">{port.title}</h4>
                    {port.description && <p className="text-[11px] text-stone-500">{port.description}</p>}
                  </div>

                  <a 
                    href={port.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-2 bg-white border border-[#ECE6DD] hover:bg-stone-100 text-[#18191D] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Visit Showcase
                  </a>
                </div>
              ))}
            </div>

            {/* Add Portfolio Form */}
            <form onSubmit={handleAddPortfolio} className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Add New Portfolio Showcase Link</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  required
                  value={newPortTitle}
                  onChange={e => setNewPortTitle(e.target.value)}
                  placeholder="Title (e.g. Strategy Playbooks)"
                  className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                />
                <select
                  value={newPortPlatform}
                  onChange={e => setNewPortPlatform(e.target.value)}
                  className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                >
                  <option value="Notion">Notion</option>
                  <option value="Google Drive">Google Drive</option>
                  <option value="Behance">Behance</option>
                  <option value="GitHub">GitHub</option>
                  <option value="Personal Website">Personal Website</option>
                  <option value="Figma">Figma</option>
                  <option value="Other">Other Platform</option>
                </select>
                <input 
                  type="url" 
                  required
                  value={newPortUrl}
                  onChange={e => setNewPortUrl(e.target.value)}
                  placeholder="https://..."
                  className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={newPortDesc}
                  onChange={e => setNewPortDesc(e.target.value)}
                  placeholder="Brief description of artifacts included..."
                  className="flex-1 text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Showcase
                </button>
              </div>
            </form>
          </div>

          {/* Social & Web Links */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <h3 className="text-base font-bold text-[#18191D]">Social & Professional Web Links</h3>
                <p className="text-xs text-stone-500">Connect your public executive presence to client portal deliverables.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {socialLinks.map((soc, idx) => (
                <div key={idx} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] flex items-center justify-between gap-3 relative group">
                  <div className="space-y-0.5 truncate">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">{soc.platform}</span>
                    <h5 className="text-xs font-bold text-[#18191D] truncate">{soc.label || soc.platform}</h5>
                    <a href={soc.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline block truncate">
                      {soc.url}
                    </a>
                  </div>
                  <button 
                    onClick={() => handleRemoveSocial(idx)}
                    className="text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Remove social link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Social Link Form */}
            <form onSubmit={handleAddSocial} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE6DD] flex flex-wrap items-center gap-2.5">
              <select
                value={newSocialPlatform}
                onChange={e => setNewSocialPlatform(e.target.value)}
                className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none min-w-[130px]"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Website">Personal / Studio Website</option>
                <option value="X / Twitter">X / Twitter</option>
                <option value="GitHub">GitHub</option>
                <option value="Substack">Substack</option>
                <option value="Medium">Medium</option>
                <option value="Instagram">Instagram</option>
              </select>
              <input 
                type="text" 
                value={newSocialLabel}
                onChange={e => setNewSocialLabel(e.target.value)}
                placeholder="Label (optional)"
                className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none flex-1 min-w-[120px]"
              />
              <input 
                type="url" 
                required
                value={newSocialUrl}
                onChange={e => setNewSocialUrl(e.target.value)}
                placeholder="https://..."
                className="text-xs p-2.5 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none flex-1 min-w-[180px]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#18191D] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 4. SECURITY, ACCESS CONTROL & MULTI-TENANT ISOLATION */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          
          {/* Multi-Tenant SaaS Workspace Status */}
          <div className="p-6 bg-white rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-100 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#18191D]">
                    Private Multi-Tenant Workspace Isolation
                  </h3>
                  <p className="text-xs text-stone-500">
                    Active Tenant: <strong>{currentUser?.fullName || userProfile?.fullName}</strong> • Key: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[11px] font-mono">{activeTenantId || 'tenant-master-001'}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Single-Tenant Data Isolation
                </span>
                <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                  {isSuperAdmin ? 'Platform Owner' : 'Active Workspace'}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Your clients, financial records, projects, time logs, templates, and SOPs are strictly isolated to your private tenant workspace. No other platform user or organization can access, view, or export your operational data.
            </p>
          </div>

          {/* Super Admin Sole Owner Platform Control Callout */}
          {isSuperAdmin && (
            <div className="p-6 bg-[#18191D] text-white rounded-3xl border border-stone-800 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-400 text-black text-[10px] font-black rounded-md uppercase tracking-wider">
                      Owner Authorization
                    </span>
                    <h3 className="text-sm font-black text-white">
                      Sole Platform Administrator & Multi-Tenant Registry
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400">
                    You are authorized as the sole Owner/Admin to provision tenant accounts, inspect workspaces, and manage platform settings.
                  </p>
                </div>

                <a
                  href="/platform-admin"
                  className="px-5 py-2.5 bg-white hover:bg-stone-100 text-black rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
                >
                  <Shield className="w-4 h-4 text-black" />
                  <span>Open Platform Admin Hub</span>
                </a>
              </div>
            </div>
          )}

          {/* Change Own Password Form */}
          <form onSubmit={handleSelfPasswordChange} className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <h3 className="text-sm font-bold text-[#18191D]">Update Your Account Password</h3>
                <p className="text-xs text-stone-500">Secure your personal workspace with an encrypted password.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSelfPassword(!showSelfPassword)}
                className="text-xs font-semibold text-stone-500 hover:text-black flex items-center gap-1"
              >
                {showSelfPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showSelfPassword ? 'Hide Passwords' : 'Show Passwords'}
              </button>
            </div>

            {selfPassSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{selfPassSuccess}</span>
              </div>
            )}

            {selfPassError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{selfPassError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">New Password (min 8 chars)</label>
                <input
                  type={showSelfPassword ? 'text' : 'password'}
                  required
                  value={newPasswordSelf}
                  onChange={e => setNewPasswordSelf(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Confirm New Password</label>
                <input
                  type={showSelfPassword ? 'text' : 'password'}
                  required
                  value={confirmPasswordSelf}
                  onChange={e => setNewPasswordSelf(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </button>
            </div>
          </form>

          {/* Active Accounts List (Admin / Owner Only) */}
          {(isOwner || isSuperAdmin) && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                <div>
                  <h3 className="text-sm font-bold text-[#18191D]">Active Workspace Accounts ({userAccounts.length})</h3>
                  <p className="text-xs text-stone-500">Provisioned credentials with localized session hashes.</p>
                </div>
              </div>

              <div className="space-y-3">
                {userAccounts.map(account => (
                  <div key={account.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#18191D] text-white flex items-center justify-center text-xs font-bold">
                        {account.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#18191D]">{account.fullName}</span>
                          {account.isPrimaryOwner && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                              Super Admin / Owner
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500">{account.email} • Role: <strong>{account.role}</strong></p>
                      </div>
                    </div>

                    {!account.isPrimaryOwner && account.role !== 'Owner' && isOwner && (
                      <button
                        onClick={() => deleteUserAccount(account.id)}
                        className="text-stone-400 hover:text-rose-600 p-2 transition-colors cursor-pointer"
                        title="Revoke access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provision New Account (Owner Only) */}
          {isOwner && (
            <form onSubmit={handleCreateAccount} className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                <div>
                  <h3 className="text-sm font-bold text-[#18191D]">Quick Provision Studio Account</h3>
                  <p className="text-xs text-stone-500">Create scoped credentials with isolated tenant parameters.</p>
                </div>
              </div>

              {accCreateSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {accCreateSuccess}
                </div>
              )}

              {accCreateError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  {accCreateError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <input 
                  type="text" 
                  required
                  value={newAccFullName}
                  onChange={e => setNewAccFullName(e.target.value)}
                  placeholder="Full Name (e.g. Alex Rivera)"
                  className="p-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none"
                />
                <input 
                  type="email" 
                  required
                  value={newAccEmail}
                  onChange={e => setNewAccEmail(e.target.value)}
                  placeholder="User Email"
                  className="p-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none"
                />
                <input 
                  type="password" 
                  required
                  value={newAccPassword}
                  onChange={e => setNewAccPassword(e.target.value)}
                  placeholder="Initial Password (min 8 chars)"
                  className="p-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none"
                />
                <select
                  value={newAccRole}
                  onChange={e => setNewAccRole(e.target.value as any)}
                  className="p-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none font-semibold"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Executive Assistant">Executive Assistant</option>
                  <option value="Contractor">Contractor (Scoped)</option>
                  <option value="Read Only">Read Only</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" /> Provision Account
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* 5. DATA PORTABILITY & BACKUP */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18191D]">Google Drive Document Strategy</h3>
                  <p className="text-xs text-stone-500">AEDMIN acts as the metadata layer, linking out to Google Drive folders.</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                In accordance with the AEDMIN security philosophy, sensitive client documents, spreadsheets, and slide decks remain safely hosted in your Google Drive folders. AEDMIN seamlessly links to those URLs from tasks, client workspaces, deliverable sign-offs, and invoices.
              </p>
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-5">
              <div className="pb-3 border-b border-[#ECE6DD]">
                <h3 className="text-base font-bold text-[#18191D]">Data Backup & Portability</h3>
                <p className="text-xs text-stone-500">Export and import your entire freelancer OS state.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={exportBackupJSON}
                  className="w-full py-3 bg-[#FAF8F5] hover:bg-stone-100 border border-[#ECE6DD] rounded-2xl text-xs font-bold text-[#18191D] flex items-center justify-center gap-2 transition-all shadow-2xs"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  Export Full JSON Backup
                </button>

                <label className="w-full py-3 bg-[#FAF8F5] hover:bg-stone-100 border border-[#ECE6DD] rounded-2xl text-xs font-bold text-[#18191D] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Import JSON Backup</span>
                  <input 
                    type="file" 
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-[#ECE6DD] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-900 block">
                  Reset State
                </span>

                {!resetConfirmOpen ? (
                  <button
                    type="button"
                    onClick={() => setResetConfirmOpen(true)}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default Seed Data
                  </button>
                ) : (
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3 text-xs">
                    <p className="font-semibold text-rose-950">
                      Are you sure? This will reload clean default seed data.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setResetConfirmOpen(false)}
                        className="px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-stone-600 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => { resetToDefaultSeed(); setResetConfirmOpen(false); }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
                      >
                        Confirm Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
