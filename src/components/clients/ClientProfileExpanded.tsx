import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Heart, 
  Home, 
  Plane, 
  Activity, 
  Scissors, 
  Calendar, 
  Users, 
  Target, 
  Sparkles, 
  DollarSign, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Edit2, 
  Sliders,
  Tag
} from 'lucide-react';
import { Client, CustomClientField } from '@/types';
import { useApp } from '@/context/AppContext';

interface ClientProfileExpandedProps {
  client: Client;
}

export function ClientProfileExpanded({ client }: ClientProfileExpandedProps) {
  const { updateClient } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<
    'personal' | 'business' | 'family' | 'household' | 'travel' | 'health' | 'grooming' | 'dates' | 'social' | 'goals' | 'hobbies' | 'financial' | 'custom'
  >('personal');

  const [isSavedToast, setIsSavedToast] = useState(false);

  // Form State initialized from client.intelligence
  const intel: any = client.intelligence || {};
  const [formData, setFormData] = useState({
    // Personal
    fullName: intel.personalInfo?.fullName || client.primaryContact || client.name,
    preferredName: intel.personalInfo?.preferredName || intel.executiveProfile?.preferredName || client.name,
    dateOfBirth: intel.personalInfo?.dateOfBirth || '',
    homeAddress: intel.personalInfo?.homeAddress || '',
    emergencyContact: intel.personalInfo?.emergencyContact || '',
    bio: intel.personalInfo?.bio || '',

    // Business
    companyName: intel.businessInfo?.companyName || client.company || client.name,
    industry: intel.businessInfo?.industry || 'Technology / Professional Services',
    taxId: intel.businessInfo?.taxId || '',
    registeredAddress: intel.businessInfo?.registeredAddress || '',
    keyVendors: intel.businessInfo?.keyVendors || 'Google Workspace, Notion, Slack',
    assistantRoleScope: intel.businessInfo?.assistantRoleScope || 'Full-scope Strategic Executive Partner',

    // Family
    spousePartner: intel.familyInfo?.spousePartner || '',
    children: intel.familyInfo?.children || '',
    anniversaryDate: intel.familyInfo?.anniversaryDate || '',
    familyNotes: intel.familyInfo?.familyNotes || '',

    // Household
    primaryResidence: intel.householdInfo?.primaryResidence || '',
    staffSchedule: intel.householdInfo?.staffSchedule || '',
    gateAccessCode: intel.householdInfo?.gateAccessCode || '',
    maintenanceContacts: intel.householdInfo?.maintenanceContacts || '',

    // Travel
    frequentFlyerNumbers: intel.travelManagement?.frequentFlyerNumbers || '',
    passportNumber: intel.travelManagement?.passportNumber || '',
    passportExpiryDate: intel.travelManagement?.passportExpiryDate || '',
    seatingPreference: intel.travelManagement?.seatingPreference || 'Aisle seat, front of cabin',
    hotelPreferences: intel.travelManagement?.hotelPreferences || 'High floor, away from elevator, king bed',

    // Health
    dietaryRestrictions: intel.healthRecords?.dietaryRestrictions || 'None specified',
    allergies: intel.healthRecords?.allergies || 'None',
    bloodType: intel.healthRecords?.bloodType || '',
    physicianContact: intel.healthRecords?.physicianContact || '',
    wellnessRoutines: intel.healthRecords?.wellnessRoutines || 'Morning cardio, evening sauna',

    // Grooming
    preferredStylist: intel.groomingAppointments?.preferredStylist || '',
    cadence: intel.groomingAppointments?.cadence || 'Every 3 weeks on Thursday afternoon',
    standingAppointments: intel.groomingAppointments?.standingAppointments || 'Hair & Beard trim on 1st & 3rd Thursdays',
    notes: intel.groomingAppointments?.notes || '',

    // Dates
    importantDatesText: intel.importantDates?.map((d: any) => `${d.date}: ${d.title} (${d.type})`).join('\n') || 'Dec 12: Board of Directors Annual Summit\nNov 04: Client Birthday',

    // Social
    keyRelationshipsText: intel.socialRelationships?.map((r: any) => `${r.name} (${r.relationship}): ${r.notes || ''}`).join('\n') || 'Marcus Vance (Lead Investor): Weekly check-in on Mondays\nSarah Jenkins (General Counsel): Contract reviews',

    // Goals
    goalsText: intel.goals?.map((g: any) => `[${g.timeframe?.toUpperCase() || 'Q3'}] ${g.title} - ${g.targetDate || '2026-12-31'}`).join('\n') || '[Q3] Complete Series B Funding Round - 2026-09-30\n[ANNUAL] Launch European Division - 2026-12-31',

    // Hobbies
    interests: intel.hobbiesAndInterests?.interests || 'Tennis, fine dining, contemporary art, angel investing',
    favoriteRestaurants: intel.hobbiesAndInterests?.favoriteRestaurants || 'Le Bernardin (NYC), Nobu, French Laundry',
    giftPreferences: intel.hobbiesAndInterests?.giftPreferences || 'Vintage Bordeaux, boutique coffee roasts, architectural coffee table books',

    // Financial
    preferredPaymentMethod: intel.financialPreferences?.preferredPaymentMethod || 'ACH / Bank Wire',
    billingContactEmail: intel.financialPreferences?.billingContactEmail || client.email,
    paymentTerms: intel.financialPreferences?.paymentTerms || 'Net 15',
    invoiceApprovalThreshold: intel.financialPreferences?.invoiceApprovalThreshold || 5000,

    // Custom Fields
    customFields: (intel.customFields || [
      { id: 'cf_1', label: 'Coffee Order', value: 'Double espresso with splash of oat milk', category: 'Personal' },
      { id: 'cf_2', label: 'Slack Handle', value: '@executive_lead', category: 'Custom' }
    ]) as CustomClientField[]
  });

  // Global custom field inputs for the master custom tab
  const [masterCustomLabel, setMasterCustomLabel] = useState('');
  const [masterCustomValue, setMasterCustomValue] = useState('');
  const [masterCustomCategory, setMasterCustomCategory] = useState<any>('Personal');

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCustomField = (label: string, value: string, category: string) => {
    if (!label.trim()) return;
    const newField: CustomClientField = {
      id: `cf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: label.trim(),
      value: value.trim(),
      category: category as any
    };
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
  };

  const handleDeleteCustomField = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== id)
    }));
  };

  const handleUpdateCustomField = (id: string, label: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(f => f.id === id ? { ...f, label, value } : f)
    }));
  };

  const handleSaveProfile = () => {
    const updatedIntelligence = {
      ...client.intelligence,
      personalInfo: {
        fullName: formData.fullName,
        preferredName: formData.preferredName,
        dateOfBirth: formData.dateOfBirth,
        homeAddress: formData.homeAddress,
        emergencyContact: formData.emergencyContact,
        bio: formData.bio
      },
      businessInfo: {
        companyName: formData.companyName,
        industry: formData.industry,
        taxId: formData.taxId,
        registeredAddress: formData.registeredAddress,
        keyVendors: formData.keyVendors,
        assistantRoleScope: formData.assistantRoleScope
      },
      familyInfo: {
        spousePartner: formData.spousePartner,
        children: formData.children,
        anniversaryDate: formData.anniversaryDate,
        familyNotes: formData.familyNotes
      },
      householdInfo: {
        primaryResidence: formData.primaryResidence,
        staffSchedule: formData.staffSchedule,
        gateAccessCode: formData.gateAccessCode,
        maintenanceContacts: formData.maintenanceContacts
      },
      travelManagement: {
        frequentFlyerNumbers: formData.frequentFlyerNumbers,
        passportNumber: formData.passportNumber,
        passportExpiryDate: formData.passportExpiryDate,
        seatingPreference: formData.seatingPreference,
        hotelPreferences: formData.hotelPreferences
      },
      healthRecords: {
        dietaryRestrictions: formData.dietaryRestrictions,
        allergies: formData.allergies,
        bloodType: formData.bloodType,
        physicianContact: formData.physicianContact,
        wellnessRoutines: formData.wellnessRoutines
      },
      groomingAppointments: {
        preferredStylist: formData.preferredStylist,
        cadence: formData.cadence,
        standingAppointments: formData.standingAppointments,
        notes: formData.notes
      },
      hobbiesAndInterests: {
        interests: formData.interests,
        favoriteRestaurants: formData.favoriteRestaurants,
        giftPreferences: formData.giftPreferences
      },
      financialPreferences: {
        preferredPaymentMethod: formData.preferredPaymentMethod,
        billingContactEmail: formData.billingContactEmail,
        paymentTerms: formData.paymentTerms,
        invoiceApprovalThreshold: Number(formData.invoiceApprovalThreshold)
      },
      customFields: formData.customFields
    };

    updateClient(client.id, {
      intelligence: updatedIntelligence,
      primaryContact: formData.fullName || client.primaryContact,
      company: formData.companyName || client.company
    });

    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  // Helper component to render and add custom fields inside any tab
  const TabCustomFieldsSection = ({ category, categoryLabel }: { category: string; categoryLabel: string }) => {
    const [labelInput, setLabelInput] = useState('');
    const [valInput, setValInput] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState('');
    const [editVal, setEditVal] = useState('');

    const matchingFields = formData.customFields.filter(f => 
      (f.category || 'General').toLowerCase() === category.toLowerCase() ||
      (category === 'Personal' && (!f.category || f.category === 'Custom'))
    );

    const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      if (!labelInput.trim()) return;
      handleAddCustomField(labelInput, valInput, category);
      setLabelInput('');
      setValInput('');
    };

    const startEditing = (field: CustomClientField) => {
      setEditingId(field.id);
      setEditLabel(field.label);
      setEditVal(field.value);
    };

    const saveEditing = (id: string) => {
      handleUpdateCustomField(id, editLabel, editVal);
      setEditingId(null);
    };

    return (
      <div className="pt-4 border-t border-[#ECE6DD] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
            <Tag className="w-3.5 h-3.5 text-purple-600" />
            <span>Custom {categoryLabel} Fields ({matchingFields.length})</span>
          </div>
          <span className="text-[10px] text-stone-400">Add tailored client attributes to this section</span>
        </div>

        {matchingFields.length > 0 && (
          <div className="space-y-2">
            {matchingFields.map(field => (
              <div 
                key={field.id} 
                className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] flex items-center justify-between gap-3 text-xs"
              >
                {editingId === field.id ? (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editLabel}
                      onChange={e => setEditLabel(e.target.value)}
                      className="p-1.5 bg-white border border-[#ECE6DD] rounded-lg text-xs"
                      placeholder="Field Label"
                    />
                    <input
                      type="text"
                      value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      className="p-1.5 bg-white border border-[#ECE6DD] rounded-lg text-xs"
                      placeholder="Field Value"
                    />
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="font-bold text-stone-800">{field.label}</span>
                    <span className="font-mono text-stone-600 sm:col-span-2">{field.value || '—'}</span>
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  {editingId === field.id ? (
                    <button
                      type="button"
                      onClick={() => saveEditing(field.id)}
                      className="p-1 text-emerald-600 hover:text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 rounded-lg cursor-pointer"
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditing(field)}
                      className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomField(field.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add custom field in this tab form */}
        <form onSubmit={handleAdd} className="p-3 bg-[#FCFAF8] rounded-2xl border border-dashed border-stone-300 flex flex-col sm:flex-row gap-2 text-xs">
          <input
            type="text"
            placeholder={`Add ${categoryLabel} field name (e.g. Favorite Coffee)`}
            value={labelInput}
            onChange={e => setLabelInput(e.target.value)}
            className="flex-1 p-2 rounded-xl border border-[#ECE6DD] bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
          <input
            type="text"
            placeholder="Value (e.g. Iced Oat Cortado)"
            value={valInput}
            onChange={e => setValInput(e.target.value)}
            className="flex-1 p-2 rounded-xl border border-[#ECE6DD] bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shrink-0 hover:bg-black transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Field
          </button>
        </form>
      </div>
    );
  };

  const navItems = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'text-blue-600' },
    { id: 'business', label: 'Business Profile', icon: Building2, color: 'text-stone-700' },
    { id: 'family', label: 'Family & Home', icon: Heart, color: 'text-rose-600' },
    { id: 'household', label: 'Household Ops', icon: Home, color: 'text-amber-600' },
    { id: 'travel', label: 'Travel Preferences', icon: Plane, color: 'text-indigo-600' },
    { id: 'health', label: 'Health & Wellness', icon: Activity, color: 'text-emerald-600' },
    { id: 'grooming', label: 'Grooming & Stylist', icon: Scissors, color: 'text-purple-600' },
    { id: 'dates', label: 'Important Dates', icon: Calendar, color: 'text-amber-700' },
    { id: 'social', label: 'Social & Stakeholders', icon: Users, color: 'text-sky-600' },
    { id: 'goals', label: 'Executive Goals', icon: Target, color: 'text-rose-700' },
    { id: 'hobbies', label: 'Hobbies & Gifts', icon: Sparkles, color: 'text-pink-600' },
    { id: 'financial', label: 'Financial Settings', icon: DollarSign, color: 'text-emerald-700' },
    { id: 'custom', label: 'All Custom Fields', icon: Sliders, color: 'text-stone-800' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#ECE6DD] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#ECE6DD] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#FAF8F5]">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold tracking-wide uppercase">
            Executive Intelligence Dossier
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-1">360° Comprehensive Client Profile</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Holistic knowledge database covering personal, family, business, travel, health, and custom attributes for {client.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSavedToast && (
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Changes Saved
            </span>
          )}
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-full flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Profile Dossier
          </button>
        </div>
      </div>

      {/* Profile Body with Sidebar Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
        {/* Left Sub-Nav */}
        <div className="p-4 border-r border-[#ECE6DD] bg-[#FCFAF8] space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive 
                    ? 'bg-white text-stone-900 font-bold shadow-xs border border-[#ECE6DD]' 
                    : 'text-stone-600 hover:bg-stone-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Form Editor Panel */}
        <div className="md:col-span-3 p-6 space-y-6 overflow-y-auto max-h-[700px]">
          
          {/* 1. PERSONAL */}
          {activeSubTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Personal Identity & Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Preferred Name / Salutation</label>
                  <input
                    type="text"
                    value={formData.preferredName}
                    onChange={(e) => handleFieldChange('preferredName', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="Name & Phone Number"
                    value={formData.emergencyContact}
                    onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Primary Home Address</label>
                <input
                  type="text"
                  value={formData.homeAddress}
                  onChange={(e) => handleFieldChange('homeAddress', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Executive Bio & Background Context</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  placeholder="Key background, previous ventures, executive career..."
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              {/* Custom Fields in Personal Tab */}
              <TabCustomFieldsSection category="Personal" categoryLabel="Personal" />
            </div>
          )}

          {/* 2. BUSINESS */}
          {activeSubTab === 'business' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-stone-700" /> Business & Corporate Entity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Corporate Entity Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleFieldChange('companyName', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Industry / Sector</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleFieldChange('industry', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tax ID / EIN</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleFieldChange('taxId', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Executive Assistant Scope</label>
                  <input
                    type="text"
                    value={formData.assistantRoleScope}
                    onChange={(e) => handleFieldChange('assistantRoleScope', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Primary Tech Stack & Core Vendors</label>
                <input
                  type="text"
                  value={formData.keyVendors}
                  onChange={(e) => handleFieldChange('keyVendors', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              {/* Custom Fields in Business Tab */}
              <TabCustomFieldsSection category="Business" categoryLabel="Business" />
            </div>
          )}

          {/* 3. FAMILY */}
          {activeSubTab === 'family' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" /> Family & Relationships
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Spouse / Partner Name</label>
                  <input
                    type="text"
                    value={formData.spousePartner}
                    onChange={(e) => handleFieldChange('spousePartner', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Anniversary Date</label>
                  <input
                    type="date"
                    value={formData.anniversaryDate}
                    onChange={(e) => handleFieldChange('anniversaryDate', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Children (Names & Ages/Birthdays)</label>
                <input
                  type="text"
                  placeholder="e.g. Leo (Age 8, June 14), Maya (Age 5, Oct 22)"
                  value={formData.children}
                  onChange={(e) => handleFieldChange('children', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Family Routine & School Schedule Notes</label>
                <textarea
                  rows={3}
                  value={formData.familyNotes}
                  onChange={(e) => handleFieldChange('familyNotes', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              {/* Custom Fields in Family Tab */}
              <TabCustomFieldsSection category="Family" categoryLabel="Family" />
            </div>
          )}

          {/* 4. HOUSEHOLD */}
          {activeSubTab === 'household' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-600" /> Household Operations & Estate Management
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Primary Residence Details</label>
                  <input
                    type="text"
                    value={formData.primaryResidence}
                    onChange={(e) => handleFieldChange('primaryResidence', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Gate / Security Access Protocol</label>
                  <input
                    type="text"
                    value={formData.gateAccessCode}
                    onChange={(e) => handleFieldChange('gateAccessCode', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Staff / Cleaner / Landscaping Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Cleaners on Mon/Thu 9am, Pool service Tue 2pm"
                  value={formData.staffSchedule}
                  onChange={(e) => handleFieldChange('staffSchedule', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Maintenance Contacts & Service Vendors</label>
                <textarea
                  rows={2}
                  value={formData.maintenanceContacts}
                  onChange={(e) => handleFieldChange('maintenanceContacts', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              {/* Custom Fields in Household Tab */}
              <TabCustomFieldsSection category="Household" categoryLabel="Household" />
            </div>
          )}

          {/* 5. TRAVEL */}
          {activeSubTab === 'travel' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Plane className="w-4 h-4 text-indigo-600" /> Travel Management & Flight Protocols
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Frequent Flyer Numbers</label>
                  <input
                    type="text"
                    value={formData.frequentFlyerNumbers}
                    onChange={(e) => handleFieldChange('frequentFlyerNumbers', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Passport Number</label>
                  <input
                    type="text"
                    value={formData.passportNumber}
                    onChange={(e) => handleFieldChange('passportNumber', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Passport Expiry Date</label>
                  <input
                    type="date"
                    value={formData.passportExpiryDate}
                    onChange={(e) => handleFieldChange('passportExpiryDate', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Seating Preferences</label>
                  <input
                    type="text"
                    value={formData.seatingPreference}
                    onChange={(e) => handleFieldChange('seatingPreference', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Hotel Preferences</label>
                  <input
                    type="text"
                    value={formData.hotelPreferences}
                    onChange={(e) => handleFieldChange('hotelPreferences', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>

              {/* Custom Fields in Travel Tab */}
              <TabCustomFieldsSection category="Travel" categoryLabel="Travel" />
            </div>
          )}

          {/* 6. HEALTH */}
          {activeSubTab === 'health' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Health Records & Dietary Heuristics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Dietary Restrictions</label>
                  <input
                    type="text"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleFieldChange('dietaryRestrictions', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => handleFieldChange('allergies', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={formData.bloodType}
                    onChange={(e) => handleFieldChange('bloodType', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Primary Physician / Dental Contacts</label>
                  <input
                    type="text"
                    value={formData.physicianContact}
                    onChange={(e) => handleFieldChange('physicianContact', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Wellness Routines & Fitness Schedule</label>
                <textarea
                  rows={2}
                  value={formData.wellnessRoutines}
                  onChange={(e) => handleFieldChange('wellnessRoutines', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              {/* Custom Fields in Health Tab */}
              <TabCustomFieldsSection category="Health" categoryLabel="Health & Wellness" />
            </div>
          )}

          {/* 7. GROOMING */}
          {activeSubTab === 'grooming' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-purple-600" /> Grooming, Aesthetics & Stylist Bookings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Preferred Stylist / Salon / Barber</label>
                  <input
                    type="text"
                    value={formData.preferredStylist}
                    onChange={(e) => handleFieldChange('preferredStylist', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Appointment Cadence</label>
                  <input
                    type="text"
                    value={formData.cadence}
                    onChange={(e) => handleFieldChange('cadence', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Standing Appointments & Recurring Slots</label>
                <input
                  type="text"
                  value={formData.standingAppointments}
                  onChange={(e) => handleFieldChange('standingAppointments', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Stylist Notes & Aesthetic Preferences</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              {/* Custom Fields in Grooming Tab */}
              <TabCustomFieldsSection category="Grooming" categoryLabel="Grooming & Aesthetics" />
            </div>
          )}

          {/* 8. DATES */}
          {activeSubTab === 'dates' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700" /> Important Dates, Anniversaries & Milestones
              </h3>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Key Annual Dates & Recurring Milestones</label>
                <textarea
                  rows={4}
                  value={formData.importantDatesText}
                  onChange={(e) => handleFieldChange('importantDatesText', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD] font-mono"
                />
              </div>

              {/* Custom Fields in Dates Tab */}
              <TabCustomFieldsSection category="Dates" categoryLabel="Dates & Calendar" />
            </div>
          )}

          {/* 9. SOCIAL */}
          {activeSubTab === 'social' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" /> Key Social Circles & VIP Stakeholders
              </h3>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">VIP Stakeholders, Investors & Close Allies</label>
                <textarea
                  rows={4}
                  value={formData.keyRelationshipsText}
                  onChange={(e) => handleFieldChange('keyRelationshipsText', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD] font-mono"
                />
              </div>

              {/* Custom Fields in Social Tab */}
              <TabCustomFieldsSection category="Social" categoryLabel="Social & VIP" />
            </div>
          )}

          {/* 10. GOALS */}
          {activeSubTab === 'goals' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-700" /> Executive Goals & Quarterly Objectives
              </h3>
              <div className="text-xs">
                <label className="font-semibold text-stone-700 block mb-1">Active Executive Targets & High-Level Objectives</label>
                <textarea
                  rows={4}
                  value={formData.goalsText}
                  onChange={(e) => handleFieldChange('goalsText', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD] font-mono"
                />
              </div>

              {/* Custom Fields in Goals Tab */}
              <TabCustomFieldsSection category="Goals" categoryLabel="Executive Goals" />
            </div>
          )}

          {/* 11. HOBBIES */}
          {activeSubTab === 'hobbies' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-600" /> Hobbies, Dining & Gifting Heuristics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Leisure Interests & Sports</label>
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => handleFieldChange('interests', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Favorite Restaurants & Chefs</label>
                  <input
                    type="text"
                    value={formData.favoriteRestaurants}
                    onChange={(e) => handleFieldChange('favoriteRestaurants', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-stone-700 block mb-1">Gift Ideas & Preferred Tokens</label>
                  <input
                    type="text"
                    value={formData.giftPreferences}
                    onChange={(e) => handleFieldChange('giftPreferences', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>

              {/* Custom Fields in Hobbies Tab */}
              <TabCustomFieldsSection category="Hobbies" categoryLabel="Hobbies & Gifting" />
            </div>
          )}

          {/* 12. FINANCIAL */}
          {activeSubTab === 'financial' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-700" /> Financial Settings & Billing Protocol
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Preferred Payment Method</label>
                  <input
                    type="text"
                    value={formData.preferredPaymentMethod}
                    onChange={(e) => handleFieldChange('preferredPaymentMethod', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Billing Accounts Email</label>
                  <input
                    type="email"
                    value={formData.billingContactEmail}
                    onChange={(e) => handleFieldChange('billingContactEmail', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={(e) => handleFieldChange('paymentTerms', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Autonomous Approval Limit ($)</label>
                  <input
                    type="number"
                    value={formData.invoiceApprovalThreshold}
                    onChange={(e) => handleFieldChange('invoiceApprovalThreshold', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>

              {/* Custom Fields in Financial Tab */}
              <TabCustomFieldsSection category="Financial" categoryLabel="Financial & Billing" />
            </div>
          )}

          {/* 13. MASTER ALL CUSTOM FIELDS TAB */}
          {activeSubTab === 'custom' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-[#ECE6DD] pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-stone-800" /> All Custom Fields Master Registry
                </span>
                <span className="text-xs text-stone-400 font-normal">{formData.customFields.length} custom fields configured</span>
              </h3>

              <div className="space-y-2">
                {formData.customFields.map((field) => (
                  <div key={field.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <span className="font-bold text-stone-800">{field.label}</span>
                      <span className="font-mono text-stone-600 sm:col-span-2">{field.value}</span>
                    </div>
                    <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                      {field.category || 'General'}
                    </span>
                    <button
                      onClick={() => handleDeleteCustomField(field.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Custom Field Form */}
              <div className="p-4 bg-[#FCFAF8] rounded-2xl border border-dashed border-stone-300 space-y-3 text-xs">
                <span className="font-bold text-stone-800 block">Add New Custom Field</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Field Name (e.g. Favorite Hotel Room)"
                    value={masterCustomLabel}
                    onChange={(e) => setMasterCustomLabel(e.target.value)}
                    className="p-2 rounded-xl border border-[#ECE6DD] bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Suite 402)"
                    value={masterCustomValue}
                    onChange={(e) => setMasterCustomValue(e.target.value)}
                    className="p-2 rounded-xl border border-[#ECE6DD] bg-white"
                  />
                  <select
                    value={masterCustomCategory}
                    onChange={(e) => setMasterCustomCategory(e.target.value)}
                    className="p-2 rounded-xl border border-[#ECE6DD] bg-white"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Business">Business</option>
                    <option value="Family">Family</option>
                    <option value="Household">Household</option>
                    <option value="Travel">Travel</option>
                    <option value="Health">Health & Wellness</option>
                    <option value="Grooming">Grooming & Stylist</option>
                    <option value="Dates">Important Dates</option>
                    <option value="Social">Social & VIP</option>
                    <option value="Goals">Executive Goals</option>
                    <option value="Hobbies">Hobbies & Gifts</option>
                    <option value="Financial">Financial Settings</option>
                    <option value="Custom">Custom Metadata</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!masterCustomLabel.trim()) return;
                    handleAddCustomField(masterCustomLabel, masterCustomValue, masterCustomCategory);
                    setMasterCustomLabel('');
                    setMasterCustomValue('');
                  }}
                  className="px-4 py-2 bg-stone-900 text-white rounded-full font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Field
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
