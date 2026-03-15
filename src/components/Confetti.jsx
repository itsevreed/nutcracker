import { useEffect, useRef } from 'react'
import styles from './Confetti.module.css'

const COLORS = ['#e8a020','#c8860a','#ff6b35','#ffd700','#ff4444','#44ff88']

export default function Confetti() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div')
      piece.className = styles.piece
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        width: ${6 + Math.random() * 10}px;
        height: ${6 + Math.random() * 10}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-delay: ${Math.random() * 0.8}s;
        animation-duration: ${1.2 + Math.random() * 0.8}s;
      `
      container.appendChild(piece)
    }
  }, [])

  return <div ref={containerRef} className={styles.container} />
}
