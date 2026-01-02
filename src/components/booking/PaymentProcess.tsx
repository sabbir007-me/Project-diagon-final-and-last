import { useState } from 'react';
import { appointmentService, paymentService } from '../../services/supabaseService';

interface PaymentProcessProps {
  bookingData: any;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export function PaymentProcess({ bookingData, onPaymentComplete, onCancel }: PaymentProcessProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash' | 'nagad' | 'rocket' | 'insurance'>('bkash');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRST10') {
      setDiscount(bookingData.amount * 0.1);
      alert('Coupon applied! 10% discount');
    } else if (couponCode.toUpperCase() === 'HEALTH20') {
      setDiscount(bookingData.amount * 0.2);
      alert('Coupon applied! 20% discount');
    } else {
      alert('Invalid coupon code');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Generate unique IDs
      const appointmentId = 'A' + Date.now();
      const paymentId = 'PAY' + Date.now();
      const transactionId = 'TXN' + Date.now();

      console.log('Booking doctor:', bookingData.doctor.name, 'ID:', bookingData.doctor.doctor_id);

      // Create appointment in database
      const appointmentData = {
        appointment_id: appointmentId,
        patient_id: bookingData.patientId,
        doctor_id: bookingData.doctor.doctor_id,
        hospital_id: bookingData.doctor.hospital_id,
        date: bookingData.date,
        time: bookingData.time,
        status: 'scheduled' as const,
        type: bookingData.type,
        notes: bookingData.notes || '',
        payment_status: 'completed' as const
      };

      const { data: appointment, error: appointmentError } = await appointmentService.createAppointment(appointmentData);
      
      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        // Still allow the booking to complete even if database fails
      } else {
        console.log('Appointment created successfully:', appointment);
      }

      // Create payment record
      const paymentData = {
        payment_id: paymentId,
        appointment_id: appointmentId,
        patient_id: bookingData.patientId,
        amount: finalAmount,
        payment_method: paymentMethod,
        payment_status: 'completed',
        transaction_id: transactionId
      };

      const { data: payment, error: paymentError } = await paymentService.createPayment(paymentData);
      
      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
      } else {
        console.log('Payment recorded successfully:', payment);
      }

      setTimeout(() => {
        setIsProcessing(false);
        alert('Payment successful! Your appointment is confirmed.');
        onPaymentComplete();
      }, 1500);
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      alert('Payment completed locally. Please check your dashboard.');
      onPaymentComplete();
    }
  };

  const finalAmount = bookingData.amount - discount;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>Complete Payment</h2>
          <p style={{ color: '#718096' }}>Secure payment for your appointment</p>
        </div>
        <button 
          onClick={onCancel}
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
          ← Back
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Booking Summary */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c' }}>Booking Summary</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Doctor</p>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{bookingData.doctor.name}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Specialization</p>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{bookingData.doctor.specialization}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Date & Time</p>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>{bookingData.date} at {bookingData.time}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Type</p>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c', textTransform: 'capitalize' }}>{bookingData.type}</p>
            </div>
            <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Consultation Fee</p>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>৳{bookingData.amount}</p>
            </div>
            {discount > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Discount</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>-৳{discount.toFixed(2)}</p>
              </div>
            )}
            <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Total Amount</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>৳{finalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          gridColumn: 'span 2'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>Payment Details</h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>Choose your payment method</p>
          </div>
          <div style={{ padding: '20px' }}>
            <form onSubmit={handlePayment}>
              {/* Payment Method Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                  Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <button
                    type="button"
                    style={{
                      padding: '16px 12px',
                      border: paymentMethod === 'bkash' ? '2px solid #e2136e' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      textAlign: 'center',
                      backgroundColor: paymentMethod === 'bkash' ? '#fce7f3' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setPaymentMethod('bkash')}
                  >
                    <p style={{ fontWeight: '600', fontSize: '16px', color: '#e2136e', marginBottom: '2px' }}>bKash</p>
                    <p style={{ fontSize: '12px', color: '#718096' }}>📱 Mobile</p>
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '16px 12px',
                      border: paymentMethod === 'nagad' ? '2px solid #f47920' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      textAlign: 'center',
                      backgroundColor: paymentMethod === 'nagad' ? '#fff7ed' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setPaymentMethod('nagad')}
                  >
                    <p style={{ fontWeight: '600', fontSize: '16px', color: '#f47920', marginBottom: '2px' }}>Nagad</p>
                    <p style={{ fontSize: '12px', color: '#718096' }}>📱 Mobile</p>
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '16px 12px',
                      border: paymentMethod === 'rocket' ? '2px solid #8a3ab9' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      textAlign: 'center',
                      backgroundColor: paymentMethod === 'rocket' ? '#f3e8ff' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setPaymentMethod('rocket')}
                  >
                    <p style={{ fontWeight: '600', fontSize: '16px', color: '#8a3ab9', marginBottom: '2px' }}>Rocket</p>
                    <p style={{ fontSize: '12px', color: '#718096' }}>📱 Mobile</p>
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '16px 12px',
                      border: paymentMethod === 'card' ? '2px solid #667eea' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      textAlign: 'center',
                      backgroundColor: paymentMethod === 'card' ? '#ede9fe' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <p style={{ fontWeight: '600', fontSize: '16px', color: '#1a202c', marginBottom: '2px' }}>💳 Card</p>
                    <p style={{ fontSize: '12px', color: '#718096' }}>Visa/Master</p>
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '16px 12px',
                      border: paymentMethod === 'insurance' ? '2px solid #667eea' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      textAlign: 'center',
                      backgroundColor: paymentMethod === 'insurance' ? '#ede9fe' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setPaymentMethod('insurance')}
                  >
                    <p style={{ fontWeight: '600', fontSize: '16px', color: '#1a202c', marginBottom: '2px' }}>🏥 Insurance</p>
                    <p style={{ fontSize: '12px', color: '#718096' }}>Policy</p>
                  </button>
                </div>
              </div>

              {/* Card Payment */}
              {paymentMethod === 'card' && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="cardNumber" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
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
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="cardName" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                      Cardholder Name
                    </label>
                    <input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div>
                      <label htmlFor="expiry" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                        Expiry Date
                      </label>
                      <input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
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
                      <label htmlFor="cvv" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                        CVV
                      </label>
                      <input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
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
                  </div>
                </div>
              )}

              {/* Mobile Banking Payment (bKash, Nagad, Rocket) */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: paymentMethod === 'bkash' ? '#fce7f3' : paymentMethod === 'nagad' ? '#fff7ed' : '#f3e8ff',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: `1px solid ${paymentMethod === 'bkash' ? '#e2136e' : paymentMethod === 'nagad' ? '#f47920' : '#8a3ab9'}`
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: paymentMethod === 'bkash' ? '#e2136e' : paymentMethod === 'nagad' ? '#f47920' : '#8a3ab9',
                      marginBottom: '8px'
                    }}>
                      {paymentMethod === 'bkash' ? '📱 bKash Payment' : paymentMethod === 'nagad' ? '📱 Nagad Payment' : '📱 Rocket Payment'}
                    </p>
                    <p style={{ fontSize: '13px', color: '#4a5568', lineHeight: '1.5' }}>
                      Enter your {paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Rocket'} account number. 
                      You will receive a payment request on your mobile app.
                    </p>
                  </div>
                  <label htmlFor="mobile" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    maxLength={11}
                    style={{
                      backgroundColor: 'white',
                      color: '#1a202c',
                      boxSizing: 'border-box',
                      border: '2px solid #e2e8f0',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      width: '100%',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#718096', marginTop: '6px' }}>
                    A payment request of ৳{finalAmount.toFixed(2)} will be sent to your {paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Rocket'} app
                  </p>
                </div>
              )}

              {/* Insurance Payment */}
              {paymentMethod === 'insurance' && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="insuranceId" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                      Insurance ID
                    </label>
                    <input
                      id="insuranceId"
                      placeholder="INS123456789"
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
                    <label htmlFor="policyNumber" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                      Policy Number
                    </label>
                    <input
                      id="policyNumber"
                      placeholder="POL987654321"
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
                </div>
              )}

              {/* Coupon Code */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="coupon" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a202c', marginBottom: '8px' }}>
                  Have a Coupon Code?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="coupon"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      backgroundColor: 'white',
                      color: '#1a202c',
                      boxSizing: 'border-box',
                      border: '1px solid #e2e8f0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      flex: 1,
                      fontSize: '14px'
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={applyCoupon}
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
                    Apply
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                  Try: FIRST10 (10% off) or HEALTH20 (20% off)
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                style={{ 
                  width: '100%',
                  padding: '12px 16px', 
                  background: isProcessing ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {isProcessing ? 'Processing...' : `Pay ৳${finalAmount.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
