import styles from './Feed.module.css'

const REACTIONS = ['💥','😤','🔥','👀','💀','🤝']

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff/60) + 'm ago'
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago'
  return Math.floor(diff/86400) + 'd ago'
}

function avatarColor(name) {
  const colors = ['#c8860a','#e84020','#2090c8','#20c860','#c820a0','#8020c8']
  let h = 0; for (let c of name) h = (h*31 + c.charCodeAt(0)) % colors.length
  return colors[Math.abs(h)]
}

export default function Feed({ logs, currentUser, onReact }) {
  if (!logs.length) return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>🥜</div>
      <p>No cracks yet. Be the first!</p>
    </div>
  )

  return (
    <div>
      <div className={styles.sectionHeader}>The Crack Feed</div>
      {logs.map(log => {
        const color = avatarColor(log.username)
        return (
          <div key={log.id} className={styles.item}>
            <div className={styles.avatar} style={{ background: color + '22', color, borderColor: color }}>
              {log.username.slice(0,2).toUpperCase()}
            </div>
            <div className={styles.content}>
              <div className={styles.row}>
                <span className={styles.name}>{log.username}</span>
                <span className={styles.action}>cracked a nut</span>
                <span className={styles.time}>{timeAgo(log.created_at)}</span>
              </div>
              <div className={styles.reactions}>
                {REACTIONS.map(r => {
                  const arr = (log.reactions && log.reactions[r]) || []
                  const reacted = arr.includes(currentUser)
                  return (
                    <button
                      key={r}
                      className={`${styles.reactionBtn} ${reacted ? styles.reacted : ''}`}
                      onClick={() => onReact(log.id, r)}
                    >
                      {r}{arr.length ? ' ' + arr.length : ''}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
