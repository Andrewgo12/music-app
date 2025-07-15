import { useEffect } from 'react';
// import { motion } from 'framer-motion'; // Not used
import { X } from 'lucide-react';
import Button from './Button';
import { modalAnimations } from '../../utils/animations';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75"
              onClick={onClose}
              {...modalAnimations.overlay}
            />

            {/* Modal panel */}
            <motion.div
              className={`inline-block w-full ${sizes[size]} p-6 my-8 overflow-hidden text-left align-middle bg-gray-800 shadow-xl rounded-lg`}
              {...modalAnimations.content}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between mb-4">
                  {title && (
                    <h3 className="text-lg font-medium text-white">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="text-white">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ModalHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const ModalContent = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
);

const ModalFooter = ({ children, className = '' }) => (
  <div className={`flex justify-end space-x-3 ${className}`}>
    {children}
  </div>
);

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
