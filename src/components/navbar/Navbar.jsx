import React from "react";
import './Navbar.css';
import FilterGroup from "../filterGroup/FilterGroup";
import SearchInput from "../searchInput/SearchInput";
import { useSearch } from "../../context/SearchContext"

export default function Navbar() {
     const { setSearchTerm, setFilters } = useSearch();
    return (
        <div className="navbar">
            <FilterGroup  
                onFilterChange={setFilters}/>
            <SearchInput onSearch={setSearchTerm}/>
        </div>
    );
}