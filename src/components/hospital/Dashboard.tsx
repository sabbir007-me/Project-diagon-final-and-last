import { mockPatients, mockDoctors, mockAppointments, mockTests, mockPayments } from '../../data/mockData';

export function Dashboard() {
  const totalPatients = mockPatients.length;
  const totalDoctors = mockDoctors.length;
  const upcomingAppointments = mockAppointments.filter(apt => apt.status === 'scheduled').length;
  const pendingTests = mockTests.filter(test => test.status === 'pending').length;
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  
  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
            Hospital Management Dashboard
          </h2>
          <p style={{ fontSize: '14px', color: '#718096' }}>Overview of hospital operations</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Total Patients</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#3b82f6' }}>{totalPatients}</div>
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>Registered patients</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Total Doctors</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#10b981' }}>{totalDoctors}</div>
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>Active doctors</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Appointments</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#8b5cf6' }}>{upcomingAppointments}</div>
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>Upcoming appointments</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Pending Tests</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#f59e0b' }}>{pendingTests}</div>
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>Tests awaiting completion</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Revenue</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#10b981' }}>৳{totalRevenue.toFixed(2)}</div>
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>Total completed payments</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Pending Payments</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#ef4444' }}>{pendingPayments}</div>
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>Payments awaiting confirmation</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '4px' }}>Recent Appointments</h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>Latest scheduled appointments</p>
            </div>
            <div style={{ padding: '24px' }}>
              {mockAppointments.filter(apt => apt.status === 'scheduled').slice(0, 3).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mockAppointments.filter(apt => apt.status === 'scheduled').slice(0, 3).map((apt) => {
                    const patient = mockPatients.find(p => p.patient_id === apt.patient_id);
                    const doctor = mockDoctors.find(d => d.doctor_id === apt.doctor_id);
                    return (
                      <div key={apt.appointment_id} style={{ paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>{patient?.name}</p>
                        <p style={{ fontSize: '14px', color: '#718096' }}>
                          with {doctor?.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>
                          {apt.date} at {apt.time}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#718096', padding: '24px' }}>No upcoming appointments</p>
              )}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '4px' }}>Pending Tests</h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>Tests awaiting completion</p>
            </div>
            <div style={{ padding: '24px' }}>
              {mockTests.filter(test => test.status === 'pending').length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mockTests.filter(test => test.status === 'pending').map((test) => {
                    const patient = mockPatients.find(p => p.patient_id === test.patient_id);
                    return (
                      <div key={test.test_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>{test.name}</p>
                          <p style={{ fontSize: '14px', color: '#718096' }}>
                            {patient?.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>
                            Scheduled: {test.date}
                          </p>
                        </div>
                        <span style={{ fontSize: '12px', backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '12px', fontWeight: '500' }}>
                          {test.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#718096', padding: '24px' }}>No pending tests</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
