import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import Feed from './components/Feed.jsx'
import Schedule from './components/Schedule.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Profile from './components/Profile.jsx'
import Toast from './components/Toast.jsx'
import Confetti from './components/Confetti.jsx'
import MrPeanut from './components/MrPeanut.jsx'
import styles from './App.module.css'

const SAYINGS = [
  { text: "Ah, a most distinguished cracking!", mood: "proud" },
  { text: "Splendid! Simply splendid!", mood: "proud" },
  { text: "My monocle has never gleamed brighter!", mood: "proud" },
  { text: "The crowd erupts in applause!", mood: "proud" },
  { text: "Magnificent! A true connoisseur!", mood: "proud" },
  { text: "Extraordinary technique, old sport!", mood: "proud" },
  { text: "Top-shelf cracking, I must say!", mood: "proud" },
  { text: "Bravo! Encore! ENCORE!", mood: "proud" },
  { text: "I tip my top hat to you, sir!", mood: "proud" },
  { text: "That crack echoed across the estate!", mood: "proud" },
  { text: "Good heavens! What a crack!", mood: "shocked" },
  { text: "I nearly dropped my cane!", mood: "shocked" },
  { text: "My word! The audacity!", mood: "shocked" },
  { text: "GOOD LORD! Another one?!", mood: "shocked" },
  { text: "The butler just fainted!", mood: "shocked" },
  { text: "The monocle has fallen off!", mood: "shocked" },
  { text: "My word... that was POWERFUL!", mood: "shocked" },
  { text: "I knew you had it in you.", mood: "smug" },
  { text: "Naturally. As expected.", mood: "smug" },
  { text: "Another one for the history books.", mood: "smug" },
  { text: "Some crack nuts. Champions crack records.", mood: "smug" },
  { text: "Yes, yes. I've seen better. Kidding—I haven't.", mood: "smug" },
  { text: "The peasants are impressed.", mood: "smug" },
  { text: "Crack first. Ask questions never.", mood: "smug" },
  { text: "My cane approves.", mood: "smug" },
  { text: "That one woke up the neighborhood!", mood: "proud" },
  { text: "Your ancestors are proud. Probably.", mood: "smug" },
  { text: "Certified nut destroyer.", mood: "proud" },
  { text: "Scientists are baffled.", mood: "shocked" },
  { text: "Local legend. Right here.", mood: "proud" },
  { text: "The leaderboard trembles.", mood: "smug" },
  { text: "That's going in the highlight reel.", mood: "proud" },
  { text: "Breaking: local hero cracks nut.", mood: "proud" },
  { text: "Another notch on the monocle.", mood: "smug" },
  { text: "Unhinged. I love it.", mood: "shocked" },
]

const IDLE_SPEECHES = [
  "Awaiting your finest crack...",
  "The nuts won't crack themselves.",
  "Tap the button, old sport.",
  "Ready when you are, champion.",
  "My cane is at the ready.",
  "Distinguished crackers crack daily.",
]

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('nc_user') || '')
  const [nameInput, setNameInput] = useState('')
  const [logs, setLogs] = useState([])
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState('feed')
  const [saying, setSaying] = useState(IDLE_SPEECHES[0])
  const [mood, setMood] = useState('idle')
  const [toast, setToast] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cracking, setCracking] = useState(false)

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }, [])

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

    const interval = setInterval(() => {
      setMood(m => {
        if (m === 'idle') setSaying(IDLE_SPEECHES[Math.floor(Math.random() * IDLE_SPEECHES.length)])
        return m
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const logsSub = supabase
      .channel('logs-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logs' }, (payload) => {
        if (payload.eventType === 'INSERT') setLogs(prev => [payload.new, ...prev].slice(0, 100))
        if (payload.eventType === 'UPDATE') setLogs(prev => prev.map(l => l.id === payload.new.id ? payload.new : l))
      })
      .subscribe()

    const eventsSub = supabase
      .channel('events-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        if (payload.eventType === 'INSERT') setEvents(prev => [...prev, payload.new].sort((a,b) => new Date(a.event_time) - new Date(b.event_time)))
        if (payload.eventType === 'UPDATE') setEvents(prev => prev.map(e => e.id === payload.new.id ? payload.new : e))
      })
      .subscribe()

    return () => { supabase.removeChannel(logsSub); supabase.removeChannel(eventsSub) }
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
    if (cracking) return
    setCracking(true)

    const { error } = await supabase.from('logs').insert({ username: currentUser, reactions: {} })
    if (error) { showToast("Error cracking! Try again."); setCracking(false); return }

    const picked = SAYINGS[Math.floor(Math.random() * SAYINGS.length)]
    setSaying(picked.text)
    setMood(picked.mood)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    setTimeout(() => { setMood('idle'); setSaying(IDLE_SPEECHES[Math.floor(Math.random() * IDLE_SPEECHES.length)]) }, 2500)

    const myCount = logs.filter(l => l.username === currentUser).length + 1
    const milestones = { 5:'5 Cracks! 🥜', 10:'10 Cracks! 🔥', 25:'25 Cracks! ⚡', 50:'50 Cracks! 💥', 100:'100 CRACKS!!! 👑' }
    showToast(milestones[myCount] || `💥 CRACKED! #${myCount}`)
    setTimeout(() => setCracking(false), 800)
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
    const { error } = await supabase.from('events').insert({ title, event_time: time, note, host: currentUser, rsvps: [currentUser] })
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
    { id: 'feed', label: '📜', text: 'Feed' },
    { id: 'schedule', label: '📅', text: 'Plan' },
    { id: 'leaderboard', label: '🏆', text: 'Board' },
    { id: 'profile', label: '👤', text: 'Me' },
  ]

  return (
    <div className={styles.app}>
      {showConfetti && <Confetti />}
      <Toast message={toast} />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerDecor}>✦</div>
          <h1>NUT CRACKER</h1>
          <div className={styles.headerDecor}>✦</div>
        </div>
        <p className={styles.tagline}>THE DISTINGUISHED GENTLEMAN'S CRACKING SOCIETY</p>
      </header>

      <div className={styles.stage}>
        <div className={styles.stageStat}>
          <span className={styles.statNum}>{logs.filter(l => l.username === currentUser).length}</span>
          <span className={styles.statText}>my cracks</span>
        </div>
        <div className={styles.mascotCenter}>
          <MrPeanut mood={mood} onClick={crackNut} />
          <div className={styles.speechWrap}>
            <div className={`${styles.speech} ${styles[mood + 'Speech'] || ''}`}>{saying}</div>
          </div>
        </div>
        <div className={styles.stageStat}>
          <span className={styles.statNum}>{logs.length}</span>
          <span className={styles.statText}>total cracks</span>
        </div>
      </div>

      <div className={styles.userSection}>
        {currentUser ? (
          <div className={styles.currentUser}>
            <div className={styles.avatar} style={{ background: avatarBg(currentUser), color: avatarColor(currentUser) }}>
              {currentUser.slice(0,2).toUpperCase()}
            </div>
            <span className={styles.userName}>{currentUser}</span>
            <button className={styles.btnChange} onClick={changeUser}>Switch</button>
          </div>
        ) : (
          <div className={styles.nameInputRow}>
            <input
              type="text"
              placeholder="Enter your cracker name..."
              maxLength={20}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setUser()}
              className={styles.nameInput}
            />
            <button className={styles.btnSet} onClick={setUser}>Join</button>
          </div>
        )}
      </div>

      <div className={styles.crackSection}>
        <button className={`${styles.crackBtn} ${cracking ? styles.cracking : ''}`} onClick={crackNut}>
          <span className={styles.crackEmoji}>💥</span>
          <span className={styles.crackText}>CRACK THAT NUT</span>
          <span className={styles.crackEmoji}>💥</span>
          <span className={styles.crackSub}>tap to log your legendary crack</span>
        </button>
      </div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.label}</span>
            <span className={styles.tabText}>{t.text}</span>
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingPeanut}>🥜</div>
            <p>Polishing the monocle...</p>
          </div>
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
