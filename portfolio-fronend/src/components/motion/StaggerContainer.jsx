import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const staggerItem = {
  hidden: { opacity: 0, y: 22, filter: 'blur(7px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: .62, ease: [0.22, 1, 0.36, 1] } }
};

const StaggerContainer = ({ children, className = '', as = 'div' }) => {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;
  return <Component className={className} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: false, amount: .12, margin: '-8% 0px -8% 0px' }} variants={{ hidden: { transition: { staggerChildren: .035, staggerDirection: -1 } }, visible: { transition: { staggerChildren: .09 } } }}>{children}</Component>;
};

export default StaggerContainer;
