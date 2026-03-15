import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import Feed from './components/Feed.jsx'
import Schedule from './components/Schedule.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Profile from './components/Profile.jsx'
import Toast from './components/Toast.jsx'
import Confetti from './components/Confetti.jsx'
import styles from './App.module.css'

const SPEECHES = [
  "Ready to crack?", "Crack 'em if ya got 'em!", "Another one bites the dust!",
  "MAGNIFICENT!", "The crowd goes wild!", "My monocle fell off!",
  "Simply spectacular!", "Extraordinary technique!", "Bravo, bravo!",
  "A fine cracking, indeed!", "The legend grows!"
]

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('nc_user') || '')
  const [nameInput, setNameInput] = useState('')
  const [logs, setLogs] = useState([])
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState('feed')
  const [speech, setSpeech] = useState('Ready to crack?')
  const [mascotBounce, setMascotBounce] = useState(false)
  const [toast, setToast] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [loading, setLoading] = useState(true)

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }, [])

  // Load initial data
  useEffect(() => {
    const load = async () => {
      const [{ data: logsData }, { data: eventsData }] = await Promise.all([
        supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('events').select('*').order('event_time', { ascending: true })
      ])
      if (logsData) setLogs(logsData)
      if (eventsData) setEvents(eventsData)
      setLoading(false)
    }
    load()
  }, [])

  // Realtime subscriptions
  useEffect(() => {
    const logsSub = supabase
      .channel('logs-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logs' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLogs(prev => [payload.new, ...prev].slice(0, 100))
        }
        if (payload.eventType === 'UPDATE') {
          setLogs(prev => prev.map(l => l.id === payload.new.id ? payload.new : l))
        }
      })
      .subscribe()

    const eventsSub = supabase
      .channel('events-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setEvents(prev => [...prev, payload.new].sort((a,b) => new Date(a.event_time) - new Date(b.event_time)))
        }
        if (payload.eventType === 'UPDATE') {
          setEvents(prev => prev.map(e => e.id === payload.new.id ? payload.new : e))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(logsSub)
      supabase.removeChannel(eventsSub)
    }
  }, [])

  const setUser = () => {
    const val = nameInput.trim()
    if (!val) { showToast("Enter a name first!"); return }
    setCurrentUser(val)
    localStorage.setItem('nc_user', val)
    showToast(`Welcome, ${val}! 🥜`)
  }

  const changeUser = () => {
    setCurrentUser('')
    localStorage.removeItem('nc_user')
  }

  const crackNut = async () => {
    if (!currentUser) { showToast("Set your name first!"); return }

    const { error } = await supabase.from('logs').insert({
      username: currentUser,
      reactions: {}
    })
    if (error) { showToast("Error cracking! Try again."); return }

    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    setSpeech(SPEECHES[Math.floor(Math.random() * SPEECHES.length)])
    setMascotBounce(true)
    setTimeout(() => setMascotBounce(false), 400)

    const myCount = logs.filter(l => l.username === currentUser).length + 1
    const milestones = { 5: '5 Cracks! 🥜', 10: '10 Cracks! 🔥', 25: '25 Cracks! ⚡', 50: '50 Cracks! 💥', 100: '100 CRACKS!!! 👑' }
    showToast(milestones[myCount] || `💥 CRACKED! #${myCount}`)
  }

  const reactTo = async (logId, emoji) => {
    if (!currentUser) { showToast("Set your name first!"); return }
    const log = logs.find(l => l.id === logId)
    if (!log) return
    const reactions = { ...(log.reactions || {}) }
    if (!reactions[emoji]) reactions[emoji] = []
    const idx = reactions[emoji].indexOf(currentUser)
    if (idx >= 0) reactions[emoji].splice(idx, 1)
    else reactions[emoji].push(currentUser)
    await supabase.from('logs').update({ reactions }).eq('id', logId)
  }

  const scheduleEvent = async (title, time, note) => {
    if (!currentUser) { showToast("Set your name first!"); return }
    const { error } = await supabase.from('events').insert({
      title,
      event_time: time,
      note,
      host: currentUser,
      rsvps: [currentUser]
    })
    if (error) { showToast("Error scheduling!"); return }
    showToast("Event scheduled! 📅")
  }

  const toggleRsvp = async (evId) => {
    if (!currentUser) { showToast("Set your name first!"); return }
    const ev = events.find(e => e.id === evId)
    if (!ev) return
    const rsvps = [...(ev.rsvps || [])]
    const idx = rsvps.indexOf(currentUser)
    if (idx >= 0) rsvps.splice(idx, 1)
    else rsvps.push(currentUser)
    await supabase.from('events').update({ rsvps }).eq('id', evId)
  }

  const TABS = [
    { id: 'feed', label: '📜 Feed' },
    { id: 'schedule', label: '📅 Plan' },
    { id: 'leaderboard', label: '🏆 Board' },
    { id: 'profile', label: '👤 Me' },
  ]

  return (
    <div className={styles.app}>
      {showConfetti && <Confetti />}
      <Toast message={toast} />

      <header className={styles.header}>
        <h1>🥜 NUT CRACKER</h1>
        <p className={styles.tagline}>Track. Crack. Compete. Repeat.</p>
      </header>

      <div className={styles.mascotArea}>
        <div className={`${styles.mascot} ${mascotBounce ? styles.bounce : ''}`} onClick={crackNut}>
          🥜
        </div>
        <div className={styles.speechBubble}>{speech}</div>
      </div>

      {/* User Section */}
      <div className={styles.userSection}>
        {currentUser ? (
          <div className={styles.currentUser}>
            <div className={styles.avatar} style={{ background: avatarBg(currentUser), color: avatarColor(currentUser) }}>
              {currentUser.slice(0,2).toUpperCase()}
            </div>
            <span className={styles.userName}>{currentUser}</span>
            <button className={styles.btnChange} onClick={changeUser}>Change</button>
          </div>
        ) : (
          <div className={styles.nameInputRow}>
            <input
              type="text"
              placeholder="Enter your nickname..."
              maxLength={20}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setUser()}
              className={styles.nameInput}
            />
            <button className={styles.btnSet} onClick={setUser}>Let's Go</button>
          </div>
        )}
      </div>

      {/* Crack Button */}
      <div className={styles.crackSection}>
        <button className={styles.crackBtn} onClick={crackNut}>
          💥 CRACK THAT NUT 💥
          <span className={styles.crackSub}>tap to log your crack</span>
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className={styles.panel}>
        {loading ? (
          <div className={styles.loading}>Loading the nuts...</div>
        ) : (
          <>
            {activeTab === 'feed' && <Feed logs={logs} currentUser={currentUser} onReact={reactTo} />}
            {activeTab === 'schedule' && <Schedule events={events} currentUser={currentUser} onSchedule={scheduleEvent} onRsvp={toggleRsvp} />}
            {activeTab === 'leaderboard' && <Leaderboard logs={logs} currentUser={currentUser} />}
            {activeTab === 'profile' && <Profile logs={logs} currentUser={currentUser} />}
          </>
        )}
      </div>
    </div>
  )
}

function avatarBg(name) {
  const colors = ['#c8860a22','#e8402022','#2090c822','#20c86022','#c820a022','#8020c822']
  let h = 0; for (let c of name) h = (h*31 + c.charCodeAt(0)) % colors.length
  return colors[Math.abs(h)]
}
function avatarColor(name) {
  const colors = ['#c8860a','#e84020','#2090c8','#20c860','#c820a0','#8020c8']
  let h = 0; for (let c of name) h = (h*31 + c.charCodeAt(0)) % colors.length
  return colors[Math.abs(h)]
}
