import { useState } from 'react';
import { mockDoctors, mockPrescriptions, mockAppointments } from '../../data/mockData';
import type { Doctor } from '../../types';

export function DoctorManagement() {
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const getDoctorAppointments = (doctorId: string) => {
    return mockAppointments.filter(apt => apt.doctor_id === doctorId && apt.status === 'scheduled').length;
  };

  const getDoctorPrescriptions = (doctorId: string) => {
    return mockPrescriptions.filter(rx => rx.doctor_id === doctorId).length;
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>Doctor Management</h2>
        <p style={{ color: '#718096' }}>View and manage doctor profiles</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {doctors.map((doctor) => (
          <div 
            key={doctor.doctor_id} 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>{doctor.name}</h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>{doctor.specialization}</p>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span style={{ color: '#718096' }}>Experience:</span>
                <span style={{ fontWeight: '500', color: '#1a202c' }}>{doctor.experience} years</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span style={{ color: '#718096' }}>Rating:</span>
                <span style={{ fontWeight: '500', color: '#1a202c' }}>⭐ {doctor.rating}/5.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span style={{ color: '#718096' }}>Appointments:</span>
                <span style={{ fontWeight: '500', color: '#1a202c' }}>{getDoctorAppointments(doctor.doctor_id)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '16px' }}>
                <span style={{ color: '#718096' }}>Prescriptions:</span>
                <span style={{ fontWeight: '500', color: '#1a202c' }}>{getDoctorPrescriptions(doctor.doctor_id)}</span>
              </div>
              <button 
                onClick={() => setSelectedDoctor(doctor)}
                style={{ 
                  width: '100%',
                  padding: '8px 16px', 
                  backgroundColor: 'white', 
                  color: '#667eea', 
                  border: '1px solid #667eea', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>
              {selectedDoctor.name} - Details
            </h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>Complete profile and activity</p>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{selectedDoctor.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Phone</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{selectedDoctor.phone}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Address</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{selectedDoctor.address}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Specialization</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{selectedDoctor.specialization}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '12px' }}>Recent Prescriptions</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f7fafc' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Patient</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Medications</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPrescriptions
                        .filter(rx => rx.doctor_id === selectedDoctor.doctor_id)
                        .map((prescription) => (
                          <tr key={prescription.prescription_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{prescription.prescription_id}</td>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{prescription.patient_id}</td>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{prescription.date}</td>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{prescription.medications.length} medication(s)</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button 
                onClick={() => setSelectedDoctor(null)}
                style={{ 
                  marginTop: '16px',
                  padding: '8px 16px', 
                  backgroundColor: 'white', 
                  color: '#667eea', 
                  border: '1px solid #667eea', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
