import { lazy, Suspense, useEffect, useState } from 'react';
import { useStore } from './store.js';
import { UI } from './content.js';
import ErrorBoundary from './ErrorBoundary.jsx';

const PageScene = lazy(() => import('./PageScenes.jsx'));
const webgl = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } };
function useReady() {
  const [r, s] = useState(false);
  useEffect(() => { const ric = window.requestIdleCallback; const id = ric ? ric(() => s(true), { timeout: 300 }) : setTimeout(() => s(true), 200); return () => (ric ? window.cancelIdleCallback(id) : clearTimeout(id)); }, []);
  return r && webgl();
}
export const Spark = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" /></svg>;

export default function Stage({ kind }) {
  const ready = useReady();
  const { lang, theme } = useStore();
  const u = UI[lang];
  return (
    <div className="stage" aria-hidden="false">
      <div className="disc" />
      <svg className="orbit" viewBox="0 0 400 300"><ellipse cx="200" cy="150" rx="190" ry="105" /></svg>
      <i className="orb o1" /><i className="orb o2" />
      <div className="cv">{ready && <ErrorBoundary inline><Suspense fallback={null}><PageScene kind={kind} theme={theme} /></Suspense></ErrorBoundary>}</div>
      <span className="spark"><Spark /></span>
      <div className="float"><span className="ico">♡</span><div><b>{u.cardT}</b><small>{u.cardD}</small></div></div>
    </div>
  );
}

