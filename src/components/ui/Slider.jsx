import React from 'react';

const Slider = ({ 
  value = 0, 
  max = 100, 
  min = 0, 
  step = 1, 
  onChange, 
  className = '',
  disabled = false,
  ...props 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e) => {
    if (onChange) {
      onChange(parseFloat(e.target.value));
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, #4b5563 ${percentage}%, #4b5563 100%)`
        }}
        {...props}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .slider:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
        }
        
        .slider:disabled::-moz-range-thumb {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Slider;
