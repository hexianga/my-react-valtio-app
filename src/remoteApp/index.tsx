import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Remote App Dev Server</h2>
      <p>该应用仅用于提供 Module Federation 的远程入口 remoteEntry.js。</p>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

