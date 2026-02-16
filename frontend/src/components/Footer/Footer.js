import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <p>Powered by: <a href="https://www.byurodev.site" target="_blank" rel="noopener noreferrer" className="sin-decoracion">byurodev.site</a></p>
        <p>&copy;VRBAGS - Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
