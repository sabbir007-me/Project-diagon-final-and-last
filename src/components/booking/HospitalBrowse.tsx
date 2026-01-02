import { useState } from 'react';
import { mockHospitals, mockDoctors } from '../../data/mockData';

interface HospitalBrowseProps {
  onSelectHospital: (hospitalId: string) => void;
}

export function HospitalBrowse({ onSelectHospital }: HospitalBrowseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');

  const allSpecializations = Array.from(
    new Set(mockHospitals.flatMap(h => h.specializations))
  );

  const filteredHospitals = mockHospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = !selectedSpecialization || 
                       hospital.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpec;
  });

  const getDoctorCount = (hospitalId: string) => {
    return mockDoctors.filter(d => d.hospital_id === hospitalId).length;
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
          Find Hospitals & Book Doctors
        </h2>
        <p style={{ fontSize: '16px', color: '#718096' }}>
          Browse hospitals and book appointments online
        </p>
      </div>

      {/* Search and Filter */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        <input
          type="text"
          placeholder="Search hospitals by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            color: '#1a202c',
            backgroundColor: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        />
        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            color: '#1a202c',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">All Specializations</option>
          {allSpecializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* Hospital Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
        gap: '24px'
      }}>
        {filteredHospitals.map((hospital) => (
          <div 
            key={hospital.hospital_id}
            style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
                  {hospital.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#718096' }}>
                  📍 {hospital.address}
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#d4f4dd',
                color: '#22543d',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ⭐ {hospital.rating}
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '16px', lineHeight: '1.6' }}>
              {hospital.description}
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '10px' }}>
                Specializations:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {hospital.specializations.map(spec => (
                  <span 
                    key={spec}
                    style={{
                      padding: '6px 12px',
                      background: '#ebf4ff',
                      color: '#2c5282',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '14px', color: '#718096' }}>
                <span style={{ fontWeight: '600', color: '#2d3748' }}>{getDoctorCount(hospital.hospital_id)}</span> Doctors Available
              </div>
              <button
                onClick={() => onSelectHospital(hospital.hospital_id)}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
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
                View Doctors →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '16px', color: '#718096' }}>No hospitals found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
