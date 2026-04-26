import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Camarade, NiveauScolaire } from '../types';
import CamaradeCard from '../components/CamaradeCard';
import { Search, Loader2, Plus, Users2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [camarades, setCamarades] = useState<Camarade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNiveau, setFilterNiveau] = useState<NiveauScolaire | 'Tous'>('Tous');

  useEffect(() => {
    fetchCamarades();
  }, []);

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
      console.error('Error fetching camarades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCamarades = camarades.filter((c) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Recherche par nom complet
    const matchesName = `${c.prenom} ${c.nom}`.toLowerCase().includes(searchLower);
    
    // Recherche par téléphone (on enlève les espaces du numéro stocké pour faciliter la recherche)
    const matchesPhone = c.telephone.replace(/\s+/g, '').includes(searchLower.replace(/\s+/g, ''));
    
    const matchesSearch = matchesName || matchesPhone;
    const matchesFilter = filterNiveau === 'Tous' || c.niveau === filterNiveau;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container" style={{ padding: '4rem 1rem', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '5rem' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#eff6ff', color: 'var(--color-primary)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '2rem', border: '1px solid #dbeafe' }}>
          <Users2 size={16} />
          <span>Communauté Cicéron</span>
        </div>
        <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', color: 'var(--color-text-main)', letterSpacing: '-0.05em' }}>
          <span style={{ color: 'var(--color-primary)' }}>O</span>ld <span style={{ color: 'var(--color-primary)' }}>C</span>iceron <span style={{ color: 'var(--color-primary)' }}>S</span>tudents
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          Cette application permet de réunir tous les élèves qui ont fréquenté ensemble à l'école Cicéron. Retrouvez vos anciens camarades et restez connectés.
        </p>
      </motion.section>

      {/* Search & Filter Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          marginBottom: '5rem',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '40px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} size={24} />
          <input
            type="text"
            placeholder="Nom, prénom ou numéro de téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1.2rem 1.5rem 1.2rem 4rem',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: '#f8fafc',
              fontSize: '1.1rem',
              color: 'var(--color-text-main)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {(['Tous', 'Primaire', 'Secondaire-Collège'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterNiveau(lvl)}
              className="btn"
              style={{
                backgroundColor: filterNiveau === lvl ? 'var(--color-primary)' : '#fff',
                color: filterNiveau === lvl ? 'white' : 'var(--color-text-muted)',
                borderRadius: '50px',
                padding: '0.75rem 1.75rem',
                border: filterNiveau === lvl ? 'none' : '2px solid #f1f5f9',
                fontSize: '0.9rem'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid Section */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
          <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
        </div>
      ) : (
        <motion.div 
          layout
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '3rem' 
          }}
        >
          <AnimatePresence>
            {filteredCamarades.map((camarade, index) => (
              <motion.div
                key={camarade.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <CamaradeCard camarade={camarade} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Floating Plus Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ position: 'fixed', bottom: '3rem', right: '3rem', zIndex: 1000 }}
      >
        <Link 
          to="/add" 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
            textDecoration: 'none'
          }}
        >
          <Plus size={36} strokeWidth={2.5} />
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
