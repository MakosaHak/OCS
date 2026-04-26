import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Camarade } from '../types';
import { ArrowLeft, Phone, MessageCircle, Calendar, Briefcase, GraduationCap, Clock, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [camarade, setCamarade] = useState<Camarade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProfile(id);
  }, [id]);

  const fetchProfile = async (profileId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('camarades')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) throw error;
      setCamarade(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <Clock size={48} color="var(--color-primary)" />
        </motion.div>
      </div>
    );
  }

  if (!camarade) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container" 
      style={{ padding: '2rem 1rem', maxWidth: '900px', overflowX: 'hidden' }}
    >
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', marginBottom: '1.5rem', padding: 0, cursor: 'pointer', fontWeight: 600 }}
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'white', width: '100%' }}>
        {/* Media Section */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
          {camarade.video_url ? (
            <video 
              src={camarade.video_url} 
              controls 
              poster={camarade.photo_url}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
            />
          ) : (
            <img 
              src={camarade.photo_url || '/favicon.svg'} 
              alt={camarade.prenom} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', backdropFilter: 'blur(10px)', fontWeight: 600 }}>
            {camarade.niveau}
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <h2 style={{ 
                fontSize: 'clamp(1.8rem, 6vw, 3rem)', 
                fontWeight: 800, 
                marginBottom: '0.5rem', 
                letterSpacing: '-0.04em',
                wordBreak: 'break-word',
                lineHeight: 1.1
              }}>
                {camarade.prenom} {camarade.nom}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>
                <GraduationCap size={20} />
                <span>Promotion {camarade.annees || 'Ciceron'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: 'fit-content', flexWrap: 'wrap' }}>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${camarade.telephone}`} 
                className="btn btn-primary"
                style={{ padding: '0.7rem 1.2rem', flex: '1 1 auto', fontSize: '0.9rem' }}
              >
                <Phone size={18} />
                Appeler
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/${camarade.telephone.replace(/\s+/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn" 
                style={{ backgroundColor: '#25D366', color: 'white', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)', padding: '0.7rem 1.2rem', flex: '1 1 auto', fontSize: '0.9rem' }}
              >
                <MessageCircle size={18} />
                WhatsApp
              </motion.a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <section>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                <Briefcase size={16} />
                Activité actuelle
              </h4>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.5', fontWeight: 500, wordBreak: 'break-word' }}>{camarade.activite}</p>
            </section>

            {camarade.biographie && (
              <section>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  <Clock size={16} />
                  Son histoire
                </h4>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#475569', wordBreak: 'break-word' }}>{camarade.biographie}</p>
              </section>
            )}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} />
              Inscrit le {format(new Date(camarade.created_at), 'dd/MM/yyyy', { locale: fr })}
            </span>
            <button style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
              <ShieldAlert size={14} />
              Signaler
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileDetail;
