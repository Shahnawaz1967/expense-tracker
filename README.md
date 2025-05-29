# 💰 Expense Tracker - MERN Stack with Framer Motion

A comprehensive expense tracking web application built with the MERN stack featuring beautiful animations, JWT authentication, Google OAuth, real-time analytics, and a responsive design.

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication with secure token management
- Google OAuth 2.0 integration
- Password hashing with bcryptjs
- Protected routes and middleware
- Auto-logout on token expiry

### 💸 Expense Management
- Add, edit, and delete expenses with smooth animations
- Categorize expenses (10+ predefined categories)
- Multiple payment methods support
- Advanced filtering and search
- Pagination for large datasets

### 📊 Analytics & Insights
- Interactive charts using Recharts
- Category-wise spending breakdown (Pie charts)
- Monthly spending trends (Line charts)
- Expense statistics and summaries
- Date range filtering

### 🎨 User Experience
- **Framer Motion Animations**: Smooth page transitions, hover effects, and micro-interactions
- Fully responsive design with Tailwind CSS
- Dark/Light theme toggle
- Toast notifications
- Loading states and error handling
- Modern glassmorphism design elements

## 🎬 Framer Motion Implementation

### How Framer Motion Works in This Project

Framer Motion is a production-ready motion library for React that makes it easy to create smooth animations and interactions. Here's how I implemented it:

### Animation Variants Used

- **fadeInUp**: Elements slide up while fading in
- **fadeInDown**: Elements slide down while fading in
- **scaleIn**: Elements scale from 0.8 to 1.0
- **staggerContainer**: Parent container for staggered children
- **slideInUp**: Elements slide up from bottom

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google OAuth** - Social authentication

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library
- **React Toastify** - Notifications
- **Axios** - HTTP client



## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/expense-tracker-mern.git
cd expense-tracker-mern
\`\`\`

2. **Install backend dependencies**
\`\`\`bash
cd backend
npm install
\`\`\`

3. **Install frontend dependencies**
\`\`\`bash
cd ../frontend
npm install
\`\`\`

4. **Environment Setup**

**Backend (.env):**
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id-here
\`\`\`

**Frontend (.env):**
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
\`\`\`

5. **Start the application**

**Backend:**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

The backend will run on `http://localhost:5000` and frontend on `http://localhost:5173`.

## 🌐 Production Deployment

### Backend Deployment on Render

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. **Add environment variables:**
   \`\`\`
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   CLIENT_URL=https://your-frontend-domain.vercel.app
   GOOGLE_CLIENT_ID=your_google_client_id
   \`\`\`

### Frontend Deployment on Vercel

1. **Install Vercel CLI:**
\`\`\`bash
npm install -g vercel
\`\`\`

2. **Deploy:**
\`\`\`bash
cd frontend
vercel
\`\`\`

3. **Configure environment variables in Vercel dashboard:**
   \`\`\`
   VITE_API_URL=https://your-backend-domain.render.com/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   \`\`\`


## 🔧 Configuration

### MongoDB Setup
1. **Local MongoDB:**
   - Install MongoDB locally
   - Start MongoDB service
   - Use connection string: `mongodb://localhost:27017/expense-tracker`

2. **MongoDB Atlas:**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Replace `MONGODB_URI` in `.env`

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `http://localhost:5173` (development)
   - `https://your-domain.vercel.app` (production)
6. Copy Client ID to both backend and frontend `.env` files


## 📱 Features Showcase

### 🎭 Animation Features
- **Page Transitions**: Smooth slide animations between pages
- **Stagger Effects**: Elements animate in sequence
- **Hover Interactions**: Buttons and cards respond to mouse hover
- **Loading States**: Animated spinners and skeleton screens
- **Form Feedback**: Inputs scale and highlight on focus
- **Micro-interactions**: Small delightful animations throughout

### 📊 Dashboard Features
- **Real-time Statistics**: Animated counters and progress bars
- **Interactive Charts**: Hover effects on chart elements
- **Responsive Design**: Works perfectly on all device sizes
- **Dark Mode**: Smooth theme transitions

### 🔐 Authentication Features
- **Password Strength Indicator**: Real-time visual feedback
- **Form Validation**: Animated error messages
- **Social Login**: Google OAuth integration
- **Remember Me**: Persistent login sessions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React](https://reactjs.org/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Recharts](https://recharts.org/) - Chart Library
- [Lucide React](https://lucide.dev/) - Icon Library

## 📞 Support

If you have any questions or need help, please open an issue or contact:
- Email: heyshah24@gmail.com
- GitHub: [https://github.com/Shahnawaz1967](https://incomparable-meerkat-a4c006.netlify.app/login)

---

⭐ **Star this repository if you found it helpful!**

## 🎯 Learning Outcomes

By studying this project, you'll learn:

1. **Framer Motion Fundamentals**:
   - Animation variants and transitions
   - Gesture animations (hover, tap, drag)
   - Layout animations and shared elements
   - Stagger animations for lists
   - Page transitions and route animations

2. **React Best Practices**:
   - Context API for state management
   - Custom hooks for reusable logic
   - Component composition patterns
   - Error boundaries and loading states

3. **Full-Stack Development**:
   - RESTful API design
   - JWT authentication flow
   - Database modeling with MongoDB
   - File upload and image handling

4. **Production Deployment**:
   - Environment configuration
   - Build optimization
   - CI/CD with GitHub Actions
   - Monitoring and error tracking

5. **Modern CSS Techniques**:
   - Tailwind CSS utility classes
   - Responsive design patterns
   - Dark mode implementation
   - CSS Grid and Flexbox layouts
