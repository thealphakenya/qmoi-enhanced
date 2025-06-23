import * as React from 'react';
import { useState } from 'react';

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, any>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: '',
    email: '',
    googleConnected: false,
    role: '',
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // TODO: Integrate Google OAuth
    setForm(f => ({ ...f, googleConnected: true, email: 'user@gmail.com' }));
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save user details and preferences
    setStep(3);
  };

  return (
    <div className="onboarding" style={{ padding: 32, background: '#fff', borderRadius: 16, maxWidth: 420, margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Join Q Community</h2>
      {step === 1 && (
        <div>
          <button style={{ width: '100%', marginBottom: 16 }} onClick={handleGoogleOAuth}>Join with Google</button>
          <p style={{ textAlign: 'center', margin: '16px 0' }}>or fill the form below</p>
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
            <select name="role" value={form.role} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }}>
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: '100%' }}>Continue</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          {/* TODO: Add preference options */}
          <button style={{ width: '100%', marginTop: 16 }} onClick={() => setStep(3)}>Finish</button>
        </div>
      )}
      {step === 3 && <div style={{ textAlign: 'center', color: 'green', fontWeight: 600 }}>Welcome to Q Community! Your setup is complete.</div>}
    </div>
  );
};

export default Onboarding; 
 
 