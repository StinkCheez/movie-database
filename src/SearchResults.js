import React from 'react';
import './SearchResults.css';

function SearchResults({ results, onSelect, onBack }) {
    return (
        <div className="search-results-container">
            <button
                className="search-results-back-btn"
                onClick={onBack}
            >
                Back
            </button>
            <div className="movie-results">
                {results.map(item => (
                    (item.media_type === 'tv' || item.media_type === 'movie') && (
                        <div
                            key={item.id}
                            className="movie-result-card"
                            onClick={() => onSelect(item)}
                        >
                            <img
                                src={item.poster_path
                                    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                                    : 'https://via.placeholder.com/180x270?text=No+Image'}
                                alt={item.title || item.name}
                            />
                            <div className="movie-result-title">{item.title || item.name}</div>
                            <div className="movie-result-year">
                                {(item.release_date || item.first_air_date || '').slice(0, 4)}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

export default SearchResults;