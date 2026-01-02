# Hospital Management System

A comprehensive hospital management system built with React, TypeScript, and Tailwind CSS based on an Entity-Relationship Diagram (ERD).

## Features

### 📊 Dashboard
- Overview of hospital operations
- Real-time statistics for patients, doctors, appointments
- Financial metrics and pending payments
- Recent activities and pending tests

### 👥 Patient Management
- Patient registration and profile management
- View all registered patients
- Track patient appointments
- Medical history tracking
- Search and filter capabilities

### 👨‍⚕️ Doctor Management
- Doctor profiles with specializations
- Experience and ratings display
- Prescription history
- Appointment tracking
- Doctor availability management

### 🏥 Facility & Test Management
- Manage diagnostic centers and facilities
- Schedule and track medical tests
- Home and hospital test options
- Test status tracking (pending, completed, cancelled)
- Facility specialization tracking

### 💰 Payments & Reports
- Payment processing and tracking
- Multiple payment methods (cash, card, insurance)
- Coupon/discount management
- Financial reporting and revenue tracking
- Medical report generation and storage
- Test results and findings

## Database Schema

The system is built based on the following ERD entities:

- **USER**: Base user entity with authentication
- **PATIENT**: Patient information and medical history
- **DOCTOR**: Doctor profiles with specializations
- **FACILITY**: Diagnostic centers and medical facilities
- **TEST**: Medical tests and diagnostics
- **REPORT**: Test results and medical reports
- **PAYMENT**: Financial transactions
- **PRESCRIPTION**: Doctor prescriptions to patients
- **APPOINTMENT**: Booking system for doctor consultations

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React Hooks (useState)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
cd test_proj
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/               # Reusable UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   └── tabs.tsx
│   └── hospital/         # Hospital-specific components
│       ├── Dashboard.tsx
│       ├── PatientManagement.tsx
│       ├── DoctorManagement.tsx
│       ├── FacilityManagement.tsx
│       └── PaymentReports.tsx
├── data/
│   └── mockData.ts       # Sample data for development
├── types/
│   └── index.ts          # TypeScript interfaces
├── lib/
│   └── utils.ts          # Utility functions
├── App.tsx               # Main application component
└── main.tsx              # Application entry point
```

## Features Implemented

✅ Dashboard with real-time statistics  
✅ Patient registration and management  
✅ Doctor profiles and management  
✅ Facility and test management  
✅ Payment processing and tracking  
✅ Medical report generation  
✅ Appointment booking system  
✅ Prescription management  
✅ Responsive design  
✅ Type-safe with TypeScript  

## Future Enhancements

- User authentication and role-based access
- Real-time notifications
- Data export functionality
- Advanced search and filtering
- Calendar integration for appointments
- Patient portal for self-service
- Mobile application
- Integration with medical devices
- Analytics and reporting dashboards
- Multi-language support

## Contributing

This is a demonstration project based on an ERD schema. Feel free to extend and customize according to your needs.

## License

MIT License - Free to use for educational and commercial purposes.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
