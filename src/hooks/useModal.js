import { useEffect, useCallback } from 'react';

export function useModal(isOpen, onClose) {
  // Handle ESC key press
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape' && isOpen) {
      console.log('🔧 ESC key pressed, closing modal');
      onClose();
    }
  }, [isOpen, onClose]);

  // Handle background click
  const handleBackgroundClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      console.log('🔧 Background clicked, closing modal');
      onClose();
    }
  }, [onClose]);

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleEscapeKey]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      const modal = document.querySelector('[data-modal="true"]');
      if (modal) {
        modal.focus();
      }
    }
  }, [isOpen]);

  return {
    handleBackgroundClick,
    handleEscapeKey
  };
}

export default useModal;
