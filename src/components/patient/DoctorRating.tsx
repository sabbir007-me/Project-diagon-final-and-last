import { useState, useEffect } from 'react';
import { mockAppointments, mockDoctors, mockRatings, mockHospitals } from '../../data/mockData';
import type { Rating } from '../../types';

interface DoctorRatingProps {
  patientId: string;
}

const STORAGE_KEY = 'patient_doctor_ratings';

export function DoctorRating({ patientId }: DoctorRatingProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load ratings from localStorage on mount
  useEffect(() => {
    const storedRatings = localStorage.getItem(STORAGE_KEY);
    if (storedRatings) {
      try {
        const allRatings = JSON.parse(storedRatings) as Rating[];
        const patientRatings = allRatings.filter(r => r.patient_id === patientId);
        setRatings(patientRatings);
      } catch (error) {
        console.error('Error loading ratings:', error);
        // Fall back to mock ratings
        const patientRatings = mockRatings.filter(r => r.patient_id === patientId);
        setRatings(patientRatings);
      }
    } else {
      // Initialize with mock ratings
      const patientRatings = mockRatings.filter(r => r.patient_id === patientId);
      setRatings(patientRatings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRatings));
    }
  }, [patientId]);

  // Save ratings to localStorage whenever they change
  const saveRatings = (newRatings: Rating[]) => {
    try {
      const storedRatings = localStorage.getItem(STORAGE_KEY);
      let allRatings: Rating[] = [];
      
      if (storedRatings) {
        allRatings = JSON.parse(storedRatings);
        // Remove old ratings for this patient
        allRatings = allRatings.filter(r => r.patient_id !== patientId);
      }
      
      // Add new ratings
      allRatings = [...allRatings, ...newRatings];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRatings));
    } catch (error) {
      console.error('Error saving ratings:', error);
    }
  };

  // Get completed appointments that haven't been rated
  const completedAppointments = mockAppointments.filter(
    apt => apt.patient_id === patientId && apt.status === 'completed'
  );

  const unratedAppointments = completedAppointments.filter(
    apt => !ratings.some(r => r.appointment_id === apt.appointment_id)
  );

  const getDoctorName = (doctorId: string) => {
    return mockDoctors.find(d => d.doctor_id === doctorId)?.name || 'Unknown Doctor';
  };

  const getDoctor = (doctorId: string) => {
    return mockDoctors.find(d => d.doctor_id === doctorId);
  };

  const getHospitalName = (hospitalId: string) => {
    return mockHospitals.find(h => h.hospital_id === hospitalId)?.name || 'Unknown Hospital';
  };

  const handleSubmitRating = () => {
    // Clear previous error
    setErrorMessage('');

    // Validation
    if (!selectedAppointment) {
      setErrorMessage('Please select an appointment');
      return;
    }

    if (rating === 0) {
      setErrorMessage('Please provide a rating (1-5 stars)');
      return;
    }

    const appointment = completedAppointments.find(a => a.appointment_id === selectedAppointment);
    if (!appointment) {
      setErrorMessage('Invalid appointment selected');
      return;
    }

    // Create new rating
    const newRating: Rating = {
      rating_id: `R${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      patient_id: patientId,
      doctor_id: appointment.doctor_id,
      appointment_id: selectedAppointment,
      rating: rating,
      review: review.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    // Update state and save to localStorage
    const updatedRatings = [...ratings, newRating];
    setRatings(updatedRatings);
    saveRatings(updatedRatings);

    // Reset form
    setSelectedAppointment('');
    setRating(0);
    setReview('');
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteRating = (ratingId: string) => {
    if (confirm('Are you sure you want to delete this rating?')) {
      const updatedRatings = ratings.filter(r => r.rating_id !== ratingId);
      setRatings(updatedRatings);
      saveRatings(updatedRatings);
    }
  };

  const renderStars = (value: number, isInteractive: boolean = false) => {
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={isInteractive ? () => setRating(star) : undefined}
            onMouseEnter={isInteractive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={isInteractive ? () => setHoveredRating(0) : undefined}
            style={{
              fontSize: isInteractive ? '32px' : '24px',
              cursor: isInteractive ? 'pointer' : 'default',
              color: star <= (isInteractive ? (hoveredRating || rating) : value) ? '#fbbf24' : '#d1d5db',
              transition: 'color 0.2s, transform 0.2s',
              transform: isInteractive && hoveredRating === star ? 'scale(1.2)' : 'scale(1)',
              userSelect: 'none'
            }}
          >
            ★
          </span>
        ))}
        {isInteractive && rating > 0 && (
          <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
            {rating}/5
          </span>
        )}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[rating] || '';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
          Rate Your Doctors
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Share your experience to help other patients make informed decisions
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#d1fae5',
          border: '1px solid #34d399',
          borderRadius: '12px',
          marginBottom: '24px',
          color: '#065f46',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>✓</span>
          <span>Rating submitted successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          marginBottom: '24px',
          color: '#991b1b',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Rating Form */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
          Submit a New Rating
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
          Rate doctors from your completed appointments
        </p>

        {unratedAppointments.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
            <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
              No completed appointments available to rate.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '8px' }}>
              Complete an appointment first to leave a review.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                Select Appointment <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={selectedAppointment}
                onChange={(e) => {
                  setSelectedAppointment(e.target.value);
                  setErrorMessage('');
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: `2px solid ${selectedAppointment ? '#667eea' : '#d1d5db'}`,
                  fontSize: '14px',
                  color: '#1a202c',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
              >
                <option value="">Choose an appointment...</option>
                {unratedAppointments.map(apt => {
                  const doctor = getDoctor(apt.doctor_id);
                  const hospital = getHospitalName(apt.hospital_id);
                  return (
                    <option key={apt.appointment_id} value={apt.appointment_id}>
                      Dr. {getDoctorName(apt.doctor_id)} ({doctor?.specialization}) - {hospital} - {apt.date} at {apt.time}
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                Your Rating <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {renderStars(rating, true)}
                {rating > 0 && (
                  <p style={{ fontSize: '13px', color: '#667eea', fontWeight: '600', marginTop: '4px' }}>
                    {getRatingText(rating)}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                Your Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this doctor... What did you like? How was the treatment?"
                rows={5}
                maxLength={500}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #d1d5db',
                  fontSize: '14px',
                  color: '#1a202c',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Help others by sharing details about your experience
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {review.length}/500
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSubmitRating}
                disabled={!selectedAppointment || rating === 0}
                style={{
                  padding: '14px 36px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  background: (!selectedAppointment || rating === 0) 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: (!selectedAppointment || rating === 0) ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: (!selectedAppointment || rating === 0) ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (selectedAppointment && rating > 0) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = (!selectedAppointment || rating === 0) 
                    ? 'none' 
                    : '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
              >
                Submit Rating
              </button>
              {(selectedAppointment || rating > 0 || review) && (
                <button
                  onClick={() => {
                    setSelectedAppointment('');
                    setRating(0);
                    setReview('');
                    setErrorMessage('');
                  }}
                  style={{
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#6b7280',
                    background: 'white',
                    border: '2px solid #d1d5db',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  Clear Form
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* My Ratings */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#374151' }}>
            My Submitted Ratings
          </h3>
          <span style={{
            padding: '6px 16px',
            backgroundColor: '#667eea',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {ratings.length} {ratings.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>

        {ratings.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '2px dashed #d1d5db',
            padding: '64px 48px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>⭐</div>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No ratings yet</p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>
              Your submitted ratings will appear here
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {ratings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((r) => {
              const appointment = completedAppointments.find(a => a.appointment_id === r.appointment_id);
              const doctor = getDoctor(r.doctor_id);
              const hospital = appointment ? getHospitalName(appointment.hospital_id) : '';
              
              return (
                <div
                  key={r.rating_id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '28px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteRating(r.rating_id)}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#ef4444',
                      background: '#fee2e2',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                  >
                    Delete
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingRight: '80px' }}>
                    <div>
                      <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '6px' }}>
                        Dr. {getDoctorName(r.doctor_id)}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                        {doctor?.specialization}
                      </p>
                      <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                        {hospital} • {appointment?.date} at {appointment?.time}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {renderStars(r.rating)}
                      <p style={{ fontSize: '13px', color: '#667eea', fontWeight: '600', marginTop: '6px' }}>
                        {getRatingText(r.rating)}
                      </p>
                    </div>
                  </div>

                  {r.review && (
                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: '4px solid #667eea'
                    }}>
                      <p style={{
                        color: '#374151',
                        fontSize: '14px',
                        lineHeight: '1.7',
                        fontStyle: 'italic'
                      }}>
                        "{r.review}"
                      </p>
                    </div>
                  )}

                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                      Reviewed on {new Date(r.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div style={{
                      padding: '4px 12px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      Appointment ID: {r.appointment_id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
