import React from 'react';
import ftlogo from '../images/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
            
       
          <span>© 2024 Company, Inc</span>
        </div>
        <div className="footer-right">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
