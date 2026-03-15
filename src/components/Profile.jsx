import styles from './Profile.module.css'

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

function avatarColor(name) {
  const colors = ['#c8860a','#e84020','#2090c8','#20c860','#c820a0','#8020c8']
  let h = 0; for (let c of name) h = (h*31 + c.charCodeAt(0)) % colors.length
  return colors[Math.abs(h)]
}

export default function Profile({ logs, currentUser }) {
  if (!currentUser) return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>👤</div>
      <p>Set your name to see your stats!</p>
    </div>
  )

  const myLogs = logs.filter(l => l.username === currentUser)
  const count = myLogs.length
  const today = myLogs.filter(l => (Date.now() - new Date(l.created_at)) < 86400000).length
  const week = myLogs.filter(l => (Date.now() - new Date(l.created_at)) < 604800000).length

  const allCounts = {}
  logs.forEach(l => { allCounts[l.username] = (allCounts[l.username] || 0) + 1 })
  const rank = Object.entries(allCounts).sort((a,b) => b[1]-a[1]).findIndex(([n]) => n === currentUser) + 1

  const color = avatarColor(currentUser)

  const badges = [
    ['🥜 First Crack', count >= 1, 'Log your first crack'],
    ['🔥 On Fire', today >= 3, '3 cracks in one day'],
    ['⚡ Weekly Warrior', week >= 10, '10 cracks in a week'],
    ['💯 Century Club', count >= 100, 'Reach 100 cracks'],
    ['👑 Top Cracker', rank === 1, 'Reach #1 on the board'],
    ['💥 Legend', count >= 200, 'Reach 200 cracks'],
  ]

  return (
    <div>
      <div className={styles.profileTop}>
        <div className={styles.bigAvatar} style={{ background: color + '22', color, borderColor: color }}>
          {currentUser.slice(0,2).toUpperCase()}
        </div>
        <div className={styles.profileName}>{currentUser}</div>
        <div className={styles.profileTitle}>{getTitle(count)}</div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.stat}><div className={styles.statVal}>{count}</div><div className={styles.statLabel}>All-Time</div></div>
        <div className={styles.stat}><div className={styles.statVal}>{rank || '–'}</div><div className={styles.statLabel}>Rank</div></div>
        <div className={styles.stat}><div className={styles.statVal}>{today}</div><div className={styles.statLabel}>Today</div></div>
        <div className={styles.stat}><div className={styles.statVal}>{week}</div><div className={styles.statLabel}>This Week</div></div>
      </div>

      <div className={styles.sectionHeader}>Badges</div>
      <div className={styles.badges}>
        {badges.map(([name, earned, hint]) => (
          <div key={name} className={`${styles.badge} ${earned ? styles.earned : ''}`} title={hint}>
            {!earned && '🔒 '}{name}
          </div>
        ))}
      </div>
    </div>
  )
}
