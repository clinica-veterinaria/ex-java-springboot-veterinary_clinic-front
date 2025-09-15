import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from "lucide-react";
import './ButtonType.css';

const ButtonType = ({ 
  initialtype = 'estandar', 
  appointmentDate = null,
  ontypeChange = () => {}
}) => {
  const [type, settype] = useState(initialtype);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  const handletypeChange = (newtype) => {
    settype(newtype);
    setIsOpen(false);
    ontypeChange(newtype);
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

  const renderDropdownIcon = () => {
    return <span className={`dropdown-icon ${isOpen ? 'dropdown-icon--open' : ''}`}> 
        <ChevronDown size={20} />
    </span>;
  };

  const gettypeText = () => {
    switch (type) {
      case 'estandar':
        return 'Estándar';
      case 'urgente':
        return 'Urgente';
      default:
        return 'Estándar';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
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
        {gettypeText()}
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
          }}
        >
          {type === 'estandar' && (
            <button 
              className="dropdown-item dropdown-item--urgente"
              onClick={() => handletypeChange('urgente')}
              type="button"
            >
              Urgente
            </button>
          )}
          {type === 'urgente' && (
            <button 
              className="dropdown-item dropdown-item--estandar"
              onClick={() => handletypeChange('estandar')}
              type="button"
            >
              Estándar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonType;