import { useNavigate } from 'react-router-dom'
import { FiCheck, FiArrowRight, FiFileText, FiTarget, FiLock, FiLayers, FiLinkedin, FiGithub, FiTwitter } from 'react-icons/fi'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <FiTarget />,
      title: 'Precision Parsing',
      description: 'Our engine extracts and evaluates your professional experience exactly how enterprise ATS systems do.'
    },
    {
      icon: <FiLayers />,
      title: 'Structural Analysis',
      description: 'Get immediate feedback on formatting, keyword density, and structural integrity.'
    },
    {
      icon: <FiLock />,
      title: 'Enterprise Security',
      description: 'Your career data remains strictly confidential with end-to-end encryption.'
    },
    {
      icon: <FiFileText />,
      title: 'Universal Compatibility',
      description: 'Seamlessly process complex PDFs and DOCX files without losing context.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Upload Document',
      description: 'Securely upload your current resume in PDF or Word format.'
    },
    {
      number: '02',
      title: 'System Evaluation',
      description: 'Our parser scans your document against thousands of successful industry resumes.'
    },
    {
      number: '03',
      title: 'Actionable Report',
      description: 'Receive a detailed breakdown of strengths, weaknesses, and missing keywords.'
    }
  ]

  return (
    <div className="home-premium">
      {/* Hero Section */}
      <section className="hero-premium">
        <div className="hero-content-premium">
          <div className="hero-overline">Resume Intelligence Platform</div>
          <h1 className="hero-title-premium">
            Craft a Resume That<br/>Opens Doors.
          </h1>
          <p className="hero-subtitle-premium">
            Get actionable, data-driven feedback on your resume. Our parsing engine evaluates your document against industry-standard ATS criteria to help you land the interview.
          </p>
          <div className="hero-actions-premium">
            <button className="btn-solid" onClick={() => navigate('/register')}>
              Start Free Analysis <FiArrowRight />
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Platform
            </button>
          </div>
          <div className="hero-metrics">
            <div className="metric">
              <span className="metric-value">10k+</span>
              <span className="metric-label">Professionals</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric">
              <span className="metric-value">92%</span>
              <span className="metric-label">Interview Rate</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric">
              <span className="metric-value">Enterprise</span>
              <span className="metric-label">Grade Parsing</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual-premium">
          <div className="mockup-window">
            <div className="mockup-header">
              <span className="dot dot-r"></span>
              <span className="dot dot-y"></span>
              <span className="dot dot-g"></span>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
              <div className="mockup-main">
                <div className="mockup-score-banner">
                  <div className="score-circle-premium">92</div>
                  <div className="score-text">
                    <h4>Excellent Fit</h4>
                    <p>Your document passes standard ATS checks.</p>
                  </div>
                </div>
                <div className="skeleton-line title"></div>
                <div className="skeleton-line paragraph"></div>
                <div className="skeleton-line paragraph short"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-premium">
        <div className="section-head">
          <h2>Professional Grade Tools</h2>
          <p>Built for ambitious professionals who demand precision.</p>
        </div>
        <div className="features-grid-premium">
          {features.map((feature, index) => (
            <div key={index} className="feature-card-premium">
              <div className="feature-icon-premium">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="workflow-premium">
        <div className="section-head">
          <h2>Streamlined Process</h2>
          <p>From upload to optimization in under 60 seconds.</p>
        </div>
        <div className="workflow-grid">
          {steps.map((step, index) => (
            <div key={index} className="workflow-step">
              <div className="step-indicator">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-premium">
        <div className="cta-box">
          <h2>Elevate your career trajectory today.</h2>
          <p>Join thousands of professionals landing roles at top-tier companies.</p>
          <ul className="cta-benefits">
            <li><FiCheck /> No credit card required</li>
            <li><FiCheck /> Instant comprehensive report</li>
            <li><FiCheck /> Privacy guaranteed</li>
          </ul>
          <button className="btn-solid-light" onClick={() => navigate('/register')}>
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-premium">
        <div className="footer-layout">
          <div className="footer-brand">
            <h4>ResumeAI</h4>
            <p>Elevating professional narratives through data-driven analysis.</p>
            <div className="social-links">
              <FiLinkedin />
              <FiTwitter />
              <FiGithub />
            </div>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h5>Platform</h5>
              <a href="#features">Features</a>
              <a href="#workflow">How it Works</a>
              <a href="#">Pricing</a>
            </div>
            <div className="link-group">
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="link-group">
              <h5>Legal</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
