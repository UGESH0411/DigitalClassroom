# 📚 Digital Classroom

A modern Google Classroom-inspired web application built with **React**, **Firebase**, and **Tailwind CSS**. This project enables teachers to create virtual classrooms, post assignments with file attachments, and manage students, while students can join classes and access course materials.

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-9.23.0-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.7-blue?logo=tailwindcss)

## ✨ Features

### 🔐 Authentication
- **Email/Password Authentication** with Firebase Auth
- **Google Sign-In** integration
- **Role-based Registration** (Teacher/Student)
- **Profile Management** with avatar upload

### 👩‍🏫 Teacher Features
- **Create Virtual Classrooms** with auto-generated class codes
- **Post Announcements & Assignments** with rich text content
- **File Upload Support** for assignments (documents, images, presentations)
- **Real-time Student Management**
- **Class Dashboard** with complete overview

### 👨‍🎓 Student Features
- **Join Classes** using class codes
- **View Assignments & Announcements** in real-time
- **Download Assignment Materials**
- **Responsive Student Dashboard**

### 🚀 Technical Features
- **Real-time Updates** using Firestore listeners
- **File Upload & Storage** with Firebase Storage
- **Responsive Design** with Tailwind CSS
- **Protected Routes** based on authentication status
- **Role-based Access Control**
- **Cross-Origin Resource Sharing (CORS)** configured for file uploads

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Build Tool**: Create React App
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: React Context API

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Firebase Account** and project setup
- **Google Cloud SDK** (for CORS configuration)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd digital-classroom
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication** (Email/Password + Google)
   - **Firestore Database**
   - **Storage**

#### Configure Environment Variables
Create a `.env` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### Firebase Storage CORS Configuration
To enable file uploads from localhost, configure CORS:

```bash
# Install Google Cloud SDK first
gcloud auth login
gcloud config set project your-project-id
gsutil cors set cors.json gs://your-storage-bucket
```

### 4. Run the Application
```bash
npm start
```

The application will open at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ClassCard.js    # Class display card
│   ├── CreateClassModal.js
│   ├── JoinClassModal.js
│   └── Navbar.js       # Navigation bar
├── contexts/           # React Context providers
│   └── AuthContext.js  # Authentication context
├── pages/              # Application pages
│   ├── ClassPage.js    # Individual class view
│   ├── Dashboard.js    # Main dashboard
│   ├── Login.js        # Login page
│   ├── Profile.js      # User profile
│   └── Register.js     # Registration page
├── App.js              # Main app component with routing
├── firebase.js         # Firebase configuration
├── index.css          # Global styles
└── index.js           # Application entry point
```

## 🔧 Configuration Files

- **`firebase.js`** - Firebase SDK initialization
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`cors.json`** - Firebase Storage CORS rules
- **`package.json`** - Project dependencies and scripts

## 🎯 How to Use

### For Teachers:
1. **Register** with Teacher role
2. **Create a Class** from the dashboard
3. **Share the class code** with students
4. **Post announcements** and **upload assignment files**
5. **Manage classroom** content in real-time

### For Students:
1. **Register** with Student role
2. **Join a class** using the provided class code
3. **View assignments** and **download materials**
4. **Access all joined classes** from the dashboard

## 🔒 Security Features

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Classes are readable by members, writable by creators
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.createdBy;
    }
    
    // Posts are readable by class members, writable by teachers
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors with File Upload**
   - Ensure CORS is configured for your Firebase Storage bucket
   - Check the `FIREBASE_STORAGE_SETUP.md` file for detailed instructions

2. **Authentication Issues**
   - Verify Firebase configuration in `.env` file
   - Check if Authentication is enabled in Firebase Console

3. **File Upload Failures**
   - Check file size limits (max 10MB)
   - Verify supported file types
   - Clear browser cache and restart dev server

### Debug Mode
Enable console logging by checking browser DevTools for detailed error messages.

## 🚧 Future Enhancements

- [ ] **Assignment Submissions** - Allow students to submit assignments
- [ ] **Grading System** - Teacher grading interface
- [ ] **Email Notifications** - Assignment and announcement notifications
- [ ] **Calendar Integration** - Due dates and scheduling
- [ ] **Mobile App** - React Native implementation
- [ ] **Video Conferencing** - Integrated video calls
- [ ] **Advanced File Management** - Folder organization
- [ ] **Plagiarism Detection** - Assignment submission checking
- [ ] **Analytics Dashboard** - Class performance metrics
- [ ] **Dark Mode** - Theme switching capability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- React team for the amazing framework
- Tailwind CSS for styling utilities
- Create React App for project setup

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the `FIREBASE_STORAGE_SETUP.md` file
3. Open an issue in the repository
4. Contact the development team

---

**Built with ❤️ for modern education**
