import { useState } from 'react';
import { mockPayments, mockReports, mockPatients } from '../../data/mockData';
import type { Payment, Report } from '../../types';

export function PaymentReports() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [reports] = useState<Report[]>(mockReports);

  const getStatusBadge = (status: Payment['status']) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      completed: { bg: '#d1fae5', text: '#065f46' },
      failed: { bg: '#fee2e2', text: '#991b1b' },
    };
    const color = colors[status];
    return (
      <span style={{ 
        padding: '4px 8px', 
        borderRadius: '4px', 
        fontSize: '12px', 
        fontWeight: '500',
        backgroundColor: color.bg,
        color: color.text
      }}>
        {status}
      </span>
    );
  };

  const getPatientName = (patientId: string) => {
    return mockPatients.find(p => p.patient_id === patientId)?.name || 'Unknown';
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>Payments & Reports</h2>
        <p style={{ color: '#718096' }}>Financial transactions and medical reports</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>Total Revenue</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '4px' }}>৳{totalRevenue.toFixed(2)}</div>
            <p style={{ fontSize: '12px', color: '#718096' }}>From completed payments</p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>Pending Payments</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '4px' }}>{pendingPayments}</div>
            <p style={{ fontSize: '12px', color: '#718096' }}>Awaiting confirmation</p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>Reports Generated</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '4px' }}>{reports.length}</div>
            <p style={{ fontSize: '12px', color: '#718096' }}>Total medical reports</p>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>Payment History</h3>
          <p style={{ fontSize: '14px', color: '#718096' }}>All payment transactions</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Payment ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Patient</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Method</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Coupon</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.payment_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{payment.payment_id}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{getPatientName(payment.patient_id)}</td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>৳{payment.amount.toFixed(2)}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{payment.date}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c', textTransform: 'capitalize' }}>{payment.method}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{payment.coupon || '-'}</td>
                    <td style={{ padding: '12px' }}>{getStatusBadge(payment.status)}</td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        style={{ 
                          padding: '4px 12px', 
                          backgroundColor: 'white', 
                          color: '#667eea', 
                          border: '1px solid #667eea', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>Medical Reports</h3>
          <p style={{ fontSize: '14px', color: '#718096' }}>Test results and doctor findings</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Report ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Test ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Patient</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Doctor ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.report_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{report.report_id}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{report.test_id}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{getPatientName(report.patient_id)}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{report.doctor_id}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{report.date}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          style={{ 
                            padding: '4px 12px', 
                            backgroundColor: 'white', 
                            color: '#667eea', 
                            border: '1px solid #667eea', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          View
                        </button>
                        <button 
                          style={{ 
                            padding: '4px 12px', 
                            backgroundColor: 'white', 
                            color: '#667eea', 
                            border: '1px solid #667eea', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
