import styles from './Leaderboard.module.css'

const TITLES = [
  [0, "🌰 Rookie Cracker"],
  [5, "🥜 Junior Cracker"],
  [10, "💪 Seasoned Cracker"],
  [25, "🔥 Pro Cracker"],
  [50, "⚡ Elite Cracker"],
  [100, "👑 Nutmaster General"],
  [200, "💥 LEGENDARY CRACKER"]
]

function getTitle(count) {
  let t = TITLES[0][1]
  for (const [n, title] of TITLES) { if (count >= n) t = title }
  return t
}

export default function Leaderboard({ logs, currentUser }) {
  const counts = {}
  logs.forEach(l => { counts[l.username] = (counts[l.username] || 0) + 1 })
  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1])

  if (!sorted.length) return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>🏆</div>
      <p>No crackers yet!</p>
    </div>
  )

  const medals = ['🥇','🥈','🥉']

  return (
    <div>
      <div className={styles.sectionHeader}>All-Time Leaderboard</div>
      {sorted.map(([name, count], i) => (
        <div key={name} className={`${styles.row} ${name === currentUser ? styles.mine : ''}`}>
          <div className={`${styles.rank} ${i < 3 ? styles[['gold','silver','bronze'][i]] : ''}`}>
            {i < 3 ? medals[i] : i + 1}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{name}{name === currentUser ? ' (you)' : ''}</div>
            <div className={styles.title}>{getTitle(count)}</div>
          </div>
          <div className={styles.countBlock}>
            <div className={styles.count}>{count}</div>
            <div className={styles.countLabel}>cracks</div>
          </div>
        </div>
      ))}
    </div>
  )
}
