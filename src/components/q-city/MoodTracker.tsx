import * as React from 'react';
import { useState } from 'react';
import { ContextEngine, UserContext } from '../../services/ContextEngine';

const contextEngine = new ContextEngine();
const userId = 'current-user'; // Replace with real user ID logic

const moodOptions = ['Happy', 'Sad', 'Stressed', 'Excited', 'Calm', 'Tired'];

export const MoodTracker: React.FC = () => {
  const [context, setContext] = useState<UserContext | null>(contextEngine.getUserContext(userId));
  const [selectedMood, setSelectedMood] = useState('');

  const logMood = (mood: string) => {
    if (context) {
      const updated: UserContext = {
        ...context,
        moodHistory: [...context.moodHistory, { date: new Date(), mood }],
      };
      contextEngine.saveUserContext(updated);
      setContext(updated);
      setSelectedMood('');
    }
  };

  return (
    <div className="mood-tracker" style={{ padding: 24, background: '#f0f7ff', borderRadius: 12, maxWidth: 400, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Mood Tracker</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>How are you feeling?</label>
        <select value={selectedMood} onChange={e => setSelectedMood(e.target.value)} style={{ marginRight: 8 }}>
          <option value="">Select mood</option>
          {moodOptions.map(mood => <option key={mood} value={mood}>{mood}</option>)}
        </select>
        <button disabled={!selectedMood} onClick={() => logMood(selectedMood)}>Log Mood</button>
      </div>
      <h3>Mood History</h3>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {context?.moodHistory.map((entry, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>{entry.date.toString()}: <strong>{entry.mood}</strong></li>
        ))}
      </ul>
      {/* Suggestions for well-being */}
      {context && context.moodHistory.length > 0 && (
        <div className="wellbeing-suggestions" style={{ marginTop: 16, background: '#e6ffe6', padding: 12, borderRadius: 8 }}>
          <h4>Suggestions</h4>
          <p>{context.moodHistory.slice(-1)[0].mood === 'Stressed' ? 'Try a short walk or breathing exercise.' : 'Keep up the good mood!'}</p>
        </div>
      )}
    </div>
  );
};

export default MoodTracker; 