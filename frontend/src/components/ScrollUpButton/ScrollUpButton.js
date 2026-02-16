import React from 'react';
import './ScrollUpButton.css';

const ScrollUpButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a href="#top" className="scroll-up-btn" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
      ↑
    </a>
  );
};

export default ScrollUpButton;
