// import { motion } from 'framer-motion'; // Not used
import { pageTransitions } from '../../utils/animations';

const PageTransition = ({
  children,
  key,
  className = '',
  animation = pageTransitions
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={animation.initial}
        animate={animation.animate}
        exit={animation.exit}
        transition={animation.transition}
        className={`w-full h-full ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
