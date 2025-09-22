import React from "react";
import './Navbar.css';
import FilterGroup from "../filterGroup/FilterGroup";
import SearchInput from "../searchInput/SearchInput";

export default function Navbar() {
    return (
        <div className="navbar">
            <FilterGroup />
            <SearchInput />
        </div>
    );
}