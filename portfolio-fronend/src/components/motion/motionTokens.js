export const motionEase = [0.22, 1, 0.36, 1];
export const motionDurations = { fast: 0.24, base: 0.55, slow: 0.8 };
export const spring = { type: 'spring', stiffness: 170, damping: 22, mass: 0.75 };
export const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: motionDurations.slow, ease: motionEase } }
};
