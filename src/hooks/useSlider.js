import { useState, useCallback, useRef, useEffect } from 'react';

export function useSlider(initialValue = 0, min = 0, max = 100, onChange) {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);

  const updateValue = useCallback((clientX) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = (percentage / 100) * (max - min) + min;
    
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  }, [min, max, onChange]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX);
  }, [updateValue]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback((e) => {
    if (!isDragging) {
      updateValue(e.clientX);
    }
  }, [isDragging, updateValue]);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'pointer';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update value when initialValue changes
  useEffect(() => {
    if (!isDragging) {
      setValue(initialValue);
    }
  }, [initialValue, isDragging]);

  const sliderProps = {
    ref: sliderRef,
    onMouseDown: handleMouseDown,
    onClick: handleClick,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      cursor: 'pointer',
      userSelect: 'none'
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return {
    value,
    percentage,
    isDragging,
    isHovered,
    sliderProps,
    setValue
  };
}

export default useSlider;
