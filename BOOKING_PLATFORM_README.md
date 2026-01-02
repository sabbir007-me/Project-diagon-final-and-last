# Doctor Booking & Online Consultation Platform

A comprehensive healthcare platform for booking doctors, online consultations, payments, and managing medical records - built with React, TypeScript, and Tailwind CSS.

## 🏥 Platform Overview

This is a complete hospital management and doctor booking system that connects patients with healthcare providers. The platform supports multiple hospitals, online consultations, payment processing, and digital prescription management.

## ✨ Key Features

### For Patients 👥
- **Hospital Browsing**: Search and filter hospitals by specialization
- **Doctor Discovery**: Browse doctors by hospital, specialization, and ratings
- **Online Booking**: Book appointments with available time slots
- **Consultation Types**: Choose between in-person visits or online consultations
- **Payment Integration**: Secure payment with multiple methods (Card, UPI, Insurance)
- **Coupon System**: Apply discount coupons (FIRST10, HEALTH20)
- **My Dashboard**: 
  - View upcoming and past appointments
  - Access prescriptions from doctors
  - View test reports
  - Track payment history
- **Test Management**: Schedule home or hospital tests
- **Digital Reports**: Download and view test reports online

### For Doctors 👨‍⚕️
- **Appointment Management**: View and manage scheduled consultations
- **Online Prescriptions**: Write digital prescriptions for patients
- **Patient History**: Access patient medical history during consultations
- **Video Consultations**: Conduct online appointments
- **Prescription History**: Track all prescriptions written
- **Multi-medication Support**: Add multiple medications with dosage details

### For Administrators 🔧
- **Full Dashboard**: Overview of all hospital operations
- **Patient Management**: Register and manage patient records
- **Doctor Management**: Manage doctor profiles and schedules
- **Facility Management**: Oversee diagnostic centers and tests
- **Financial Reports**: Track payments and generate reports
- **Test Coordination**: Manage test scheduling and results

## 🔐 Demo Credentials

**Patient Access:**
- Phone: 555-0101
- Password: patient123

**Doctor Access:**
- Phone: 555-0201
- Password: doctor123

**Admin Access:**
- Phone: 555-0000
- Password: admin123

## 🏗️ System Architecture

### Role-Based Interfaces

1. **Patient Interface**
   - Browse Hospitals → Select Doctor → Book Appointment → Payment → Dashboard
   - View appointments, prescriptions, and test reports
   - Manage profile and medical history

2. **Doctor Interface**
   - View scheduled appointments
   - Write online prescriptions
   - Conduct video consultations
   - Track patient history

3. **Admin Interface**
   - Complete hospital management dashboard
   - Manage patients, doctors, and facilities
   - Generate reports and analytics

## 💳 Payment System

- **Multiple Payment Methods**:
  - Credit/Debit Card
  - UPI (Unified Payments Interface)
  - Insurance

- **Coupon System**:
  - FIRST10: 10% discount
  - HEALTH20: 20% discount

- **Payment Tracking**:
  - Real-time payment status
  - Digital receipts
  - Transaction history

## 🏥 Hospital & Specialization System

### Supported Specializations
- Cardiology
- Orthopedics
- Pediatrics
- General Medicine
- Cardiac Surgery
- Vascular Medicine
- Neonatology
- Child Psychology
- Radiology
- Pathology
- Diagnostic Imaging

### Sample Hospitals
1. **City General Hospital** - Multi-specialty with 24/7 emergency
2. **Heart Care Specialty Center** - Cardiac care facility
3. **Children's Medical Center** - Pediatric hospital
4. **Advanced Diagnostic Center** - Testing and diagnostics

## 📋 Appointment Flow

```
1. Patient Login
   ↓
2. Browse Hospitals (Filter by specialization)
   ↓
3. View Doctors (Ratings, Experience, Fee)
   ↓
4. Select Doctor & Time Slot
   ↓
5. Choose Appointment Type (In-person/Online)
   ↓
6. Payment Processing
   ↓
7. Confirmation & Dashboard
   ↓
8. Consultation (Video call or visit)
   ↓
9. Doctor Writes Prescription
   ↓
10. Patient Receives Digital Prescription
```

## 💊 Prescription System

Doctors can create comprehensive digital prescriptions including:
- **Medication Details**: Name, dosage, frequency, duration
- **Multiple Medications**: Add multiple prescriptions at once
- **Instructions**: Special instructions and precautions
- **Auto-delivery**: Prescription sent to patient automatically
- **Download**: Patients can download PDF copies

## 🧪 Test & Report Management

- **Test Booking**: Schedule medical tests
- **Location Options**: Home sample collection or hospital visit
- **Test Tracking**: Monitor test status (pending/completed)
- **Digital Reports**: Access reports online
- **Doctor Integration**: Reports linked to prescribing doctors

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Hooks (useState)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Form Handling**: Native HTML5 validation

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Login.tsx              # Authentication
│   ├── booking/
│   │   ├── HospitalBrowse.tsx     # Hospital listing
│   │   ├── DoctorBooking.tsx      # Doctor selection & booking
│   │   └── PaymentProcess.tsx     # Payment processing
│   ├── patient/
│   │   └── PatientDashboard.tsx   # Patient dashboard
│   ├── doctor/
│   │   └── DoctorInterface.tsx    # Doctor interface
│   ├── hospital/
│   │   ├── Dashboard.tsx          # Admin dashboard
│   │   ├── PatientManagement.tsx
│   │   ├── DoctorManagement.tsx
│   │   ├── FacilityManagement.tsx
│   │   └── PaymentReports.tsx
│   └── ui/                        # Reusable UI components
├── data/
│   └── mockData.ts                # Demo data
├── types/
│   └── index.ts                   # TypeScript types
├── lib/
│   └── utils.ts                   # Utilities
└── App.tsx                        # Main application

## 🚀 Getting Started

### Installation

```bash
# Navigate to project directory
cd test_proj

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### First Time Use

1. Start the application: `npm run dev`
2. Open browser: http://localhost:5173/
3. Login with demo credentials (see above)
4. Explore features based on your role

## 📱 User Workflows

### Patient Workflow
1. Login → Browse hospitals → Find doctor
2. Select time slot → Choose appointment type
3. Enter payment details → Apply coupon (optional)
4. Complete booking → Receive confirmation
5. Access dashboard to view appointment
6. Attend consultation (online/in-person)
7. Receive prescription → Download reports

### Doctor Workflow
1. Login → View dashboard
2. Check upcoming appointments
3. Start consultation (video/in-person)
4. Review patient history
5. Write prescription with medications
6. Submit prescription to patient
7. Track prescription history

### Admin Workflow
1. Login → Access full dashboard
2. Manage patient registrations
3. Oversee doctor schedules
4. Coordinate test bookings
5. Monitor payments & financials
6. Generate reports

## 🔄 ERD Implementation

The system fully implements the provided ERD diagram:

- **USER**: Authentication and role management
- **PATIENT**: Patient profiles and medical history
- **DOCTOR**: Doctor profiles with hospital linkage
- **HOSPITAL**: Multiple hospitals with specializations
- **APPOINTMENT**: Booking system with payment integration
- **PRESCRIPTION**: Digital prescription management
- **TEST**: Diagnostic test scheduling
- **REPORT**: Test results and findings
- **PAYMENT**: Transaction processing with coupons
- **FACILITY**: Diagnostic centers

All relationships (books, rates, prescribes, assigns, provides, confirms, etc.) are implemented.

## 🌟 Advanced Features

- ✅ Role-based access control
- ✅ Real-time appointment booking
- ✅ Online consultation support
- ✅ Multi-step booking flow
- ✅ Secure payment processing
- ✅ Coupon/discount system
- ✅ Digital prescription generation
- ✅ Test report management
- ✅ Doctor ratings & reviews
- ✅ Hospital specialization filtering
- ✅ Responsive design
- ✅ Type-safe with TypeScript

## 🔮 Future Enhancements

- Video call integration (WebRTC)
- Real-time chat between doctor and patient
- SMS/Email notifications
- Calendar sync for appointments
- Medicine delivery integration
- Health record storage (blockchain)
- AI-powered symptom checker
- Insurance claim automation
- Multi-language support
- Mobile app (React Native)
- Push notifications
- Analytics dashboard for doctors
- Telemedicine platform integration

## 📞 Support

For issues or questions:
- Check the demo credentials above
- Review the user workflows
- Explore each role's interface

## 📄 License

MIT License - Free to use for educational and commercial purposes.

---

Built with ❤️ based on ERD specifications
