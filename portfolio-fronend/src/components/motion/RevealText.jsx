import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { motionEase } from './motionTokens';

const RevealText = ({ text = '', className = '', as = 'h1' }) => {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] || motion.h1;
  return (
    <Component className={className} aria-label={text} initial="hidden" animate="visible">
      {text.split(' ').map((word, index) => <span className="reveal-word-mask" aria-hidden="true" key={`${word}-${index}`}><motion.span variants={{ hidden: reduceMotion ? {} : { y: '110%', opacity: 0, filter: 'blur(8px)' }, visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { delay: .12 + index * .07, duration: .72, ease: motionEase } } }}>{word}</motion.span></span>)}
    </Component>
  );
};

export default RevealText;
