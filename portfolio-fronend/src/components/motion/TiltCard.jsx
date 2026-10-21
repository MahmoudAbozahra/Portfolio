import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { spring } from './motionTokens';

const TiltCard = ({ children, className = '', float = false, delay = 0, as = 'div' }) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const pointerX = useMotionValue(.5);
  const pointerY = useMotionValue(.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [4, -4]), spring);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-4, 4]), spring);
  const lightX = useTransform(pointerX, [0, 1], ['0%', '100%']);
  const lightY = useTransform(pointerY, [0, 1], ['0%', '100%']);
  const Component = motion[as] || motion.div;
  const move = (event) => {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };
  const reset = () => { pointerX.set(.5); pointerY.set(.5); };
  return (
    <Component ref={ref} className={`tilt-card ${className}`} onPointerMove={move} onPointerLeave={reset} style={reduceMotion ? undefined : { rotateX, rotateY, '--light-x': lightX, '--light-y': lightY }} animate={float && !reduceMotion ? { y: [0, -6, 0] } : undefined} transition={float ? { duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay } : spring}>{children}</Component>
  );
};

export default TiltCard;
