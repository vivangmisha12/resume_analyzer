import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCheck, FiArrowRight, FiUpload, FiBarChart2, FiZap, FiShield, FiLinkedin, FiGithub, FiTwitter } from 'react-icons/fi'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()
  const features = [
    {
      icon: <FiZap />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms analyze your resume instantly and provide actionable insights.'
    },
    {
      icon: <FiBarChart2 />,
      title: 'Detailed Scoring',
      description: 'Get comprehensive scores across multiple dimensions with visual breakdowns.'
    },
    {
      icon: <FiShield />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared. We prioritize your privacy.'
    },
    {
      icon: <FiUpload />,
      title: 'Easy Upload',
      description: 'Drag and drop your resume in any format. Supported: PDF, DOC, DOCX.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Upload Your Resume',
      description: 'Simply drag and drop or click to upload your resume file.'
    },
    {
      number: '02',
      title: 'AI Analysis Runs',
      description: 'Our AI analyzes your resume across multiple criteria in seconds.'
    },
    {
      number: '03',
      title: 'Get Insights',
      description: 'Receive detailed feedback with suggestions to improve your resume.'
    },
    {
      number: '04',
      title: 'Track Progress',
      description: 'Monitor improvements over time with our history feature.'
    }
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎯 AI-Powered Resume Analysis</div>
          <h1 className="hero-title">
            Optimize Your Resume with <span className="highlight">AI Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            Get instant, actionable feedback to make your resume stand out. Our AI analyzes every aspect and helps you land more interviews.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get Started Free <FiArrowRight />
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <p className="stat-number">10K+</p>
              <p className="stat-label">Resumes Analyzed</p>
            </div>
            <div className="stat">
              <p className="stat-number">92%</p>
              <p className="stat-label">Success Rate</p>
            </div>
            <div className="stat">
              <p className="stat-number">24/7</p>
              <p className="stat-label">Available</p>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-box">
            <div className="hero-card">
              <div className="card-header">Resume Analysis</div>
              <div className="card-content">
                <div className="score-circle">92</div>
                <p>Overall Score</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to create a winning resume</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple, fast, and effective resume optimization</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="cta-section">
        <div className="cta-content">
          <h2>Ready to Optimize Your Resume?</h2>
          <p>Join thousands of job seekers who've improved their resumes with AI analysis.</p>
          <div className="cta-features">
            <div className="cta-feature">
              <FiCheck /> First analysis FREE
            </div>
            <div className="cta-feature">
              <FiCheck /> No credit card required
            </div>
            <div className="cta-feature">
              <FiCheck /> Instant results
            </div>
          </div>
          <button className="btn-primary-large" onClick={() => navigate('/register')}>Start Your Free Analysis</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>ResumeAI</h4>
            <p>Optimize your resume with AI-powered insights.</p>
            <div className="social-icons">
              <FiLinkedin />
              <FiTwitter />
              <FiGithub />
            </div>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="/">About</a></li>
              <li><a href="/">Blog</a></li>
              <li><a href="/">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/">Privacy Policy</a></li>
              <li><a href="/">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 ResumeAI. All rights reserved.</p>
          <p>Made with ❤️ by the ResumeAI team</p>
        </div>
      </footer>
    </div>
  )
}
