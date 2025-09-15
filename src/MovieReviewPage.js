import React, { useState, useEffect } from 'react';
import './MovieReviewPage.css';
import SignUpLoginPage from './SignUpLoginPage';
import ShowInfoPage from './ShowInfoPage';
import SearchResults from './SearchResults';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function MovieReviewPage() {
    const [showAuth, setShowAuth] = useState(false);
    const [username, setUsername] = useState('');
    const [search, setSearch] = useState('');
    const [popularShows, setPopularShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
    const [bannerIndex, setBannerIndex] = useState(0);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [moreShows, setMoreShows] = useState([]);
    const [showPage, setShowPage] = useState(2);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch banner shows
    useEffect(() => {
        async function fetchPopularShows() {
            const res = await fetch(
                `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
            );
            const data = await res.json();
            setPopularShows(data.results ? data.results.slice(0, 5) : []);
        }
        fetchPopularShows();
    }, []);

    // Fetch initial grid shows
    useEffect(() => {
        async function fetchInitialShows() {
            const res = await fetch(
                `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=2`
            );
            const data = await res.json();
            setMoreShows(data.results ? data.results.slice(0, 12) : []);
        }
        fetchInitialShows();
    }, []);

    // Rotating banner effect
    useEffect(() => {
        if (popularShows.length === 0) return;
        const interval = setInterval(() => {
            setBannerIndex((prev) => (prev + 1) % popularShows.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [popularShows]);

    // Load more shows when "Load More" button is clicked
    const loadMoreShows = async () => {
        setLoadingMore(true);
        const nextPage = showPage + 1;
        const res = await fetch(
            `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${nextPage}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            setMoreShows(prev => {
                const combined = [...prev, ...data.results];
                return combined.length > 50 ? combined.slice(0, 50) : combined;
            });
            setShowPage(nextPage);
        }
        setLoadingMore(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUsername('');
    };

    // Search TMDB for shows/movies and redirect to SearchResults page
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) return;
        const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
        setShowSearchResults(true);
    };

    if (selectedShow) {
        return (
            <ShowInfoPage
                id={selectedShow.id}
                type={selectedShow.media_type}
                onBack={() => setSelectedShow(null)}
            />
        );
    }

    if (showSearchResults) {
        return (
            <SearchResults
                results={searchResults}
                onSelect={item => setSelectedShow(item)}
                onBack={() => setShowSearchResults(false)}
            />
        );
    }

    return (
        <div className="movie-review-container">
            <header className="movie-review-header">
                <h1 style={{ margin: 0 }}>Rotten Potatoes</h1>
                <form onSubmit={handleSearch} className="navbar-search-form">
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
                <div>
                    {username ? (
                        <>
                            <span style={{ marginRight: 12 }}>Hello, {username}</span>
                            <button
                                className="navbar-auth-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            className="navbar-auth-btn"
                            onClick={() => setShowAuth(true)}
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </header>

            {/* Netflix-style Rotating Banner using Backdrops */}
            {popularShows.length > 0 && (
                <div className="banner-container">
                    <div
                        className={`banner-card`}
                        onClick={() => setSelectedShow({ ...popularShows[bannerIndex], media_type: 'tv' })}
                    >
                        <img
                            src={popularShows[bannerIndex].backdrop_path
                                ? `https://image.tmdb.org/t/p/w1280${popularShows[bannerIndex].backdrop_path}`
                                : (popularShows[bannerIndex].poster_path
                                    ? `https://image.tmdb.org/t/p/w500${popularShows[bannerIndex].poster_path}`
                                    : 'https://via.placeholder.com/1280x400?text=No+Image')}
                            alt={popularShows[bannerIndex].name}
                            className="banner-poster"
                        />
                        <div className="banner-info">
                            <div className="banner-title">
                                {popularShows[bannerIndex].name}
                            </div>
                            <div className="banner-year">
                                {popularShows[bannerIndex].first_air_date?.slice(0, 4)}
                            </div>
                            <div className="banner-overview">
                                {popularShows[bannerIndex].overview?.slice(0, 180)}...
                            </div>
                        </div>
                    </div>
                    <div className="banner-dots">
                        {popularShows.map((_, idx) => (
                            <span
                                key={idx}
                                className={`banner-dot${idx === bannerIndex ? ' active' : ''}`}
                                onClick={() => {
                                    setBannerIndex(idx);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {showAuth && !username && (
                <SignUpLoginPage
                    onAuth={(name) => {
                        setUsername(name);
                    }}
                    onClose={() => setShowAuth(false)}
                />
            )}

            {/* Grid of More Shows/Movies */}
            <div className="show-grid">
                {moreShows.map(show => (
                    <div
                        key={show.id}
                        className="show-grid-card"
                        onClick={() => setSelectedShow({ ...show, media_type: 'tv' })}
                    >
                        <img
                            src={show.poster_path
                                ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                                : 'https://via.placeholder.com/300x450?text=No+Image'}
                            alt={show.name}
                            className="show-grid-poster"
                        />
                        <div className="show-grid-title">{show.name}</div>
                        <div className="show-grid-year">{show.first_air_date?.slice(0, 4)}</div>
                    </div>
                ))}
            </div>
            {/* Load More button appears only if less than 50 shows are displayed */}
            {moreShows.length < 50 && (
                <div style={{ textAlign: 'center', margin: '32px 0' }}>
                    <button
                        className="navbar-search-btn"
                        onClick={loadMoreShows}
                        disabled={loadingMore}
                    >
                        {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default MovieReviewPage;