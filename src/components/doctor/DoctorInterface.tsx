import { useState, useEffect } from 'react';
import { mockAppointments, mockPatients, mockPrescriptions } from '../../data/mockData';
import { appointmentService } from '../../services/supabaseService';
import { TestOrdering } from './TestOrdering';
import { PrescriptionWriter } from './PrescriptionWriter';
import type { Test, Report, Prescription } from '../../types';

interface DoctorInterfaceProps {
  doctorId: string;
}

export function DoctorInterface({ doctorId }: DoctorInterfaceProps) {
  const [dbAppointments, setDbAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTestOrdering, setShowTestOrdering] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [orderedTests, setOrderedTests] = useState<Test[]>([]);
  const [testReports] = useState<Report[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await appointmentService.getDoctorAppointments(doctorId);
        if (data && !error) {
          setDbAppointments(data);
        }
      } catch (err) {
        console.error('Error fetching doctor appointments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);
  }, [doctorId]);

  const allAppointments = [
    ...dbAppointments,
    ...mockAppointments.filter(apt => apt.doctor_id === doctorId)
  ];

  const myAppointments = allAppointments.filter(
    apt => apt.status === 'scheduled' || apt.status === 'confirmed'
  );

  const myPastAppointments = allAppointments.filter(apt => apt.status === 'completed');
  const myPrescriptions = prescriptions.filter(rx => rx.doctor_id === doctorId);

  const handleOrderTests = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowTestOrdering(true);
  };

  const handleWritePrescription = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowPrescription(true);
  };

  const handleTestOrdered = (test: Test) => {
    setOrderedTests(prev => [...prev, test]);
    alert(`Test "${test.name}" ordered successfully!`);
  };

  const handlePrescriptionCreated = (prescription: Prescription) => {
    setPrescriptions(prev => [...prev, prescription]);
  };

  const handleAppointmentCompleted = async (appointmentId: string) => {
    try {
      // Update local state immediately for instant UI feedback
      setDbAppointments(prev => 
        prev.map(apt => 
          apt.appointment_id === appointmentId 
            ? { ...apt, status: 'completed' } 
            : apt
        )
      );

      // Close the prescription modal immediately
      setShowPrescription(false);
      setSelectedAppointment(null);

      // Update in database
      const { error } = await appointmentService.updateAppointment(appointmentId, {
        status: 'completed' as const
      });
      
      if (error) {
        console.error('Error updating appointment status:', error);
        // Revert local state if database update failed
        await handleRefresh();
        alert('Could not update appointment status in database.');
      } else {
        alert('Appointment marked as completed successfully!');
        // Refresh to sync with database
        await handleRefresh();
      }
    } catch (err) {
      console.error('Error completing appointment:', err);
      // Revert by refreshing from database
      await handleRefresh();
      alert('Error completing appointment. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await appointmentService.getDoctorAppointments(doctorId);
      if (data && !error) {
        setDbAppointments(data);
      }
    } catch (err) {
      console.error('Error refreshing appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientName = (patientId: string) => {
    return mockPatients.find(p => p.patient_id === patientId)?.name || 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      scheduled: { bg: '#dbeafe', text: '#1e40af' },
      confirmed: { bg: '#d1fae5', text: '#065f46' },
      completed: { bg: '#f3f4f6', text: '#374151' },
      pending: { bg: '#fef3c7', text: '#92400e' }
    };
    const style = colors[status] || { bg: '#f3f4f6', text: '#374151' };
    return (
      <span style={{ backgroundColor: style.bg, color: style.text, padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', textTransform: 'capitalize' }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c' }}>Doctor Dashboard</h1>
          <button onClick={handleRefresh} disabled={isLoading} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '600', color: 'white', background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔄</span>{isLoading ? 'Refreshing...' : 'Refresh Appointments'}
          </button>
        </div>

        {dbAppointments.length > 0 && (
          <div style={{ padding: '12px 16px', marginBottom: '24px', backgroundColor: '#d1fae5', border: '1px solid #34d399', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#065f46' }}>
            <span style={{ fontSize: '16px' }}>✓</span>
            <span>Real-time sync active • {dbAppointments.length} new booking(s) from patients • Auto-refreshing every 10s</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Upcoming Appointments</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#3b82f6' }}>{myAppointments.length}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Prescriptions Written</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#10b981' }}>{myPrescriptions.length}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Tests Ordered</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#f59e0b' }}>{orderedTests.length}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Completed</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#8b5cf6' }}>{myPastAppointments.length}</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '32px', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c' }}>Today's Appointments</h2>
          </div>
          <div style={{ padding: '24px' }}>
            {myAppointments.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>Patient</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.map((appointment) => (
                    <tr key={appointment.appointment_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1a202c' }}>{appointment.time}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1a202c' }}>{getPatientName(appointment.patient_id)}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1a202c', textTransform: 'capitalize' }}>{appointment.type}</td>
                      <td style={{ padding: '16px' }}>{getStatusBadge(appointment.status)}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>📞 Call</button>
                          <button onClick={() => handleOrderTests(appointment)} style={{ padding: '8px 12px', backgroundColor: 'white', color: '#f59e0b', borderRadius: '6px', border: '1px solid #f59e0b', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>🔬 Tests</button>
                          <button onClick={() => handleWritePrescription(appointment)} style={{ padding: '8px 12px', backgroundColor: 'white', color: '#10b981', borderRadius: '6px', border: '1px solid #10b981', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>📋 Prescribe</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>No upcoming appointments</div>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c' }}>Recent Prescriptions</h2>
          </div>
          <div style={{ padding: '24px' }}>
            {myPrescriptions.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>Patient</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' }}>Medications</th>
                  </tr>
                </thead>
                <tbody>
                  {myPrescriptions.map((rx) => (
                    <tr key={rx.prescription_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1a202c' }}>{rx.prescription_id}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1a202c' }}>{getPatientName(rx.patient_id)}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1a202c' }}>{new Date(rx.date).toLocaleDateString()}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1a202c' }}>{rx.medications.length} medication(s)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>No prescriptions written yet</div>
            )}
          </div>
        </div>
      </div>

      {showTestOrdering && selectedAppointment && (
        <TestOrdering
          doctorId={doctorId}
          patientId={selectedAppointment.patient_id}
          patientName={getPatientName(selectedAppointment.patient_id)}
          appointmentId={selectedAppointment.appointment_id}
          onClose={() => { setShowTestOrdering(false); setSelectedAppointment(null); }}
          onTestOrdered={handleTestOrdered}
        />
      )}

      {showPrescription && selectedAppointment && (
        <PrescriptionWriter
          doctorId={doctorId}
          patientId={selectedAppointment.patient_id}
          patientName={getPatientName(selectedAppointment.patient_id)}
          appointmentId={selectedAppointment.appointment_id}
          orderedTests={orderedTests.filter(t => t.patient_id === selectedAppointment.patient_id)}
          testReports={testReports.filter(r => r.patient_id === selectedAppointment.patient_id)}
          onClose={() => { setShowPrescription(false); setSelectedAppointment(null); }}
          onPrescriptionCreated={handlePrescriptionCreated}
          onAppointmentCompleted={handleAppointmentCompleted}
        />
      )}
    </div>
  );
}