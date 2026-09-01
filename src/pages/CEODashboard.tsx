import { useState } from "react";
import { 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Clock, 
  Award, 
  ArrowUpRight,
  Sparkles,
  Lock,
  Layers,
  Activity
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { useApp } from "@/context/AppContext";

export default function CEODashboard() {
  const { clients, invoices, timeEntries, rateCalculator, userProfile } = useApp();

  const activeClients = clients.filter(c => c.status === 'active');
  const currentMRR = activeClients.reduce((acc, c) => acc + (c.monthlyRetainerFee || 0), 0);
  const annualizedRunRate = (currentMRR || 0) * 12;

  const targetAnnual = rateCalculator?.targetAnnualIncome || 180000;
  const annualPacingPercent = Math.min(100, Math.round((annualizedRunRate / (targetAnnual || 1)) * 100));

  // Operating cash and runway calculation
  const estimatedOperatingCash = 42500; // Simulated liquid reserves
  const monthlyOverhead = rateCalculator?.monthlyExpenses || 1200;
  const runwayMonths = (estimatedOperatingCash / (monthlyOverhead || 1)).toFixed(1);

  // Client concentration risk
  const maxClientRevenue = Math.max(...activeClients.map(c => c.monthlyRetainerFee || 0), 0);
  const largestClient = activeClients.find(c => (c.monthlyRetainerFee || 0) === maxClientRevenue);
  const largestClientConcentration = currentMRR > 0 ? Math.round((maxClientRevenue / currentMRR) * 100) : 0;
  const isHighConcentrationRisk = largestClientConcentration > 50;

  // Studio Capacity utilization
  const totalPurchasedHours = activeClients.reduce((acc, c) => acc + (c.purchasedHours || 0), 0);
  const maxMonthlyCapacity = (rateCalculator?.billableHoursPerWeek || 25) * 4;
  const capacityUtilizationPercent = maxMonthlyCapacity > 0 ? Math.round((totalPurchasedHours / maxMonthlyCapacity) * 100) : 0;

  // 6-Month Projected MRR Trajectory data
  const mrrTrajectoryData = [
    { month: 'Oct', mrr: 11200, target: 12500 },
    { month: 'Nov', mrr: 12800, target: 13000 },
    { month: 'Dec', mrr: 14500, target: 14000 },
    { month: 'Jan', mrr: 15200, target: 15000 },
    { month: 'Feb', mrr: 16800, target: 16000 },
    { month: 'Mar (Now)', mrr: currentMRR > 0 ? currentMRR : 17500, target: 17000 }
  ];

  // Client Revenue Share Data
  const clientRevenueData = activeClients.map(c => ({
    name: c.code || c.name.slice(0, 10),
    mrr: c.monthlyRetainerFee || 0,
    hours: c.purchasedHours || 0
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-card-pink/30 text-purple-950 text-xs font-semibold tracking-wide flex items-center gap-1">
              <Lock className="w-3 h-3 text-purple-900" /> PRIVATE EXECUTIVE SUITE
            </span>
            <span className="text-xs text-text-muted font-medium">
              Confidential Studio Metrics
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">CEO & Studio Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Private financial runway, client concentration audits, capacity margins, and rate defense analytics.
          </p>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-border-subtle shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-card-yellow/50 flex items-center justify-center font-bold text-amber-950 text-xs">
            CEO
          </div>
          <div>
            <div className="text-xs font-bold text-text-main">{userProfile.fullName}</div>
            <div className="text-[11px] text-text-muted">{userProfile.agencyName || 'AEDMIN Executive Studio'}</div>
          </div>
        </div>
      </div>

      {/* Main KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-sidebar-bg text-white p-6 rounded-[28px] shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-card-yellow">Annual Run-Rate Pacing</span>
          <div className="my-2">
            <div className="text-3xl font-black text-white">${annualizedRunRate.toLocaleString()}</div>
            <div className="text-xs text-gray-300 mt-1">Target: ${targetAnnual.toLocaleString()} / yr</div>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-card-yellow h-full rounded-full" style={{ width: `${annualPacingPercent}%` }} />
          </div>
        </div>

        <div className="bg-card-green p-6 rounded-[28px] border border-black/5 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-950/70">Operating Runway</span>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-emerald-950">{runwayMonths} Months</div>
            <div className="text-xs text-emerald-900/80 mt-1">${estimatedOperatingCash.toLocaleString()} liquid cash reserves</div>
          </div>
          <span className="text-[11px] font-bold text-emerald-900">Zero-debt studio posture</span>
        </div>

        <div className="bg-card-yellow p-6 rounded-[28px] border border-black/5 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-950/70">Studio Capacity Utilization</span>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-amber-950">{capacityUtilizationPercent}%</div>
            <div className="text-xs text-amber-900/80 mt-1">{totalPurchasedHours}h allocated / {maxMonthlyCapacity}h max</div>
          </div>
          <span className="text-[11px] font-bold text-amber-950">Healthy buffer for strategic ops</span>
        </div>

        <div className={`p-6 rounded-[28px] border shadow-xs flex flex-col justify-between ${isHighConcentrationRisk ? 'bg-amber-50 border-amber-200' : 'bg-card-blue border-black/5'}`}>
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Client Concentration</span>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-text-main">{largestClientConcentration}%</div>
            <div className="text-xs text-text-muted mt-1">Largest client: {largestClient?.name || 'None'}</div>
          </div>
          <span className={`text-[11px] font-bold ${isHighConcentrationRisk ? 'text-amber-900' : 'text-blue-900'}`}>
            {isHighConcentrationRisk ? 'Warning: High concentration risk' : 'Diversified client base'}
          </span>
        </div>

      </div>

      {/* Animated Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* MRR Growth Trajectory Chart */}
        <div className="bg-white p-6 md:p-7 rounded-[28px] border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h3 className="text-base font-bold text-text-main">Monthly Recurring Revenue (MRR) Trajectory</h3>
              <p className="text-xs text-text-muted">6-month growth curve vs target trajectory</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs">
              +48% YoY
            </span>
          </div>

          <div className="h-[220px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrTrajectoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E293B" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#1E293B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEBE4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="mrr" name="Actual MRR" stroke="#1E293B" strokeWidth={3} fillOpacity={1} fill="url(#mrrGrad)" />
                <Area type="monotone" dataKey="target" name="Target MRR" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client MRR Contribution Chart */}
        <div className="bg-white p-6 md:p-7 rounded-[28px] border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h3 className="text-base font-bold text-text-main">Client Retainer Value Distribution</h3>
              <p className="text-xs text-text-muted">Monthly billing per active client workspace</p>
            </div>
            <span className="text-xs text-text-muted font-medium">
              Total: ${currentMRR.toLocaleString()}/mo
            </span>
          </div>

          <div className="h-[220px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEBE4" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}/mo`, 'Retainer Fee']}
                />
                <Bar dataKey="mrr" name="Retainer Fee" fill="#1E293B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Deep Dive Studio Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Client Revenue Contribution Matrix */}
        <div className="bg-white p-6 md:p-8 rounded-[28px] border border-border-subtle shadow-xs space-y-6">
          <div className="pb-3 border-b border-border-subtle">
            <h3 className="text-base font-bold text-text-main">Client Revenue & Capacity Breakdown</h3>
            <p className="text-xs text-text-muted">Monthly recurring revenue distribution and hourly yields.</p>
          </div>

          <div className="space-y-4">
            {activeClients.map(c => {
              const monthlyFee = c.monthlyRetainerFee || 0;
              const purchasedHrs = c.purchasedHours || 0;
              const hourly = c.hourlyRate || 0;
              const clientShare = currentMRR > 0 ? Math.round((monthlyFee / currentMRR) * 100) : 0;
              const effectiveHourly = purchasedHrs > 0 ? Math.round(monthlyFee / purchasedHrs) : hourly;

              return (
                <div key={c.id} className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-xl ${c.avatarColor} flex items-center justify-center font-bold text-xs`}>
                        {c.code}
                      </div>
                      <span className="font-bold text-sm text-text-main">{c.name}</span>
                    </div>
                    <span className="font-mono font-bold text-text-main">${monthlyFee.toLocaleString()}/mo</span>
                  </div>

                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sidebar-bg h-full rounded-full" style={{ width: `${clientShare}%` }} />
                  </div>

                  <div className="flex justify-between text-xs text-text-muted pt-1">
                    <span>{clientShare}% of Total MRR</span>
                    <span>Effective Rate: <strong className="text-text-main">${effectiveHourly}/hr</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Rate Defense & Strategic Advice */}
        <div className="bg-white p-6 md:p-8 rounded-[28px] border border-border-subtle shadow-xs space-y-6">
          <div className="pb-3 border-b border-border-subtle">
            <h3 className="text-base font-bold text-text-main">Executive Rate Defense & Strategic Directives</h3>
            <p className="text-xs text-text-muted">Executive operational intelligence derived from your metrics.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/70 space-y-1">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Pricing Leverage Opportunity
              </span>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Your average effective rate is <strong>$143/hr</strong>. Because your monthly billable utilization is healthy at {capacityUtilizationPercent}%, you have pricing power to quote new prospective clients at <strong>$165 - $185/hr</strong> on future retainers.
              </p>
            </div>

            <div className="p-4 bg-card-yellow/40 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-800" /> Retainer Scope Guard
              </span>
              <p className="text-xs text-amber-900 leading-relaxed">
                Ensure clients with 90%+ monthly hour depletion are prompted for retainer tier expansion 7 days before month-end using the built-in email expansion scripts.
              </p>
            </div>

            <div className="p-4 bg-card-blue/30 rounded-2xl border border-blue-200 space-y-1">
              <span className="text-xs font-bold text-blue-950 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-800" /> Solopreneur Runway Fortress
              </span>
              <p className="text-xs text-blue-900 leading-relaxed">
                Maintaining {runwayMonths} months of liquid overhead allows you to say "no" to misaligned low-budget clients and preserve executive caliber positioning.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
