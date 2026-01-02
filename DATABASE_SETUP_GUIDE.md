# 🏥 Supabase Database Setup Guide

## ✅ What's Already Done

1. **Environment Variables Configured** (`.env` file)
   - `VITE_SUPABASE_URL`: https://gbcnjtcbyjzcnhwwrxae.supabase.co
   - `VITE_SUPABASE_ANON_KEY`: Your anonymous key is set

2. **Supabase Client Initialized** (`src/lib/supabase.ts`)
   - Client is ready to connect to your database

3. **Service Layer Complete** (`src/services/supabaseService.ts`)
   - Authentication service
   - Hospital service
   - Doctor service
   - Patient service
   - Appointment service
   - Payment service

4. **Login Component Updated** (`src/components/auth/Login.tsx`)
   - Now uses `authService.login()` instead of mock data
   - Connects to real Supabase database

---

## 📋 Next Steps - Create Database Tables

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project: https://supabase.com/dashboard/project/gbcnjtcbyjzcnhwwrxae
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### Step 2: Run the Schema SQL

1. Open the file `supabase-schema.sql` in this project
2. Copy **ALL** the SQL code (all 344 lines)
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button

This will create:
- ✅ All database tables (users, hospitals, doctors, patients, appointments, etc.)
- ✅ Sample data for testing (10 hospitals, 10 doctors, 10 patients)
- ✅ Indexes for better performance
- ✅ Row Level Security (RLS) policies

### Step 3: Verify Tables Were Created

1. In Supabase dashboard, click **"Table Editor"** in left sidebar
2. You should see these tables:
   - `users`
   - `hospitals`
   - `patients`
   - `doctors`
   - `facilities`
   - `appointments`
   - `prescriptions`
   - `tests`
   - `test_reports`
   - `payments`

---

## 🧪 Test the Database Connection

### Test Login

After creating the database tables, try logging in with these credentials:

**Patient Account:**
- Phone: `01711-123456`
- Password: `patient123`
- Name: Md. Kamal Hossain

**Doctor Account:**
- Phone: `01711-111111`
- Password: `doctor123`
- Name: Prof. Dr. Azizul Haque

**Admin Account:**
- Phone: `01700-000000`
- Password: `admin123`
- Name: Admin Ashraful Islam

---

## 🔧 If Login Doesn't Work

### Check Row Level Security (RLS)

The SQL schema enables RLS for security. However, for initial testing, you might need to temporarily disable it:

1. Go to **Table Editor** in Supabase
2. Click on `users` table
3. Go to **"RLS"** tab
4. If policies are blocking access, you can:
   - **Option A**: Disable RLS temporarily (click "Disable RLS" - **NOT recommended for production**)
   - **Option B**: Add a policy to allow public reads:
     ```sql
     CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
     ```

---

## 🔄 Update Other Components to Use Database

Currently, **only Login.tsx** has been updated. Other components still use mock data. Here's what needs updating:

### Components That Need Database Integration:

1. **HospitalBrowse.tsx** - Should fetch from `hospitalService.getAllHospitals()`
2. **DoctorBooking.tsx** - Should fetch from `doctorService.getAllDoctors()`
3. **PatientDashboard.tsx** - Should fetch patient data from database
4. **DoctorInterface.tsx** - Should fetch appointments from database
5. **Dashboard.tsx** (Admin) - Should fetch all statistics from database

---

## 📊 Database Schema Overview

### Main Tables:

- **users**: Authentication and user roles (patient, doctor, admin)
- **hospitals**: Hospital information with specializations
- **doctors**: Doctor profiles linked to hospitals
- **patients**: Patient medical records
- **appointments**: Booking information
- **prescriptions**: Medical prescriptions from doctors
- **payments**: Payment transactions
- **tests** & **test_reports**: Diagnostic test information

### Key Relationships:

```
users → patients (one-to-one)
users → doctors (one-to-one)
hospitals → doctors (one-to-many)
doctors → appointments (one-to-many)
patients → appointments (one-to-many)
appointments → prescriptions (one-to-one)
appointments → payments (one-to-one)
```

---

## ⚠️ Important Notes

### Password Security

**Current Setup**: The schema stores passwords in plain text (`password_hash` field)  
**Production Requirement**: You MUST implement proper password hashing before going live

Recommended approach:
1. Use Supabase Auth built-in authentication
2. Or implement bcrypt/scrypt password hashing
3. Never store plain text passwords in production!

### Sample Data

The schema includes sample Bangladesh hospital data with:
- 10 hospitals (Dhaka Medical, Square Hospital, United Hospital, etc.)
- 10 doctors with different specializations
- 10 patients
- Sample appointments, prescriptions, and payments

You can use this data for testing or modify it as needed.

---

## 🚀 Quick Start Commands

**Your dev server is already running!**

If you need to restart:
```bash
npm run dev
```

Then open: http://localhost:5173

---

## 📞 Support

If you encounter issues:

1. **Check Supabase Dashboard** → Logs section for errors
2. **Check Browser Console** (F12) for JavaScript errors
3. **Verify .env file** has correct credentials
4. **Ensure SQL schema was run** without errors in Supabase

---

**Status**: ✅ Environment configured, ✅ Login updated, ⏳ Waiting for database tables to be created
