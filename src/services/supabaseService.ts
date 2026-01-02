import { supabase } from '../lib/supabase';
import type { 
  User, 
  Patient, 
  Doctor, 
  Hospital, 
  Appointment, 
  Prescription, 
  Payment,
  Report 
} from '../types';

// =====================
// Authentication
// =====================

export const authService = {
  // Login with phone and password
  async login(phone: string, password: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .eq('password_hash', password) // In production, use proper password hashing
        .maybeSingle();

      console.log('Login attempt:', { phone, password });
      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase login error:', error);
        // Fallback to mock data if database not set up
        return this.mockLogin(phone, password);
      }

      if (!data) {
        console.warn('No user found in database, trying mock login');
        return this.mockLogin(phone, password);
      }

      return { data, error: null };
    } catch (err) {
      console.error('Login exception:', err);
      return this.mockLogin(phone, password);
    }
  },

  // Temporary mock login for testing
  mockLogin(phone: string, password: string) {
    const mockUsers = [
      { user_id: 'U001', phone: '01711-123456', password_hash: 'patient123', name: 'Md. Kamal Hossain', email: 'kamal.hossain@gmail.com', role: 'patient' },
      { user_id: 'D001', phone: '01711-111111', password_hash: 'doctor123', name: 'Prof. Dr. Azizul Haque', email: 'azizul.haque@dmch.gov.bd', role: 'doctor' },
      { user_id: 'A001', phone: '01700-000000', password_hash: 'admin123', name: 'Admin Ashraful Islam', email: 'admin@healthbd.gov.bd', role: 'admin' },
    ];

    const user = mockUsers.find(u => u.phone === phone && u.password_hash === password);
    
    if (user) {
      console.log('Using mock login for:', user.name);
      return { data: user, error: null };
    }
    
    return { data: null, error: 'Invalid phone number or password' };
  },

  // Register a new user
  async register(user: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    return { data, error };
  },

  // Get current user
  async getCurrentUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  }
};

// =====================
// Hospitals
// =====================

export const hospitalService = {
  // Get all hospitals
  async getAllHospitals() {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('name');

    return { data, error };
  },

  // Get hospital by ID
  async getHospitalById(hospitalId: string) {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('hospital_id', hospitalId)
      .single();

    return { data, error };
  },

  // Search hospitals by specialization
  async searchBySpecialization(specialization: string) {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .contains('specializations', [specialization]);

    return { data, error };
  },

  // Create a new hospital (admin only)
  async createHospital(hospital: Partial<Hospital>) {
    const { data, error } = await supabase
      .from('hospitals')
      .insert([hospital])
      .select()
      .single();

    return { data, error };
  },

  // Update hospital
  async updateHospital(hospitalId: string, updates: Partial<Hospital>) {
    const { data, error } = await supabase
      .from('hospitals')
      .update(updates)
      .eq('hospital_id', hospitalId)
      .select()
      .single();

    return { data, error };
  }
};

// =====================
// Doctors
// =====================

export const doctorService = {
  // Get all doctors
  async getAllDoctors() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, users(name, email, phone), hospitals(name, location)')
      .order('name');

    return { data, error };
  },

  // Get doctors by hospital
  async getDoctorsByHospital(hospitalId: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, users(name, email, phone)')
      .eq('hospital_id', hospitalId);

    return { data, error };
  },

  // Get doctors by specialization
  async getDoctorsBySpecialization(specialization: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, users(name, email, phone), hospitals(name, location)')
      .eq('specialization', specialization);

    return { data, error };
  },

  // Get doctor by ID
  async getDoctorById(doctorId: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, users(name, email, phone), hospitals(name, location)')
      .eq('doctor_id', doctorId)
      .single();

    return { data, error };
  },

  // Update doctor
  async updateDoctor(doctorId: string, updates: Partial<Doctor>) {
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('doctor_id', doctorId)
      .select()
      .single();

    return { data, error };
  }
};

// =====================
// Patients
// =====================

export const patientService = {
  // Get patient by ID
  async getPatientById(patientId: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*, users(name, email, phone)')
      .eq('patient_id', patientId)
      .single();

    return { data, error };
  },

  // Get patient by user ID
  async getPatientByUserId(userId: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  },

  // Create patient profile
  async createPatient(patient: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();

    return { data, error };
  },

  // Update patient
  async updatePatient(patientId: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('patient_id', patientId)
      .select()
      .single();

    return { data, error };
  }
};

// =====================
// Appointments
// =====================

export const appointmentService = {
  // Get all appointments for a patient
  async getPatientAppointments(patientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctors!inner (
          doctor_id,
          specialization,
          qualification,
          experience_years,
          consultation_fee,
          rating,
          users!inner (
            user_id,
            name,
            email,
            phone
          )
        ),
        hospitals (
          hospital_id,
          name,
          location
        )
      `)
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    return { data, error };
  },

  // Get all appointments for a doctor
  async getDoctorAppointments(doctorId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(*, users(name, phone))')
      .eq('doctor_id', doctorId)
      .order('date', { ascending: false });

    return { data, error };
  },

  // Create a new appointment
  async createAppointment(appointment: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single();

    return { data, error };
  },

  // Update appointment status
  async updateAppointment(appointmentId: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('appointment_id', appointmentId)
      .select()
      .single();

    return { data, error };
  },

  // Cancel appointment
  async cancelAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('appointment_id', appointmentId)
      .select()
      .single();

    return { data, error };
  }
};

// =====================
// Prescriptions
// =====================

export const prescriptionService = {
  // Get prescriptions for a patient
  async getPatientPrescriptions(patientId: string) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    return { data, error };
  },

  // Create a prescription
  async createPrescription(prescription: Partial<Prescription>) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([prescription])
      .select()
      .single();

    return { data, error };
  },

  // Get prescription by ID
  async getPrescriptionById(prescriptionId: string) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, doctors(*, users(name)), patients(*, users(name, phone))')
      .eq('prescription_id', prescriptionId)
      .single();

    return { data, error };
  }
};

// =====================
// Test Reports
// =====================

export const testReportService = {
  // Get test reports for a patient
  async getPatientTestReports(patientId: string) {
    const { data, error } = await supabase
      .from('test_reports')
      .select('*, tests(*), doctors(*, users(name))')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    return { data, error };
  },

  // Create a test report
  async createTestReport(report: Partial<Report>) {
    const { data, error } = await supabase
      .from('test_reports')
      .insert([report])
      .select()
      .single();

    return { data, error };
  },

  // Get all available tests
  async getAllTests() {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('test_name');

    return { data, error };
  }
};

// =====================
// Payments
// =====================

export const paymentService = {
  // Get payments for a patient
  async getPatientPayments(patientId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*, appointments(*, doctors(*, users(name)))')
      .eq('patient_id', patientId)
      .order('payment_date', { ascending: false });

    return { data, error };
  },

  // Create a payment
  async createPayment(payment: Partial<Payment>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();

    return { data, error };
  },

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: 'pending' | 'completed' | 'failed' | 'refunded') {
    const { data, error } = await supabase
      .from('payments')
      .update({ payment_status: status })
      .eq('payment_id', paymentId)
      .select()
      .single();

    return { data, error };
  },

  // Get all payments (admin)
  async getAllPayments() {
    const { data, error } = await supabase
      .from('payments')
      .select('*, appointments(*, patients(*, users(name)), doctors(*, users(name)))')
      .order('payment_date', { ascending: false });

    return { data, error };
  }
};

// =====================
// Dashboard Statistics
// =====================

export const dashboardService = {
  // Get patient dashboard stats
  async getPatientStats(patientId: string) {
    const [appointments, prescriptions, reports, payments] = await Promise.all([
      appointmentService.getPatientAppointments(patientId),
      prescriptionService.getPatientPrescriptions(patientId),
      testReportService.getPatientTestReports(patientId),
      paymentService.getPatientPayments(patientId)
    ]);

    return {
      totalAppointments: appointments.data?.length || 0,
      upcomingAppointments: appointments.data?.filter(a => a.status === 'scheduled').length || 0,
      totalPrescriptions: prescriptions.data?.length || 0,
      totalReports: reports.data?.length || 0,
      totalPayments: payments.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
    };
  },

  // Get doctor dashboard stats
  async getDoctorStats(doctorId: string) {
    const { data: appointments } = await appointmentService.getDoctorAppointments(doctorId);
    
    return {
      totalAppointments: appointments?.length || 0,
      todayAppointments: appointments?.filter(a => 
        new Date(a.date).toDateString() === new Date().toDateString()
      ).length || 0,
      pendingAppointments: appointments?.filter(a => a.status === 'scheduled').length || 0
    };
  },

  // Get admin dashboard stats
  async getAdminStats() {
    const [hospitals, doctors, patients, appointments, payments] = await Promise.all([
      supabase.from('hospitals').select('*', { count: 'exact', head: true }),
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('payments').select('amount')
    ]);

    return {
      totalHospitals: hospitals.count || 0,
      totalDoctors: doctors.count || 0,
      totalPatients: patients.count || 0,
      totalAppointments: appointments.count || 0,
      totalRevenue: payments.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
    };
  }
};
