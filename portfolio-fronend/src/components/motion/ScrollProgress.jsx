import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: .4 });
  return <motion.span className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
};

export default ScrollProgress;
