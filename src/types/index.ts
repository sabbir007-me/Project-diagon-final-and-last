// User entity
export interface User {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
}

// Hospital entity
export interface Hospital {
  hospital_id: string;
  name: string;
  address: string;
  contact_info: string;
  specializations: string[];
  rating: number;
  image?: string;
  description?: string;
}

// Patient entity
export interface Patient {
  patient_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  medicalHistory?: string;
}

// Doctor entity
export interface Doctor {
  doctor_id: string;
  user_id: string;
  hospital_id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  address: string;
  rating: number;
  experience: number;
  consultationFee: number;
  availableSlots?: string[];
  image?: string;
}

// Facility entity (Diagnostic Centers)
export interface Facility {
  fac_id: string;
  name: string;
  address: string;
  contact_info: string;
  specialized_in: string;
}

// Test entity
export interface Test {
  test_id: string;
  patient_id: string;
  facility_id: string;
  name: string;
  description: string;
  from_home: boolean;
  from_hospital: boolean;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Report entity
export interface Report {
  report_id: string;
  test_id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  findings: string;
  recommendations: string;
}

// Payment entity
export interface Payment {
  payment_id: string;
  patient_id: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'insurance';
  status: 'pending' | 'completed' | 'failed';
  coupon?: string;
}

// Prescription entity (from Doctor to Patient)
export interface Prescription {
  prescription_id: string;
  appointment_id?: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  diagnosis?: string;
  medications: Medication[];
  instructions: string;
  follow_up_date?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// Appointment/Booking entity
export interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'confirmed';
  type: 'in-person' | 'online';
  notes?: string;
  payment_status: 'pending' | 'completed';
  payment_id?: string;
}

// Rating entity (Patient rating Doctor)
export interface Rating {
  rating_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string;
  rating: number; // 1-5
  review: string;
  date: string;
}
