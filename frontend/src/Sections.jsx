import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from './store.js';
import { HOME, UI } from './content.js';
import { FOOT } from './copy.js';
import { T } from './data.js';
import Booking from './Booking.jsx';

const P = {
  frame: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5', chat: 'M4 5h12v8H9l-4 3v-3H4zM18 9h2v8h-2l-3 2v-2h-4', heart: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  leaf: 'M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l8-8', shield: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4', check: 'M4 12l5 5L20 6',
  phone: 'M6 3h4l2 5-2.5 1.5a11 11 0 005 5L16 12l5 2v4a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z', pin: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
  clock: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2', clip: 'M9 4h6v3H9zM7 6H5v14h14V6h-2M9 14l2 2 4-4', mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
};
const Ico = ({ n, s = 22 }) => <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>;
const Head = ({ k, h, p }) => <div className="shead">{k && <span className="eyebrow">{k}</span>}<h2>{h}</h2>{p && <p className="sub">{p}</p>}</div>;

// Own photo goes in frontend/public/images/<name>.jpg; until then a labelled placeholder shows.
function Photo({ src, label }) {
  const [ok, setOk] = useState(true);
  return <div className="photo">{ok ? <img src={src} alt="" loading="lazy" onError={() => setOk(false)} /> : <span>{label}</span>}</div>;
}

const ToothIcon = ({ stained }) => <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><path d="M20 8c-9 0-13 8-11 18 1.5 8 3 13 4 21 .7 6 4.5 8 6.5 2 1.5-5 2.5-9 6.5-9s5 4 6.5 9c2 6 5.8 4 6.5-2 1-8 2.5-13 4-21 2-10-2-18-11-18-4 0-6 2-9 2s-5-2-9-2z" fill={stained ? '#e6d6a0' : '#fff'} stroke="#b7ccc7" strokeWidth="1.5" /></svg>;

// Photo before/after: plays on its own while visible, stops as soon as the visitor drags the slider.
// Own photos: frontend/public/images/smile-before.jpg and smile-after.jpg (same framing, consented).
function BeforeAfter({ L }) {
  const frame = useRef(), top = useRef(), line = useRef(), rng = useRef(), stop = useRef(false);
  const [ok, setOk] = useState(true);
  const set = (v) => { if (!top.current) return; top.current.style.clipPath = `inset(0 ${100 - v}% 0 0)`; line.current.style.left = v + '%'; rng.current.value = v; };
  useEffect(() => {
    if (!ok) return;
    set(50);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, t0 = 0, on = false;
    const tick = (t) => { if (!on || stop.current) return; t0 = t0 || t; set(50 + 42 * Math.sin((t - t0) / 1200)); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(tick); }, { threshold: 0.35 });
    io.observe(frame.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ok]);
  if (!ok) return <p className="fine" dir="auto">{L.note}</p>;
  return (
    <div className="pba" dir="ltr">
      <div className="bub"><span className="orb2"><ToothIcon stained /></span><span className="chip2">{L.before}</span></div>
      <div className="ba">
        <div className="ba-frame" ref={frame}>
          <img className="smile" src="/images/smile-after.jpg" alt="" onError={() => setOk(false)} />
          <div className="ba-top" ref={top}><img className="smile" src="/images/smile-before.jpg" alt="" /></div>
          <span className="ba-line" ref={line}><i className="knob">⇄</i></span>
          <span className="lbl l1">{L.before}</span><span className="lbl l2">{L.after}</span>
          <i className="spark s1" /><i className="spark s2" />
        </div>
        <input ref={rng} type="range" min="0" max="100" defaultValue="50" onChange={(e) => { stop.current = true; set(+e.target.value); }} aria-label={`${L.before} / ${L.after}`} />
        <p className="fine" dir="auto">{L.note}</p>
      </div>
      <div className="bub r"><span className="orb2"><ToothIcon /></span><span className="chip2 on">{L.after}</span></div>
    </div>
  );
}

const MORE = { en: 'Learn more' };
function Block({ b, lang, photo }) {
  const L = b[lang] || {};
  const T_ = T[lang];
  switch (b.t) {
    case 'band': return <section className="band"><div className="wrap sec"><Head h={L.h} p={L.p} /></div></section>;
    case 'cards': return <section id={b.id} className="wrap sec"><Head h={L.h} p={L.p} /><div className="cards3">{L.items.map(([t, d, to]) => <article className="opt" key={t}><h3>{t}</h3><p>{d}</p>{to && <Link className="more" to={to}>{MORE[lang]} →</Link>}</article>)}</div></section>;
    case 'steps': return <section className="wrap sec"><Head h={L.h} /><div className="steps">{L.items.map(([t, d], i) => <div key={t}><span className="num">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></div>)}</div>{L.note && <p className="fine">{L.note}</p>}</section>;
    case 'intro': return (
      <section className="wrap sec two">
        <div><Head h={L.h} p={L.p} /><Link className="btn primary lg" to={b.to}>{L.cta} ↗</Link></div>
        {photo ? <div className="shot"><Photo src={photo} label="" /></div> : null}
      </section>);
    case 'faq': return <section className="wrap sec narrow faqlist">{L.items.map(([q, a], i) => <details name="faq" key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}</section>;
    case 'ba': return <section className="band"><div className="wrap sec"><Head {...HOME[lang].ba} /><BeforeAfter L={HOME[lang].ba} /></div></section>;
    case 'form': return (
      <section id="request" className="band"><div className="wrap sec contact">
        <div>
          <Head h={L.h} p={L.p} />
          {L.info.map(([i, v]) => <div className="crow" key={i}><span className="ti"><Ico n={i} /></span><div><b dir="auto">{v}</b></div></div>)}
          <div className="opt" style={{ marginTop: '1.4rem' }}><h3>{L.bh}</h3><p>{L.bp}</p></div>
          <p className="fine warn">{T_.emergency}</p>
        </div>
        <div className="formcard"><h3>{L.h}</h3><Booking lang={lang} /></div>
        <p className="closing">{L.closing}</p>
      </div></section>);
    default: return null;
  }
}
export const Blocks = ({ blocks, lang, photo }) => blocks.map((b, i) => <Block key={i} b={b} lang={lang} photo={photo} />);

export function SiteFooter() {
  const { lang } = useStore();
  const F = FOOT[lang], to = ['/', '/orthodontics', '/surgery', '/services', '/about', '/faqs'];
  return (
    <footer className="sfoot">
      <div className="wrap fgrid">
        <div><h3>{UI[lang].brand}</h3><p>{F.about}</p></div>
        <div><h4>{F.explore}</h4>{F.links.map((l, i) => <Link key={l} to={to[i]}>{l}</Link>)}</div>
        <div><h4>{F.contact}</h4>{F.info.map((x) => <p key={x} dir="auto">{x}</p>)}</div>
      </div>
      <div className="wrap legal"><p>© {new Date().getFullYear()} {F.legal}</p><p>{F.disc}</p></div>
    </footer>
  );
}
