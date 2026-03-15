import styles from './MrPeanut.module.css'

export default function MrPeanut({ mood = 'idle', onClick }) {
  return (
    <div className={`${styles.wrapper} ${styles[mood]}`} onClick={onClick} title="Click to crack!">
      <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>

        {/* TOP HAT */}
        <rect x="38" y="18" width="44" height="5" rx="2" fill="#1a0a00" stroke="#c8860a" strokeWidth="1.5"/>
        <rect x="43" y="0" width="34" height="20" rx="3" fill="#1a0a00" stroke="#c8860a" strokeWidth="1.5"/>
        {/* Hat band */}
        <rect x="43" y="16" width="34" height="4" rx="1" fill="#c8860a"/>

        {/* PEANUT BODY - upper lobe */}
        <ellipse cx="60" cy="80" rx="28" ry="32" fill="#e8c060" stroke="#c8860a" strokeWidth="2"/>
        {/* PEANUT BODY - waist pinch */}
        <ellipse cx="60" cy="112" rx="18" ry="8" fill="#d4a840" stroke="#c8860a" strokeWidth="1.5"/>
        {/* PEANUT BODY - lower lobe */}
        <ellipse cx="60" cy="138" rx="24" ry="26" fill="#e8c060" stroke="#c8860a" strokeWidth="2"/>

        {/* Peanut texture lines */}
        <path d="M 40 75 Q 60 70 80 75" fill="none" stroke="#c8a030" strokeWidth="1" opacity="0.6"/>
        <path d="M 38 85 Q 60 79 82 85" fill="none" stroke="#c8a030" strokeWidth="1" opacity="0.6"/>
        <path d="M 42 130 Q 60 124 78 130" fill="none" stroke="#c8a030" strokeWidth="1" opacity="0.6"/>
        <path d="M 40 142 Q 60 136 80 142" fill="none" stroke="#c8a030" strokeWidth="1" opacity="0.6"/>

        {/* FACE */}
        {/* Eyes */}
        <circle cx="50" cy="72" r="5" fill="#1a0a00"/>
        <circle cx="70" cy="72" r="5" fill="#1a0a00"/>
        <circle cx="52" cy="70" r="1.5" fill="#fff"/>
        <circle cx="72" cy="70" r="1.5" fill="#fff"/>

        {/* MONOCLE on right eye */}
        <circle cx="70" cy="72" r="8" fill="none" stroke="#c8860a" strokeWidth="1.8"/>
        <line x1="76" y1="78" x2="80" y2="85" stroke="#c8860a" strokeWidth="1.5"/>

        {/* Eyebrows - change based on mood */}
        {mood === 'proud' || mood === 'idle' ? (
          <>
            <path d="M 44 65 Q 50 62 56 65" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 64 65 Q 70 62 76 65" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
          </>
        ) : mood === 'shocked' ? (
          <>
            <path d="M 44 62 Q 50 58 56 62" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 64 62 Q 70 58 76 62" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <path d="M 44 66 Q 50 63 56 66" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 64 64 Q 70 61 76 64" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}

        {/* Mustache */}
        <path d="M 52 82 Q 56 86 60 84 Q 64 86 68 82" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>

        {/* Mouth - changes with mood */}
        {mood === 'proud' ? (
          <path d="M 52 90 Q 60 97 68 90" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
        ) : mood === 'shocked' ? (
          <ellipse cx="60" cy="92" rx="6" ry="5" fill="#1a0a00"/>
        ) : mood === 'smug' ? (
          <path d="M 54 90 Q 62 94 68 89" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
        ) : (
          <path d="M 53 90 Q 60 95 67 90" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
        )}

        {/* ARMS */}
        {/* Left arm */}
        <path d="M 33 105 Q 18 115 14 130" fill="none" stroke="#e8c060" strokeWidth="8" strokeLinecap="round"/>
        <path d="M 33 105 Q 18 115 14 130" fill="none" stroke="#c8a030" strokeWidth="2" strokeLinecap="round"/>
        {/* Right arm holding cane */}
        <path d="M 87 105 Q 100 115 104 128" fill="none" stroke="#e8c060" strokeWidth="8" strokeLinecap="round"/>
        <path d="M 87 105 Q 100 115 104 128" fill="none" stroke="#c8a030" strokeWidth="2" strokeLinecap="round"/>

        {/* CANE */}
        <line x1="104" y1="128" x2="108" y2="175" stroke="#c8860a" strokeWidth="3" strokeLinecap="round"/>
        <path d="M 108 175 Q 115 175 115 168" fill="none" stroke="#c8860a" strokeWidth="3" strokeLinecap="round"/>
        {/* Cane gold tip */}
        <circle cx="108" cy="176" r="3" fill="#e8a020"/>

        {/* GLOVES (white circles at arm ends) */}
        <circle cx="13" cy="132" r="6" fill="#f5f0e0" stroke="#c8a030" strokeWidth="1"/>
        <circle cx="105" cy="130" r="6" fill="#f5f0e0" stroke="#c8a030" strokeWidth="1"/>

        {/* SHOES */}
        <ellipse cx="50" cy="167" rx="12" ry="5" fill="#1a0a00"/>
        <ellipse cx="70" cy="167" rx="12" ry="5" fill="#1a0a00"/>
        {/* Shoe shine */}
        <ellipse cx="47" cy="165" rx="4" ry="2" fill="#333" opacity="0.5"/>
        <ellipse cx="67" cy="165" rx="4" ry="2" fill="#333" opacity="0.5"/>

        {/* BOW TIE */}
        <polygon points="54,108 60,112 54,116" fill="#c8860a"/>
        <polygon points="66,108 60,112 66,116" fill="#c8860a"/>
        <circle cx="60" cy="112" r="3" fill="#e8a020"/>

        {/* Sparkle effects when proud */}
        {mood === 'proud' && (
          <>
            <text x="88" y="55" fontSize="12" fill="#ffd700" className={styles.sparkle}>✦</text>
            <text x="18" y="60" fontSize="10" fill="#ffd700" className={styles.sparkle2}>✦</text>
            <text x="95" y="75" fontSize="8" fill="#e8a020" className={styles.sparkle3}>✦</text>
          </>
        )}
      </svg>
    </div>
  )
}
