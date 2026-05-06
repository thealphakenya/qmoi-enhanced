
"use client";
import { specificExports } from "react";

export /**
 * QiSpaces function
 */
function QiSpaces(): any {
  const [spaces, setSpaces] = useState<string[]>(["default"]);
  const [name, setName] = useState("");

  /**
 * add function
 */
function add(): any {
    if (!name.trim()) return;
    setSpaces((s) => [name.trim(), ...s]);
    setName("");
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontWeight: 700 }}>Qi Spaces</div>
      <div style={{ marginTop: 8 }}>
        <input
          value={name}
          onChange={(_e) => setName(_e.target.value)}
          
        />
        <button onClick={add} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>
      <ul style={{ marginTop: 8 }}>
        {spaces.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
