import { useState } from 'react'
import styles from './Schedule.module.css'

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    weekday:'short', month:'short', day:'numeric', hour:'numeric', minute:'2-digit'
  })
}

export default function Schedule({ events, currentUser, onSchedule, onRsvp }) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    if (!title.trim() || !time) return
    onSchedule(title.trim(), time, note.trim())
    setTitle(''); setTime(''); setNote('')
  }

  return (
    <div>
      <div className={styles.sectionHeader}>Plan a Group Crack</div>
      <div className={styles.form}>
        <label>Event Name</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Saturday Night Crackdown" maxLength={40} />
        <label>Date & Time</label>
        <input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} />
        <label>Message (optional)</label>
        <textarea value={note} onChange={e => setNote(e.target.value)}
          placeholder="Let's get everyone together..." />
        <button className={styles.btnSchedule} onClick={handleSubmit}>📅 SCHEDULE IT</button>
      </div>

      <div className={styles.sectionHeader}>Upcoming Cracks</div>
      {!events.length ? (
        <div className={styles.noEvents}>No events planned. Be the organizer!</div>
      ) : (
        events.map(ev => {
          const rsvps = ev.rsvps || []
          const going = rsvps.includes(currentUser)
          return (
            <div key={ev.id} className={styles.card}>
              <div className={styles.cardTitle}>💥 {ev.title}</div>
              <div className={styles.cardTime}>📅 {formatDateTime(ev.event_time)} · by {ev.host}</div>
              {ev.note && <div className={styles.cardNote}>"{ev.note}"</div>}
              <div className={styles.rsvpRow}>
                {rsvps.slice(0,4).map(r => <div key={r} className={styles.chip}>{r}</div>)}
                {rsvps.length > 4 && <div className={styles.chip}>+{rsvps.length - 4}</div>}
                <button className={`${styles.btnRsvp} ${going ? styles.going : ''}`} onClick={() => onRsvp(ev.id)}>
                  {going ? '✓ Going' : '+ Join'}
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
