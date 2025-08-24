import React from 'react';
import './WelcomePage.css';
 
function WelcomePage() {
  return (
    <div className="app">
      <header className="hero">
        <h1>Organize Your Life, One Task at a Time</h1>
        <p>Stay productive, focused, and stress-free with our intuitive to-do list and journaling tool.</p>
        <button className="cta-button">→ Get Started – It's Free</button>
      </header>
 
      <section className="features">
        <h2>Why You'll Love This To-Do List</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Simple Task Management</h3>
            <p>Add, edit, combine, and organize your tasks with ease.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Reminders</h3>
            <p>Never forget important deadlines or daily habits again.</p>
          </div>
          <div className="feature-card">
            <h3>Due Dates & Priorities</h3>
            <p>Plan your weekly posting deadlines and high priority tags.</p>
          </div>
          <div className="feature-card">
            <h3>Dark Mode Ready</h3>
            <p>Work comfortably, day or night.</p>
          </div>
        </div>
      </section>
 
      <section className="journal">
        <h2>Reflect and Grow with Daily Journals</h2>
        <p>Go beyond tasks. Our built-in journal helps you clear your mind, track your mood, and build better habits. Whether you're writing morning thoughts or nighttime reflections, it's your space to stay grounded and motivated.</p>
        <button className="secondary-button">Start Journaling Today</button>
      </section>
 
      <section className="newsletter">
        <h2>Join Our Community!</h2>
        <p>Subscribe to get the latest news, special offers, and updates straight to your inbox!</p>
        <div className="email-input">
          <input type="email" placeholder="Email" />
          <button className="subscribe-button">Subscribe</button>
        </div>
      </section>
 
      <footer className="footer">
        <button className="donate-button">Start Donating</button>
        <div className="contact-info">
          <p>Contact</p>
          <p>focusflow@gmail.com</p>
          <p>1346799087654</p>
          <p>Hangists, Semalliaud</p>
        </div>
        <div className="legal">
          <p>© 2023 FocusFlow. All rights reserved.</p>
          <p>Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
}
 
export default WelcomePage;