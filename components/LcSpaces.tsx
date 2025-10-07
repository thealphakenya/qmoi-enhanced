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
          <p>Set, view, and update Leah's personal and shared goals and plans.</p>
          {/* TODO: Connect to goals/plans data */}
        </div>
        <div style={sectionStyle}>
          <h3>Achievements</h3>
          <p>Celebrate milestones and completed goals together.</p>
          {/* TODO: Connect to achievements data */}
        </div>
        <div style={sectionStyle}>
          <h3>Projects</h3>
          <p>Track progress on shared or personal projects, with status indicators.</p>
          {/* TODO: Connect to projects data */}
        </div>
        <div style={sectionStyle}>
          <h3>Routines & Habits</h3>
          <p>Manage daily routines, habits, and consistency tracking for Leah.</p>
          {/* TODO: Connect to routines/habits data */}
        </div>
        <div style={sectionStyle}>
          <h3>Reminders & Alarms</h3>
          <p>Set up reminders and alarms for important events and tasks.</p>
          {/* TODO: Connect to reminders/alarms data */}
        </div>
        <div style={sectionStyle}>
          <h3>Places & Memories</h3>
          <p>Record places visited, memories, and special moments.</p>
          {/* TODO: Connect to places/memories data */}
        </div>
        <div style={sectionStyle}>
          <h3>Settings</h3>
          <p>Adjust preferences and manage Leah's LC Space settings.</p>
          {/* TODO: Add settings/controls */}
        </div>
      </div>
    </div>
  )
}
