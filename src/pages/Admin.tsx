import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Camarade } from '../types';
import { Trash2, ShieldCheck, Lock, Loader2, Eye, LogOut, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [camarades, setCamarades] = useState<Camarade[]>([]);
  const [loading, setLoading] = useState(false);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      fetchCamarades();
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const fetchCamarades = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('camarades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCamarades(data || []);
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le profil de ${name} ?`);
    
    if (confirmDelete) {
      try {
        const { error } = await supabase.from('camarades').delete().eq('id', id);
        if (error) throw error;
        setCamarades(camarades.filter(c => c.id !== id));
        alert('Profil supprimé avec succès.');
      } catch (error) {
        alert('Erreur lors de la suppression. Vérifiez vos politiques RLS sur Supabase.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '8rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <motion.form 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleLogin} 
          className="card" 
          style={{ padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}
        >
          <div style={{ backgroundColor: '#eff6ff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Lock size={32} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Espace de Modération</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Entrez le code d'accès pour gérer les profils.</p>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Code secret"
            style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2em', border: '2px solid #e2e8f0', borderRadius: '12px' }}
            required
          />
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
            Déverrouiller l'accès
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
            <ShieldCheck size={32} color="var(--color-primary)" />
            Tableau de Bord
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Gérez les {camarades.length} profils inscrits</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="btn" style={{ border: '2px solid #f1f5f9', color: 'var(--color-text-muted)', background: 'white' }}>
          <LogOut size={18} /> Quitter
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f8fafc' }}>
              <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Camarade</th>
              <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Niveau</th>
              <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Téléphone</th>
              <th style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ padding: '4rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" size={32} color="var(--color-primary)" style={{ margin: '0 auto' }} />
                </td>
              </tr>
            ) : camarades.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                      {c.photo_url ? (
                        <img src={c.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : <Users size={20} style={{ margin: '10px', color: '#cbd5e1' }} />}
                    </div>
                    <span style={{ fontWeight: 600 }}>{c.prenom} {c.nom}</span>
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', padding: '4px 12px', borderRadius: '50px', backgroundColor: '#f1f5f9', fontWeight: 600 }}>
                    {c.niveau}
                  </span>
                </td>
                <td style={{ padding: '1.2rem 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {c.telephone}
                </td>
                <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Link to={`/profile/${c.id}`} className="btn" style={{ padding: '0.5rem', backgroundColor: '#f8fafc', color: 'var(--color-primary)' }}>
                      <Eye size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(c.id, `${c.prenom} ${c.nom}`)} 
                      className="btn" 
                      style={{ padding: '0.5rem', backgroundColor: '#fff1f2', color: '#e11d48' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {camarades.length === 0 && !loading && (
          <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Users size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>Aucun élève n'est encore inscrit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
