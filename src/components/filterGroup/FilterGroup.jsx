import React, { useState } from "react";
import './FilterGroup.css';
import FilterPill from "../filterPills/FilterPill";

export default function FilterGroup({ onFilterChange }) {
    
    const [selectedFilters, setSelectedFilters] = useState(null);

    const filters = [
        "Ordenar por fecha",
        "Urgencia", 
        "Estándar", 
        "Perro", 
        "Gato", 
        "Hembra", 
        "Macho"
    ];

    const handleFilterClick = (filterName) => {
        let newSelected;
        
        if (selectedFilters.includes(filterName)) {
            // if it's already selected, deselect it
            newSelected = selectedFilters.filter(f => f !== filterName);
        } else {
            // if not selected, add it
            newSelected = [...selectedFilters, filterName];
        }
        
        setSelectedFilters(newSelected);
        
        if (onFilterChange) {
            onFilterChange(newSelected);
        }
    };

    return(
        <div className="filter-group">
            {filters.map((filter) => (
                <FilterPill key={filter} isSelected={selectedFilters.includes(filter)} onClick={() => handleFilterClick(filter)}>{filter}</FilterPill>
            ))}
        </div>
    );

}