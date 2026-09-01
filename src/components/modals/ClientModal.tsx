import React, { useState, useEffect } from 'react';
import { X, Building2, User, Mail, DollarSign, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Client } from '@/types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
}

export function ClientModal({ isOpen, onClose, clientToEdit }: ClientModalProps) {
  const { addClient, updateClient } = useApp();

  const [name, setName] = useState(clientToEdit?.name || '');
  const [code, setCode] = useState(clientToEdit?.code || '');
  const [company, setCompany] = useState(clientToEdit?.company || '');
  const [primaryContact, setPrimaryContact] = useState(clientToEdit?.primaryContact || '');
  const [email, setEmail] = useState(clientToEdit?.email || '');
  const [phone, setPhone] = useState(clientToEdit?.phone || '');
  const [status, setStatus] = useState<Client['status']>(clientToEdit?.status || 'active');
  const [contractType, setContractType] = useState<Client['contractType']>(clientToEdit?.contractType || 'retainer');
  const [monthlyRetainerFee, setMonthlyRetainerFee] = useState<number>(clientToEdit?.monthlyRetainerFee ?? 5000);
  const [purchasedHours, setPurchasedHours] = useState<number>(clientToEdit?.purchasedHours ?? 35);
  const [hourlyRate, setHourlyRate] = useState<number>(clientToEdit?.hourlyRate ?? 150);
  const [avatarColor, setAvatarColor] = useState(clientToEdit?.avatarColor || 'bg-card-blue');
  const [googleDriveFolderUrl, setGoogleDriveFolderUrl] = useState(clientToEdit?.googleDriveFolderUrl || '');
  const [slackChannel, setSlackChannel] = useState(clientToEdit?.slackChannel || '');

  // Intelligence Basics
  const [preferredName, setPreferredName] = useState(clientToEdit?.intelligence?.executiveProfile?.preferredName || '');
  const [timezone, setTimezone] = useState(clientToEdit?.intelligence?.executiveProfile?.timezone || 'America/New_York (EST)');
  const [communicationStyle, setCommunicationStyle] = useState(clientToEdit?.intelligence?.executiveProfile?.communicationStyle || 'Async-first, concise bullet points');

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name || '');
      setCode(clientToEdit.code || '');
      setCompany(clientToEdit.company || '');
      setPrimaryContact(clientToEdit.primaryContact || '');
      setEmail(clientToEdit.email || '');
      setPhone(clientToEdit.phone || '');
      setStatus(clientToEdit.status || 'active');
      setContractType(clientToEdit.contractType || 'retainer');
      setMonthlyRetainerFee(clientToEdit.monthlyRetainerFee ?? 5000);
      setPurchasedHours(clientToEdit.purchasedHours ?? 35);
      setHourlyRate(clientToEdit.hourlyRate ?? 150);
      setAvatarColor(clientToEdit.avatarColor || 'bg-card-blue');
      setGoogleDriveFolderUrl(clientToEdit.googleDriveFolderUrl || '');
      setSlackChannel(clientToEdit.slackChannel || '');
      setPreferredName(clientToEdit.intelligence?.executiveProfile?.preferredName || clientToEdit.primaryContact || clientToEdit.name || '');
      setTimezone(clientToEdit.intelligence?.executiveProfile?.timezone || 'America/New_York (EST)');
      setCommunicationStyle(clientToEdit.intelligence?.executiveProfile?.communicationStyle || 'Async-first, concise bullet points');
    } else {
      setName('');
      setCode('');
      setCompany('');
      setPrimaryContact('');
      setEmail('');
      setPhone('');
      setStatus('active');
      setContractType('retainer');
      setMonthlyRetainerFee(5000);
      setPurchasedHours(35);
      setHourlyRate(150);
      setAvatarColor('bg-card-blue');
      setGoogleDriveFolderUrl('');
      setSlackChannel('');
      setPreferredName('');
      setTimezone('America/New_York (EST)');
      setCommunicationStyle('Async-first, concise bullet points');
    }
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedCode = code.trim().toUpperCase() || name.substring(0, 4).toUpperCase();

    const clientPayload = {
      name,
      code: generatedCode,
      company: company || name,
      primaryContact: primaryContact || name,
      email,
      phone,
      status,
      contractType,
      monthlyRetainerFee: Number(monthlyRetainerFee),
      purchasedHours: Number(purchasedHours),
      hourlyRate: Number(hourlyRate),
      avatarColor,
      googleDriveFolderUrl,
      slackChannel,
      relationshipHealth: clientToEdit?.relationshipHealth || 'exceptional',
      onboardingProgress: clientToEdit?.onboardingProgress || (status === 'onboarding' ? 20 : 100),
      onboardingPhases: clientToEdit?.onboardingPhases || [],
      intelligence: clientToEdit?.intelligence || {
        executiveProfile: {
          preferredName: preferredName || primaryContact || name,
          timezone,
          communicationStyle,
          meetingPreferences: 'Mornings preferred, max 25 mins',
          decisionMakingStyle: 'Structured options with recommendations',
          reportingPreferences: 'Weekly Friday executive summary'
        },
        businessProfile: {
          company: company || name,
          industry: 'Professional Services / Tech',
          website: 'https://example.com',
          coreServices: 'Strategy, Operations, Growth',
          currentGoals: 'Scale operations and increase margins',
          keyChallenges: 'Time management, calendar conflicts',
          keyTeamMembers: 'Executive Team',
          primaryVendors: 'Google Workspace, Slack, Notion',
          coreSystems: 'Cloud Tools'
        },
        relationshipProfile: {
          hobbies: '',
          interests: '',
          travelPreferences: '',
          favoriteRestaurants: '',
          giftIdeas: '',
          personalNotes: ''
        },
        lifestyleContext: {},
        memoryVault: []
      }
    };

    if (clientToEdit) {
      updateClient(clientToEdit.id, clientPayload);
    } else {
      addClient(clientPayload);
    }

    onClose();
  };

  const colorOptions = [
    { label: 'Pastel Blue', value: 'bg-card-blue' },
    { label: 'Pastel Pink', value: 'bg-card-pink' },
    { label: 'Pastel Yellow', value: 'bg-card-yellow' },
    { label: 'Pastel Green', value: 'bg-card-green' },
    { label: 'Slate Dark', value: 'bg-sidebar-bg text-white' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-main">
              {clientToEdit ? 'Edit Client Workspace' : 'Add New Client Workspace'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">AEDMIN Dedicated Client Workspace & Executive Profile</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Company & Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Client / Organization Name</label>
              <input 
                type="text" 
                value={name ?? ''} 
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Arkgate Ventures"
                className="w-full px-4 py-3 bg-[#FDFBF7] border border-border-subtle rounded-2xl text-sm font-medium focus:outline-none"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Client Code (4-chars)</label>
              <input 
                type="text" 
                value={code ?? ''} 
                maxLength={4}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="ARKG"
                className="w-full px-4 py-3 bg-[#FDFBF7] border border-border-subtle rounded-2xl text-sm font-medium uppercase font-mono text-center focus:outline-none"
              />
            </div>
          </div>

          {/* Primary Contact & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Principal Executive Contact</label>
              <input 
                type="text" 
                value={primaryContact ?? ''} 
                onChange={e => setPrimaryContact(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Contact Email</label>
              <input 
                type="email" 
                value={email ?? ''} 
                onChange={e => setEmail(e.target.value)}
                placeholder="marcus@arkgatevc.com"
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Contract Type & Rates */}
          <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Contract & Retainer Structure</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contract Type</label>
                <select 
                  value={contractType ?? 'retainer'} 
                  onChange={e => setContractType(e.target.value as Client['contractType'])}
                  className="w-full px-3 py-2 bg-white border border-border-subtle rounded-xl text-sm font-medium"
                >
                  <option value="retainer">Monthly Retainer</option>
                  <option value="project">Fixed Project</option>
                  <option value="hourly">Hourly Billing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Monthly Fee ($)</label>
                <input 
                  type="number" 
                  value={monthlyRetainerFee ?? 0} 
                  onChange={e => setMonthlyRetainerFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-border-subtle rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Purchased Hours / Mo</label>
                <input 
                  type="number" 
                  value={purchasedHours ?? 0} 
                  onChange={e => setPurchasedHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-border-subtle rounded-xl text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Status & Accent Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Lifecycle Status</label>
              <select 
                value={status ?? 'active'} 
                onChange={e => setStatus(e.target.value as Client['status'])}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              >
                <option value="active">Active Operations</option>
                <option value="onboarding">In Onboarding</option>
                <option value="paused">Paused / Hold</option>
                <option value="offboarding">Offboarding</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Card Accent Theme</label>
              <div className="flex gap-2 items-center h-10">
                {colorOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAvatarColor(opt.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${opt.value} ${avatarColor === opt.value ? 'ring-2 ring-black scale-110' : 'opacity-80'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Google Drive & Slack Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Google Drive Root Folder</label>
              <input 
                type="url" 
                value={googleDriveFolderUrl ?? ''} 
                onChange={e => setGoogleDriveFolderUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Slack Channel ID / Name</label>
              <input 
                type="text" 
                value={slackChannel ?? ''} 
                onChange={e => setSlackChannel(e.target.value)}
                placeholder="#aedmin-client-ops"
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-border-subtle text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-full bg-sidebar-bg text-white text-sm font-medium hover:bg-sidebar-active transition-colors shadow-sm"
            >
              {clientToEdit ? 'Update Workspace' : 'Initialize Workspace'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
