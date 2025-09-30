import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './FilterGroup.css';
import FilterPill from "../filterPills/FilterPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export default function FilterGroup({ onFilterChange }) {

    const [selectedFilters, setSelectedFilters] = useState([]);
    const location = useLocation();

    const filters = [
        "Ordenar por fecha",
        "Urgencia",
        "Estándar",
        "Perro",
        "Gato",
        "Hembra",
        "Macho"
    ];

    useEffect(() => {
        setSelectedFilters([]);
        if (onFilterChange) {
            onFilterChange([]);
        }
    }, [location.pathname]);


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

    return (
        <div className="filter-group">
            <FontAwesomeIcon icon={faFilter} className="faFilter" />
            {filters.map((filter) => (
                <FilterPill key={filter} isSelected={selectedFilters.includes(filter)} onClick={() => handleFilterClick(filter)}>{filter}</FilterPill>
            ))}
        </div>
    );

}