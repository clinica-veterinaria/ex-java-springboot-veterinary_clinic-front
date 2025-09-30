import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState([]);
    const location = useLocation();

    // Limpiar búsqueda y filtros al cambiar de página
    useEffect(() => {
        setSearchTerm("");
        setFilters([]);
    }, [location.pathname]);

    return (
        <SearchContext.Provider value={{ 
            searchTerm, 
            setSearchTerm, 
            filters, 
            setFilters 
        }}>
            {children}
        </SearchContext.Provider>
    );
}

// Hook personalizado para usar el contexto fácilmente
export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch debe usarse dentro de SearchProvider');
    }
    return context;
};