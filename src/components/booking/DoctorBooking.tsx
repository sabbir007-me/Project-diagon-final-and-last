import { useState } from 'react';
import { mockDoctors, mockHospitals } from '../../data/mockData';
import type { Doctor } from '../../types';

interface DoctorBookingProps {
  hospitalId?: string;
  onBack: () => void;
  onBookingComplete: (bookingData: any) => void;
  patientId: string;
}

export function DoctorBooking({ hospitalId, onBack, onBookingComplete, patientId }: DoctorBookingProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'online'>('in-person');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const doctors = hospitalId 
    ? mockDoctors.filter(d => d.hospital_id === hospitalId)
    : mockDoctors;

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHospitalName = (hId: string) => {
    return mockHospitals.find(h => h.hospital_id === hId)?.name || '';
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please select doctor, date and time');
      return;
    }

    const bookingData = {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      notes: notes,
      amount: selectedDoctor.consultationFee,
      patientId: patientId,
    };

    onBookingComplete(bookingData);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>Book an Appointment</h2>
          <p style={{ color: '#718096' }}>
            {hospitalId ? `Doctors at ${getHospitalName(hospitalId)}` : 'All Available Doctors'}
          </p>
        </div>
        <button 
          onClick={onBack}
          style={{ 
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
          {hospitalId ? '← Back to Hospitals' : '← Back'}
        </button>
      </div>

      {!selectedDoctor ? (
        <>
          {/* Search */}
          <input
            placeholder="Search by doctor name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: 'white',
              color: '#1a202c',
              boxSizing: 'border-box',
              border: '1px solid #e2e8f0',
              padding: '8px 12px',
              borderRadius: '8px',
              width: '100%',
              marginBottom: '24px',
              fontSize: '14px'
            }}
          />

          {/* Doctor List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredDoctors.map((doctor) => (
              <div 
                key={doctor.doctor_id} 
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>{doctor.name}</h3>
                      <p style={{ fontSize: '14px', color: '#718096' }}>{doctor.specialization}</p>
                    </div>
                    <span style={{ 
                      fontSize: '12px', 
                      backgroundColor: '#fef3c7', 
                      color: '#92400e', 
                      padding: '4px 8px', 
                      borderRadius: '4px' 
                    }}>
                      ⭐ {doctor.rating}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Experience</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{doctor.experience} years</p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Hospital</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{getHospitalName(doctor.hospital_id)}</p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Consultation Fee</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>৳{doctor.consultationFee}</p>
                  </div>
                </div>
                <div style={{ padding: '20px', paddingTop: '0' }}>
                  <button 
                    onClick={() => setSelectedDoctor(doctor)}
                    style={{ 
                      width: '100%',
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
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Booking Form */
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>
              Book Appointment with {selectedDoctor.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              {selectedDoctor.specialization} • {getHospitalName(selectedDoctor.hospital_id)}
            </p>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Experience</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{selectedDoctor.experience} years</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Rating</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>⭐ {selectedDoctor.rating}/5.0</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Consultation Fee</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>৳{selectedDoctor.consultationFee}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Contact</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{selectedDoctor.phone}</p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                Appointment Type
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="in-person"
                    checked={appointmentType === 'in-person'}
                    onChange={(e) => setAppointmentType(e.target.value as 'in-person')}
                  />
                  <span style={{ fontSize: '14px', color: '#1a202c' }}>In-Person Visit</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="online"
                    checked={appointmentType === 'online'}
                    onChange={(e) => setAppointmentType(e.target.value as 'online')}
                  />
                  <span style={{ fontSize: '14px', color: '#1a202c' }}>Online Consultation</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="date" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                  Select Date
                </label>
                <input
                  id="date"
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
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
                <label htmlFor="time" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                  Select Time
                </label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
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
                >
                  <option value="">Choose time slot</option>
                  {selectedDoctor.availableSlots?.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="notes" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                placeholder="Describe your symptoms or reason for visit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  backgroundColor: 'white',
                  color: '#1a202c',
                  boxSizing: 'border-box',
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  borderRadius: '8px',
                  width: '100%',
                  minHeight: '80px',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', paddingTop: '16px' }}>
              <button 
                onClick={() => setSelectedDoctor(null)}
                style={{ 
                  flex: 1,
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
                Cancel
              </button>
              <button 
                onClick={handleBookAppointment}
                style={{ 
                  flex: 1,
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
                Proceed to Payment (৳{selectedDoctor.consultationFee})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
