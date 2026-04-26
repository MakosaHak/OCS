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
      style={{ padding: '2rem 1rem', maxWidth: '900px' }}
    >
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', marginBottom: '2rem', padding: 0, cursor: 'pointer', fontWeight: 600 }}
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'white' }}>
        {/* Media Section */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
          {camarade.video_url ? (
            <video 
              src={camarade.video_url} 
              controls 
              poster={camarade.photo_url}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img 
              src={camarade.photo_url} 
              alt={camarade.prenom} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px 12px', borderRadius: '50px', fontSize: '0.8rem', backdropFilter: 'blur(10px)' }}>
            {camarade.niveau}
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>
                {camarade.prenom} {camarade.nom}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '1.1rem' }}>
                <GraduationCap size={22} />
                <span>Promotion {camarade.annees || 'Ciceron'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${camarade.telephone}`} 
                className="btn btn-primary"
              >
                <Phone size={20} />
                Appeler
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/${camarade.telephone.replace(/\s+/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn" 
                style={{ backgroundColor: '#25D366', color: 'white', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)' }}
              >
                <MessageCircle size={20} />
                WhatsApp
              </motion.a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            <section>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Briefcase size={18} />
                Activité actuelle
              </h4>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', fontWeight: 500 }}>{camarade.activite}</p>
            </section>

            {camarade.biographie && (
              <section>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <Clock size={18} />
                  Son histoire
                </h4>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#475569' }}>{camarade.biographie}</p>
              </section>
            )}
          </div>

          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} />
              Rejoint le {format(new Date(camarade.created_at), 'dd MMMM yyyy', { locale: fr })}
            </span>
            <button style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <ShieldAlert size={16} />
              Signaler un abus
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileDetail;
