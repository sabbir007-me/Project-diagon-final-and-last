-- Database Update Script for Hospital Management & Doctor Booking Platform
-- Run this SQL in your Supabase SQL Editor to update your existing database
-- This script updates existing data to match Bangladesh localization

-- =====================================================
-- STEP 1: Update CHECK constraints to allow new values
-- =====================================================

-- Drop and recreate payment_method constraint to allow Bangladesh mobile banking
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_method_check;
ALTER TABLE payments ADD CONSTRAINT payments_payment_method_check 
  CHECK (payment_method IN ('card', 'bkash', 'nagad', 'rocket', 'insurance'));

-- Drop and recreate payment_status constraint (change 'paid' to 'completed')
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_status_check;
ALTER TABLE payments ADD CONSTRAINT payments_payment_status_check 
  CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));

-- Update appointments payment_status constraint
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_payment_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_payment_status_check 
  CHECK (payment_status IN ('pending', 'completed', 'refunded'));

-- =====================================================
-- STEP 2: Update existing data
-- =====================================================

-- Update payment methods from 'upi' to Bangladesh mobile banking
-- (Update based on transaction_id patterns)
UPDATE payments SET payment_method = 'bkash' 
WHERE payment_method = 'upi' AND transaction_id LIKE 'BKASH%';

UPDATE payments SET payment_method = 'nagad' 
WHERE payment_method = 'upi' AND transaction_id LIKE 'NAGAD%';

UPDATE payments SET payment_method = 'rocket' 
WHERE payment_method = 'upi' AND transaction_id LIKE 'ROCKET%';

-- Update payment status from 'paid' to 'completed'
UPDATE payments SET payment_status = 'completed' WHERE payment_status = 'paid';
UPDATE appointments SET payment_status = 'completed' WHERE payment_status = 'paid';

-- Update doctor IDs from DOC### to D### format
UPDATE doctors SET doctor_id = REPLACE(doctor_id, 'DOC', 'D') WHERE doctor_id LIKE 'DOC%';
UPDATE appointments SET doctor_id = REPLACE(doctor_id, 'DOC', 'D') WHERE doctor_id LIKE 'DOC%';
UPDATE prescriptions SET doctor_id = REPLACE(doctor_id, 'DOC', 'D') WHERE doctor_id LIKE 'DOC%';
UPDATE test_reports SET doctor_id = REPLACE(doctor_id, 'DOC', 'D') WHERE doctor_id LIKE 'DOC%';

-- Update user_id in doctors table to match doctor_id
UPDATE doctors SET user_id = doctor_id WHERE user_id LIKE 'DOC%';

-- Update specific doctor names if needed
UPDATE users SET name = 'Dr. Kamrul Hasan' 
WHERE user_id = 'D009' AND role = 'doctor';

-- =====================================================
-- STEP 3: Ensure indexes exist for better performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_test_reports_patient ON test_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_appointment ON payments(appointment_id);

-- =====================================================
-- STEP 4: Update triggers
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to auto-update updated_at column
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_hospitals_updated_at ON hospitals;
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_doctors_updated_at ON doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_facilities_updated_at ON facilities;
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_prescriptions_updated_at ON prescriptions;
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DRO=====================================================
-- STEP 5: Ensure Row Level Security is enabled
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 6: Update RLS Policies
-- =====================================================
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic examples - customize based on your security requirements)
-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Patients can view own data" ON patients;
DROP POLICY IF EXISTS "Patients can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view own prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Patients can view own test reports" ON test_reports;
DROP POLICY IF EXISTS "Patients can view own payments" ON payments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can update appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can create payments" ON payments;
DROP POLICY IF EXISTS "Anyone can update payments" ON payments;
DROP POLICY IF EXISTS "Doctors can view own data" ON doctors;
DROP POLICY IF EXISTS "Doctors can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can manage prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Anyone can view hospitals" ON hospitals;
DROP POLICY IF EXISTS "Anyone can view doctors" ON doctors;
DROP POLICY IF EXISTS "Allow login authentication" ON users;

-- Patients can view their own data
CREATE POLICY "Patients can view own data" ON patients FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Patients can view own appointments" ON appointments FOR SELECT USING (patient_id IN (SELECT patient_id FROM patients WHERE user_id = auth.uid()::text));
CREATE POLICY "Patients can view own prescriptions" ON prescriptions FOR SELECT USING (patient_id IN (SELECT patient_id FROM patients WHERE user_id = auth.uid()::text));
CREATE POLICY "Patients can view own test reports" ON test_reports FOR SELECT USING (patient_id IN (SELECT patient_id FROM patients WHERE user_id = auth.uid()::text));
CREATE POLICY "Patients can view own payments" ON payments FOR SELECT USING (patient_id IN (SELECT patient_id FROM patients WHERE user_id = auth.uid()::text));

-- Allow patients to create appointments and payments (for booking)
CREATE POLICY "Anyone can create appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update appointments" ON appointments FOR UPDATE USING (true);
CREATE POLICY "Anyone can view all appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Anyone can create payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update payments" ON payments FOR UPDATE USING (true);

-- Doctors can view their appointments and related data
CREATE POLICY "Doctors can view own data" ON doctors FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Doctors can view own appointments" ON appointments FOR SELECT USING (doctor_id IN (SELECT doctor_id FROM doctors WHERE user_id = auth.uid()::text));
CREATE POLICY "Doctors can manage prescriptions" ON prescriptions FOR ALL USING (doctor_id IN (SELECT doctor_id FROM doctors WHERE user_id = auth.uid()::text));

-- Admins have full access (you'll need to implement admin role check)
-- Public access for hospitals and doctors (for booking purposes)
CREATE POLICY "Anyone can view hospitals" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Anyone can view doctors" ON doctors FOR SELECT USING (true);
TEP 7: Insert missing sample data (skips if exists)
-- Allow authentication - users table needs to be readable for login
CREATE POLICY "Allow login authentication" ON users FOR SELECT USING (true);

-- =====================================================
-- SAMPLE DATA FOR BANGLADESH HEALTHCARE SYSTEM
-- =====================================================

-- Insert Bangladesh Hospitals (will skip if already exists)
INSERT INTO hospitals (hospital_id, name, location, city, specializations, total_doctors, rating, image_url) VALUES
('H001', 'Dhaka Medical College Hospital', 'Dhaka-1000, Bakshibazar', 'Dhaka', ARRAY['General Medicine', 'Surgery', 'Cardiology', 'Neurology', 'Orthopedics'], 250, 4.2, NULL),
('H002', 'Square Hospital Ltd', 'West Panthapath, Dhaka-1205', 'Dhaka', ARRAY['Cardiology', 'Oncology', 'Nephrology', 'Gastroenterology', 'Pulmonology'], 180, 4.8, NULL),
('H003', 'United Hospital Limited', 'Plot-15, Road-71, Gulshan, Dhaka-1212', 'Dhaka', ARRAY['Cardiac Surgery', 'Neurosurgery', 'Orthopedics', 'Pediatrics', 'ICU'], 150, 4.7, NULL),
('H004', 'Labaid Specialized Hospital', 'House-06, Road-04, Dhanmondi, Dhaka-1205', 'Dhaka', ARRAY['Diabetes', 'Gynecology', 'Urology', 'ENT', 'Dermatology'], 120, 4.5, NULL),
('H005', 'Evercare Hospital Dhaka', 'Plot-81, Block-E, Bashundhara R/A, Dhaka-1229', 'Dhaka', ARRAY['Cardiology', 'Neurology', 'Oncology', 'Emergency Medicine', 'ICU'], 200, 4.9, NULL),
('H006', 'Chittagong Medical College Hospital', 'K.B. Fazlul Kader Road, Chittagong-4203', 'Chittagong', ARRAY['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'], 180, 4.1, NULL),
('H007', 'Ibn Sina Hospital', 'House-48, Road-9/A, Dhanmondi, Dhaka-1209', 'Dhaka', ARRAY['General Medicine', 'Surgery', 'Cardiology', 'Orthopedics'], 90, 4.4, NULL),
('H008', 'Bangabandhu Sheikh Mujib Medical University', 'Shahbag, Dhaka-1000', 'Dhaka', ARRAY['Cardiology', 'Neurology', 'Nephrology', 'Oncology', 'Surgery'], 300, 4.6, NULL),
('H009', 'Popular Medical College Hospital', 'House-10/12, Road-02, Dhanmondi, Dhaka-1205', 'Dhaka', ARRAY['General Medicine', 'Pediatrics', 'Gynecology', 'Dermatology'], 100, 4.3, NULL),
('H010', 'Holy Family Red Crescent Medical College Hospital', 'Eskaton Garden, Dhaka-1000', 'Dhaka', ARRAY['General Medicine', 'Surgery', 'Pediatrics', 'Orthopedics'], 110, 4.2, NULL)
ON CONFLICT (hospital_id) DO NOTHING;

-- Insert Bangladesh Users (Patients, Doctors, Admin) (will skip if already exists)
INSERT INTO users (user_id, phone, password_hash, name, email, role, created_at) VALUES
('U001', '01711-123456', 'patient123', 'Md. Kamal Hossain', 'kamal.hossain@gmail.com', 'patient', NOW()),
('U002', '01812-234567', 'patient123', 'Fatima Begum', 'fatima.begum@yahoo.com', 'patient', NOW()),
('U003', '01912-345678', 'patient123', 'Abdul Rahman', 'abdul.rahman@outlook.com', 'patient', NOW()),
('U004', '01611-456789', 'patient123', 'Ayesha Siddika', 'ayesha.siddika@gmail.com', 'patient', NOW()),
('U005', '01712-567890', 'patient123', 'Mohammad Rahim', 'mohammad.rahim@gmail.com', 'patient', NOW()),
('U006', '01813-678901', 'patient123', 'Nasrin Akter', 'nasrin.akter@yahoo.com', 'patient', NOW()),
('U007', '01913-789012', 'patient123', 'Rafiqul Islam', 'rafiqul.islam@gmail.com', 'patient', NOW()),
('U008', '01612-890123', 'patient123', 'Shamima Khatun', 'shamima.khatun@outlook.com', 'patient', NOW()),
('U009', '01713-901234', 'patient123', 'Jahangir Alam', 'jahangir.alam@gmail.com', 'patient', NOW()),
('U010', '01814-012345', 'patient123', 'Ruksana Parvin', 'ruksana.parvin@yahoo.com', 'patient', NOW()),
-- Doctors
('D001', '01711-111111', 'doctor123', 'Prof. Dr. Azizul Haque', 'azizul.haque@dmch.gov.bd', 'doctor', NOW()),
('D002', '01811-222222', 'doctor123', 'Dr. Sharmin Sultana', 'sharmin.sultana@square.com.bd', 'doctor', NOW()),
('D003', '01911-333333', 'doctor123', 'Dr. Mahmudur Rahman', 'mahmud.rahman@united.com.bd', 'doctor', NOW()),
('D004', '01611-444444', 'doctor123', 'Dr. Farhana Ahmed', 'farhana.ahmed@labaid.com.bd', 'doctor', NOW()),
('D005', '01711-555555', 'doctor123', 'Dr. Nurul Islam', 'nurul.islam@evercare.com.bd', 'doctor', NOW()),
('D006', '01811-666666', 'doctor123', 'Dr. Taslima Akhter', 'taslima.akhter@cmch.gov.bd', 'doctor', NOW()),
('D007', '01911-777777', 'doctor123', 'Dr. Habibur Rahman', 'habib.rahman@ibnsina.com.bd', 'doctor', NOW()),
('D008', '01611-888888', 'doctor123', 'Dr. Nasima Begum', 'nasima.begum@bsmmu.edu.bd', 'doctor', NOW()),
('D009', '01711-999999', 'doctor123', 'Dr. Kamrul Hasan', 'kamrul.hasan@popular.com.bd', 'doctor', NOW()),
('D010', '01811-000000', 'doctor123', 'Dr. Sabina Yasmin', 'sabina.yasmin@holyfamily.com.bd', 'doctor', NOW()),
-- Admin
('A001', '01700-000000', 'admin123', 'Admin Ashraful Islam', 'admin@healthbd.gov.bd', 'admin', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Insert Bangladesh Patients (will skip if already exists)
INSERT INTO patients (patient_id, user_id, date_of_birth, blood_group, address, emergency_contact, medical_history, created_at) VALUES
('P001', 'U001', '1985-03-15', 'B+', 'House-12, Road-5, Mirpur-10, Dhaka', '01711-123457', 'Hypertension, Diabetes Type 2', NOW()),
('P002', 'U002', '1990-07-22', 'O+', 'Flat-4B, Bashundhara R/A, Dhaka', '01812-234568', 'Asthma', NOW()),
('P003', 'U003', '1978-11-30', 'A+', 'Village-Chandpur, Thana-Savar, Dhaka', '01912-345679', 'Heart disease', NOW()),
('P004', 'U004', '1995-05-18', 'AB+', 'House-25, Uttara Sector-7, Dhaka', '01611-456780', 'None', NOW()),
('P005', 'U005', '1982-09-10', 'O-', 'Agrabad, Chittagong', '01712-567891', 'Kidney stones', NOW()),
('P006', 'U006', '1988-12-25', 'B-', 'House-8, Dhanmondi-15, Dhaka', '01813-678902', 'Thyroid disorder', NOW()),
('P007', 'U007', '1975-04-08', 'A-', 'Mohammadpur, Dhaka', '01913-789013', 'Arthritis', NOW()),
('P008', 'U008', '1992-08-14', 'AB-', 'Gulshan-1, Dhaka', '01612-890124', 'Migraine', NOW()),
('P009', 'U009', '1980-01-20', 'B+', 'Banani, Dhaka', '01713-901235', 'Back pain', NOW()),
('P010', 'U010', '1998-06-05', 'O+', 'Motijheel, Dhaka', '01814-012346', 'Allergies', NOW())
ON CONFLICT (patient_id) DO NOTHING;

-- Insert Bangladesh Doctors (will skip if already exists)
INSERT INTO doctors (doctor_id, user_id, hospital_id, specialization, qualification, experience_years, consultation_fee, available_slots, rating, created_at) VALUES
('D001', 'D001', 'H001', 'Cardiology', 'MBBS, MD (Cardiology), FCPS', 25, 1500.00, '["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]'::jsonb, 4.8, NOW()),
('D002', 'D002', 'H002', 'Gynecology', 'MBBS, FCPS (Gynecology & Obstetrics)', 15, 2000.00, '["9:30 AM", "11:00 AM", "2:30 PM", "4:00 PM"]'::jsonb, 4.7, NOW()),
('D003', 'D003', 'H003', 'Neurology', 'MBBS, MD (Neurology), PhD', 18, 2500.00, '["10:00 AM", "11:30 AM", "3:00 PM", "4:30 PM"]'::jsonb, 4.9, NOW()),
('D004', 'D004', 'H004', 'Diabetes & Endocrinology', 'MBBS, FCPS (Medicine), MD (Endocrinology)', 12, 1800.00, '["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"]'::jsonb, 4.6, NOW()),
('D005', 'D005', 'H005', 'Cardiology', 'MBBS, MRCP (UK), MD (Cardiology)', 20, 3000.00, '["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"]'::jsonb, 4.9, NOW()),
('D006', 'D006', 'H006', 'Pediatrics', 'MBBS, DCH, FCPS (Pediatrics)', 14, 1200.00, '["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"]'::jsonb, 4.5, NOW()),
('D007', 'D007', 'H007', 'Orthopedics', 'MBBS, MS (Orthopedics), FCPS', 16, 1600.00, '["10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"]'::jsonb, 4.7, NOW()),
('D008', 'D008', 'H008', 'Nephrology', 'MBBS, MD (Medicine), MD (Nephrology)', 22, 2200.00, '["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]'::jsonb, 4.8, NOW()),
('D009', 'D009', 'H009', 'General Medicine', 'MBBS, FCPS (Medicine)', 10, 1000.00, '["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]'::jsonb, 4.4, NOW()),
('D010', 'D010', 'H010', 'Dermatology', 'MBBS, DDV, MD (Dermatology)', 13, 1400.00, '["10:00 AM", "11:30 AM", "2:30 PM", "4:00 PM"]'::jsonb, 4.6, NOW())
ON CONFLICT (doctor_id) DO NOTHING;

-- Insert Facilities (will skip if already exists)
INSERT INTO facilities (facility_id, hospital_id, facility_name, description, availability_status, created_at) VALUES
('F001', 'H002', 'ICU Bed - Room 201', 'Intensive Care Unit with ventilator support', 'available', NOW()),
('F002', 'H003', 'Operation Theater - OT-1', 'Cardiac surgery equipped operation theater', 'occupied', NOW()),
('F003', 'H005', 'Private Cabin - C301', 'VIP cabin with AC and attached bathroom', 'available', NOW()),
('F004', 'H001', 'General Ward - Ward 5', 'General patient ward with 20 beds', 'available', NOW()),
('F005', 'H002', 'CT Scan Machine', 'Latest 128-slice CT scanner', 'available', NOW()),
('F006', 'H008', 'Dialysis Unit - Bed 12', 'Hemodialysis machine', 'maintenance', NOW()),
('F007', 'H004', 'X-Ray Room', 'Digital X-ray facility', 'available', NOW())
ON CONFLICT (facility_id) DO NOTHING;

-- Insert Appointments (will skip if already exists)
INSERT INTO appointments (appointment_id, patient_id, doctor_id, hospital_id, date, time, status, type, notes, payment_status, created_at) VALUES
('A001', 'P001', 'D001', 'H001', '2025-12-31', '10:00 AM', 'scheduled', 'in-person', 'Follow-up for blood pressure check', 'completed', NOW()),
('A002', 'P002', 'D002', 'H002', '2025-12-31', '11:00 AM', 'scheduled', 'online', 'Regular checkup during pregnancy', 'completed', NOW()),
('A003', 'P003', 'D003', 'H003', '2026-01-02', '3:00 PM', 'scheduled', 'in-person', 'Headache and dizziness complaints', 'pending', NOW()),
('A004', 'P004', 'D009', 'H009', '2025-12-30', '2:00 PM', 'completed', 'in-person', 'General health checkup', 'completed', NOW()),
('A005', 'P005', 'D008', 'H008', '2026-01-03', '11:00 AM', 'scheduled', 'in-person', 'Kidney stone consultation', 'pending', NOW()),
('A006', 'P006', 'D004', 'H004', '2026-01-04', '10:30 AM', 'scheduled', 'online', 'Diabetes management consultation', 'completed', NOW()),
('A007', 'P007', 'D007', 'H007', '2025-12-28', '3:00 PM', 'completed', 'in-person', 'Joint pain treatment', 'completed', NOW()),
('A008', 'P008', 'D003', 'H003', '2026-01-05', '10:00 AM', 'scheduled', 'in-person', 'Migraine treatment', 'pending', NOW())
ON CONFLICT (appointment_id) DO NOTHING;

-- Insert Prescriptions (will skip if already exists)
INSERT INTO prescriptions (prescription_id, appointment_id, patient_id, doctor_id, date, diagnosis, medications, instructions, follow_up_date, created_at) VALUES
('RX001', 'A004', 'P004', 'D009', '2025-12-30', 'Viral fever with body ache', 
'[{"name": "Napa (Paracetamol 500mg)", "dosage": "1+0+1", "duration": "5 days", "instructions": "After meal"}, {"name": "Histacin (Cetirizine 10mg)", "dosage": "0+0+1", "duration": "3 days", "instructions": "Before sleep"}]'::jsonb,
'Take rest, drink plenty of water. Avoid cold drinks.', '2026-01-06', NOW()),

('RX002', 'A007', 'P007', 'D007', '2025-12-28', 'Osteoarthritis of knee joint',
'[{"name": "Naprosyn (Naproxen 500mg)", "dosage": "1+0+1", "duration": "10 days", "instructions": "After meal"}, {"name": "Seclo (Omeprazole 20mg)", "dosage": "1+0+0", "duration": "10 days", "instructions": "Before breakfast"}, {"name": "Calcium-D3 tablet", "dosage": "0+0+1", "duration": "30 days", "instructions": "After dinner"}]'::jsonb,
'Apply hot compress. Do light exercises. Avoid climbing stairs frequently.', '2026-01-28', NOW())
ON CONFLICT (prescription_id) DO NOTHING;

-- Insert Tests (will skip if already exists)
INSERT INTO tests (test_id, test_name, description, normal_range, cost, created_at) VALUES
('T001', 'Complete Blood Count (CBC)', 'Full blood count analysis', 'WBC: 4-11 K/uL, RBC: 4.5-5.5 M/uL', 500.00, NOW()),
('T002', 'Lipid Profile', 'Cholesterol and triglycerides test', 'Total Cholesterol: <200 mg/dL', 800.00, NOW()),
('T003', 'HbA1c (Glycated Hemoglobin)', 'Blood sugar control test', '4.0-5.6%', 1000.00, NOW()),
('T004', 'Liver Function Test (LFT)', 'Liver enzyme levels', 'ALT: 7-56 U/L, AST: 10-40 U/L', 1200.00, NOW()),
('T005', 'Kidney Function Test', 'Creatinine and urea test', 'Creatinine: 0.7-1.3 mg/dL', 900.00, NOW()),
('T006', 'Thyroid Profile (T3, T4, TSH)', 'Thyroid hormone levels', 'TSH: 0.4-4.0 mIU/L', 1500.00, NOW()),
('T007', 'ECG (Electrocardiogram)', 'Heart rhythm test', 'Normal sinus rhythm', 600.00, NOW()),
('T008', 'Chest X-Ray', 'Lung and heart imaging', 'Clear lung fields', 800.00, NOW())
ON CONFLICT (test_id) DO NOTHING;

-- Insert Test Reports (will skip if already exists)
INSERT INTO test_reports (report_id, test_id, patient_id, doctor_id, date, findings, recommendations, created_at) VALUES
('R001', 'T001', 'P001', 'D001', '2025-12-25', 
'WBC: 8.5 K/uL, RBC: 5.2 M/uL, Hemoglobin: 14.5 g/dL, Platelets: 250 K/uL. All values within normal range.', 
'Blood count is normal. Continue current medication.', NOW()),

('R002', 'T003', 'P001', 'D001', '2025-12-25',
'HbA1c: 7.2% - Indicates fair blood sugar control over past 3 months.',
'Need better diabetes control. Adjust medication and follow strict diet.', NOW()),

('R003', 'T007', 'P003', 'D001', '2025-12-20',
'Normal sinus rhythm. Heart rate: 75 bpm. No ST-T changes. No arrhythmia detected.',
'ECG is normal. Continue monitoring blood pressure.', NOW())
ON CONFLICT (report_id) DO NOTHING;

-- Insert Payments (will skip if already exists)
INSERT INTO payments (payment_id, appointment_id, patient_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at) VALUES
('PAY001', 'A001', 'P001', 1500.00, 'card', 'completed', 'TXN20251230001', '2025-12-30 09:00:00', NOW()),
('PAY002', 'A002', 'P002', 2000.00, 'bkash', 'completed', 'BKASH20251230002', '2025-12-30 10:30:00', NOW()),
('P=====================================================
-- STEP 8: Final updates
-- =====================================================

-- Update hospital doctor counts
UPDATE hospitals SET total_doctors = (
  SELECT COUNT(*) FROM doctors WHERE doctors.hospital_id = hospitals.hospital_id
);

-- Verify updates (optional - will show summary of changes)
DO $$
BEGIN
  RAISE NOTICE 'Database update completed successfully!';
  RAISE NOTICE 'Doctor IDs updated: % records', (SELECT COUNT(*) FROM doctors WHERE doctor_id LIKE 'D%');
  RAISE NOTICE 'Appointments with completed payment: % records', (SELECT COUNT(*) FROM appointments WHERE payment_status = 'completed');
  RAISE NOTICE 'Payments with Bangladesh methods: % records', (SELECT COUNT(*) FROM payments WHERE payment_method IN ('bkash', 'nagad', 'rocket'));
END $$N CONFLICT (payment_id) DO NOTHING;

-- Update hospital doctor counts
UPDATE hospitals SET total_doctors = (
  SELECT COUNT(*) FROM doctors WHERE doctors.hospital_id = hospitals.hospital_id
);
