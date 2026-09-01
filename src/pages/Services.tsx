import { useState, FormEvent } from "react";
import { 
  Calculator, 
  Plus, 
  Check, 
  Copy, 
  Edit3, 
  Trash2, 
  Layers,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ServicePackage } from "@/types";

export default function Services() {
  const { services, addService, updateService, deleteService, duplicateService, rateCalculator, updateRateCalculator } = useApp();

  const [activeTab, setActiveTab] = useState<'packages' | 'calculator'>('packages');
  
  // Modal state for adding / editing packages
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    pricingModel: string;
    baseRate: number;
    description: string;
    deliverablesText: string;
    idealFor: string;
    includedHours?: number;
  }>({
    name: '',
    category: 'Executive Assistance',
    pricingModel: 'Monthly Retainer',
    baseRate: 5000,
    description: '',
    deliverablesText: 'Daily Morning Brief\nZero-Conflict Executive Calendar\nPriority Inbox Triage',
    idealFor: 'Founders & Partners',
    includedHours: 35
  });

  // Rate calculator formula
  const annualTarget = rateCalculator?.targetAnnualIncome || 180000;
  const taxPct = (rateCalculator?.taxRatePercentage || 28) / 100;
  const annualOverhead = (rateCalculator?.monthlyExpenses || 1200) * 12;
  const grossNeeded = (annualTarget + annualOverhead) / (1 - taxPct);

  const workingWeeks = 52 - (rateCalculator?.vacationWeeksPerYear || 4);
  const annualBillableHours = workingWeeks * (rateCalculator?.billableHoursPerWeek || 25);

  const minViableHourlyRate = annualBillableHours > 0 ? Math.round(grossNeeded / annualBillableHours) : 0;
  const targetHourlyRate = Math.round(minViableHourlyRate * (1 + (rateCalculator?.profitMarginPercentage || 20) / 100));

  const standard20hRetainer = Math.round(targetHourlyRate * 20 * 0.95); // 5% discount for retainer commitment
  const standard35hRetainer = Math.round(targetHourlyRate * 35 * 0.90); // 10% discount

  const handleOpenAddModal = () => {
    setEditingPackageId(null);
    setFormData({
      name: '',
      category: 'Executive Assistance',
      pricingModel: 'Monthly Retainer',
      baseRate: 5000,
      description: '',
      deliverablesText: 'Daily Morning Brief\nZero-Conflict Executive Calendar\nPriority Inbox Triage',
      idealFor: 'Executive Founders',
      includedHours: 35
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (pkg: ServicePackage) => {
    setEditingPackageId(pkg.id);
    const rate = Number(pkg.baseRate ?? pkg.basePrice ?? 5000);
    setFormData({
      name: pkg.name || '',
      category: pkg.category || 'Executive Assistance',
      pricingModel: pkg.pricingModel || 'Monthly Retainer',
      baseRate: rate,
      description: pkg.description || '',
      deliverablesText: (pkg.deliverables || []).join('\n'),
      idealFor: pkg.idealFor || '',
      includedHours: pkg.includedHours || 35
    });
    setModalOpen(true);
  };

  const handleSavePackage = (e: FormEvent) => {
    e.preventDefault();
    const deliverables = formData.deliverablesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingPackageId) {
      updateService(editingPackageId, {
        name: formData.name,
        category: formData.category,
        pricingModel: formData.pricingModel,
        baseRate: formData.baseRate,
        basePrice: formData.baseRate,
        description: formData.description,
        deliverables,
        idealFor: formData.idealFor,
        includedHours: formData.includedHours
      });
    } else {
      addService({
        name: formData.name || 'Executive Retainer Package',
        category: formData.category,
        pricingModel: formData.pricingModel,
        baseRate: formData.baseRate,
        basePrice: formData.baseRate,
        description: formData.description,
        scope: deliverables,
        deliverables,
        workflowSteps: ['Daily Morning Review', 'Active Execution & Unblocking', 'EOD Summary Dispatch'],
        estimatedTimeline: 'Ongoing Monthly Retainer',
        idealFor: formData.idealFor,
        includedHours: formData.includedHours,
        isActive: true
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-card-green/40 text-emerald-950 text-xs font-semibold tracking-wide">
              VALUE ARCHITECTURE & PRICING
            </span>
            <span className="text-xs text-text-muted font-medium">
              {services.length} Core Service Packages
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">Services & Rate Intelligence</h1>
          <p className="text-sm text-text-muted mt-1">
            Package definitions, value-based scopes of work, and executive rate defense formulas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'packages' ? 'calculator' : 'packages')}
            className="px-4 py-2.5 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Calculator className="w-3.5 h-3.5 text-card-blue" />
            {activeTab === 'packages' ? 'Open Rate Calculator' : 'View Service Packages'}
          </button>

          {activeTab === 'packages' && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Package
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle gap-8">
        <button
          onClick={() => setActiveTab('packages')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'packages' ? 'border-sidebar-bg text-text-main' : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          Packaged Offerings ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'calculator' ? 'border-sidebar-bg text-text-main' : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          Dynamic Rate & Profitability Formula
        </button>
      </div>

      {/* 1. SERVICE PACKAGES TAB */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(pkg => {
              const price = Number(pkg.baseRate ?? pkg.basePrice ?? 0);
              const deliverables = Array.isArray(pkg.deliverables) ? pkg.deliverables : [];
              const tierOrCategory = pkg.tier || pkg.category || 'Executive Service';
              const pricingModelStr = (pkg.pricingModel || 'Monthly Retainer').toLowerCase();
              const isRetainer = pricingModelStr.includes('retainer') || pricingModelStr.includes('month');

              return (
                <div 
                  key={pkg.id}
                  className="bg-white rounded-[28px] border border-border-subtle hover:border-gray-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-card-blue/30 text-blue-950 capitalize truncate max-w-[140px]">
                        {tierOrCategory}
                      </span>
                      <span className="text-xs font-semibold text-text-muted capitalize">
                        {pkg.pricingModel || 'Monthly Retainer'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-text-main group-hover:text-card-blue transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">
                      {pkg.description || 'Custom tailored executive support and high-performance workflow execution.'}
                    </p>

                    <div className="my-4 p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-text-main">
                          ${price.toLocaleString()}
                        </span>
                        <span className="text-xs text-text-muted font-medium">
                          {isRetainer ? '/ month' : ' flat fee'}
                        </span>
                      </div>
                      {pkg.includedHours ? (
                        <p className="text-[11px] text-text-muted mt-1 font-semibold">
                          Includes {pkg.includedHours} allocated hours / month
                        </p>
                      ) : null}
                    </div>

                    {/* Included Deliverables */}
                    <div className="space-y-2 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">What's Included:</span>
                      <div className="space-y-1.5">
                        {deliverables.map((d, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-text-main">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
                    <span className="text-text-muted font-medium truncate max-w-[160px]">
                      Ideal for: {pkg.idealFor || 'Executive Clients'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(pkg)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text-main"
                        title="Edit Package"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateService(pkg.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text-main"
                        title="Clone Package"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteService(pkg.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600"
                        title="Delete Package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DYNAMIC RATE & PROFITABILITY CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls / Inputs */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[28px] border border-border-subtle shadow-xs space-y-6">
            <div className="pb-4 border-b border-border-subtle">
              <h3 className="text-base font-bold text-text-main">Operational Inputs & Financial Baselines</h3>
              <p className="text-xs text-text-muted">
                Mathematical rate formula accounting for self-employment tax, operational overhead, and real-world billable capacity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Target Take-Home Income */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-main">Target Annual Take-Home (Net)</span>
                  <span className="text-card-blue font-bold">${annualTarget.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min="80000"
                  max="350000"
                  step="5000"
                  value={annualTarget}
                  onChange={e => updateRateCalculator({ targetAnnualIncome: Number(e.target.value) })}
                  className="w-full accent-sidebar-bg"
                />
                <p className="text-[11px] text-text-muted">Net personal salary after business expenses and taxes.</p>
              </div>

              {/* Monthly Business Expenses */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-main">Monthly Overhead & Software</span>
                  <span className="text-card-blue font-bold">${(rateCalculator?.monthlyExpenses || 0).toLocaleString()}/mo</span>
                </div>
                <input 
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={rateCalculator?.monthlyExpenses || 1200}
                  onChange={e => updateRateCalculator({ monthlyExpenses: Number(e.target.value) })}
                  className="w-full accent-sidebar-bg"
                />
                <p className="text-[11px] text-text-muted">Workspace tools, insurance, accounting, and subscriptions.</p>
              </div>

              {/* Tax Reserve Percentage */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-main">Estimated Tax Reserve %</span>
                  <span className="text-card-blue font-bold">{rateCalculator?.taxRatePercentage || 28}%</span>
                </div>
                <input 
                  type="range"
                  min="15"
                  max="45"
                  step="1"
                  value={rateCalculator?.taxRatePercentage || 28}
                  onChange={e => updateRateCalculator({ taxRatePercentage: Number(e.target.value) })}
                  className="w-full accent-sidebar-bg"
                />
                <p className="text-[11px] text-text-muted">Federal, state, and self-employment tax provision.</p>
              </div>

              {/* Billable Hours Per Week */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-main">Max Billable Hours / Week</span>
                  <span className="text-card-blue font-bold">{rateCalculator?.billableHoursPerWeek || 25} hrs</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="35"
                  step="1"
                  value={rateCalculator?.billableHoursPerWeek || 25}
                  onChange={e => updateRateCalculator({ billableHoursPerWeek: Number(e.target.value) })}
                  className="w-full accent-sidebar-bg"
                />
                <p className="text-[11px] text-text-muted">Realistic client time excluding sales, admin, and ops.</p>
              </div>

              {/* Vacation Weeks Per Year */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-main">Vacation / Off-Time Weeks</span>
                  <span className="text-card-blue font-bold">{rateCalculator?.vacationWeeksPerYear || 4} weeks</span>
                </div>
                <input 
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={rateCalculator?.vacationWeeksPerYear || 4}
                  onChange={e => updateRateCalculator({ vacationWeeksPerYear: Number(e.target.value) })}
                  className="w-full accent-sidebar-bg"
                />
                <p className="text-[11px] text-text-muted">Time away where client billing is paused.</p>
              </div>

              {/* Desired Profit Margin % */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-main">Studio Profit Buffer</span>
                  <span className="text-card-blue font-bold">{rateCalculator?.profitMarginPercentage || 20}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={rateCalculator?.profitMarginPercentage || 20}
                  onChange={e => updateRateCalculator({ profitMarginPercentage: Number(e.target.value) })}
                  className="w-full accent-sidebar-bg"
                />
                <p className="text-[11px] text-text-muted">Safety margin for retained earnings and studio growth.</p>
              </div>

            </div>

          </div>

          {/* Results Bento Box */}
          <div className="space-y-4">
            
            <div className="bg-sidebar-bg text-white p-6 rounded-[28px] shadow-xl space-y-5">
              <span className="text-xs font-semibold text-card-yellow uppercase tracking-wider">
                Recommended Pricing Matrix
              </span>

              <div className="space-y-4">
                
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 block">Target Hourly Floor:</span>
                  <div className="text-3xl font-extrabold text-white mt-0.5">${targetHourlyRate} / hr</div>
                  <span className="text-[11px] text-emerald-400">Min viable break-even: ${minViableHourlyRate}/hr</span>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 block">Standard 20h Retainer Package:</span>
                  <div className="text-2xl font-bold text-card-yellow mt-0.5">${standard20hRetainer.toLocaleString()} / mo</div>
                  <span className="text-[11px] text-gray-400">Yields ${(standard20hRetainer * 12).toLocaleString()} / yr per client</span>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 block">Executive 35h Retainer Package:</span>
                  <div className="text-2xl font-bold text-card-pink mt-0.5">${standard35hRetainer.toLocaleString()} / mo</div>
                  <span className="text-[11px] text-gray-400">Yields ${(standard35hRetainer * 12).toLocaleString()} / yr per client</span>
                </div>

              </div>

              <div className="text-[11px] text-gray-400 border-t border-white/10 pt-4">
                <strong>Studio Goal:</strong> 3-4 active retainers at ${standard20hRetainer.toLocaleString()}/mo safely reaches your ${(annualTarget).toLocaleString()} net salary target without burnout.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Add / Edit Package Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl border border-border-subtle space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-card-blue/20 text-blue-950">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-text-main">
                  {editingPackageId ? 'Edit Service Package' : 'Create Service Package'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-text-main hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Package Name *
                </label>
                <input 
                  type="text"
                  required
                  value={formData.name ?? ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chief of Staff & Operations Retainer"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-border-subtle rounded-xl text-sm font-medium focus:outline-none focus:border-sidebar-bg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category ?? 'Executive Assistance'}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="Executive Assistance">Executive Assistance</option>
                    <option value="Operations">Operations</option>
                    <option value="Design & Branding">Design & Branding</option>
                    <option value="Web & Tech">Web & Tech</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={formData.pricingModel ?? 'Monthly Retainer'}
                    onChange={e => setFormData({ ...formData, pricingModel: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="Monthly Retainer">Monthly Retainer</option>
                    <option value="Fixed Project">Fixed Project</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Base Price ($) *
                  </label>
                  <input 
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={formData.baseRate ?? 5000}
                    onChange={e => setFormData({ ...formData, baseRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-border-subtle rounded-xl text-sm font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Monthly Included Hours
                  </label>
                  <input 
                    type="number"
                    min="0"
                    step="5"
                    value={formData.includedHours ?? 0}
                    onChange={e => setFormData({ ...formData, includedHours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-border-subtle rounded-xl text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Ideal Client Profile
                </label>
                <input 
                  type="text"
                  value={formData.idealFor ?? ''}
                  onChange={e => setFormData({ ...formData, idealFor: e.target.value })}
                  placeholder="e.g. Managing Partners & Founders"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-border-subtle rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea 
                  rows={2}
                  value={formData.description ?? ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of strategic value provided to the executive client..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-border-subtle rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Deliverables (One per line)
                </label>
                <textarea 
                  rows={3}
                  value={formData.deliverablesText ?? ''}
                  onChange={e => setFormData({ ...formData, deliverablesText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-border-subtle rounded-xl text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-border-subtle text-xs font-semibold text-text-muted hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-sidebar-bg text-white text-xs font-semibold hover:bg-sidebar-active shadow-sm"
                >
                  {editingPackageId ? 'Update Package' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
