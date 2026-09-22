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
          <p>Track, add, and update your personal and professional goals.</p>
          {/* TODO: Connect to goals data */}
        </div>
        <div style={sectionStyle}>
          <h3>Achievements</h3>
          <p>View your milestones and completed objectives.</p>
          {/* TODO: Connect to achievements data */}
        </div>
        <div style={sectionStyle}>
          <h3>Invention/Business Projects</h3>
          <p>Manage, monitor, and automate your projects and ventures.</p>
          {/* TODO: Connect to projects data */}
        </div>
        <div style={sectionStyle}>
          <h3>Wallet & Financial Dashboard</h3>
          <p>Monitor balances, transactions, and manage multiple financial services.</p>
          {/* TODO: Integrate wallet/finance APIs */}
        </div>
        <div style={sectionStyle}>
          <h3>Routines & Habits</h3>
          <p>Set up daily routines, habits, and track consistency.</p>
          {/* TODO: Connect to routines/habits data */}
        </div>
        <div style={sectionStyle}>
          <h3>Reminders & Alarms</h3>
          <p>Configure reminders, alarms, and notifications for important tasks.</p>
          {/* TODO: Connect to reminders/alarms data */}
        </div>
        <div style={sectionStyle}>
          <h3>Settings & Advanced Controls</h3>
          <p>Adjust preferences, access advanced features, and manage your Qi Space.</p>
          {/* TODO: Add settings/controls */}
        </div>
      </div>
    </div>
  )
}
