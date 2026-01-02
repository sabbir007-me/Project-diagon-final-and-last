import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcnjtcbyjzcnhwwrxae.supabase.co';
const supabaseAnonKey = 'sb_publishable_DD5ntP682YmkNqia1TWtyg_2iqYq8Lc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  console.log('📍 Database URL:', supabaseUrl);
  console.log('📍 Database Host: db.gbcnjtcbyjzcnhwwrxae.supabase.co\n');

  // Test 1: Check Users table
  console.log('1️⃣ Testing users table...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(5);
  
  if (usersError) {
    console.log('   ❌ Users table:', usersError.message);
  } else {
    console.log('   ✅ Users table exists -', users.length, 'records found');
  }

  // Test 2: Check Hospitals table
  console.log('2️⃣ Testing hospitals table...');
  const { data: hospitals, error: hospitalsError } = await supabase
    .from('hospitals')
    .select('*')
    .limit(5);
  
  if (hospitalsError) {
    console.log('   ❌ Hospitals table:', hospitalsError.message);
  } else {
    console.log('   ✅ Hospitals table exists -', hospitals.length, 'records found');
  }

  // Test 3: Check Doctors table
  console.log('3️⃣ Testing doctors table...');
  const { data: doctors, error: doctorsError } = await supabase
    .from('doctors')
    .select('*')
    .limit(5);
  
  if (doctorsError) {
    console.log('   ❌ Doctors table:', doctorsError.message);
  } else {
    console.log('   ✅ Doctors table exists -', doctors.length, 'records found');
  }

  // Test 4: Check Appointments table
  console.log('4️⃣ Testing appointments table...');
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('*')
    .limit(5);
  
  if (appointmentsError) {
    console.log('   ❌ Appointments table:', appointmentsError.message);
  } else {
    console.log('   ✅ Appointments table exists -', appointments.length, 'records found');
    if (appointments.length > 0) {
      console.log('   📋 Sample appointment:', appointments[0]);
    }
  }

  // Test 5: Check Patients table
  console.log('5️⃣ Testing patients table...');
  const { data: patients, error: patientsError } = await supabase
    .from('patients')
    .select('*')
    .limit(5);
  
  if (patientsError) {
    console.log('   ❌ Patients table:', patientsError.message);
  } else {
    console.log('   ✅ Patients table exists -', patients.length, 'records found');
  }

  // Test 6: Check Payments table
  console.log('6️⃣ Testing payments table...');
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('*')
    .limit(5);
  
  if (paymentsError) {
    console.log('   ❌ Payments table:', paymentsError.message);
  } else {
    console.log('   ✅ Payments table exists -', payments.length, 'records found');
  }

  console.log('\n✨ Connection test complete!');
}

testConnection().catch(console.error);
