import { useState } from 'react';
import { mockPatients, mockAppointments } from '../../data/mockData';
import type { Patient } from '../../types';

export function PatientManagement() {
  const [patients] = useState<Patient[]>(mockPatients);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Adding patient:', newPatient);
    setShowAddForm(false);
    setNewPatient({ name: '', email: '', phone: '', address: '', dateOfBirth: '' });
  };

  const getPatientAppointments = (patientId: string) => {
    return mockAppointments.filter(apt => apt.patient_id === patientId).length;
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>Patient Management</h2>
          <p style={{ color: '#718096' }}>Manage patient records and appointments</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ 
            padding: '8px 16px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white', 
            borderRadius: '8px', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {showAddForm ? 'Cancel' : 'Add Patient'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>Add New Patient</h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>Enter patient information</p>
          </div>
          <div style={{ padding: '20px' }}>
            <form onSubmit={handleAddPatient}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    required
                    style={{
                      backgroundColor: 'white',
                      color: '#1a202c',
                      boxSizing: 'border-box',
                      border: '1px solid #e2e8f0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      width: '100%',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    required
                    style={{
                      backgroundColor: 'white',
                      color: '#1a202c',
                      boxSizing: 'border-box',
                      border: '1px solid #e2e8f0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      width: '100%',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    required
                    style={{
                      backgroundColor: 'white',
                      color: '#1a202c',
                      boxSizing: 'border-box',
                      border: '1px solid #e2e8f0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      width: '100%',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="dob" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                    required
                    style={{
                      backgroundColor: 'white',
                      color: '#1a202c',
                      boxSizing: 'border-box',
                      border: '1px solid #e2e8f0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      width: '100%',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="address" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                    Address
                  </label>
                  <input
                    id="address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    required
                    style={{
                      backgroundColor: 'white',
                      color: '#1a202c',
                      boxSizing: 'border-box',
                      border: '1px solid #e2e8f0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      width: '100%',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <button 
                type="submit"
                style={{ 
                  padding: '8px 16px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Save Patient
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>Patient List</h3>
          <p style={{ fontSize: '14px', color: '#718096' }}>All registered patients</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Phone</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Date of Birth</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Appointments</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1a202c', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.patient_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{patient.patient_id}</td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{patient.name}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{patient.email}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{patient.phone}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{patient.dateOfBirth}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{getPatientAppointments(patient.patient_id)}</td>
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
                          Edit
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
