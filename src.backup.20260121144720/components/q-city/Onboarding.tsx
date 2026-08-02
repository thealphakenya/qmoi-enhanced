import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.536119Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.579432Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/Onboarding.tsx -->
import * as React from "react";
import { useState } from "react";

type OnboardingForm = {
  name: string;
  email: string;
  googleConnected: boolean;
  role: string;
  preferences: Record<string, unknown>;
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    email: "",
    googleConnected: false,
    role: "",
    preferences: {},
  });

  const handleGoogleOAuth = () => {
    // Google OAuth stub - in production, integrate with @react-oauth/google
    console.log("Initiating Google OAuth flow...");
    setForm((f) => ({ ...f, googleConnected: true, email: "user@gmail.com" }));
    setStep(2);
  };

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [_e.target.name]: _e.target.value }));
  };

  const handleSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    // Save user details and preferences to backend
    console.log("Saving user data:", form);
    setStep(3);
  };

  return (
    <div
      className="onboarding"
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Join Q Community
      </h2>
      {step === 1 && (
        <div>
          <button
            style={{ width: "100%", marginBottom: 16 }}
            onClick={handleGoogleOAuth}
          >
            Join with Google
          </button>
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            or fill the form below
          </p>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="shop">Shop Owner</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Set Your Preferences</h3>
          <div style={{ margin: "16px 0", textAlign: "left" }}>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Receive Notifications
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" defaultChecked /> Enable Analytics
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </p>
            <p style={{ marginBottom: 12 }}>
              <label>
                Language:
                <select style={{ marginLeft: 8, padding: 4 }}>
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </label>
            </p>
          </div>
          <button
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setStep(3)}
          >
            Finish
          </button>
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", color: "green", fontWeight: 600 }}>
          Welcome to Q Community! Your setup is complete.
        </div>
      )}
    </div>
  );
};

export default Onboarding;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.055593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.938469Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.084204Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.518488Z
