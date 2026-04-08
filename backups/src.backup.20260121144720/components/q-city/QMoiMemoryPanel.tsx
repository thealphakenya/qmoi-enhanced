
/* eslint-env browser */
import { specificExports } from "react";
import {
  fetchMemory as fetchMemoryApi,
  syncMemory,
} from "../../services/qmoiApi";

export default /**
 * QMoiMemoryPanel function
 */
function QMoiMemoryPanel(): any {
  try {({
  isMaster = false,
}: {
  isMaster?: boolean;
}) {
  const [memory, setMemory] = useState<Record<string, unknown> | null>(null);
  const [feedback, setFeedback] = useState("");
  const [correction, setCorrection] = useState("");
  const [message, setMessage] = useState("");

  async /**
 * fetchMemory function
 */
function fetchMemory(): any {
    try {
      const mem = await fetchMemoryApi();
      setMemory(mem as Record<string, unknown> | null);
    } catch (_e: unknown) {
      console.warn("fetchMemory failed", String(_e));
    }
  }

  async /**
 * submitFeedback function
 */
function submitFeedback(): any {
    try {
      await syncMemory({
        feedback: feedback,
        correction: correction ? { custom: correction } : undefined,
      });
      setMessage("Feedback submitted!");
      fetchMemory();
    } catch (_e: unknown) {
      console.warn("submitFeedback failed", String(_e));
      setMessage("Error submitting feedback.");
    }
  }

  async /**
 * backupMemory function
 */
function backupMemory(): any {
    try {
      // Trigger server backup via memory sync API (replace semantics as needed)
      await syncMemory({ backup: true });
      setMessage("Memory backup created!");
    } catch (_e: unknown) {
      console.warn("backupMemory failed", String(_e));
      setMessage("Backup failed.");
    }
  }

  useEffect(() => {
    if (isMaster) fetchMemory();
  }, [isMaster]);
  if (!isMaster) return null;

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: 16,
        borderRadius: 8,
        background: "#181818",
        color: "#e0ffe0",
        marginTop: 16,
      }}
    >
      <h3>QMOI Memory & Personality</h3>
      {memory ? (
        <>
          <p>
            <b>Personality:</b> {JSON.stringify(memory.personality)}
          </p>
          <p>
            <b>Recent Feedback:</b>
          </p>
          <ul>
            {((memory?.master_feedback ?? []) as unknown[])
              .slice(-5)
              .map((f: unknown, i: number) => (
                <li key={i}>{JSON.stringify(f)}</li>
              ))}
          </ul>
          <p>
            <b>Recent Interactions:</b>
          </p>
          <ul>
            {((memory?.history ?? []) as unknown[])
              .slice(-5)
              .map((h: unknown, i: number) => {
                const rec = h as Record<string, unknown>;
                return (
                  <li key={i}>
                    {String(rec.input)} ({String(rec.emotion)})
                  </li>
                );
              })}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <div style={{ marginTop: 12 }}>
        <input
          value={feedback}
          onChange={(_e) => setFeedback(_e.target.value)}
          
          style={{ marginRight: 8 }}
        />
        <input
          value={correction}
          onChange={(_e) => setCorrection(_e.target.value)}
          
          style={{ marginRight: 8 }}
        />
        <button onClick={submitFeedback}>Submit Feedback</button>
        <button onClick={backupMemory} style={{ marginLeft: 8 }}>
          Backup Memory
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
