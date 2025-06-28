# SME Finance Platform with KYC Verification

A full-stack finance application built with Vue.js and Firebase, designed for Small and Medium Enterprises (SMEs) to facilitate secure lending and borrowing with comprehensive KYC (Know Your Customer) document verification.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login for lenders and borrowers
- **KYC Document Upload**: Drag-and-drop interface for document submission
- **Manual Verification**: Admin interface for document review and approval
- **Real-time Status Updates**: Track document verification progress
- **Secure Storage**: Encrypted document storage with access controls

### User Types
- **Borrowers**: SMEs seeking financing
- **Lenders**: Financial institutions or individual lenders
- **Admins**: Platform administrators for document verification

### Document Types Supported
- Passport
- National ID Card
- Driver's License
- Business License
- Certificate of Incorporation
- Bank Statements
- Proof of Address
- Tax Certificates
- Audited Financial Statements
- Board Resolutions

## Tech Stack

### Frontend
- **Vue.js 3**: Progressive JavaScript framework
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool and development server

### Backend
- **Firebase Authentication**: User management and authentication
- **Cloud Firestore**: NoSQL database for user and document metadata
- **Firebase Storage**: Secure file storage for KYC documents
- **Firebase Security Rules**: Access control and data validation

## Project Structure

```
src/
├── components/           # Reusable Vue components
│   └── TheNavbar.vue    # Navigation component
├── stores/              # Pinia state management
│   ├── auth.js         # Authentication store
│   └── kyc.js          # KYC document store
├── views/              # Page components
│   ├── auth/           # Authentication views
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── kyc/            # KYC related views
│   │   ├── KYCView.vue
│   │   └── KYCUploadView.vue
│   ├── admin/          # Admin interface
│   │   └── KYCReviewView.vue
│   ├── DashboardView.vue
│   └── HomeView.vue
├── router/             # Route configuration
│   └── index.js
├── firebase/           # Firebase configuration
│   └── config.js
├── assets/             # Static assets
│   └── main.css        # Global styles
└── main.js             # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 16 or higher
- Firebase account
- Git

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, and Storage

2. **Configure Authentication**
   - Enable Email/Password authentication
   - Set up custom claims for admin users (optional)

3. **Set up Firestore**
   - Create a Firestore database
   - Deploy the security rules from `firestore.rules`

4. **Configure Storage**
   - Enable Firebase Storage
   - Deploy the security rules from `storage.rules`

5. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Add a web app and copy the config object

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sme-finance-kyc-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Update `src/firebase/config.js` with your Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   }
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## User Workflows

### For Borrowers/Lenders

1. **Registration**
   - Select user type (Borrower/Lender)
   - Provide company and personal information
   - Create account

2. **KYC Document Upload**
   - Navigate to KYC section
   - Select document type
   - Upload documents (PDF, JPG, PNG)
   - Track verification status

3. **Document Management**
   - View uploaded documents
   - Check approval status
   - Read admin feedback

### For Administrators

1. **Document Review**
   - Access pending documents
   - View/download documents
   - Approve or reject with comments
   - Update user KYC status

2. **Dashboard Analytics**
   - Track daily approval/rejection statistics
   - Monitor pending document queue
   - User management

## Security Features

- **Authentication**: Firebase Auth with email/password
- **Authorization**: Role-based access control
- **File Validation**: Type and size restrictions
- **Data Privacy**: User data isolation
- **Secure Storage**: Encrypted file storage
- **Access Logs**: Audit trail for document access

## Database Schema

### Users Collection
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  userType: "borrower", // or "lender"
  companyName: "ACME Corp",
  phone: "+1234567890",
  role: "user", // or "admin"
  kycStatus: "pending", // "approved", "rejected"
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### KYC Documents Collection
```javascript
{
  id: "document-id",
  userId: "user-id",
  fileName: "passport.pdf",
  fileType: "application/pdf",
  fileSize: 1048576,
  documentType: "passport",
  downloadURL: "https://storage.googleapis.com/...",
  storagePath: "kyc-documents/user-id/passport/file.pdf",
  status: "pending", // "approved", "rejected"
  uploadedAt: "2024-01-01T00:00:00.000Z",
  reviewedAt: "2024-01-01T00:00:00.000Z",
  comments: ["Document is clear and valid"]
}
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for Vue.js
- Tailwind CSS for styling
- Composition API for Vue components

## Deployment

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Other Platforms
The built application in the `dist/` folder can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please create an issue in the repository or contact the development team.

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced document verification (OCR)
- [ ] Multi-language support
- [ ] Mobile application
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard
- [ ] Automated compliance checks
- [ ] Digital signature integration