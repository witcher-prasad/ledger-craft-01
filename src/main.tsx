import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Start MSW in development
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')
  return worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
