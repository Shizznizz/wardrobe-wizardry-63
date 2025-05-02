
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root with strict caching strategy
createRoot(document.getElementById("root")!).render(<App />);
