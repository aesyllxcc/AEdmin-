import { Client, Task, ApprovalItem, ClientHoliday, DualTimeConversion, MeetingOverlapSlot, SmartCommunicationRecommendation, UserProfile, ClientStakeholder } from '../types';

export function cleanTimezone(tz?: string): string {
  if (!tz) return 'America/New_York';
  // Strip annotations like "(EST)" or "(PHT UTC+8)"
  const cleaned = tz.split(' ')[0].trim();
  try {
    Intl.DateTimeFormat(undefined, { timeZone: cleaned });
    return cleaned;
  } catch {
    return 'America/New_York';
  }
}

export interface FreelancerLiveTimeInfo {
  timeStr: string;
  time24Str: string;
  dateStr: string;
  secondsStr: string;
  hour24: number;
  minute: number;
  status: 'working' | 'business_hours' | 'end_of_shift' | 'off_hours' | 'weekend';
  statusLabel: string;
  statusColor: string;
  statusBadge: string;
  workingHoursLabel: string;
  businessHoursLabel: string;
  endOfShiftLabel: string;
  effectiveTimezone: string;
  effectiveCity: string;
  effectiveCountry: string;
  effectiveFlag: string;
  isEndShiftNow: boolean;
}

export interface ClientLiveTimeInfo {
  timeStr: string; // e.g. "02:45 PM"
  time24Str: string; // "14:45"
  dateStr: string; // "Wed, Aug 26"
  secondsStr: string; // "12"
  hour24: number; // 14
  minute: number; // 45
  isDaytime: boolean; // between 06:00 and 19:00
  status: 'working' | 'preferred_comms' | 'available' | 'off_hours' | 'sleeping' | 'traveling';
  statusLabel: string;
  statusColor: string;
  workingHoursLabel: string;
  preferredCommsLabel: string;
  timeDiffFromFreelancerHours: number;
  timeDiffLabel: string;
  effectiveTimezone: string;
  effectiveCity: string;
  effectiveCountry: string;
  effectiveCountryCode: string;
  effectiveFlag: string;
}

// Fallback timezone offsets if Intl fails
const TIMEZONE_FALLBACK_MAP: Record<string, string> = {
  'America/Los_Angeles': 'America/Los_Angeles',
  'America/New_York': 'America/New_York',
  'America/Chicago': 'America/Chicago',
  'America/Denver': 'America/Denver',
  'Europe/London': 'Europe/London',
  'Europe/Paris': 'Europe/Paris',
  'Europe/Berlin': 'Europe/Berlin',
  'Asia/Tokyo': 'Asia/Tokyo',
  'Asia/Singapore': 'Asia/Singapore',
  'Asia/Manila': 'Asia/Manila',
  'Asia/Dubai': 'Asia/Dubai',
  'Australia/Sydney': 'Australia/Sydney',
  'Pacific/Auckland': 'Pacific/Auckland'
};

export const COMMON_TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (US / Vancouver)', city: 'San Francisco', country: 'United States', flag: '🇺🇸', code: 'US' },
  { value: 'America/Denver', label: 'Mountain Time (US)', city: 'Denver', country: 'United States', flag: '🇺🇸', code: 'US' },
  { value: 'America/Chicago', label: 'Central Time (US / Mexico City)', city: 'Chicago', country: 'United States', flag: '🇺🇸', code: 'US' },
  { value: 'America/New_York', label: 'Eastern Time (US / Toronto)', city: 'New York', country: 'United States', flag: '🇺🇸', code: 'US' },
  { value: 'America/Sao_Paulo', label: 'Brasília Time (Brazil)', city: 'São Paulo', country: 'Brazil', flag: '🇧🇷', code: 'BR' },
  { value: 'Europe/London', label: 'British Time (UK / BST / GMT)', city: 'London', country: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { value: 'Europe/Paris', label: 'Central European Time (Paris / Berlin / Rome)', city: 'Paris', country: 'France', flag: '🇫🇷', code: 'FR' },
  { value: 'Europe/Berlin', label: 'Central European Time (Germany)', city: 'Berlin', country: 'Germany', flag: '🇩🇪', code: 'DE' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (Dubai / Abu Dhabi)', city: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪', code: 'AE' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (Mumbai / Delhi)', city: 'Mumbai', country: 'India', flag: '🇮🇳', code: 'IN' },
  { value: 'Asia/Singapore', label: 'Singapore Standard Time (Singapore / KL)', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', code: 'SG' },
  { value: 'Asia/Manila', label: 'Philippine Standard Time (Manila / PHT UTC+8)', city: 'Manila', country: 'Philippines', flag: '🇵🇭', code: 'PH' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo / Osaka)', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', code: 'JP' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney / Melbourne)', city: 'Sydney', country: 'Australia', flag: '🇦🇺', code: 'AU' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (Auckland)', city: 'Auckland', country: 'New Zealand', flag: '🇳🇿', code: 'NZ' }
];

export function getClientEffectiveLocation(client: Client) {
  if (client.isTravelModeActive && client.travelTimezone) {
    return {
      timezone: cleanTimezone(client.travelTimezone),
      city: client.travelCity || client.city || 'Travel Location',
      country: client.travelCountry || client.country || 'Global',
      countryCode: client.countryCode || 'US',
      flagEmoji: client.travelCountry === 'France' ? '🇫🇷' : client.travelCountry === 'United Kingdom' ? '🇬🇧' : client.travelCountry === 'Japan' ? '🇯🇵' : '✈️',
      isTravel: true,
      travelReason: client.travelReason,
      travelEndDate: client.travelEndDate
    };
  }

  return {
    timezone: cleanTimezone(client.timezone || 'America/New_York'),
    city: client.city || 'New York',
    country: client.country || 'United States',
    countryCode: client.countryCode || 'US',
    flagEmoji: client.flagEmoji || '🇺🇸',
    isTravel: false,
    travelReason: undefined,
    travelEndDate: undefined
  };
}

export function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function formatMinutesToTime(mins: number): string {
  const normMins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normMins / 60);
  const m = normMins % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m.toString().padStart(2, '0');
  return `${displayH}:${displayM} ${period}`;
}

export function getFreelancerLiveTimeInfo(userProfile: UserProfile, baseDate: Date = new Date()): FreelancerLiveTimeInfo {
  const targetTz = cleanTimezone(userProfile.timezone || userProfile.defaultTimezone || 'America/New_York');
  
  let timeStr = '';
  let time24Str = '';
  let dateStr = '';
  let secondsStr = '';
  let hour24 = 0;
  let minute = 0;
  let weekdayStr = '';

  try {
    const dtfTime = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    timeStr = dtfTime.format(baseDate);

    const dtf24 = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts24 = dtf24.formatToParts(baseDate);
    const hPart = parts24.find(p => p.type === 'hour')?.value || '00';
    const mPart = parts24.find(p => p.type === 'minute')?.value || '00';
    const sPart = parts24.find(p => p.type === 'second')?.value || '00';
    hour24 = parseInt(hPart, 10);
    minute = parseInt(mPart, 10);
    time24Str = `${hPart}:${mPart}`;
    secondsStr = sPart;

    const dtfDate = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    dateStr = dtfDate.format(baseDate);
    weekdayStr = dateStr.split(',')[0];
  } catch {
    hour24 = baseDate.getHours();
    minute = baseDate.getMinutes();
    timeStr = baseDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    time24Str = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    dateStr = baseDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    secondsStr = baseDate.getSeconds().toString().padStart(2, '0');
  }

  const currentMinutes = hour24 * 60 + minute;
  const workStartMins = parseTimeToMinutes(userProfile.workingHoursStart || '08:30');
  const workEndMins = parseTimeToMinutes(userProfile.workingHoursEnd || '17:30');
  const bizStartMins = parseTimeToMinutes(userProfile.businessHoursStart || '08:00');
  const bizEndMins = parseTimeToMinutes(userProfile.businessHoursEnd || '18:00');
  const endShiftStartMins = parseTimeToMinutes(userProfile.endOfShiftWindowStart || '17:00');
  const endShiftEndMins = parseTimeToMinutes(userProfile.endOfShiftWindowEnd || userProfile.endOfShiftTime || '18:00');

  const activeDays = userProfile.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const isWorkDay = activeDays.some(d => dateStr.toLowerCase().includes(d.toLowerCase()));

  const isEndShift = isWorkDay && currentMinutes >= endShiftStartMins && currentMinutes <= endShiftEndMins;
  const isWorking = isWorkDay && currentMinutes >= workStartMins && currentMinutes <= workEndMins;
  const isBizHours = isWorkDay && currentMinutes >= bizStartMins && currentMinutes <= bizEndMins;

  let status: 'working' | 'business_hours' | 'end_of_shift' | 'off_hours' | 'weekend' = 'off_hours';
  let statusLabel = 'Off-Hours';
  let statusColor = 'bg-stone-100 text-stone-700 border-stone-200';
  let statusBadge = '🌙 Off Duty';

  if (!isWorkDay) {
    status = 'weekend';
    statusLabel = 'Non-Working Day';
    statusColor = 'bg-stone-100 text-stone-600 border-stone-200';
    statusBadge = '☕ Weekend / Off-Day';
  } else if (isEndShift) {
    status = 'end_of_shift';
    statusLabel = 'End-of-Shift Wrap Up';
    statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    statusBadge = '📋 EOD Dispatch Window';
  } else if (isWorking) {
    status = 'working';
    statusLabel = 'In Active Shift (Focus)';
    statusColor = 'bg-purple-100 text-purple-800 border-purple-300';
    statusBadge = '🟢 Active Working Shift';
  } else if (isBizHours) {
    status = 'business_hours';
    statusLabel = 'Business SLA Window';
    statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
    statusBadge = '🟡 SLA Available';
  }

  return {
    timeStr,
    time24Str,
    dateStr,
    secondsStr,
    hour24,
    minute,
    status,
    statusLabel,
    statusColor,
    statusBadge,
    workingHoursLabel: `${formatMinutesToTime(workStartMins)} - ${formatMinutesToTime(workEndMins)}`,
    businessHoursLabel: `${formatMinutesToTime(bizStartMins)} - ${formatMinutesToTime(bizEndMins)}`,
    endOfShiftLabel: `${formatMinutesToTime(endShiftStartMins)} - ${formatMinutesToTime(endShiftEndMins)}`,
    effectiveTimezone: targetTz,
    effectiveCity: userProfile.city || 'New York',
    effectiveCountry: userProfile.country || 'United States',
    effectiveFlag: userProfile.flagEmoji || '🇺🇸',
    isEndShiftNow: isEndShift
  };
}

export function getClientLiveTime(client: Client, baseDate: Date = new Date(), freelancerTimezone: string = 'America/New_York'): ClientLiveTimeInfo {
  const loc = getClientEffectiveLocation(client);
  const targetTz = loc.timezone;

  let timeStr = '';
  let time24Str = '';
  let dateStr = '';
  let secondsStr = '';
  let hour24 = 0;
  let minute = 0;

  try {
    const dtfTime = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    timeStr = dtfTime.format(baseDate);

    const dtf24 = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts24 = dtf24.formatToParts(baseDate);
    const hPart = parts24.find(p => p.type === 'hour')?.value || '00';
    const mPart = parts24.find(p => p.type === 'minute')?.value || '00';
    const sPart = parts24.find(p => p.type === 'second')?.value || '00';
    hour24 = parseInt(hPart, 10);
    minute = parseInt(mPart, 10);
    time24Str = `${hPart}:${mPart}`;
    secondsStr = sPart;

    const dtfDate = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    dateStr = dtfDate.format(baseDate);
  } catch (err) {
    // Fallback in case of invalid timezone string
    hour24 = baseDate.getHours();
    minute = baseDate.getMinutes();
    timeStr = baseDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    time24Str = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    dateStr = baseDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    secondsStr = baseDate.getSeconds().toString().padStart(2, '0');
  }

  // Calculate difference from freelancer
  let timeDiffFromFreelancerHours = 0;
  try {
    const freeH = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: freelancerTimezone, hour: 'numeric', hour12: false }).format(baseDate), 10);
    let diff = hour24 - freeH;
    if (diff > 12) diff -= 24;
    if (diff < -12) diff += 24;
    timeDiffFromFreelancerHours = diff;
  } catch {
    timeDiffFromFreelancerHours = 0;
  }

  const timeDiffLabel = timeDiffFromFreelancerHours === 0 
    ? 'Same time' 
    : timeDiffFromFreelancerHours > 0 
      ? `+${timeDiffFromFreelancerHours}h ahead` 
      : `${timeDiffFromFreelancerHours}h behind`;

  const clientMinutesNow = hour24 * 60 + minute;
  const workStartMins = parseTimeToMinutes(client.workingHoursStart || '09:00');
  const workEndMins = parseTimeToMinutes(client.workingHoursEnd || '17:30');
  const commsStartMins = parseTimeToMinutes(client.preferredCommsStart || '10:00');
  const commsEndMins = parseTimeToMinutes(client.preferredCommsEnd || '16:30');

  const isDaytime = hour24 >= 6 && hour24 < 20;
  const isSleeping = hour24 >= 22 || hour24 < 7;
  const isWorkingHours = clientMinutesNow >= workStartMins && clientMinutesNow <= workEndMins;
  const isPreferredComms = clientMinutesNow >= commsStartMins && clientMinutesNow <= commsEndMins;

  let status: 'working' | 'preferred_comms' | 'available' | 'off_hours' | 'sleeping' | 'traveling' = 'off_hours';
  let statusLabel = 'Off-Hours';
  let statusColor = 'bg-gray-100 text-gray-700 border-gray-200';

  if (loc.isTravel) {
    status = 'traveling';
    statusLabel = `Traveling (${loc.city})`;
    statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (isPreferredComms) {
    status = 'preferred_comms';
    statusLabel = 'Prime Comms Window';
    statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (isWorkingHours) {
    status = 'working';
    statusLabel = 'Active Working Hours';
    statusColor = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (isSleeping) {
    status = 'sleeping';
    statusLabel = 'Night / Sleeping';
    statusColor = 'bg-purple-100 text-purple-800 border-purple-300';
  } else {
    status = 'off_hours';
    statusLabel = 'Off-Hours';
    statusColor = 'bg-stone-100 text-stone-700 border-stone-200';
  }

  const workingHoursLabel = `${formatMinutesToTime(workStartMins)} - ${formatMinutesToTime(workEndMins)}`;
  const preferredCommsLabel = `${formatMinutesToTime(commsStartMins)} - ${formatMinutesToTime(commsEndMins)}`;

  return {
    timeStr,
    time24Str,
    dateStr,
    secondsStr,
    hour24,
    minute,
    isDaytime,
    status,
    statusLabel,
    statusColor,
    workingHoursLabel,
    preferredCommsLabel,
    timeDiffFromFreelancerHours,
    timeDiffLabel,
    effectiveTimezone: loc.timezone,
    effectiveCity: loc.city,
    effectiveCountry: loc.country,
    effectiveCountryCode: loc.countryCode,
    effectiveFlag: loc.flagEmoji
  };
}

export function getClientPlainExplanation(client: Client, live: ClientLiveTimeInfo): string {
  const loc = getClientEffectiveLocation(client);
  if (loc.isTravel) {
    return `Currently traveling in ${loc.city} (${loc.timezone.split('/')[1]?.replace('_', ' ') || loc.timezone}). Timezone shifted ${live.timeDiffLabel}.`;
  }
  if (live.status === 'preferred_comms') {
    return `Great time to contact! ${client.name} is in their prime communication window until ${formatMinutesToTime(parseTimeToMinutes(client.preferredCommsEnd || '16:30'))}.`;
  }
  if (live.status === 'working') {
    return `${client.name} is in their workday (${live.workingHoursLabel}). Available for deliverables and urgent items.`;
  }
  if (live.status === 'sleeping') {
    return `Night time in ${loc.city} (${live.timeStr}). Client is likely asleep; queue non-urgent updates for tomorrow.`;
  }
  return `Off-hours in ${loc.city} (${live.timeStr}). Next active operating window begins at ${formatMinutesToTime(parseTimeToMinutes(client.workingHoursStart || '09:00'))}.`;
}

export function convertFreelancerToClientTime(
  dateStr: string, // "YYYY-MM-DD"
  timeStr: string, // "HH:MM" or "14:30"
  client: Client,
  freelancerTz: string = 'America/New_York'
): DualTimeConversion {
  const loc = getClientEffectiveLocation(client);
  const clientTz = loc.timezone;

  // Build ISO date assuming freelancer's timezone
  let baseDate: Date;
  try {
    const [year, month, day] = (dateStr || new Date().toISOString().split('T')[0]).split('-').map(Number);
    const [hours, minutes] = (timeStr || '12:00').split(':').map(Number);
    
    // Construct approximate UTC
    baseDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  } catch {
    baseDate = new Date();
  }

  let freeTimeStr = timeStr;
  let freeDateStr = dateStr;
  let cliTimeStr = timeStr;
  let cliDateStr = dateStr;
  let cliHour24 = 12;
  let cliMin = 0;

  try {
    // Format for freelancer
    freeTimeStr = new Intl.DateTimeFormat('en-US', {
      timeZone: freelancerTz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(baseDate);

    freeDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: freelancerTz,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(baseDate);

    // Format for client
    cliTimeStr = new Intl.DateTimeFormat('en-US', {
      timeZone: clientTz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(baseDate);

    cliDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: clientTz,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(baseDate);

    const cli24Parts = new Intl.DateTimeFormat('en-US', {
      timeZone: clientTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(baseDate);

    cliHour24 = parseInt(cli24Parts.find(p => p.type === 'hour')?.value || '12', 10);
    cliMin = parseInt(cli24Parts.find(p => p.type === 'minute')?.value || '0', 10);
  } catch {
    // fallback
  }

  const cliMinutes = cliHour24 * 60 + cliMin;
  const workStartMins = parseTimeToMinutes(client.workingHoursStart || '09:00');
  const workEndMins = parseTimeToMinutes(client.workingHoursEnd || '17:30');
  const commsStartMins = parseTimeToMinutes(client.preferredCommsStart || '10:00');
  const commsEndMins = parseTimeToMinutes(client.preferredCommsEnd || '16:30');

  const isClientInWorkingHours = cliMinutes >= workStartMins && cliMinutes <= workEndMins;
  const isClientInPreferredWindow = cliMinutes >= commsStartMins && cliMinutes <= commsEndMins;
  const isClientSleeping = cliHour24 >= 22 || cliHour24 < 7;

  return {
    freelancerTimeStr: freeTimeStr,
    freelancerTimezone: freelancerTz,
    freelancerDate: freeDateStr,
    clientTimeStr: cliTimeStr,
    clientTimezone: clientTz,
    clientDate: cliDateStr,
    isClientInWorkingHours,
    isClientInPreferredWindow,
    isClientSleeping,
    timeDifferenceLabel: isClientSleeping ? '⚠️ Client is sleeping' : isClientInPreferredWindow ? '✨ Prime response window' : isClientInWorkingHours ? '💼 Active work hours' : '🌙 Off-hours'
  };
}

export function findMeetingOverlaps(
  clients: Client[],
  freelancerTz: string = 'America/New_York',
  durationMinutes: number = 30
): MeetingOverlapSlot[] {
  const slots: MeetingOverlapSlot[] = [];
  const baseDate = new Date();

  // Test every hour from 06:00 to 22:00 in freelancer time
  for (let fHour = 6; fHour <= 22; fHour++) {
    const fMinutes = fHour * 60;
    const fTimeFormatted = formatMinutesToTime(fMinutes);

    // Create a date object with this freelancer hour
    const dateAtHour = new Date(baseDate);
    dateAtHour.setHours(fHour, 0, 0, 0);

    const clientTimes = clients.map(client => {
      const loc = getClientEffectiveLocation(client);
      let cHour = 0;
      let cMin = 0;
      let localTime = '';

      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: loc.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).formatToParts(dateAtHour);
        cHour = parseInt(parts.find(p => p.type === 'hour')?.value || '12', 10);
        cMin = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

        localTime = new Intl.DateTimeFormat('en-US', {
          timeZone: loc.timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).format(dateAtHour);
      } catch {
        cHour = fHour;
        localTime = fTimeFormatted;
      }

      const cMinutes = cHour * 60 + cMin;
      const workStart = parseTimeToMinutes(client.workingHoursStart || '09:00');
      const workEnd = parseTimeToMinutes(client.workingHoursEnd || '17:30');
      const meetStart = parseTimeToMinutes(client.meetingAvailabilityStart || client.preferredCommsStart || '10:00');
      const meetEnd = parseTimeToMinutes(client.meetingAvailabilityEnd || client.preferredCommsEnd || '16:30');

      let status: 'optimal' | 'acceptable' | 'off_hours' | 'sleeping' = 'off_hours';

      if (cHour >= 22 || cHour < 7) {
        status = 'sleeping';
      } else if (cMinutes >= meetStart && (cMinutes + durationMinutes) <= meetEnd) {
        status = 'optimal';
      } else if (cMinutes >= workStart && (cMinutes + durationMinutes) <= workEnd) {
        status = 'acceptable';
      } else {
        status = 'off_hours';
      }

      return {
        clientId: client.id,
        clientName: client.primaryContact || client.name,
        city: loc.city,
        flagEmoji: loc.flagEmoji,
        localTime,
        hour: cHour,
        status
      };
    });

    // Score slot
    const optimalCount = clientTimes.filter(c => c.status === 'optimal').length;
    const acceptableCount = clientTimes.filter(c => c.status === 'acceptable').length;
    const sleepingCount = clientTimes.filter(c => c.status === 'sleeping').length;
    const total = clientTimes.length || 1;

    let overlapScore: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    let recommendation = 'Not recommended (outside business hours)';

    if (sleepingCount > 0) {
      overlapScore = 'poor';
      const sleepers = clientTimes.filter(c => c.status === 'sleeping').map(c => `${c.clientName} (${c.city})`).join(', ');
      recommendation = `Conflict: Sleeping hours for ${sleepers}`;
    } else if (optimalCount === total) {
      overlapScore = 'excellent';
      recommendation = 'Perfect bridge: All participants in prime meeting availability';
    } else if (optimalCount + acceptableCount === total) {
      overlapScore = 'good';
      recommendation = 'Solid overlap: All participants within working hours';
    } else if (acceptableCount > 0) {
      overlapScore = 'fair';
      recommendation = 'Marginal overlap: One or more participants outside preferred window';
    }

    slots.push({
      freelancerTime: fTimeFormatted,
      freelancerHour: fHour,
      clientTimes,
      overlapScore,
      recommendation
    });
  }

  return slots;
}

export function generateSmartCommsRecommendations(
  clients: Client[],
  freelancerTz: string = 'America/New_York'
): SmartCommunicationRecommendation[] {
  const list: SmartCommunicationRecommendation[] = [];
  const now = new Date();

  clients.forEach(client => {
    const live = getClientLiveTime(client, now, freelancerTz);
    const loc = getClientEffectiveLocation(client);

    // 1. EOD / Morning Dispatch Recommendation
    if (live.hour24 >= 15 && live.hour24 <= 18) {
      list.push({
        clientId: client.id,
        clientName: client.name,
        flagEmoji: loc.flagEmoji,
        city: loc.city,
        actionType: 'send_eod_report',
        urgency: 'now',
        suggestedFreelancerTime: 'Now',
        suggestedClientTime: `${live.timeStr} (Client EOD)`,
        reason: `${client.primaryContact || client.name} is wrapping up their day (${live.timeStr}). Perfect time to dispatch your async recap so it is reviewed before tomorrow.`,
        templateSnippet: `Hi ${client.intelligence?.executiveProfile?.preferredName || client.primaryContact || 'there'},\n\nHere is your EOD operational digest:\n• ✅ Priority milestones completed today\n• ⏱️ Retainer hours utilization on track\n• 📌 Agenda for tomorrow prepped for your local morning.`
      });
    } else if (live.hour24 >= 8 && live.hour24 <= 10) {
      list.push({
        clientId: client.id,
        clientName: client.name,
        flagEmoji: loc.flagEmoji,
        city: loc.city,
        actionType: 'send_update',
        urgency: 'now',
        suggestedFreelancerTime: 'Now',
        suggestedClientTime: `${live.timeStr} (Client Morning)`,
        reason: `${client.primaryContact || client.name} is starting their morning in ${loc.city}. A morning priority brief will land at the top of their inbox.`,
        templateSnippet: `Good morning ${client.intelligence?.executiveProfile?.preferredName || client.primaryContact || 'there'}!\n\nMorning priority scan ready for you:\n• 1. Key deliverable in flight\n• 2. No calendar blockers today\n• 3. Let me know if anything urgent pops up!`
      });
    }

    // 2. Urgent Approval Request Timing
    if (live.status === 'sleeping') {
      list.push({
        clientId: client.id,
        clientName: client.name,
        flagEmoji: loc.flagEmoji,
        city: loc.city,
        actionType: 'request_approval',
        urgency: 'wait_for_morning',
        suggestedFreelancerTime: `Queue for ${live.timeDiffFromFreelancerHours < 0 ? 'Tonight' : 'Tomorrow morning'}`,
        suggestedClientTime: '09:00 AM local',
        reason: `Client is currently asleep (${live.timeStr} in ${loc.city}). Avoid night pings to preserve executive trust; schedule send for their 09:00 AM local start.`,
        templateSnippet: `Hi ${client.intelligence?.executiveProfile?.preferredName || client.primaryContact || 'there'},\n\n[ACTION REQUIRED] Wire/document approval pending for your sign-off when you come online:\n• Details: [Insert link]\n• Deadline: End of day today.`
      });
    } else if (live.status === 'preferred_comms') {
      list.push({
        clientId: client.id,
        clientName: client.name,
        flagEmoji: loc.flagEmoji,
        city: loc.city,
        actionType: 'request_approval',
        urgency: 'now',
        suggestedFreelancerTime: 'Immediate',
        suggestedClientTime: `${live.timeStr} (Prime Window)`,
        reason: `Currently in prime communication window (${live.preferredCommsLabel}). Best historical response SLA.`,
        templateSnippet: `Hi ${client.intelligence?.executiveProfile?.preferredName || client.primaryContact || 'there'},\n\nQuick approval needed on [Milestone Item]. Take a quick look here when you have 2 minutes: [Link]`
      });
    }
  });

  return list;
}
