import { lazy, Suspense, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from './store.js';
import { CINE } from './content.js';
import ErrorBoundary from './ErrorBoundary.jsx';

gsap.registerPlugin(ScrollTrigger);
const HeroScene = lazy(() => import('./HeroScene.jsx'));
const webgl = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } };
const mq = (q) => typeof matchMedia !== 'undefined' && matchMedia(q).matches;

export default function CinematicHero() {
  const { lang, theme } = useStore();
  const L = CINE[lang];
  const root = useRef(), prog = useRef({ v: 0 });
  const [reduced] = useState(() => mq('(prefers-reduced-motion: reduce)'));
  const [mobile] = useState(() => mq('(max-width: 860px)'));
  const [gl] = useState(webgl);
  const [ready, setReady] = useState(false);
  const [photo, setPhoto] = useState(true);
  useEffect(() => { const ric = window.requestIdleCallback; const id = ric ? ric(() => setReady(true), { timeout: 300 }) : setTimeout(() => setReady(true), 200); return () => (ric ? window.cancelIdleCallback(id) : clearTimeout(id)); }, []);

  useLayoutEffect(() => {
    if (reduced) { prog.current.v = 1; return; }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.7 } });
      tl.to(prog.current, { v: 1, duration: 1 }, 0);                                     // drives camera, jaw, scan, teeth, light
      if (photo) tl.fromTo('.cine-photo', { scale: 1.05, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.05);
      tl.fromTo('.cine-cap', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.33)
        .to('.cine-cap', { autoAlpha: 0, y: -20, duration: 0.08 }, 0.66)
        .fromTo('.cine-late', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.03 }, 0.74)
        .to('.cine-hint', { autoAlpha: 0, duration: 0.05 }, 0.1);
      gsap.from('.cine-word', { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12, ease: 'power4.out', delay: 0.2 });
    }, root);
    return () => ctx.revert();
  }, [lang, reduced, photo]);

  return (
    <section ref={root} className={'cine' + (reduced ? ' reduced' : '')}>
      <div className="cine-pin">
        <div className="rays" aria-hidden="true" /><div className="mist" aria-hidden="true" />
        {photo && <img className="cine-photo" src="/images/smile-closeup.jpg" alt="" onError={() => setPhoto(false)} />}
        <div className="cine-canvas">
          {gl && ready ? <ErrorBoundary inline><Suspense fallback={null}><HeroScene theme={theme} prog={prog.current} rtl={lang === 'fa'} mobile={mobile} labels={[L.before, L.after]} /></Suspense></ErrorBoundary> : <div className="cine-fallback" />}
        </div>
        <div className="wrap cine-ui">
          <div className="cine-copy">
            <span className="eyebrow">{L.eyebrow}</span>
            <h1>{L.h.map((line, i) => <span key={i} className={i ? 'em' : ''}>{line.split(' ').map((w, j) => <span className="cw" key={j}><span className="cine-word"><span className="vw" style={{ animationDelay: `${(i * 3 + j) * 0.18}s` }}>{w}</span></span> </span>)}<br /></span>)}</h1>
            <p className="lead">{L.lead}</p>
            <div className="cta"><Link className="btn primary lg" to="/contact#request">{L.cta1} ↗</Link><Link className="btn ghost lg" to="/services">{L.cta2} →</Link></div>
            <p className="fine">{L.note}</p>
          </div>
          <p className="cine-cap" role="status">{L.cap}</p>
          <div className="cine-feat">{L.feats.map(([t, d]) => <div className="cine-late" key={t}><b>{t}</b><small>{d}</small></div>)}</div>
          <div className="cine-hint">{L.scroll} ↓</div>
        </div>
      </div>
    </section>
  );
}
