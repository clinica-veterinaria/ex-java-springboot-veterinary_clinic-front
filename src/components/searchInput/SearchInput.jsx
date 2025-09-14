import React, { useState } from "react"; 
import './SearchInput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchInput({ placeholder="Buscar...", onSearch }) {
    const [searchValue, setSearchValue] = useState("");

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
        if (onSearch) {
            onSearch(e.target.value); //Búsqueda en tiempo real
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(onSearch) {
            onSearch(searchValue); //Se busca al enviar
        }
    };

    return(
        <div className="search-input">
            <form onSubmit={handleSubmit}>
                <div className="search-input__container">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="faMagnifyingGlass"/>
                <input type="text" value={searchValue} onChange={handleInputChange} placeholder={placeholder} className="search-input__field" />
                </div>
            </form>
        </div>
    );
}