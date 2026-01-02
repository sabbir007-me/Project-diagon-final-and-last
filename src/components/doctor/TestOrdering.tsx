import { useState } from 'react';
import type { Test } from '../../types';

interface TestOrderingProps {
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  onClose: () => void;
  onTestOrdered: (test: Test) => void;
}

const commonTests = [
  { name: 'Complete Blood Count (CBC)', description: 'Blood test for overall health assessment', category: 'Blood Test' },
  { name: 'Blood Sugar Test (FBS)', description: 'Fasting blood sugar level measurement', category: 'Blood Test' },
  { name: 'Lipid Profile', description: 'Cholesterol and triglycerides test', category: 'Blood Test' },
  { name: 'Liver Function Test (LFT)', description: 'Assess liver health and function', category: 'Blood Test' },
  { name: 'Kidney Function Test (KFT)', description: 'Assess kidney health and function', category: 'Blood Test' },
  { name: 'Thyroid Function Test', description: 'TSH, T3, T4 levels', category: 'Blood Test' },
  { name: 'X-Ray Chest', description: 'Chest radiography', category: 'Imaging' },
  { name: 'ECG', description: 'Electrocardiogram for heart activity', category: 'Cardiac' },
  { name: 'Ultrasound Abdomen', description: 'Abdominal organ imaging', category: 'Imaging' },
  { name: 'CT Scan', description: 'Computed Tomography scan', category: 'Imaging' },
  { name: 'MRI', description: 'Magnetic Resonance Imaging', category: 'Imaging' },
  { name: 'Urine Routine Examination', description: 'Urine analysis', category: 'Urine Test' },
];

export function TestOrdering({ doctorId: _doctorId, patientId, patientName, appointmentId: _appointmentId, onClose, onTestOrdered }: TestOrderingProps) {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [customTest, setCustomTest] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [testLocation, setTestLocation] = useState<'hospital' | 'home' | 'both'>('hospital');
  const [instructions, setInstructions] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = commonTests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestToggle = (testName: string) => {
    setSelectedTests(prev =>
      prev.includes(testName)
        ? prev.filter(t => t !== testName)
        : [...prev, testName]
    );
  };

  const handleAddCustomTest = () => {
    if (customTest.trim()) {
      setSelectedTests(prev => [...prev, customTest.trim()]);
      setCustomTest('');
      setCustomDescription('');
    }
  };

  const handleSubmit = () => {
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    // Create test orders for each selected test
    selectedTests.forEach((testName, index) => {
      const test: Test = {
        test_id: `T${Date.now()}_${index}`,
        patient_id: patientId,
        facility_id: 'FAC001', // Default facility
        name: testName,
        description: commonTests.find(t => t.name === testName)?.description || customDescription || 'Custom test',
        from_home: testLocation === 'home' || testLocation === 'both',
        from_hospital: testLocation === 'hospital' || testLocation === 'both',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      onTestOrdered(test);
    });

    onClose();
  };

  const groupedTests = filteredTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, typeof filteredTests>);

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
        maxWidth: '900px',
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
                Order Diagnostic Tests
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
          {/* Search */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Selected Tests Count */}
          {selectedTests.length > 0 && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '20px',
              backgroundColor: '#dbeafe',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#1e40af'
            }}>
              {selectedTests.length} test(s) selected
            </div>
          )}

          {/* Test Location */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '12px'
            }}>
              Test Location
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { value: 'hospital', label: '🏥 Hospital/Lab', icon: '🏥' },
                { value: 'home', label: '🏠 Home Collection', icon: '🏠' },
                { value: 'both', label: '✓ Both Options', icon: '✓' }
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTestLocation(option.value as any)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: testLocation === option.value ? 'white' : '#4a5568',
                    background: testLocation === option.value
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#f7fafc',
                    border: testLocation === option.value ? 'none' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Common Tests by Category */}
          {Object.entries(groupedTests).map(([category, tests]) => (
            <div key={category} style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e2e8f0'
              }}>
                {category}
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {tests.map(test => (
                  <div
                    key={test.name}
                    onClick={() => handleTestToggle(test.name)}
                    style={{
                      padding: '16px',
                      border: selectedTests.includes(test.name) ? '2px solid #667eea' : '2px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedTests.includes(test.name) ? '#f0f4ff' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: selectedTests.includes(test.name) ? 'none' : '2px solid #cbd5e0',
                        backgroundColor: selectedTests.includes(test.name) ? '#667eea' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        {selectedTests.includes(test.name) && '✓'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a202c',
                          marginBottom: '4px'
                        }}>
                          {test.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>
                          {test.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Custom Test */}
          <div style={{
            padding: '20px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '1px solid #f59e0b',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#92400e',
              marginBottom: '12px'
            }}>
              Add Custom Test
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input
                type="text"
                placeholder="Test name"
                value={customTest}
                onChange={(e) => setCustomTest(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#1a202c',
                  border: '1px solid #d97706',
                  borderRadius: '6px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#1a202c',
                  border: '1px solid #d97706',
                  borderRadius: '6px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              />
              <button
                onClick={handleAddCustomTest}
                disabled={!customTest.trim()}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  background: customTest.trim() ? '#f59e0b' : '#9ca3af',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: customTest.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Add Custom Test
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              Special Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any special instructions for the patient..."
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
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#4a5568',
              background: 'white',
              border: '1px solid #cbd5e0',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedTests.length === 0}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              background: selectedTests.length > 0
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              cursor: selectedTests.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            Order {selectedTests.length} Test(s)
          </button>
        </div>
      </div>
    </div>
  );
}
