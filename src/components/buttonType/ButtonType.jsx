import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from "lucide-react";
import './ButtonType.css';


const mapTypeToInternal = (inputType) => {
  if (!inputType) return 'estandar';
  const lower = inputType.toLowerCase();
  if (lower === 'standard') return 'estandar';
  if (lower === 'urgent') return 'urgente';
  return lower;
};

const mapTypeToAPI = (internalType) => {
  if (internalType === 'estandar') return 'STANDARD';
  if (internalType === 'urgente') return 'URGENT';
  return 'STANDARD';
};

const ButtonType = ({ 
  initialType = 'estandar', 
  onTypeChange = () => {}
}) => {
  const [type, setType] = useState(mapTypeToInternal(initialType));
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setType(mapTypeToInternal(initialType));
  }, [initialType]);

  const handleTypeChange = (newType) => {
    const newStatusInternal = mapTypeToInternal(newType);
    setType(newType);
    setIsOpen(false);
    onTypeChange(mapTypeToAPI(newStatusInternal));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getButtonClass = () => {
    return `button-type button-type--${type}`;
  };

  const renderDropdownIcon = () => (
    <span className={`dropdown-icon ${isOpen ? 'dropdown-icon--open' : ''}`}> 
      <ChevronDown size={16} />
    </span>
  );

  const getTypeText = () => {
    return mapTypeToAPI(type);
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
      <button className={getButtonClass()} onClick={toggleDropdown} type="button">
        {getTypeText()}
        {renderDropdownIcon()}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
        {/* If standard change to urgent */}
        {type === 'estandar' && (
          <button className="dropdown-item dropdown-item--urgente" onClick={() => handleTypeChange('urgente')} type="button">Urgente</button>
        )}
        {/* If urgent change to standard */}
        {type === 'urgente' && (
          <button className="dropdown-item dropdown-item--estandar" onClick={() => handleTypeChange('estandar')} type="button">Estándar</button>
        )}
      </div>
      )}
    </div>
  );
};

export default ButtonType;
