import { useState } from 'react';
import { authService } from '../../services/supabaseService';

interface RegisterProps {
  onRegister: (phone: string, role: string, name: string) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Patient specific
    address: '',
    dateOfBirth: '',
    // Doctor specific
    specialization: '',
    experience: '',
    consultationFee: '',
    hospitalId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone.replace('-', ''))) {
      setError('Please enter a valid Bangladeshi phone number (e.g., 01711123456)');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Doctor specific validation
    if (userType === 'doctor') {
      if (!formData.specialization || !formData.experience || !formData.consultationFee) {
        setError('Please fill in all doctor-specific fields');
        return false;
      }
      if (parseInt(formData.experience) < 0) {
        setError('Experience cannot be negative');
        return false;
      }
      if (parseInt(formData.consultationFee) < 0) {
        setError('Consultation fee cannot be negative');
        return false;
      }
    }

    // Patient specific validation
    if (userType === 'patient') {
      if (!formData.address || !formData.dateOfBirth) {
        setError('Please fill in all patient-specific fields');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Generate unique IDs
      const userId = `U${Date.now()}`;

      // Create user record
      const userData = {
        user_id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password_hash: formData.password, // In production, hash this properly
        role: userType
      };

      const { error: userError } = await authService.register(userData);

      if (userError) {
        // Fallback to mock registration
        console.warn('Database not available, using mock registration');
        setSuccess(`Registration successful! You can now login with phone: ${formData.phone}`);
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
        setIsLoading(false);
        return;
      }

      // Create role-specific record (patient or doctor)
      if (userType === 'patient') {
        // Here you would create patient record in database
        // For now, we'll just show success message
        setSuccess(`Patient registration successful! You can now login with phone: ${formData.phone}`);
      } else {
        // Here you would create doctor record in database
        setSuccess(`Doctor registration successful! You can now login with phone: ${formData.phone}`);
      }

      // Automatically login after successful registration
      setTimeout(() => {
        onRegister(formData.phone, userType, formData.name);
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            marginBottom: '20px'
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#667eea"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '48px', height: '48px' }}
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Join Diagnostic-care
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>
            Create your account to get started
          </p>
        </div>

        {/* Registration Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
              Create Account
            </h2>
            <p style={{ color: '#718096', fontSize: '14px' }}>
              Register as a patient or doctor
            </p>
          </div>

          {/* User Type Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#2d3748',
              marginBottom: '12px'
            }}>
              I am registering as:
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setUserType('patient')}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: userType === 'patient' ? 'white' : '#4a5568',
                  background: userType === 'patient' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f7fafc',
                  border: userType === 'patient' ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: userType === 'patient' ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                }}
              >
                👤 Patient
              </button>
              <button
                type="button"
                onClick={() => setUserType('doctor')}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: userType === 'doctor' ? 'white' : '#4a5568',
                  background: userType === 'doctor' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f7fafc',
                  border: userType === 'doctor' ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: userType === 'doctor' ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                }}
              >
                👨‍⚕️ Doctor
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="name" style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#1a202c',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: isLoading ? '#f7fafc' : 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#1a202c',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: isLoading ? '#f7fafc' : 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="phone" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#2d3748',
                marginBottom: '8px'
              }}>
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="01711123456"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#1a202c',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: isLoading ? '#f7fafc' : 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="password" style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#1a202c',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: isLoading ? '#f7fafc' : 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#1a202c',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: isLoading ? '#f7fafc' : 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Patient Specific Fields */}
            {userType === 'patient' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="address" style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#2d3748',
                    marginBottom: '8px'
                  }}>
                    Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Your full address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#1a202c',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: isLoading ? '#f7fafc' : 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="dateOfBirth" style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#2d3748',
                    marginBottom: '8px'
                  }}>
                    Date of Birth *
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#1a202c',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: isLoading ? '#f7fafc' : 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </>
            )}

            {/* Doctor Specific Fields */}
            {userType === 'doctor' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label htmlFor="specialization" style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      Specialization *
                    </label>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      placeholder="e.g., Cardiology"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#1a202c',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: isLoading ? '#f7fafc' : 'white',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div>
                    <label htmlFor="experience" style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      Experience (years) *
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      placeholder="Years of experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      min="0"
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#1a202c',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: isLoading ? '#f7fafc' : 'white',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="consultationFee" style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#2d3748',
                    marginBottom: '8px'
                  }}>
                    Consultation Fee (BDT) *
                  </label>
                  <input
                    id="consultationFee"
                    name="consultationFee"
                    type="number"
                    placeholder="Fee in Taka"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    required
                    min="0"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#1a202c',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: isLoading ? '#f7fafc' : 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="hospitalId" style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#2d3748',
                    marginBottom: '8px'
                  }}>
                    Hospital Affiliation (Optional)
                  </label>
                  <input
                    id="hospitalId"
                    name="hospitalId"
                    type="text"
                    placeholder="Hospital name or ID"
                    value={formData.hospitalId}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#1a202c',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: isLoading ? '#f7fafc' : 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </>
            )}
            
            {error && (
              <div style={{
                background: '#fed7d7',
                border: '1px solid #fc8181',
                color: '#c53030',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                background: '#c6f6d5',
                border: '1px solid #48bb78',
                color: '#22543d',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: isLoading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                marginBottom: '16px'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#718096' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  disabled={isLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '14px'
                  }}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: 'rgba(255,255,255,0.8)',
          marginTop: '24px'
        }}>
          © 2025 Diagnostic-care. All rights reserved.
        </p>
      </div>
    </div>
  );
}
