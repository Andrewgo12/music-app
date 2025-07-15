// import { motion } from 'framer-motion'; // Not used
import { cardAnimations } from '../../utils/animations';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  animated = true,
  ...props
}) => {
  const baseClasses = 'bg-gray-800 rounded-lg shadow-lg overflow-hidden';
  const hoverClasses = hover ? 'cursor-pointer' : '';

  const classes = `${baseClasses} ${hoverClasses} ${className}`.trim();

  if (animated) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        initial={cardAnimations.initial}
        animate={cardAnimations.animate}
        whileHover={hover ? cardAnimations.hover : undefined}
        whileTap={hover ? cardAnimations.tap : undefined}
        layout
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 border-b border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 border-t border-gray-700 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
