import React, { useState, useEffect } from 'react';
import './FeedbackModal.css';

export default function FeedbackModal({ message, type = "success", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="feedback__overlay">
      <div className={`feedback__container ${type === "success" ? 'feedback-message--success' : 'feedback-message--error'}`}>
        {message}
      </div>
    </div>
  );
}
