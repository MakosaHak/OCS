import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProfileDetail from './pages/ProfileDetail';
import AddProfile from './pages/AddProfile';
import Admin from './pages/Admin';
import Header from './components/Header';
import Footer from './components/Footer';
import { AlertCircle } from 'lucide-react';

function App() {
  const isConfigured = import.meta.env.VITE_SUPABASE_URL && 
                      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (!isConfigured) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div className="card" style={{ padding: '3rem', maxWidth: '500px' }}>
          <AlertCircle size={48} color="#e11d48" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Configuration Incomplète</h2>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            L'application ne peut pas se connecter à la base de données. 
            <br /><br />
            <strong>Action requise :</strong> Ajoutez les variables <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans les paramètres de votre hébergeur (Netlify/Vercel).
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<ProfileDetail />} />
            <Route path="/add" element={<AddProfile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
