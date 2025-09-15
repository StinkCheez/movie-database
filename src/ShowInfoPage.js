import React, { useEffect, useState } from 'react';
import './ShowInfoPage.css';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function ShowInfoPage({ id, type = 'tv', onHome, search, setSearch, onSearchSubmit }) {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInfo() {
            setLoading(true);
            const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&language=en-US`;
            const res = await fetch(url);
            const data = await res.json();
            setInfo(data);
            setLoading(false);
        }
        if (id) fetchInfo();
    }, [id, type]);

    return (
        <div className="show-info-container">
            <header className="movie-review-header">
                <form onSubmit={onSearchSubmit} className="navbar-search-form">
                    <input
                        type="text"
                        placeholder="Search for a show or movie..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="navbar-search-input"
                    />
                    <button type="submit" className="navbar-search-btn">
                        Search
                    </button>
                </form>
                <button className="navbar-home-btn" onClick={onHome}>
                    Home
                </button>
            </header>
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>
            ) : !info ? (
                <div style={{ textAlign: 'center', marginTop: 40 }}>No information found.</div>
            ) : (
                <div className="show-info-main">
                    <img
                        src={info.poster_path
                            ? `https://image.tmdb.org/t/p/w300${info.poster_path}`
                            : 'https://via.placeholder.com/300x450?text=No+Image'}
                        alt={info.title || info.name}
                        className="show-info-poster"
                    />
                    <div className="show-info-details">
                        <div className="show-info-title">{info.title || info.name}</div>
                        <div className="show-info-type-year">
                            {type === 'tv' ? 'TV Show' : 'Movie'} {info.release_date || info.first_air_date ? `(${(info.release_date || info.first_air_date).slice(0, 4)})` : ''}
                        </div>
                        <div className="show-info-genres">
                            <strong>Genres:</strong> {info.genres?.map(g => g.name).join(', ') || 'N/A'}
                        </div>
                        <div className="show-info-overview">
                            <strong>Overview:</strong> {info.overview || 'No overview available.'}
                        </div>
                        <div className="show-info-rating">
                            <strong>Rating:</strong> {info.vote_average ? `${info.vote_average}/10` : 'N/A'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowInfoPage;