import React from 'react';
import AnimatedSection from './AnimatedSection';

const Reveal = ({ children, className = '', delay = 0, as = 'div' }) => {
  return <AnimatedSection className={className} delay={delay} as={as}>{children}</AnimatedSection>;
};

export default Reveal;
