import { useState } from 'react';
import { prescriptionService } from '../../services/supabaseService';
import type { Prescription, Medication, Test, Report } from '../../types';

interface PrescriptionWriterProps {
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  orderedTests?: Test[];
  testReports?: Report[];
  onClose: () => void;
  onPrescriptionCreated: (prescription: Prescription) => void;
  onAppointmentCompleted?: (appointmentId: string) => void;
}

export function PrescriptionWriter({
  doctorId,
  patientId,
  patientName,
  appointmentId,
  orderedTests = [],
  testReports = [],
  onClose,
  onPrescriptionCreated,
  onAppointmentCompleted
}: PrescriptionWriterProps) {
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = async () => {
    const validMedications = medications.filter(m => m.name.trim() !== '');
    
    if (validMedications.length === 0 && !diagnosis.trim()) {
      alert('Please add at least one medication or diagnosis');
      return;
    }

    const prescription: Prescription = {
      prescription_id: `RX${Date.now()}`,
      appointment_id: appointmentId,
      doctor_id: doctorId,
      patient_id: patientId,
      date: new Date().toISOString().split('T')[0],
      diagnosis: diagnosis.trim() || 'General Consultation',
      medications: validMedications,
      instructions: instructions.trim() || '',
      follow_up_date: followUpDate || undefined
    };

    // Save to database
    try {
      const { error } = await prescriptionService.createPrescription(prescription);
      if (error) {
        console.error('Error saving prescription to database:', error);
        alert('Prescription saved locally but could not sync to database. Error: ' + error.message);
      } else {
        console.log('Prescription saved to database successfully');
      }
    } catch (err) {
      console.error('Exception saving prescription:', err);
      alert('Prescription saved locally but could not sync to database.');
    }

    onPrescriptionCreated(prescription);
    setPrescriptionSaved(true);
    setIsCompleting(true);
    
    // Show success message and auto-complete the appointment
    if (onAppointmentCompleted) {
      alert('Prescription saved! Marking appointment as completed...');
      setTimeout(() => {
        onAppointmentCompleted(appointmentId);
      }, 500);
    } else {
      alert('Prescription saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                📋 Write Prescription
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                Patient: {patientName}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Left Column - Prescription Form */}
            <div>
              {/* Diagnosis */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Diagnosis *
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis or symptoms..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Medications */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2d3748'
                  }}>
                    Medications
                  </label>
                  <button
                    onClick={addMedication}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#667eea',
                      background: 'white',
                      border: '1px solid #667eea',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Medicine
                  </button>
                </div>

                {medications.map((med, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      marginBottom: '12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>
                        Medicine #{index + 1}
                      </span>
                      {medications.length > 1 && (
                        <button
                          onClick={() => removeMedication(index)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            color: '#dc2626',
                            background: 'white',
                            border: '1px solid #dc2626',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      <input
                        type="text"
                        placeholder="Medicine name *"
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          fontSize: '14px',
                          color: '#1a202c',
                          border: '1px solid #cbd5e0',
                          borderRadius: '6px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          backgroundColor: 'white'
                        }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Dosage (e.g., 500mg)"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '14px',
                            color: '#1a202c',
                            border: '1px solid #cbd5e0',
                            borderRadius: '6px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            backgroundColor: 'white'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Frequency"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '14px',
                            color: '#1a202c',
                            border: '1px solid #cbd5e0',
                            borderRadius: '6px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            backgroundColor: 'white'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={med.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '14px',
                            color: '#1a202c',
                            border: '1px solid #cbd5e0',
                            borderRadius: '6px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            backgroundColor: 'white'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Additional Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Dietary advice, lifestyle recommendations, precautions..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Follow-up Date */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Follow-up Date (Optional)
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Right Column - Tests and Reports */}
            <div>
              {/* Ordered Tests */}
              {orderedTests.length > 0 && (
                <div style={{
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#92400e',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    🔬 Ordered Tests ({orderedTests.length})
                  </h3>
                  <div style={{ fontSize: '13px', color: '#92400e' }}>
                    {orderedTests.map((test, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px',
                          marginBottom: '6px',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{test.name}</span>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          backgroundColor: test.status === 'completed' ? '#d1fae5' : '#fef3c7',
                          color: test.status === 'completed' ? '#065f46' : '#92400e',
                          borderRadius: '12px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {test.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Reports */}
              {testReports.length > 0 && (
                <div style={{
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #10b981',
                  borderRadius: '8px'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#065f46',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    📊 Test Reports ({testReports.length})
                  </h3>
                  <div style={{ fontSize: '13px', color: '#065f46' }}>
                    {testReports.map((report, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          marginBottom: '8px',
                          backgroundColor: 'white',
                          borderRadius: '6px'
                        }}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          Report #{report.report_id}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '12px', marginBottom: '6px' }}>
                          <strong>Findings:</strong> {report.findings}
                        </div>
                        {report.recommendations && (
                          <div style={{ fontSize: '12px' }}>
                            <strong>Recommendations:</strong> {report.recommendations}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div style={{
                padding: '16px',
                backgroundColor: '#dbeafe',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#1e40af'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>💡 Tips:</div>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li>Include test reports in diagnosis notes</li>
                  <li>Specify medicine timing clearly</li>
                  <li>Add follow-up date if needed</li>
                  <li>Include dietary restrictions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f9fafb',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            disabled={isCompleting}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: isCompleting ? '#9ca3af' : '#4a5568',
              background: 'white',
              border: '1px solid #cbd5e0',
              borderRadius: '8px',
              cursor: isCompleting ? 'not-allowed' : 'pointer',
              opacity: isCompleting ? 0.5 : 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={prescriptionSaved || isCompleting}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              background: (prescriptionSaved || isCompleting) ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: (prescriptionSaved || isCompleting) ? 'not-allowed' : 'pointer',
              opacity: (prescriptionSaved || isCompleting) ? 0.6 : 1
            }}
          >
            💾 {isCompleting ? 'Completing...' : prescriptionSaved ? 'Prescription Saved ✓' : 'Save Prescription'}
          </button>
        </div>
      </div>
    </div>
  );
}
