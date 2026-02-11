import React from "react";
import { Terminal } from "lucide-react";

export function TerminalOverlay({ logs }) {
  return (
    <div className="terminal-overlay">
      <div className="term-header">
        <Terminal size={12} /> SYSTEM_LOG
      </div>
      {logs.map((log, i) => (
        <div key={`${i}-${log}`} className="log-line">
          {log}
        </div>
      ))}
    </div>
  );
}
