import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fingerprint, Settings, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
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
      alert("Installation : \n\n• Sur iPhone : Appuyez sur 'Partager' ↑ puis 'Sur l'écran d'accueil'. \n\n• Sur Android/PC : Si vous ne voyez pas d'invitation, l'application est peut-être déjà installée.");
    }
  };

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0.6rem 0', borderBottom: '1px solid rgba(79, 70, 229, 0.1)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo OCS compact */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
            <Fingerprint size={16} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'var(--font-titles)' }}>
            OCS
          </span>
        </Link>

        {/* Boutons d'action resserrés */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Admin Icon invisible */}
          <Link to="/admin" style={{ textDecoration: 'none', color: '#f8fafc', padding: '4px' }}>
            <Settings size={8} />
          </Link>

          {/* Bouton Installer Minimaliste */}
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
              fontWeight: 700,
              minWidth: 'auto'
            }}
          >
            <DownloadCloud size={14} />
            <span>Installer</span>
          </motion.button>
          
          {/* Bouton Rejoindre Simple */}
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
