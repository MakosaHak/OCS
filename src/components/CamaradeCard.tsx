import { Link } from 'react-router-dom';
import type { Camarade } from '../types';
import { Briefcase, ArrowRight, GraduationCap, School } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  camarade: Camarade;
}

const CamaradeCard = ({ camarade }: Props) => {
  return (
    <Link to={`/profile/${camarade.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <motion.div 
        className="card" 
        style={{ 
          height: '100%',
          display: 'flex', 
          flexDirection: 'column',
          padding: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
        whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      >
        <div style={{ height: '280px', borderRadius: '18px', overflow: 'hidden', marginBottom: '1.25rem' }}>
          {camarade.photo_url ? (
            <img 
              src={camarade.photo_url} 
              alt={`${camarade.prenom} ${camarade.nom}`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <School size={48} />
            </div>
          )}
        </div>
        
        <div style={{ padding: '0 0.5rem 0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
              {camarade.prenom} <span style={{ color: 'var(--color-primary)' }}>{camarade.nom}</span>
            </h3>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.7rem', 
              fontWeight: 700, 
              backgroundColor: '#f1f5f9', 
              color: '#475569', 
              padding: '4px 10px', 
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}>
              <GraduationCap size={12} />
              {camarade.niveau === 'Primaire' ? 'Prim' : 'Sec'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            <Briefcase size={16} />
            <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {camarade.activite}
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-primary)'
          }}>
            <span>Voir le profil</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CamaradeCard;
