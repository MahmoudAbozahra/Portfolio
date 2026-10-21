import React, { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

const AuroraBackground = () => {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(.5);
  const pointerY = useMotionValue(.5);
  const smoothX = useSpring(pointerX, { stiffness: 35, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 35, damping: 22 });
  const nearX = useTransform(smoothX, [0, 1], [-18, 18]);
  const nearY = useTransform(smoothY, [0, 1], [-12, 12]);
  const farX = useTransform(smoothX, [0, 1], [12, -12]);
  const farY = useTransform(smoothY, [0, 1], [8, -8]);
  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const move = (event) => { pointerX.set(event.clientX / window.innerWidth); pointerY.set(event.clientY / window.innerHeight); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduceMotion, pointerX, pointerY]);
  return <div className="aurora" aria-hidden="true"><motion.span className="aurora-shape aurora-one" style={reduceMotion ? undefined : { x: nearX, y: nearY }} /><motion.span className="aurora-shape aurora-two" style={reduceMotion ? undefined : { x: farX, y: farY }} /><span className="aurora-shape aurora-three" /><span className="aurora-grain" /></div>;
};

export default AuroraBackground;
