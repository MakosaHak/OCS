import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
        
        {/* Nouveau Logo OCS SVG */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src="/favicon.svg" 
            alt="OCS Logo" 
            style={{ width: '36px', height: '36px', borderRadius: '8px' }} 
          />
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'var(--font-titles)' }}>
            OCS
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link 
            to="/admin" 
            style={{ 
              textDecoration: 'none', 
              color: '#94a3b8', 
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
