import { useState, useEffect } from 'react';
import { mockAppointments, mockPrescriptions, mockReports, mockDoctors, mockTests, mockPayments, mockHospitals } from '../../data/mockData';
import { appointmentService, prescriptionService } from '../../services/supabaseService';
// @ts-ignore - DoctorRating component
import { DoctorRating } from './DoctorRating';

interface PatientDashboardProps {
  patientId: string;
  onBookNew: () => void;
}

export function PatientDashboard({ patientId, onBookNew }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState('appointments');
  const [dbAppointments, setDbAppointments] = useState<any[]>([]);
  const [dbPrescriptions, setDbPrescriptions] = useState<any[]>([]);

  // Fetch appointments from database
  useEffect(() => {
    console.log('===== PATIENT DASHBOARD LOADING =====');
    console.log('Patient ID being used:', patientId);
    
    const fetchAppointments = async () => {
      try {
        const { data, error } = await appointmentService.getPatientAppointments(patientId);
        if (data && !error) {
          console.log('Fetched appointments from database:', data);
          setDbAppointments(data);
        } else {
          console.log('No appointments in database or error:', error);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    const fetchPrescriptions = async () => {
      try {
        console.log('Fetching prescriptions for patient_id:', patientId);
        const { data, error } = await prescriptionService.getPatientPrescriptions(patientId);
        console.log('Prescription fetch result:', { data, error });
        if (data && !error) {
          console.log('Fetched prescriptions from database:', data);
          setDbPrescriptions(data);
        } else {
          console.log('No prescriptions in database or error:', error);
        }
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
      }
    };

    fetchAppointments();
    fetchPrescriptions();
  }, [patientId]);

  // Merge database appointments with mock appointments
  const myAppointments = [
    ...dbAppointments.map(apt => {
      // Extract doctor name from database join OR fall back to mock data
      let doctorName = 'Unknown Doctor';
      let hospitalName = 'Unknown Hospital';
      
      // Try to get doctor name from the nested join: appointments -> doctors -> users
      if (apt.doctors && apt.doctors.users) {
        doctorName = apt.doctors.users.name;
      } else {
        // Fallback: Look up doctor in mock data using doctor_id
        const mockDoctor = mockDoctors.find(d => d.doctor_id === apt.doctor_id);
        if (mockDoctor) {
          doctorName = mockDoctor.name;
        }
      }
      
      // Get hospital name from database OR mock data
      if (apt.hospitals && apt.hospitals.name) {
        hospitalName = apt.hospitals.name;
      } else {
        // Fallback: Look up hospital in mock data
        const mockHospital = mockHospitals.find(h => h.hospital_id === apt.hospital_id);
        if (mockHospital) {
          hospitalName = mockHospital.name;
        }
      }
      
      console.log('Mapping appointment:', {
        appointment_id: apt.appointment_id,
        doctor_id: apt.doctor_id,
        doctor_name: doctorName,
        hospital_name: hospitalName,
        has_db_doctor: !!(apt.doctors && apt.doctors.users)
      });
      
      return {
        appointment_id: apt.appointment_id,
        patient_id: apt.patient_id,
        doctor_id: apt.doctor_id,
        hospital_id: apt.hospital_id,
        date: apt.date,
        time: apt.time,
        status: apt.status,
        type: apt.type,
        notes: apt.notes,
        payment_status: apt.payment_status || 'pending',
        doctor_name: doctorName,
        hospital_name: hospitalName
      };
    }),
    ...mockAppointments.filter(apt => apt.patient_id === patientId)
  ];
  
  const myPrescriptions = [
    ...dbPrescriptions.map(rx => ({
      prescription_id: rx.prescription_id,
      patient_id: rx.patient_id,
      doctor_id: rx.doctor_id,
      date: rx.date,
      diagnosis: rx.diagnosis,
      medications: rx.medications,
      instructions: rx.instructions,
      follow_up_date: rx.follow_up_date,
      doctor_name: rx.doctors?.users?.name || 'Unknown Doctor'
    })),
    ...mockPrescriptions.filter(rx => rx.patient_id === patientId)
  ];
  
  console.log('Patient Dashboard - Total prescriptions:', myPrescriptions.length);
  console.log('Database prescriptions:', dbPrescriptions.length);
  console.log('Mock prescriptions for patient:', mockPrescriptions.filter(rx => rx.patient_id === patientId).length);
  console.log('Prescription data:', myPrescriptions);
  
  const myTests = mockTests.filter(test => test.patient_id === patientId);
  const myReports = mockReports.filter(report => report.patient_id === patientId);
  const myPayments = mockPayments.filter(payment => payment.patient_id === patientId);

  const getDoctorName = (apt: any) => {
    // First check if we have the doctor_name from database
    if (apt.doctor_name) {
      return apt.doctor_name;
    }
    // Fall back to mock data
    return mockDoctors.find(d => d.doctor_id === apt.doctor_id)?.name || 'Unknown';
  };

  const getDoctorNameById = (doctorId: string) => {
    return mockDoctors.find(d => d.doctor_id === doctorId)?.name || 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      scheduled: { bg: '#dbeafe', text: '#1e40af' },
      confirmed: { bg: '#d1fae5', text: '#065f46' },
      completed: { bg: '#f3f4f6', text: '#374151' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' },
      pending: { bg: '#fef3c7', text: '#92400e' },
    };
    const color = colors[status] || { bg: '#f3f4f6', text: '#374151' };
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: color.bg,
        color: color.text,
        display: 'inline-block'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
            My Dashboard
          </h2>
          <p style={{ fontSize: '16px', color: '#718096' }}>
            Manage your appointments and health records
          </p>
        </div>
        <button
          onClick={onBookNew}
          style={{
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          + Book New Appointment
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
            {myAppointments.filter(a => a.status === 'scheduled').length}
          </p>
          <p style={{ fontSize: '14px', color: '#718096' }}>Upcoming</p>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
            {myPrescriptions.length}
          </p>
          <p style={{ fontSize: '14px', color: '#718096' }}>Prescriptions</p>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
            {myReports.length}
          </p>
          <p style={{ fontSize: '14px', color: '#718096' }}>Reports</p>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#f97316', marginBottom: '8px' }}>
            {myTests.filter(t => t.status === 'pending').length}
          </p>
          <p style={{ fontSize: '14px', color: '#718096' }}>Pending Tests</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          {['appointments', 'prescriptions', 'tests', 'payments', 'ratings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: activeTab === tab ? '#667eea' : '#718096',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #667eea' : '3px solid transparent',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
                marginBottom: '-2px'
              }}
            >
              {tab === 'tests' ? 'Tests & Reports' : tab === 'payments' ? 'Payment History' : tab === 'ratings' ? 'Rate Doctors' : tab}
            </button>
          ))}
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '16px' }}>
              My Appointments
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Date & Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Doctor</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.map((apt) => (
                    <tr key={apt.appointment_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '500', color: '#1a202c' }}>{apt.date}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>{apt.time}</div>
                      </td>
                      <td style={{ padding: '16px', color: '#1a202c' }}>{getDoctorName(apt)}</td>
                      <td style={{ padding: '16px', color: '#1a202c', textTransform: 'capitalize' }}>{apt.type}</td>
                      <td style={{ padding: '16px' }}>{getStatusBadge(apt.status)}</td>
                      <td style={{ padding: '16px' }}>{getStatusBadge(apt.payment_status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {myAppointments.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
                  No appointments yet. Click "Book New Appointment" to get started!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '16px' }}>
              My Prescriptions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myPrescriptions.map((prescription) => (
                <div key={prescription.prescription_id} style={{
                  background: '#f7fafc',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c' }}>
                        Dr. {getDoctorNameById(prescription.doctor_id)}
                      </p>
                      <p style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>{prescription.date}</p>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>Medications:</p>
                    {prescription.medications.map((med: any, idx: number) => (
                      <div key={idx} style={{
                        background: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <p style={{ fontWeight: '500', color: '#1a202c' }}>{med.name} - {med.dosage}</p>
                        <p style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>
                          {med.frequency} for {med.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>Instructions:</p>
                    <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>{prescription.instructions}</p>
                  </div>
                </div>
              ))}
              {myPrescriptions.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
                  No prescriptions available yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '16px' }}>
              Tests & Reports
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Test Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Location</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myTests.map((test) => (
                    <tr key={test.test_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', fontWeight: '500', color: '#1a202c' }}>{test.name}</td>
                      <td style={{ padding: '16px', color: '#1a202c' }}>{test.date}</td>
                      <td style={{ padding: '16px' }}>
                        {test.from_home && <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', marginRight: '4px' }}>Home</span>}
                        {test.from_hospital && <span style={{ fontSize: '12px', background: '#f3e8ff', color: '#6b21a8', padding: '4px 8px', borderRadius: '6px' }}>Hospital</span>}
                      </td>
                      <td style={{ padding: '16px' }}>{getStatusBadge(test.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {myTests.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
                  No tests scheduled.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '16px' }}>
              Payment History
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Payment ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Amount (BDT)</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Method</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myPayments.map((payment) => (
                    <tr key={payment.payment_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', fontWeight: '500', color: '#1a202c' }}>{payment.payment_id}</td>
                      <td style={{ padding: '16px', color: '#1a202c' }}>{payment.date}</td>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#1a202c' }}>৳ {payment.amount.toFixed(2)}</td>
                      <td style={{ padding: '16px', color: '#1a202c', textTransform: 'capitalize' }}>{payment.method}</td>
                      <td style={{ padding: '16px' }}>{getStatusBadge(payment.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {myPayments.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
                  No payment history available.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <DoctorRating patientId={patientId} />
        )}
      </div>
    </div>
  );
}
