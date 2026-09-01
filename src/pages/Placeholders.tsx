import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Play, 
  Square,
  Pause,
  Coffee,
  CheckCircle2,
  Circle,
  MoreVertical,
  Clock,
  ArrowRight,
  Search,
  Plus,
  Mail,
  FolderOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Workday() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsTracked, setSecondsTracked] = useState(3600 * 2 + 1500); // 2h 25m

  // Simulate timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setSecondsTracked((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-main mb-2">My Workday</h1>
          <p className="text-text-muted text-lg">Manage your daily workflow, time tracking, and routines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Workday Controls & Routines */}
        <div className="space-y-8">
          
          {/* Time Tracker Control */}
          <Card className="bg-[#1A1A1A] text-white border-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-1">Current Session</p>
                  <h2 className="text-3xl font-light tracking-tight font-mono">{formatTime(secondsTracked)}</h2>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-card-blue" />
                </div>
              </div>
              
              <div className="flex gap-3">
                {!isTracking ? (
                  <button 
                    onClick={() => setIsTracking(true)}
                    className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Clock In
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsPaused(!isPaused)}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      {isPaused ? "Resume" : "Pause"}
                    </button>
                    <button 
                      onClick={() => { setIsTracking(false); setIsPaused(false); }}
                      className="flex-1 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      Clock Out
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Routine Checklist */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Routine</h3>
            <Card>
              <CardContent className="p-0">
                {[
                  { text: "Review Command Center Dashboard", done: true },
                  { text: "Process Inbox (Inbox Zero)", done: true },
                  { text: "Review Calendar & Schedule", done: false },
                  { text: "Review Pending Client Requests", done: false },
                ].map((item, i, arr) => (
                  <div key={i} className={cn(
                    "flex items-center gap-4 p-4",
                    i !== arr.length - 1 && "border-b border-border-subtle"
                  )}>
                    <button className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      item.done ? "border-card-blue bg-card-blue text-white" : "border-gray-300 hover:border-card-blue text-transparent"
                    )}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <span className={cn(
                      "text-sm font-medium",
                      item.done ? "text-text-muted line-through" : "text-text-main"
                    )}>{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Middle & Right Column - Daily Schedule & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Today's Timeline</h3>
            <span className="text-sm font-medium text-text-muted">{format(new Date(), 'MMM do, yyyy')}</span>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-subtle before:to-transparent">
            
            {[
              { time: "09:00 AM", title: "Morning Deep Work", type: "focus", duration: "2h" },
              { time: "11:30 AM", title: "Client Check-in: Stark Industries", type: "meeting", duration: "30m" },
              { time: "12:00 PM", title: "Lunch Break", type: "break", duration: "1h" },
              { time: "01:00 PM", title: "Administrative Block", type: "admin", duration: "1.5h" },
              { time: "02:30 PM", title: "Website Redesign Review", type: "focus", duration: "1.5h", active: true },
              { time: "04:30 PM", title: "Closing Routine & Reporting", type: "admin", duration: "45m" },
            ].map((event, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-app-bg bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {event.type === 'break' ? (
                    <Coffee className="w-4 h-4 text-gray-400" />
                  ) : (
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      event.active ? "bg-card-blue animate-pulse" : "bg-gray-300"
                    )} />
                  )}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border-subtle bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-text-muted">{event.time}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{event.duration}</span>
                  </div>
                  <h4 className={cn(
                    "text-sm font-medium",
                    event.active ? "text-card-blue" : "text-text-main"
                  )}>{event.title}</h4>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export function Clients() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-main mb-2">Clients</h1>
          <p className="text-text-muted text-lg">Manage client relationships, projects, and portals.</p>
        </div>
        <button className="px-5 py-2.5 bg-sidebar-bg text-white rounded-full text-sm font-medium hover:bg-sidebar-active transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Client
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-2 rounded-full border border-border-subtle shadow-sm max-w-2xl">
        <div className="flex items-center flex-1 px-4 border-r border-border-subtle">
           <Search className="w-5 h-5 text-gray-400 mr-2" />
           <input type="text" placeholder="Search clients..." className="w-full py-2 outline-none text-sm bg-transparent" />
        </div>
        <div className="flex items-center gap-2 px-2">
           <span className="text-sm font-medium px-4 py-1.5 bg-gray-100 rounded-full text-text-main cursor-pointer hover:bg-gray-200 transition-colors">All Clients</span>
           <span className="text-sm font-medium px-4 py-1.5 text-text-muted cursor-pointer hover:bg-gray-100 rounded-full transition-colors">Onboarding</span>
           <span className="text-sm font-medium px-4 py-1.5 text-text-muted cursor-pointer hover:bg-gray-100 rounded-full transition-colors">Archived</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Acme Corp", contact: "Alice Smith", status: "Active", retain: "85%", rev: "$4,500/mo", tag: "bg-card-green" },
          { name: "Stark Industries", contact: "Tony Stark", status: "Active", retain: "100%", rev: "$12,000/mo", tag: "bg-card-blue" },
          { name: "Wayne Enterprises", contact: "Bruce Wayne", status: "Onboarding", retain: "0%", rev: "$8,000/mo", tag: "bg-card-yellow" },
          { name: "Globex Inc", contact: "Hank Scorpio", status: "Active", retain: "45%", rev: "$2,000/mo", tag: "bg-card-pink" },
        ].map((client, i) => (
          <Card key={i} className="group hover:border-gray-300 transition-colors cursor-pointer overflow-hidden flex flex-col">
            <div className={cn("h-2 w-full", client.tag)} />
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{client.name}</h3>
                  <p className="text-sm text-text-muted">{client.contact}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  client.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                )}>
                  {client.status}
                </span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border-subtle grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-1 uppercase tracking-wide">Retainer</p>
                  <p className="font-semibold text-sm">{client.retain} Used</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1 uppercase tracking-wide">Revenue</p>
                  <p className="font-semibold text-sm">{client.rev}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                    <FolderOpen className="w-4 h-4" />
                  </button>
                </div>
                <button className="text-sm font-medium text-text-muted hover:text-text-main flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  View Portal <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Operations() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Operations</h1>
      <p className="text-text-muted">Internal tasks and business operations.</p>
    </div>
  );
}

