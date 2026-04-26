import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fingerprint, Settings, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('PWA prompt ready');
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else {
      alert("Installation : \n\n• Sur iPhone : Appuyez sur 'Partager' ↑ puis 'Sur l'écran d'accueil'. \n\n• Sur Android/PC : L'application est déjà installée ou votre navigateur ne supporte pas l'installation directe ici.");
    }
  };

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0.6rem 0', borderBottom: '1px solid rgba(79, 70, 229, 0.1)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
            <Fingerprint size={16} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'var(--font-titles)' }}>
            OCS
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Bouton Admin - Un peu plus visible (Gris moyen) */}
          <Link 
            to="/admin" 
            style={{ 
              textDecoration: 'none', 
              color: '#94a3b8', // Gris visible mais discret
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Settings size={16} />
          </Link>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleInstallClick}
            className="btn" 
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid var(--color-primary)', 
              padding: '0.35rem 0.6rem', 
              fontSize: '0.75rem', 
              borderRadius: '50px',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 700
            }}
          >
            <DownloadCloud size={14} />
            <span>Installer</span>
          </motion.button>
          
          <Link 
            to="/add" 
            className="btn btn-primary" 
            style={{ 
              padding: '0.4rem 0.8rem', 
              borderRadius: '50px', 
              fontSize: '0.75rem', 
              fontWeight: 700
            }}
          >
            Rejoindre
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
