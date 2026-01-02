import { useState } from 'react';
import { mockFacilities, mockTests } from '../../data/mockData';
import type { Facility, Test } from '../../types';

export function FacilityManagement() {
  const [facilities] = useState<Facility[]>(mockFacilities);
  const [tests] = useState<Test[]>(mockTests);

  const getFacilityTests = (facilityId: string) => {
    return tests.filter(test => test.facility_id === facilityId);
  };

  const getStatusBadge = (status: Test['status']) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      completed: { bg: '#d1fae5', text: '#065f46' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' },
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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>Facility Management</h2>
        <p style={{ color: '#718096' }}>Manage diagnostic centers and test facilities</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {facilities.map((facility) => (
          <div 
            key={facility.fac_id}
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>{facility.name}</h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>{facility.specialized_in}</p>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Address</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{facility.address}</p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Contact</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{facility.contact_info}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Active Tests</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{getFacilityTests(facility.fac_id).length}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>Test Management</h3>
          <p style={{ fontSize: '14px', color: '#718096' }}>All scheduled and completed tests</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Test ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Test Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Patient ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Facility</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Location</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => {
                  const facility = facilities.find(f => f.fac_id === test.facility_id);
                  return (
                    <tr key={test.test_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{test.test_id}</td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{test.name}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{test.patient_id}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{facility?.name}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{test.date}</td>
                      <td style={{ padding: '12px' }}>
                        {test.from_home && <span style={{ fontSize: '12px', backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px', marginRight: '4px' }}>Home</span>}
                        {test.from_hospital && <span style={{ fontSize: '12px', backgroundColor: '#e9d5ff', color: '#6b21a8', padding: '4px 8px', borderRadius: '4px' }}>Hospital</span>}
                      </td>
                      <td style={{ padding: '12px' }}>{getStatusBadge(test.status)}</td>
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
                          {test.status === 'pending' && (
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
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
