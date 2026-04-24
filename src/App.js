import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import ProductsList from './ProductsList';
import Auth from './Auth';
import Admin from './Admin';
import Profile from './Profile';
import { supabase } from './supabaseClient';


function ProtectedRoute({ session, role, requireAdmin, children }) {
  if (!session || !session.user) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}





function AppRoutes() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch session on mount and on auth state change
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data?.session || null);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Fetch role when session or route changes
  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      setError(null);
      if (session && session.user) {
        const { data, error } = await supabase
          .from('profile')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        setRole(data?.role || null);
        setError(error ? error.message : null);
        // Redirect admin to /admin after login
        if (data?.role === 'admin' && window.location.pathname === '/login') {
          window.location.replace('/admin');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    };
    fetchRole();
  }, [session, location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
  };

  return (
    <div className="App">
      <h1>My Product Store</h1>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/admin">Admin</Link> |{' '}
        <Link to="/profile">Profile</Link>
        {session && session.user && (
          <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>
        )}
        {/* Debug info */}
        <span style={{ marginLeft: 20, color: 'gray', fontSize: 12 }}>
          {session?.user?.id && `User: ${session.user.id}`} | Role: {role || 'none'}
        </span>
      </nav>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/login" element={<Auth onAuth={async () => {
          const { data } = await supabase.auth.getSession();
          setSession(data?.session || null);
        }} />} />
        <Route path="/admin" element={
          <ProtectedRoute session={session} role={role} requireAdmin={true}>
            <Admin session={session} role={role} />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute session={session} role={role}>
            <Profile session={session} role={role} />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
