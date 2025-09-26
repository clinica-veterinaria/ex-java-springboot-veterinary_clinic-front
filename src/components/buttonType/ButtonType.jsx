import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from "lucide-react";
import './ButtonType.css';

const ButtonType = ({ 
  initialType = 'estandar', 
  onTypeChange = () => {}
}) => {
  const [type, setType] = useState(initialType);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  const handleTypeChange = (newType) => {
    setType(newType);
    setIsOpen(false);
    onTypeChange(newType);
  };

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: 132
      });
    }
    setIsOpen(!isOpen);
  };

  const getButtonClass = () => {
    return `button-type button-type--${type}`;
  };

  const renderDropdownIcon = () => (
    <span className={`dropdown-icon ${isOpen ? 'dropdown-icon--open' : ''}`}> 
      <ChevronDown size={20} />
    </span>
  );

  const getTypeText = () => {
    switch (type) {
      case 'estandar': return 'STANDARD';
      case 'urgente': return 'URGENT';
      default: return 'STANDARD';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="button-type-container" ref={containerRef}>
      <button 
        ref={buttonRef}
        className={getButtonClass()}
        onClick={toggleDropdown}
        type="button"
      >
        {getTypeText()}
        {renderDropdownIcon()}
      </button>

      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999
          }}>
          {type === 'estandar' && (
            <button className="dropdown-item dropdown-item--urgente" onClick={() => handleTypeChange('URGENT')} type="button">Urgente</button>
          )}
          {type === 'urgente' && (
            <button className="dropdown-item dropdown-item--estandar" onClick={() => handleTypeChange('STANDARD')} type="button">Estándar</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonType;
