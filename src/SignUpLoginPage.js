import React, { useState } from 'react';
import './MovieReviewPage.css';

function SignUpLoginPage({ onAuth, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/api/login' : '/api/register';
        const payload = isLogin
            ? { username: form.username, password: form.password }
            : { username: form.username, email: form.email, password: form.password };
        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                onAuth(data.username);
                onClose && onClose();
            } else if (data.user) {
                setIsLogin(true);
            } else {
                setError(data.error || 'Error');
            }
        } catch {
            setError('Server error');
        }
    };

    return (
        <div className="movie-review-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="auth-modal-content">
                <h2 style={{ marginBottom: 24 }}>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    {!isLogin && (
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" style={{ width: '100%', marginTop: 16 }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <button className="auth-switch" onClick={() => setIsLogin(!isLogin)} style={{ marginTop: 12 }}>
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </button>
                {onClose && (
                    <button className="auth-switch" onClick={onClose} style={{ marginTop: 8 }}>
                        Cancel
                    </button>
                )}
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            </div>
        </div>
    );
}

export default SignUpLoginPage;