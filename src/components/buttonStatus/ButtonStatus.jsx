import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from "lucide-react";
import './ButtonStatus.css';

const ButtonStatus = ({ 
  initialStatus = 'pendiente', 
  appointmentDate = null,
  onStatusChange = () => {}
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setIsOpen(false);
    onStatusChange(newStatus);
  };

  const toggleDropdown = () => {
    // If its attended menu wont open
    if (status === 'expirada' || status === 'atendido') return;

    setIsOpen(!isOpen);
  };

  const getButtonClass = () => {
    return `button-status button-status--${status}`;
  };

  const renderDropdownIcon = () => {
    if (status === 'expirada' || status === 'atendido') return null;
    return <span className={`dropdown-icon ${isOpen ? 'dropdown-icon--open' : ''}`}> 
        <ChevronDown size={20} />
    </span>;
  };

  const getStatusText = () => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'atendido':
        return 'Atendido';
      case 'expirada':
        return 'Expirada';
      default:
        return 'Pendiente';
    }
  };

  // Check if appointment expired
  useEffect(() => {
    if (appointmentDate && status === 'pendiente') {
      const appointmentDateTime = new Date(appointmentDate);
      const closingTime = new Date(appointmentDateTime);
      closingTime.setHours(20, 0, 0, 0);
      
      const now = new Date();
      if (now > closingTime) {
        setStatus('expirada');
        onStatusChange('expirada');
      }
    }
  }, [appointmentDate, status, onStatusChange]);

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
    <div className="button-status-container" ref={containerRef}>
      <button 
        ref={buttonRef}
        className={getButtonClass()}
        onClick={toggleDropdown}
        disabled={status === 'expirada' || status === 'atendido'}
        type="button"
      >
        {getStatusText()}
        {renderDropdownIcon()}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {status === 'pendiente' && (
            <button className="dropdown-item dropdown-item--atendido" onClick={() => handleStatusChange('atendido')} type="button">Atendido</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonStatus;