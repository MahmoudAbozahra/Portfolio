import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { fadeUp } from './motionTokens';

const AnimatedSection = ({ children, className = '', as = 'div', delay = 0, variant = 'up' }) => {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;
  const variants = variant === 'soft' ? {
    hidden: { opacity: 0, scale: .985, filter: 'blur(6px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: .7, ease: [0.22, 1, 0.36, 1], delay } }
  } : { hidden: fadeUp.hidden, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay } } };
  return <Component className={className} variants={variants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: false, amount: .16, margin: '-8% 0px -8% 0px' }}>{children}</Component>;
};

export default AnimatedSection;
