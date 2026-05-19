'use client';

import { Download, Wallet, FileText, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { SettlementReport } from '@/lib/types';
import { formatDate, formatCurrency, formatTokens, SETTLEMENT_STATUS_LABELS } from '@/lib/utils';

import { StatsCard } from '../_components/StatsCard';

const MOCK_REPORTS: SettlementReport[] = [
  {
    id: 'stl_1', partnerId: 'p1', periodStart: '2024-05-01T00:00:00Z', periodEnd: '2024-05-15T23:59:59Z',
    completedBookings: 142, totalTokenValue: 1250, settlementRate: 50, settlementAmount: 62500,
    status: 'COMPLETED', paidAt: '2024-05-17T10:30:00Z', notes: null, createdAt: '', updatedAt: '',
  },
  {
    id: 'stl_2', partnerId: 'p1', periodStart: '2024-04-16T00:00:00Z', periodEnd: '2024-04-30T23:59:59Z',
    completedBookings: 128, totalTokenValue: 1100, settlementRate: 50, settlementAmount: 55000,
    status: 'COMPLETED', paidAt: '2024-05-02T14:15:00Z', notes: null, createdAt: '', updatedAt: '',
  },
  {
    id: 'stl_3', partnerId: 'p1', periodStart: '2024-04-01T00:00:00Z', periodEnd: '2024-04-15T23:59:59Z',
    completedBookings: 156, totalTokenValue: 1350, settlementRate: 50, settlementAmount: 67500,
    status: 'COMPLETED', paidAt: '2024-04-18T09:45:00Z', notes: null, createdAt: '', updatedAt: '',
  },
];

export default function SettlementPage() {
  const [period, setPeriod] = useState('2024-05');
  
  const pendingAmount = 31500; // Mock current period pending

  return (
    <div className="settlement-page">
      <div className="page-header">
        <div>
          <h2 style={{ margin: 0 }}>RevenueAndการชำระเงิน</h2>
          <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Pendingบการตัดยอด: EveryDate 15 Andสิ้นmonth
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatsCard
          title="ยอดPendingการชำระ (Pendingบปัจจุบัน)"
          value={formatCurrency(pendingAmount)}
          subtitle={`ประเมินFrom ${formatTokens(630)} Token`}
          icon={<Wallet size={24} />}
          variant="accent"
        />
        <StatsCard
          title="Revenuemonthago"
          value={formatCurrency(117500)}
          subtitle="โอนSuccessDone"
          icon={<FileText size={24} />}
          variant="navy"
        />
      </div>

      {/* Reports Table */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-header">
          <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)' }}>Historyการรับชำระเงิน</h3>
          
          <div className="table-actions">
            <div className="select-wrapper">
              <select 
                className="period-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="2024-05">May 2024</option>
                <option value="2024-04">April 2024</option>
                <option value="2024-03">March 2024</option>
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
            
            <button className="export-btn">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Billing Period</th>
              <th>Transactions</th>
              <th>Total Tokens</th>
              <th>Amount (THB)</th>
              <th>Status</th>
              <th>Transfer Date</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REPORTS.map((report) => (
              <tr key={report.id}>
                <td>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    {formatDate(report.periodStart)} – {formatDate(report.periodEnd)}
                  </span>
                </td>
                <td>{report.completedBookings} items</td>
                <td>{formatTokens(report.totalTokenValue)}</td>
                <td style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }}>
                  {formatCurrency(report.settlementAmount)}
                </td>
                <td>
                  <span className={`status-badge ${report.status === 'COMPLETED' ? 'status-checked-in' : 'status-pending'}`}>
                    {SETTLEMENT_STATUS_LABELS[report.status]}
                  </span>
                </td>
                <td>
                  {report.paidAt ? formatDate(report.paidAt) : '-'}
                </td>
                <td>
                  <button className="download-receipt-btn" title="Download Receipt">
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .settlement-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-base);
        }

        .table-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .select-wrapper {
          position: relative;
        }

        .period-select {
          appearance: none;
          background: var(--bg-app);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-8) var(--space-2) var(--space-3);
          font-size: var(--font-size-sm);
          color: var(--text-primary);
          cursor: pointer;
          outline: none;
        }

        .period-select:focus {
          border-color: var(--color-navy-400);
        }

        .select-icon {
          position: absolute;
          right: var(--space-2);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--bg-app);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .export-btn:hover {
          background: var(--bg-navy-subtle);
          color: var(--text-brand);
          border-color: var(--color-navy-300);
        }

        .download-receipt-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--bg-app);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .download-receipt-btn:hover {
          background: var(--bg-navy-subtle);
          color: var(--text-brand);
          border-color: var(--color-navy-300);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .table-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
}
