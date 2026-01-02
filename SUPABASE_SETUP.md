# 🚀 Supabase Backend Setup Guide

This guide will walk you through connecting your Hospital Management & Doctor Booking Platform to Supabase for backend hosting.

## 📋 Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Your project already has the Supabase client library installed

## 🔧 Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in your project details:
   - **Name**: Hospital Management Platform (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free (or your preferred plan)
4. Click **"Create new project"**
5. Wait 2-3 minutes for your project to be provisioned

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
2. Click **API** in the Settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long JWT token starting with `eyJ...`
4. Copy these values (you'll need them in the next step)

### Step 3: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important**: Never commit your `.env` file to version control! It's already in `.gitignore`.

### Step 4: Create Database Tables

1. In your Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **"New query"**
3. Open the `supabase-schema.sql` file in your project root
4. Copy the entire SQL content
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** to execute the SQL and create all tables

This will create:
- ✅ All database tables (users, hospitals, doctors, patients, appointments, etc.)
- ✅ Indexes for better performance
- ✅ Row Level Security (RLS) policies
- ✅ Auto-update triggers for `updated_at` columns

### Step 5: Add Sample Data (Optional)

To populate your database with test data:

1. In SQL Editor, create a new query
2. Run the following SQL to insert sample data:

```sql
-- Insert sample users
INSERT INTO users (user_id, phone, password_hash, name, email, role) VALUES
('U001', '555-0101', 'patient123', 'John Smith', 'john@example.com', 'patient'),
('U002', '555-0102', 'patient123', 'Sarah Johnson', 'sarah@example.com', 'patient'),
('U003', '555-0201', 'doctor123', 'Dr. Michael Chen', 'chen@hospital.com', 'doctor'),
('U004', '555-0202', 'doctor123', 'Dr. Emily Rodriguez', 'rodriguez@hospital.com', 'doctor'),
('U000', '555-0000', 'admin123', 'Admin User', 'admin@hospital.com', 'admin');

-- Insert sample hospitals
INSERT INTO hospitals (hospital_id, name, location, city, specializations, total_doctors, rating) VALUES
('H001', 'City General Hospital', '123 Main St', 'New York', ARRAY['Cardiology', 'Neurology', 'Orthopedics'], 15, 4.5),
('H002', 'Metro Medical Center', '456 Oak Ave', 'Los Angeles', ARRAY['Pediatrics', 'Gynecology', 'General Medicine'], 12, 4.2),
('H003', 'University Hospital', '789 College Rd', 'Chicago', ARRAY['Oncology', 'Surgery', 'Emergency Medicine'], 20, 4.8),
('H004', 'Community Health Clinic', '321 Park Lane', 'Houston', ARRAY['Family Medicine', 'Dermatology'], 8, 4.0);

-- Insert sample patients
INSERT INTO patients (patient_id, user_id, date_of_birth, blood_group, address, emergency_contact) VALUES
('P001', 'U001', '1990-05-15', 'A+', '123 Main St, Apt 4B', '555-0199'),
('P002', 'U002', '1985-08-22', 'O+', '456 Oak Ave, Unit 12', '555-0198');

-- Insert sample doctors
INSERT INTO doctors (doctor_id, user_id, hospital_id, specialization, qualification, experience_years, consultation_fee, available_slots, rating) VALUES
('D001', 'U003', 'H001', 'Cardiology', 'MD, Cardiology', 15, 150.00, '["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]'::jsonb, 4.7),
('D002', 'U004', 'H002', 'Pediatrics', 'MD, Pediatrics', 10, 120.00, '["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"]'::jsonb, 4.5);
```

### Step 6: Test the Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to your app
3. The app should now connect to Supabase instead of using mock data

## 🔄 Migrating Components to Use Supabase

The `supabaseService.ts` file provides ready-to-use functions for all operations. Here's how to update your components:

### Example: Update Login Component

**Before (using mock data):**
```typescript
import { mockUsers } from '../data/mockData';
```

**After (using Supabase):**
```typescript
import { authService } from '../services/supabaseService';

// In your login function
const { data: user, error } = await authService.login(phone, password);
if (error) {
  console.error('Login failed:', error);
  return;
}
// User logged in successfully
```

### Example: Update Hospital Browse Component

**Before:**
```typescript
import { mockHospitals } from '../data/mockData';
```

**After:**
```typescript
import { hospitalService } from '../services/supabaseService';

// Inside your component
useEffect(() => {
  async function fetchHospitals() {
    const { data, error } = await hospitalService.getAllHospitals();
    if (data) setHospitals(data);
  }
  fetchHospitals();
}, []);
```

## 📊 Available Service Functions

The `supabaseService.ts` file includes these service modules:

### 🔐 Authentication
- `authService.login(phone, password)`
- `authService.register(user)`
- `authService.getCurrentUser(userId)`

### 🏥 Hospitals
- `hospitalService.getAllHospitals()`
- `hospitalService.getHospitalById(id)`
- `hospitalService.searchBySpecialization(specialization)`

### 👨‍⚕️ Doctors
- `doctorService.getAllDoctors()`
- `doctorService.getDoctorsByHospital(hospitalId)`
- `doctorService.getDoctorsBySpecialization(specialization)`

### 👤 Patients
- `patientService.getPatientById(id)`
- `patientService.getPatientByUserId(userId)`
- `patientService.createPatient(patient)`

### 📅 Appointments
- `appointmentService.getPatientAppointments(patientId)`
- `appointmentService.getDoctorAppointments(doctorId)`
- `appointmentService.createAppointment(appointment)`
- `appointmentService.cancelAppointment(appointmentId)`

### 💊 Prescriptions
- `prescriptionService.getPatientPrescriptions(patientId)`
- `prescriptionService.createPrescription(prescription)`

### 🧪 Test Reports
- `testReportService.getPatientTestReports(patientId)`
- `testReportService.createTestReport(report)`

### 💳 Payments
- `paymentService.getPatientPayments(patientId)`
- `paymentService.createPayment(payment)`
- `paymentService.updatePaymentStatus(paymentId, status)`

### 📈 Dashboard
- `dashboardService.getPatientStats(patientId)`
- `dashboardService.getDoctorStats(doctorId)`
- `dashboardService.getAdminStats()`

## 🔒 Security Features

Your Supabase setup includes:

- ✅ **Row Level Security (RLS)**: Patients can only access their own data
- ✅ **Role-based Access**: Different policies for patients, doctors, and admins
- ✅ **Indexed Queries**: Optimized database performance
- ✅ **Auto-updating Timestamps**: Tracks when records are modified

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Check that your `.env` file has the correct `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after changing `.env` files

### Error: "relation does not exist"
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that all tables were created successfully in Database > Tables

### Error: "Row Level Security policy violation"
- This means you're trying to access data without proper authentication
- For testing, you can temporarily disable RLS on specific tables (not recommended for production)

### Connection Issues
- Verify your `VITE_SUPABASE_URL` is correct
- Check your internet connection
- Verify your Supabase project is active (not paused)

## 📚 Next Steps

1. **Update Components**: Replace mock data imports with Supabase service calls
2. **Add Real Authentication**: Implement Supabase Auth for secure login
3. **File Storage**: Use Supabase Storage for test reports and prescriptions
4. **Real-time Updates**: Add Supabase Realtime for live appointment updates
5. **Deploy**: Host your frontend on Vercel, Netlify, or your preferred platform

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**Need Help?** Check the Supabase documentation or the service function implementations in `src/services/supabaseService.ts` for more details.
