import React from "react";
import {
  runSecurityCheck,
  isTampered,
  showDecoyInfo,
} from "./lib/security_check.js";

function App() {
  runSecurityCheck();

  if (isTampered) {
    const decoy = showDecoyInfo();
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <h1 className="text-2xl font-bold text-red-700">{decoy.message}</h1>
        <p className="mt-4 text-red-500">{decoy.warning}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Alpha-Q AI is running.</p>
      </header>
    </div>
  );
}

export default App;
