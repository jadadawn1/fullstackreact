import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('login'); // 'login' or 'register'

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let result;
    if (view === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    if (result.error) {
      setError(result.error.message);
    } else {
      // Force session refresh after login/register
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        onAuth();
      }
    }
    setLoading(false);
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div>
      <h2>{view === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : view === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button onClick={() => setView(view === 'login' ? 'register' : 'login')}>
        {view === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
      <hr />
      <button onClick={() => handleOAuth('github')} disabled={loading}>
        {loading ? 'Loading...' : 'Sign in with GitHub'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Auth;
