import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'transparent', padding: '5rem 0 3rem', marginTop: '4rem', borderTop: '1px solid #f1f5f9' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Titre sans espace entre les lettres colorées et la suite */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'var(--color-text-main)', 
          fontWeight: 900, 
          fontSize: '1.6rem', 
          fontFamily: 'var(--font-titles)',
          letterSpacing: '-0.02em'
        }}>
          <span style={{ color: 'var(--color-primary)' }}>O</span>ld&nbsp;<span style={{ color: 'var(--color-primary)' }}>C</span>iceron&nbsp;<span style={{ color: 'var(--color-primary)' }}>S</span>tudents
        </div>
        
        {/* Lien WhatsApp direct sur le fond (Logo officiel + Texte vert) */}
        <motion.a 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="https://chat.whatsapp.com/HkKC3PbeUOV04lUbf692Uc" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            color: '#25D366', 
            fontWeight: 700, 
            textDecoration: 'none', 
            fontSize: '1.1rem',
            background: 'none',
            border: 'none',
            padding: 0
          }}
        >
          {/* Logo officiel WhatsApp via SVG pour un rendu parfait sans fond */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.031 2C6.511 2 2.022 6.488 2.022 12.008c0 2.13.664 4.103 1.798 5.726L2 22l4.413-1.442a9.948 9.948 0 005.618 1.458c5.52 0 10.009-4.489 10.009-10.008C22.04 6.488 17.551 2 12.031 2zM10.15 15.8c-.206-.011-.41-.07-.585-.172-.34-.197-2.126-1.05-2.126-1.05s-.284-.143-.4-.363c-.116-.22-.012-.49.035-.588.048-.097.162-.162.162-.162s.324-.194.432-.26c.108-.064.21-.064.312.033.102.097.432.551.528.648.096.097.162.13.264.065.102-.065.432-.26.54-.325.108-.065.228-.065.342 0 .114.065.732.422.732.422s.228.13.276.325c.048.195-.048.454-.144.584-.096.13-.372.422-.516.52-.144.097-.24.162-.48.162z" fill="#25D366"/>
            <path d="M17.507 14.307c-.21-.106-1.24-.611-1.433-.682-.192-.07-.332-.105-.472.105-.14.21-.54.681-.662.82-.122.14-.244.158-.454.053-.21-.105-.885-.327-1.686-1.041-.623-.557-1.044-1.245-1.166-1.456-.122-.21-.013-.323.092-.427.094-.095.21-.245.315-.367.105-.122.14-.21.21-.35.07-.14.034-.262-.017-.367-.052-.105-.472-1.137-.647-1.558-.17-.41-.357-.354-.488-.36-.127-.006-.272-.007-.417-.007s-.38.053-.579.272c-.2.218-.762.744-.762 1.813s.777 2.1.885 2.248c.11.147 1.53 2.335 3.704 3.273.517.223.92.356 1.235.456.52.165.994.14 1.368.085.418-.06 1.24-.507 1.414-1 .174-.492.174-.913.122-1-.052-.087-.192-.14-.403-.245z" fill="#25D366"/>
          </svg>
          Rejoindre notre groupe WhatsApp
        </motion.a>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            © 2026 Old Ciceron Students — Retrouvons-nous
          </p>
          <p style={{ 
            color: 'var(--color-text-main)', 
            fontSize: '1rem', 
            fontWeight: 800,
            letterSpacing: '0.05em'
          }}>
            Made by <span style={{ color: 'var(--color-primary)' }}>Makosa</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
