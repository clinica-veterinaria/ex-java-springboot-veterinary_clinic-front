import React from 'react';
import './AlphabetIndex.css';

const AlphabetIndex = ({
  activeLetter = '',
  onLetterClick = () => {},
  availableLetters = [],
  variant = 'default',
  className = ''
}) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleLetterClick = (letter) => {
    onLetterClick(letter === activeLetter ? '' : letter);
  };

  const isLetterAvailable = (letter) => {
    return availableLetters.length === 0 || availableLetters.includes(letter);
  };

  const getLetterClassName = (letter) => {
    let classes = 'alphabet-letter';
    
    if (letter === activeLetter) {
      classes += ' alphabet-letter--active';
    }
    
    if (!isLetterAvailable(letter)) {
      classes += ' alphabet-letter--disabled';
    }
    
    return classes;
  };

  return (
    <div className={`alphabet-index alphabet-index--${variant} ${className}`}>
      <div className="alphabet-index__list">
          <div className="alphabet-index__connector" />

        {alphabet.map((letter, index) => (
          <div key={letter} className="alphabet-index__item">
            <button
              className={getLetterClassName(letter)}
              onClick={() => handleLetterClick(letter)}
              disabled={!isLetterAvailable(letter)}
              title={`Ir a pacientes que empiecen por ${letter}`}
            >
              {letter}
            </button>
            {index < alphabet.length - 1 && (
              <div className="alphabet-index__connector" />
            )}
            
          </div>
          
        ))}
          <div className="alphabet-index__connector" />

      </div>
    </div>
  );
};

export default AlphabetIndex;