
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { AuthProvider } from './hooks/useAuth.tsx'

// Create root with strict caching strategy
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  </BrowserRouter>
);
