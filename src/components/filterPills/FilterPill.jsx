import React from 'react';
import './FilterPill.css';

export default function FilterPill({ children, isSelected = false, onClick }) {
    
    const pillClass = `filter-pill ${isSelected ? 'filter-pill--selected' : ''}`;

    return(
        <button className={pillClass} onClick={onClick}>{children}</button>
    );
}