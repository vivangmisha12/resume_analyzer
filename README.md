# 🚀 AI Resume Analyzer

An intelligent, full-stack web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). The application analyzes resumes against Job Descriptions (JDs), calculates an ATS match score, and leverages AI (via OpenRouter/Gemini) to provide actionable feedback, missing keywords, and interview preparation tips.

---

## ✨ Features

- **ATS Score Calculation:** Deterministic scoring algorithm to match resume skills with required JD keywords.
- **AI-Powered Insights:** Deep analysis of strengths, weaknesses, and improvement areas using OpenRouter API (Gemini 2.5 Flash).
- **Secure File Storage:** Resumes and JDs are safely uploaded and managed via Cloudinary.
- **Premium UI/UX:** A stunning, responsive, glassmorphism-inspired dashboard built with React and Vanilla CSS.
- **Report Generation:** Shareable, printer-friendly (PDF export) analysis reports.
- **History Tracking:** Automatically saves past analyses allowing users to track their resume improvements over time.
- **Template Library:** Built-in ATS-friendly templates that users can preview and adopt.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 (built with Vite)
- **Routing:** React Router DOM
- **Styling:** Pure CSS (Responsive, Modern Glassmorphism, Print Media Queries)
- **Icons:** React Icons (`react-icons/fi`)

### Backend
- **Framework:** .NET 8 Web API (C#)
- **Database:** SQLite with Entity Framework Core
- **AI Integration:** OpenRouter API
- **Cloud Storage:** Cloudinary (for PDF/Docx uploads)
- **Text Extraction:** Custom Resume Text Extraction Engine

---

## ⚙️ Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Cloudinary Account
- OpenRouter API Key

### 1. Clone the Repository
```bash
git clone https://github.com/vivangmisha12/resume_analyzer.git
cd resume_analyzer
```

### 2. Backend Setup
1. Navigate to the API folder:
   ```bash
   cd backend/ResumeAnalyzer.API
   ```
2. Create an `appsettings.json` file based on the provided template:
   ```bash
   cp appsettings.example.json appsettings.json
   ```
3. Update `appsettings.json` with your actual API keys:
   - Your Cloudinary `CloudName`, `ApiKey`, and `ApiSecret`
   - Your OpenRouter `ApiKey`
4. Run Database Migrations (if applicable) and start the server:
   ```bash
   dotnet build
   dotnet run
   ```
   *The backend will typically start on `http://localhost:5275`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically start on `http://localhost:5173`.*

---

## 🔒 Security Note
- **Never commit your API keys.** The `.gitignore` is configured to ignore `.env` files and `appsettings.json`. Always use environment variables in production.

## 🚀 Deployment

- **Frontend:** Can be easily deployed on [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Ensure to update API endpoint URLs before building.
- **Backend:** Can be deployed on platforms like [Render.com](https://render.com), Azure App Service, or AWS. Configure Environment Variables for `Cloudinary` and `OpenRouter` in the hosting dashboard.

---

## 📝 License
This project is for educational and portfolio purposes. 
