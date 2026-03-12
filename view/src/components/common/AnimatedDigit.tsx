import { AnimatePresence, motion } from 'framer-motion';

export function AnimatedDigit({ digit }: { digit: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        position: 'relative',
        height: '1.2em',
        verticalAlign: 'bottom',
        perspective: '600px',
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: '60%', opacity: 0, rotateX: -15, filter: 'blur(4px)' }}
          animate={{ y: '0%', opacity: 1, rotateX: 0, filter: 'blur(0px)' }}
          exit={{ y: '-60%', opacity: 0, rotateX: 15, filter: 'blur(4px)' }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            display: 'inline-block',
            lineHeight: '1.2em',
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
          }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
