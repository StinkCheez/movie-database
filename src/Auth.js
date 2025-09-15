import React, { useState } from 'react';

function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        onAuth(data.username);
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
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block' }}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={{ margin: 4, padding: 8 }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ margin: 4, padding: 8 }}
        />
        <button type="submit" style={{ margin: 4, padding: 8 }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <div>
        <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: 8 }}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default Auth;