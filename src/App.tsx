import { useState } from 'react';
import './App.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Dashboard } from './components/hospital/Dashboard';
import { PatientManagement } from './components/hospital/PatientManagement';
import { DoctorManagement } from './components/hospital/DoctorManagement';
import { FacilityManagement } from './components/hospital/FacilityManagement';
import { PaymentReports } from './components/hospital/PaymentReports';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { HospitalBrowse } from './components/booking/HospitalBrowse';
import { DoctorBooking } from './components/booking/DoctorBooking';
import { PaymentProcess } from './components/booking/PaymentProcess';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { DoctorInterface } from './components/doctor/DoctorInterface';
import { Button } from './components/ui/button';
import { mockPatients, mockDoctors } from './data/mockData';

interface UserSession {
  phone: string;
  role: string;
  name: string;
}

type BookingView = 'browse' | 'booking' | 'payment' | 'dashboard';
type AuthView = 'login' | 'register';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserSession | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [bookingView, setBookingView] = useState<BookingView>('browse');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [bookingData, setBookingData] = useState<any>(null);

  const handleLogin = (phone: string, role: string, name: string) => {
    setUser({ phone, role, name });
    setAuthView('login');
  };

  const handleRegister = (phone: string, role: string, name: string) => {
    setUser({ phone, role, name });
    setAuthView('login');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    setBookingView('browse');
    setAuthView('login');
  };

  const getUserId = () => {
    if (user?.role === 'patient') {
      return mockPatients.find(p => p.phone === user.phone)?.patient_id || 'P001';
    } else if (user?.role === 'doctor') {
      return mockDoctors.find(d => d.phone === user.phone)?.doctor_id || 'D001';
    }
    return '';
  };

  const handleSelectHospital = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    setBookingView('booking');
  };

  const handleBookingComplete = (data: any) => {
    setBookingData(data);
    setBookingView('payment');
  };

  const handlePaymentComplete = () => {
    setBookingView('dashboard');
    setBookingData(null);
  };

  // Show login or register if user is not authenticated
  if (!user) {
    if (authView === 'register') {
      return (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '28px', height: '28px' }}
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', lineHeight: '1.2' }}>
                Diagnostic-care
              </h1>
              <p style={{ fontSize: '13px', color: '#718096' }}>
                Comprehensive Healthcare Management
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', marginRight: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>{user.name}</p>
              <p style={{ fontSize: '12px', color: '#718096', textTransform: 'capitalize' }}>{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#667eea',
                background: 'white',
                border: '1px solid #667eea',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#667eea';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Patient Interface */}
        {user.role === 'patient' && (
          <>
            {bookingView === 'browse' && (
              <HospitalBrowse onSelectHospital={handleSelectHospital} />
            )}
            {bookingView === 'booking' && (
              <DoctorBooking
                hospitalId={selectedHospitalId}
                onBack={() => { setBookingView('browse'); setSelectedHospitalId(''); }}
                onBookingComplete={handleBookingComplete}
                patientId={getUserId()}
              />
            )}
            {bookingView === 'payment' && bookingData && (
              <PaymentProcess
                bookingData={bookingData}
                onPaymentComplete={handlePaymentComplete}
                onCancel={() => setBookingView('booking')}
              />
            )}
            {bookingView === 'dashboard' && (
              <PatientDashboard
                patientId={getUserId()}
                onBookNew={() => setBookingView('browse')}
              />
            )}
            
            {/* Patient Navigation */}
            <div className="fixed bottom-6 right-6 flex gap-2">
              {bookingView === 'dashboard' && (
                <Button onClick={() => setBookingView('browse')} size="lg">
                  🔍 Browse Hospitals
                </Button>
              )}
              {bookingView !== 'dashboard' && (
                <Button variant="outline" onClick={() => setBookingView('dashboard')} size="lg">
                  📊 My Dashboard
                </Button>
              )}
            </div>
          </>
        )}

        {/* Doctor Interface */}
        {user.role === 'doctor' && (
          <DoctorInterface doctorId={getUserId()} />
        )}

        {/* Admin Interface */}
        {user.role === 'admin' && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="facilities">Facilities & Tests</TabsTrigger>
              <TabsTrigger value="payments">Payments & Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>

            <TabsContent value="patients">
              <PatientManagement />
            </TabsContent>

            <TabsContent value="doctors">
              <DoctorManagement />
            </TabsContent>

            <TabsContent value="facilities">
              <FacilityManagement />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentReports />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
          © 2025 Hospital Management System. Based on ERD Schema.
        </div>
      </footer>
    </div>
  );
}

export default App;
