import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logoImage from '../assets/logo.jpg'
import {
  FiCheck, FiArrowRight, FiUpload, FiBarChart2,
  FiZap, FiShield, FiLinkedin, FiGithub, FiTwitter,
  FiFileText, FiTarget, FiMessageCircle, FiX
} from 'react-icons/fi'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <FiZap />,
      title: 'Resume Analysis',
      description: 'Instant, AI-driven analysis of your resume formatting, keywords, and overall structure.'
    },
    {
      icon: <FiTarget />,
      title: 'JD Matching',
      description: 'Compare your resume directly against specific Job Descriptions to see exact match rates.'
    },
    {
      icon: <FiBarChart2 />,
      title: 'ATS Score Calculation',
      description: 'Get a realistic ATS parsability score before you apply to your dream company.'
    },
    {
      icon: <FiShield />,
      title: 'Missing Skills Detection',
      description: 'Discover critical keywords and skills missing from your resume that recruiters want.'
    },
    {
      icon: <FiFileText />,
      title: 'AI Recommendations',
      description: 'Actionable bullet point suggestions to strengthen your experience section.'
    },
    {
      icon: <FiMessageCircle />,
      title: 'Interview Preparation',
      description: 'Anticipate interview questions based on the gaps identified in your profile.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Upload Resume',
      description: 'Drop your PDF/Word resume into our secure platform.'
    },
    {
      number: '2',
      title: 'Paste Job Description',
      description: 'Input the exact role you are applying for to get tailored insights.'
    },
    {
      number: '3',
      title: 'ATS Analysis',
      description: 'Our proprietary AI scans and scores your documents instantly.'
    },
    {
      number: '4',
      title: 'Download Report',
      description: 'Get actionable steps to fix your resume and land the interview.'
    }
  ]

  const templates = [
    { category: 'ATS Friendly', name: 'The Minimalist' },
    { category: 'Developer', name: 'Tech Focused' },
    { category: 'Professional', name: 'Executive Suite' },
    { category: 'Creative', name: 'Modern Portfolio' },
    { category: 'ATS Friendly', name: 'Harvard Standard' },
    { category: 'Student', name: 'Entry Level' }
  ]

  return (
    <div className="home-container">

      {/* SECTION 1: HERO SECTION */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-app-logo">
             <img src={logoImage} alt="Resume Analyzer Logo" className="app-logo-icon" />
             <span className="app-logo-text">Resume Analyzer</span>
          </div>
          <h1>Beat ATS Filters.<br />Land More Interviews.</h1>
          <p>
            Upload your resume, compare it against job descriptions, discover missing skills, and improve your ATS score with AI-powered insights.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Analyze Resume <FiArrowRight />
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}>
              View Templates
            </button>
          </div>
          <div className="trust-badges">
            <div className="trust-badge"><FiCheck /> <span>ATS Compatible</span></div>
            <div className="trust-badge"><FiCheck /> <span>AI Powered</span></div>
            <div className="trust-badge"><FiCheck /> <span>Resume + JD Matching</span></div>
            <div className="trust-badge"><FiCheck /> <span>Instant Analysis</span></div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="dashboard-mockup"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <div className="mockup-header">
              <span style={{ fontWeight: 700, color: 'var(--sidebar-dark)' }}>ATS Analysis Report</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '12px' }}>Live Preview</span>
            </div>

            <div className="mockup-image-container">
              <img src="/templates/home.jpg" alt="Resume Template Preview" className="mockup-image" />
              <div className="mockup-caption">
                <strong>Stand Out Instantly</strong>
                <p>Get your resume noticed with industry-approved, ATS-friendly templates designed to highlight your true potential.</p>
              </div>
            </div>

            <div className="mockup-mini-features">
              <div className="mini-feature"><FiCheck style={{color: 'var(--success)'}}/> ATS-Optimized Layouts</div>
              <div className="mini-feature"><FiCheck style={{color: 'var(--success)'}}/> AI Content Suggestions</div>
              <div className="mini-feature"><FiCheck style={{color: 'var(--success)'}}/> Smart Keyword Insertion</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: FEATURE HIGHLIGHTS */}
      <section id="features" className="features-section">
        <div className="section-title">Powerful ATS Optimization</div>
        <div className="section-subtitle">Everything you need to bypass robotic filters and get your resume into human hands.</div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="section-title">How It Works</div>
        <div className="section-subtitle">Four simple steps to a perfect resume match.</div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: ATS REPORT PREVIEW */}
      <section className="report-preview-section">
        <div className="report-preview-container">
          <motion.div
            className="report-card-mockup"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Software Engineer</h3>
              <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.2rem' }}>Score: 92/100</div>
            </div>

            <div className="report-section">
              <h4><FiCheck style={{ color: 'var(--success)' }} /> Matched Keywords</h4>
              <div className="skill-pills">
                <span className="skill-pill matched">React.js</span>
                <span className="skill-pill matched">Node.js</span>
                <span className="skill-pill matched">TypeScript</span>
                <span className="skill-pill matched">REST APIs</span>
                <span className="skill-pill matched">Agile</span>
              </div>
            </div>

            <div className="report-section">
              <h4><FiX style={{ color: '#EF4444' }} /> Missing Keywords</h4>
              <div className="skill-pills">
                <span className="skill-pill missing">GraphQL</span>
                <span className="skill-pill missing">AWS</span>
                <span className="skill-pill missing">Docker</span>
              </div>
            </div>

            <div className="report-section">
              <h4><FiZap style={{ color: 'var(--primary)' }} /> AI Recommendation</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5, background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                Consider adding specific metrics to your recent role. Instead of "Improved performance", write "Improved rendering performance by 40% using React.memo".
              </p>
            </div>
          </motion.div>

          <motion.div
            className="report-preview-content"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-title">Deep Dive Analysis</div>
            <div className="section-subtitle">Get actionable insights that go beyond simple spell checking. Our AI understands context and industry requirements.</div>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '0.5rem', borderRadius: '50%', color: '#A855F7' }}><FiCheck /></div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Keyword Optimization</strong>
                  <span style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Identify exact phrases ATS bots are scanning for.</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '0.5rem', borderRadius: '50%', color: '#A855F7' }}><FiCheck /></div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Formatting Checks</strong>
                  <span style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Ensure your resume layout is machine-readable.</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '0.5rem', borderRadius: '50%', color: '#A855F7' }}><FiCheck /></div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Impact Metrics</strong>
                  <span style={{ color: '#94A3B8', fontSize: '0.95rem' }}>AI suggests where to add numbers to show true impact.</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: TEMPLATES */}
      <section id="templates" className="templates-section">
        <div className="section-title">ATS-Approved Templates</div>
        <div className="section-subtitle">Start with a template that is guaranteed to pass parsing software.</div>

        <div className="templates-grid">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              className="template-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="template-image-ph">
                <FiFileText />
              </div>
              <div className="template-info">
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{template.category}</span>
                <h4>{template.name}</h4>
                <button className="btn-secondary" style={{ width: '100%' }}>Use Template</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE US (COMPARISON) */}
      <section className="comparison-section">
        <div className="section-title">Why Choose Resume Analyzer</div>
        <div className="section-subtitle">See how we stack up against traditional resume checkers.</div>

        <motion.div
          className="comparison-table-wrapper"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Us</th>
                <th>Others</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Direct JD Matching</td>
                <td><FiCheck className="check-icon" /></td>
                <td><FiX className="x-icon" /></td>
              </tr>
              <tr>
                <td>Actionable AI Insights</td>
                <td><FiCheck className="check-icon" /></td>
                <td><FiCheck className="check-icon" style={{ color: 'var(--text-muted)' }} /></td>
              </tr>
              <tr>
                <td>Real-time ATS Scoring</td>
                <td><FiCheck className="check-icon" /></td>
                <td><FiX className="x-icon" /></td>
              </tr>
              <tr>
                <td>Interview Question Gen</td>
                <td><FiCheck className="check-icon" /></td>
                <td><FiX className="x-icon" /></td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* SECTION 7: TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="section-title">Success Stories</div>
        <div className="section-subtitle">Join thousands who landed their dream jobs using our platform.</div>

        <div className="testimonials-grid">
          {[
            { name: "Sarah J.", role: "Product Manager", text: "I was applying for months with no callbacks. After fixing my missing keywords with this tool, I landed 3 interviews in a week." },
            { name: "Michael T.", role: "Software Engineer", text: "The JD matching feature is a game changer. It told me exactly which AWS technologies to highlight." },
            { name: "Elena R.", role: "Marketing Director", text: "Sleek, fast, and incredibly accurate. The ATS templates alone are worth it. Highly recommend!" }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="testimonial-rating">
                <FiZap /><FiZap /><FiZap /><FiZap /><FiZap />
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.name[0]}</div>
                <div className="author-info">
                  <h5>{testimonial.name}</h5>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="final-cta-section">
        <motion.div
          className="final-cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Improve Your ATS Score?</h2>
          <p>Don't let a robotic filter reject your hard-earned experience. Optimize your resume today and land your next role faster.</p>
          <div className="hero-buttons" style={{ justifyContent: 'center' }}>
            <button className="btn-primary" style={{ background: 'white', color: 'var(--primary)' }} onClick={() => navigate('/register')}>
              Analyze Resume
            </button>
            <button className="btn-secondary" onClick={() => navigate('/register')}>
              Get Started Free
            </button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Resume Analyzer</h4>
            <p style={{ color: '#94A3B8', maxWidth: '300px' }}>The intelligent way to optimize your resume for ATS systems and human recruiters alike.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', color: '#94A3B8', fontSize: '1.25rem' }}>
              <FiLinkedin style={{ cursor: 'pointer' }} />
              <FiTwitter style={{ cursor: 'pointer' }} />
              <FiGithub style={{ cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#94A3B8', lineHeight: 2 }}>
                <li>Features</li>
                <li>Templates</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#94A3B8', lineHeight: 2 }}>
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '3rem auto 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
          &copy; 2026 Resume Analyzer. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
