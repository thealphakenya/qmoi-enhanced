import React from "react"

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  padding: 24,
  marginBottom: 24,
  minHeight: 120,
}

export const QiSpaces: React.FC<{ user: string }> = ({ user }) => {
  // Only show if user is Master (Victor)
  if (user !== 'Victor Kwemoi' && user !== 'thealphakenya@gmail.com') return null
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Qi Spaces (Master Only)</h2>
      <p style={{ marginBottom: 32 }}>Welcome, Master Victor! Here you can manage all your goals, achievements, projects, wallet, routines, reminders, and more.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={sectionStyle}>
          <h3>Life Goals</h3>
          <ul>
            <li>Become a top AI developer</li>
            <li>Launch QMOI v2.0</li>
            <li>Travel to 5 new countries</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Achievements</h3>
          <ul>
            <li>QMOI Alpha AI launched</li>
            <li>1000+ users onboarded</li>
            <li>First revenue milestone reached</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Invention/Business Projects</h3>
          <ul>
            <li>QMOI Cloud Sync</li>
            <li>QMOI Gaming Engine</li>
            <li>QMOI Revenue Dashboard</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Wallet & Financial Dashboard</h3>
          <ul>
            <li>Balance: $12,500</li>
            <li>Last transaction: +$1,000 (QMOI Revenue)</li>
            <li>Linked: Airtel Money, Mpesa</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Routines & Habits</h3>
          <ul>
            <li>Morning coding (6am-8am)</li>
            <li>Daily system health check</li>
            <li>Weekly project review</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Reminders & Alarms</h3>
          <ul>
            <li>QMOI v2.0 launch: Oct 10, 8am</li>
            <li>Project review: Every Friday, 5pm</li>
            <li>Health check: Daily, 7am</li>
          </ul>
        </div>
        <div style={sectionStyle}>
          <h3>Settings & Advanced Controls</h3>
          <ul>
            <li>Theme: Dark</li>
            <li>Notifications: Enabled</li>
            <li>Backup: Daily</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
