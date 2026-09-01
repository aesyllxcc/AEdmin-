import { AuditLogEntry, RetainerPeriodLog } from '../types';

export const initialRetainerPeriods: RetainerPeriodLog[] = [
  // Arkgate Ventures (cli_1)
  {
    id: 'ret_1_aug26',
    clientId: 'cli_1',
    clientName: 'Arkgate Ventures',
    periodMonth: '2026-08',
    purchasedHours: 40,
    rolloverHours: 4.5,
    manualAdjustmentHours: 2.0,
    usedHours: 24.5,
    effectiveAvailableHours: 46.5,
    remainingHours: 22.0,
    status: 'active',
    hourlyRate: 150,
    monthlyFee: 5500,
    notes: 'August 2026 active cycle. Granted +2h discretionary buffer for LP summit sprint.',
    lastModified: '2026-08-26T14:30:00Z',
    modifiedBy: 'Olivia Vance',
    adjustmentReason: 'Added 2.0h discretionary buffer for LP summit sprint prep'
  },
  {
    id: 'ret_1_jul26',
    clientId: 'cli_1',
    clientName: 'Arkgate Ventures',
    periodMonth: '2026-07',
    purchasedHours: 40,
    rolloverHours: 0,
    manualAdjustmentHours: 0,
    usedHours: 35.5,
    effectiveAvailableHours: 40,
    remainingHours: 4.5,
    status: 'closed',
    hourlyRate: 150,
    monthlyFee: 5500,
    notes: 'July 2026 reconciled. 4.5 unused hours rolled over into August.',
    lastModified: '2026-08-01T09:00:00Z',
    modifiedBy: 'Olivia Vance',
    adjustmentReason: 'Period reconciled and closed with 4.5h rollover'
  },
  {
    id: 'ret_1_sep26',
    clientId: 'cli_1',
    clientName: 'Arkgate Ventures',
    periodMonth: '2026-09',
    purchasedHours: 40,
    rolloverHours: 0,
    manualAdjustmentHours: 0,
    usedHours: 0,
    effectiveAvailableHours: 40,
    remainingHours: 40,
    status: 'active',
    hourlyRate: 150,
    monthlyFee: 5500,
    notes: 'Upcoming September retainer cycle scheduled.',
    lastModified: '2026-08-20T10:00:00Z',
    modifiedBy: 'Olivia Vance'
  },

  // Stark Media Studio (cli_2)
  {
    id: 'ret_2_aug26',
    clientId: 'cli_2',
    clientName: 'Stark Media Studio',
    periodMonth: '2026-08',
    purchasedHours: 45,
    rolloverHours: 5.0,
    manualAdjustmentHours: 0,
    usedHours: 29.0,
    effectiveAvailableHours: 50.0,
    remainingHours: 21.0,
    status: 'active',
    hourlyRate: 160,
    monthlyFee: 6200,
    notes: 'Paris Fashion Week production support phase.',
    lastModified: '2026-08-26T16:00:00Z',
    modifiedBy: 'Olivia Vance'
  },
  {
    id: 'ret_2_jul26',
    clientId: 'cli_2',
    clientName: 'Stark Media Studio',
    periodMonth: '2026-07',
    purchasedHours: 45,
    rolloverHours: 0,
    manualAdjustmentHours: 0,
    usedHours: 40.0,
    effectiveAvailableHours: 45.0,
    remainingHours: 5.0,
    status: 'closed',
    hourlyRate: 160,
    monthlyFee: 6200,
    notes: 'July cycle closed. 5.0h rolled over.',
    lastModified: '2026-08-01T09:00:00Z',
    modifiedBy: 'Olivia Vance'
  },

  // Wayne Technologies (cli_3)
  {
    id: 'ret_3_aug26',
    clientId: 'cli_3',
    clientName: 'Wayne Technologies',
    periodMonth: '2026-08',
    purchasedHours: 32,
    rolloverHours: 0,
    manualAdjustmentHours: 3.0,
    usedHours: 18.5,
    effectiveAvailableHours: 35.0,
    remainingHours: 16.5,
    status: 'active',
    hourlyRate: 150,
    monthlyFee: 4800,
    notes: 'Series B data room overhaul retainer.',
    lastModified: '2026-08-25T11:20:00Z',
    modifiedBy: 'Olivia Vance',
    adjustmentReason: 'Added 3h onboarding data room bonus hours'
  },
  {
    id: 'ret_3_jul26',
    clientId: 'cli_3',
    clientName: 'Wayne Technologies',
    periodMonth: '2026-07',
    purchasedHours: 32,
    rolloverHours: 0,
    manualAdjustmentHours: 0,
    usedHours: 32.0,
    effectiveAvailableHours: 32.0,
    remainingHours: 0,
    status: 'closed',
    hourlyRate: 150,
    monthlyFee: 4800,
    notes: 'Initial kick-off month completed at 100% capacity.',
    lastModified: '2026-08-01T09:00:00Z',
    modifiedBy: 'Olivia Vance'
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud_1',
    timestamp: '2026-08-26T15:45:00Z',
    entityType: 'time_entry',
    entityId: 'tm_1',
    entityTitle: 'Time Log: Weekly LP Executive Digest',
    clientId: 'cli_1',
    clientName: 'Arkgate Ventures',
    action: 'updated',
    actor: 'Olivia Vance',
    reason: 'Corrected duration from 60m to 90m to include portfolio reconciliation work.',
    changes: [
      { field: 'durationMinutes', label: 'Duration (Minutes)', oldValue: 60, newValue: 90 },
      { field: 'value', label: 'Billable Amount', oldValue: 150, newValue: 225 },
      { field: 'notes', label: 'Work Description', oldValue: 'Drafted email digest.', newValue: 'Aggregated Q3 portfolio returns, checked Carta cap table revisions, drafted email digest.' }
    ]
  },
  {
    id: 'aud_2',
    timestamp: '2026-08-26T14:30:00Z',
    entityType: 'retainer_period',
    entityId: 'ret_1_aug26',
    entityTitle: 'Retainer Period: Arkgate Ventures (2026-08)',
    clientId: 'cli_1',
    clientName: 'Arkgate Ventures',
    action: 'adjusted_hours',
    actor: 'Olivia Vance',
    reason: 'Authorized +2.0h discretionary buffer for urgent LP summit sprint support.',
    changes: [
      { field: 'manualAdjustmentHours', label: 'Manual Adjustment', oldValue: 0, newValue: 2.0 },
      { field: 'effectiveAvailableHours', label: 'Available Hours', oldValue: 44.5, newValue: 46.5 },
      { field: 'remainingHours', label: 'Remaining Balance', oldValue: 20.0, newValue: 22.0 }
    ]
  },
  {
    id: 'aud_3',
    timestamp: '2026-08-25T17:15:00Z',
    entityType: 'historical_record',
    entityId: 'tm_3',
    entityTitle: 'Historical Time Log: Wayne Tech Data Room Standardization',
    clientId: 'cli_3',
    clientName: 'Wayne Technologies',
    action: 'updated',
    actor: 'Olivia Vance',
    reason: 'Operational retroactive adjustment for additional drive structuring.',
    changes: [
      { field: 'durationMinutes', label: 'Duration (Minutes)', oldValue: 90, newValue: 120 },
      { field: 'value', label: 'Calculated Value', oldValue: 225, newValue: 300 }
    ]
  },
  {
    id: 'aud_4',
    timestamp: '2026-08-25T11:20:00Z',
    entityType: 'client_hours',
    entityId: 'cli_3',
    entityTitle: 'Client Available Hours: Wayne Technologies',
    clientId: 'cli_3',
    clientName: 'Wayne Technologies',
    action: 'adjusted_hours',
    actor: 'Olivia Vance',
    reason: 'Applied onboarding bonus hours per signed Service Level Agreement.',
    changes: [
      { field: 'purchasedHours', label: 'Monthly Retainer Cap', oldValue: 30, newValue: 32 },
      { field: 'usedHoursThisMonth', label: 'Consumed Hours', oldValue: 16.5, newValue: 18.5 }
    ]
  },
  {
    id: 'aud_5',
    timestamp: '2026-08-05T14:10:00Z',
    entityType: 'invoice',
    entityId: 'inv_2',
    entityTitle: 'Invoice INV-2026-082 (Stark Media Studio)',
    clientId: 'cli_2',
    clientName: 'Stark Media Studio',
    action: 'marked_paid',
    actor: 'Olivia Vance',
    reason: 'Payment verified and reconciled with Bank Wire confirmation.',
    changes: [
      { field: 'status', label: 'Invoice Status', oldValue: 'sent', newValue: 'paid' },
      { field: 'paidDate', label: 'Payment Settled Date', oldValue: null, newValue: '2026-08-05' },
      { field: 'paymentMethod', label: 'Payment Method', oldValue: null, newValue: 'Bank Wire' },
      { field: 'paymentReferenceNumber', label: 'Reference Number', oldValue: null, newValue: 'WIRE-US9921049' }
    ]
  },
  {
    id: 'aud_6',
    timestamp: '2026-08-03T10:05:00Z',
    entityType: 'invoice',
    entityId: 'inv_1',
    entityTitle: 'Invoice INV-2026-081 (Arkgate Ventures)',
    clientId: 'cli_1',
    clientName: 'Arkgate Ventures',
    action: 'marked_paid',
    actor: 'Olivia Vance',
    reason: 'Stripe Autopay webhooks confirmed settlement.',
    changes: [
      { field: 'status', label: 'Invoice Status', oldValue: 'sent', newValue: 'paid' },
      { field: 'paidDate', label: 'Payment Settled Date', oldValue: null, newValue: '2026-08-03' },
      { field: 'paymentMethod', label: 'Payment Method', oldValue: null, newValue: 'Stripe' },
      { field: 'paymentReferenceNumber', label: 'Reference Number', oldValue: null, newValue: 'ch_3N84k192019488' }
    ]
  }
];
