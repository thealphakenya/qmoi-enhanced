import React from "react"

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  padding: 24,
  marginBottom: 24,
  minHeight: 120,
}

export const LcSpaces: React.FC<{ user: string }> = ({ user }) => {
  // Only show if user is Leah or Master (Victor)
  if (user !== 'Leah Chebet' && user !== 'Victor Kwemoi' && user !== 'thealphakenya@gmail.com') return null
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>LC Spaces (Leah Chebet)</h2>
      <p style={{ marginBottom: 32 }}>Welcome, {user === 'Leah Chebet' ? 'Leah' : 'Master Victor'}! Here you can manage Leah's goals, achievements, plans, projects, routines, alarms, reminders, places, and settings.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={sectionStyle}>
          <h3>Goals & Plans</h3>
          <ul>
            <li>Complete AI course</li>
            <li>Start a new project with Victor</li>
            <li>Travel to Nairobi</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Achievements</h3>
          <ul>
            <li>AI course completed</li>
            <li>First joint project launched</li>
            <li>Visited Nairobi</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Projects</h3>
          <ul>
            <li>QMOI Learning Portal</li>
            <li>Leah's AI Assistant</li>
            <li>Shared Health Tracker</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Routines & Habits</h3>
          <ul>
            <li>Morning study (7am-8am)</li>
            <li>Daily health check</li>
            <li>Weekly review with Victor</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Reminders & Alarms</h3>
          <ul>
            <li>AI course exam: Oct 10, 8am</li>
            <li>Project review: Every Friday, 5pm</li>
            <li>Health check: Daily, 7am</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Places & Memories</h3>
          <ul>
            <li>Nairobi trip: Jan 2025</li>
            <li>AI conference: Feb 2025</li>
            <li>First project launch: Mar 2025</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Settings</h3>
          <ul>
            <li>Theme: Light</li>
            <li>Notifications: Enabled</li>
            <li>Backup: Weekly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
