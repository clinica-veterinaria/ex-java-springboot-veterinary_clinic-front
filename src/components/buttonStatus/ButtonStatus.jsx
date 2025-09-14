import React, { useState, useEffect, useRef } from 'react';
import './ButtonStatus.css';

const ButtonStatus = ({ 
  initialStatus = 'pendiente', 
  appointmentDate = null,
  onStatusChange = () => {}
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);

  // Check if appointment is expired
  const isExpired = appointmentDate && new Date(appointmentDate) < new Date() && status === 'pendiente';

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setIsOpen(false);
    onStatusChange(newStatus);
  };

  const toggleDropdown = () => {
    if (status !== 'expirada') {
      if (!isOpen && buttonRef.current) {
        // Calculate position when opening
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width
        });
      }
      setIsOpen(!isOpen);
    }
  };

  // Auto-set to expired if conditions are met
  useEffect(() => {
    if (isExpired && status === 'pendiente') {
      setStatus('expirada');
      onStatusChange('expirada');
    }
  }, [appointmentDate, status, isExpired, onStatusChange]);

  const getButtonClass = () => {
    return `button-status button-status--${status}`;
  };

  const renderDropdownIcon = () => {
    if (status === 'expirada') return null;
    return <span className={`dropdown-icon ${isOpen ? 'dropdown-icon--open' : ''}`}>▼</span>;
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

  return (
    <div className="button-status-container">
      <button 
        ref={buttonRef}
        className={getButtonClass()}
        onClick={toggleDropdown}
        disabled={status === 'expirada'}
        type="button"
      >
        {getStatusText()}
        {renderDropdownIcon()}
      </button>
      
      {/* Dropdown con position fixed */}
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
          {status === 'pendiente' && (
            <button 
              className="dropdown-item dropdown-item--atendido"
              onClick={() => handleStatusChange('atendido')}
              type="button"
            >
              Atendido
            </button>
          )}
          {status === 'atendido' && (
            <button 
              className="dropdown-item dropdown-item--pendiente"
              onClick={() => handleStatusChange('pendiente')}
              type="button"
            >
              Pendiente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonStatus;