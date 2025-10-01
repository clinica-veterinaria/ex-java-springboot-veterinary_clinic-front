import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from "lucide-react";
import './ButtonStatus.css';

const mapStatusToInternal = (inputStatus) => {
  if (!inputStatus) return 'pendiente';
  
  const lower = inputStatus.toLowerCase();
  
  if (lower === 'pending') return 'pendiente';
  if (lower === 'attended') return 'atendido';
  if (lower === 'expired') return 'expirada';
  
  return lower;
};

const mapStatusToBackend = (internalStatus) => {
  switch (internalStatus) {
    case 'pendiente':
      return 'PENDING'; 
    case 'atendido':
      return 'ATTENDED'; 
    case 'expirada':
      return 'MISSED';
    default:
      return 'PENDING';
  }
};

const ButtonStatus = ({ initialStatus = 'pendiente', appointmentDatetime = null, onStatusChange = () => {}}) => {
  const [status, setStatus] = useState(mapStatusToInternal(initialStatus));
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setStatus(mapStatusToInternal(initialStatus));
  }, [initialStatus]);

  const handleStatusChange = (newStatus) => {
    const newStatusInternal = mapStatusToInternal(newStatus); 
    setStatus(newStatusInternal);
    setIsOpen(false);
    onStatusChange(mapStatusToBackend(newStatusInternal)); 
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
    return (
        <span className={`dropdown-icon ${isOpen ? 'dropdown-icon--open' : ''}`}> 
            <ChevronDown size={16} />
        </span>
    );
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
    if (appointmentDatetime && status === 'pendiente') {
      const appointmentDateTime = new Date(appointmentDatetime);
      const now = new Date();
      
      if (now > appointmentDateTime) {
        setStatus('expirada');
      }
    }
  }, [appointmentDatetime, status]);


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

  const isDisabled = status === 'expirada' || status === 'atendido';

  return (
    <div className="button-status-container" ref={containerRef}>
      <button className={getButtonClass()} onClick={toggleDropdown} disabled={isDisabled} type="button">
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