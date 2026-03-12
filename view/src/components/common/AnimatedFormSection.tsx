import { AnimatePresence, motion } from 'framer-motion';
export function AnimatedFormSection({
  stepId,
  children,
}: {
  stepId: string;
  children: React.ReactNode;
}) {
  const staggerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepId}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="flex flex-col gap-4"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
