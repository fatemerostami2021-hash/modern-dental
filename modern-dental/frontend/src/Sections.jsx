import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from './store.js';
import { HOME } from './content.js';
import { T } from './data.js';
import Booking from './Booking.jsx';

const P = {
  frame: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5', chat: 'M4 5h12v8H9l-4 3v-3H4zM18 9h2v8h-2l-3 2v-2h-4', heart: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  leaf: 'M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l8-8', shield: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4', check: 'M4 12l5 5L20 6',
  phone: 'M6 3h4l2 5-2.5 1.5a11 11 0 005 5L16 12l5 2v4a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z', pin: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
  clock: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2', clip: 'M9 4h6v3H9zM7 6H5v14h14V6h-2M9 14l2 2 4-4',
};
const Ico = ({ n, s = 22 }) => <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>;
const Head = ({ k, h, p }) => <div className="shead"><span className="eyebrow">{k}</span><h2>{h}</h2>{p && <p className="sub">{p}</p>}</div>;

// Own photo goes in frontend/public/images/<name>.jpg; until then a labelled placeholder shows.
function Photo({ src, label }) {
  const [ok, setOk] = useState(true);
  return <div className="photo">{ok ? <img src={src} alt="" loading="lazy" onError={() => setOk(false)} /> : <span>{label}</span>}</div>;
}

// Code-drawn illustration of a smile (not a real patient).
const BEFORE = [[34, 0], [46, 2], [38, -1], [44, 3], [41, 0], [36, -3], [45, 2], [33, 0]];
function SmileArt({ after }) {
  const id = after ? 'ma' : 'mb', open = 'M90 118Q200 190 310 118Q200 96 90 118Z';
  return (
    <svg viewBox="0 0 400 260" className="smile" role="img" aria-label="Smile illustration" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id={id + 'g'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3d3bd" /><stop offset="1" stopColor="#e6b199" /></linearGradient><clipPath id={id}><path d={open} /></clipPath></defs>
      <rect width="400" height="260" fill={`url(#${id}g)`} />
      <ellipse cx="85" cy="140" rx="38" ry="24" fill="#e58f8f" opacity=".25" /><ellipse cx="315" cy="140" rx="38" ry="24" fill="#e58f8f" opacity=".25" />
      <path d="M78 120Q200 215 322 120Q200 190 78 120Z" fill="#cf6f7c" />
      <path d="M78 120Q135 78 200 90Q265 78 322 120Q200 98 78 120Z" fill="#b95664" />
      <path d={open} fill="#5a1f2b" />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 8 }, (_, i) => { const [h, j] = after ? [42, 0] : BEFORE[i]; return <rect key={i} x={100 + i * 25} y={100 + j} width={after ? 24 : i % 3 === 0 ? 27 : 23} height={h} rx="8" fill={after ? '#fffdf8' : '#e6d6a0'} stroke="#0000001a" transform={after ? undefined : `rotate(${i % 2 ? 3 : -3} ${112 + i * 25} 120)`} />; })}
      </g>
    </svg>
  );
}
function Pic({ name, after }) {
  const [ok, setOk] = useState(true);
  return ok ? <img className="smile" src={`/images/${name}.jpg`} alt="" onError={() => setOk(false)} /> : <SmileArt after={after} />;
}
function BeforeAfter({ L }) {
  const [v, setV] = useState(50);
  return (
    <div className="ba" dir="ltr">
      <div className="ba-frame">
        <Pic name="smile-after" after />
        <div className="ba-top" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}><Pic name="smile-before" /></div>
        <span className="ba-line" style={{ left: v + '%' }} />
        <span className="lbl l1">{L.before}</span><span className="lbl l2">{L.after}</span>
      </div>
      <input type="range" min="0" max="100" value={v} onChange={(e) => setV(+e.target.value)} aria-label={`${L.before} / ${L.after}`} />
      <p className="fine" dir="auto">{L.note}</p>
    </div>
  );
}

export function ContactSection() {
  const { lang } = useStore();
  const C = HOME[lang].contact;
  return (
    <section id="book" className="band"><div className="wrap sec contact">
      <div>
        <Head k={C.k} h={C.h} p={C.p} />
        {[['phone', C.rec, '{{PHONE}}'], ['pin', C.addr, '{{ADDRESS}}'], ['clock', C.hours, '{{HOURS}}']].map(([i, l, v]) => <div className="crow" key={i}><span className="ti"><Ico n={i} /></span><div><small>{l}</small><b>{v}</b></div></div>)}
        <p className="fine warn">{T[lang].emergency}</p>
      </div>
      <div className="formcard"><h3>{C.formH}</h3><Booking lang={lang} /><p className="fine">{C.fine}</p></div>
    </div></section>
  );
}

export function HomeSections() {
  const { lang } = useStore();
  const H = HOME[lang];
  return (
    <>
      <section className="strip"><div className="wrap trust">{H.trust.map(([t, d], i) => <div key={t}><span className="ti"><Ico n={['frame', 'chat', 'heart'][i]} /></span><div><b>{t}</b><small>{d}</small></div></div>)}</div></section>
      <section className="band"><div className="wrap sec"><Head {...H.needs} /></div></section>
      <section className="wrap sec"><Head {...H.options} />
        <div className="cards3">{H.options.cards.map(([t, d], i) => <article className="opt" key={t}><span className="ti"><Ico n={['leaf', 'frame', 'shield'][i]} /></span><h3>{t}</h3><p>{d}</p><Link className="more" to="/surgery">{H.options.link} →</Link></article>)}</div>
      </section>
      <section className="band"><div className="wrap sec"><Head {...H.ba} /><BeforeAfter L={H.ba} /></div></section>
      <section className="wrap sec two">
        <div><Head {...H.assess} />{H.assess.list.map(([t, d]) => <div className="check" key={t}><span className="tick"><Ico n="check" s={20} /></span><div><b>{t}</b><small>{d}</small></div></div>)}</div>
        <div className="shot"><Photo src="/images/clinic.jpg" label={H.assess.ph} /><div className="float2"><b>{H.assess.cardT}</b><small>{H.assess.cardD}</small></div></div>
      </section>
      <section className="wrap sec"><Head {...H.team} />
        <div className="cards3">{H.team.cards.map(([t, d], i) => <article className="member" key={t}><Photo src={`/images/team-${i + 1}.jpg`} label={H.team.ph} /><div><h3>{t}</h3><small>{d}</small></div></article>)}</div>
        <p className="fine">{H.team.note}</p>
      </section>
      <section className="wrap sec"><Head {...H.journey} />
        <div className="steps">{H.journey.steps.map(([t, d], i) => <div key={t}><span className="num">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
      </section>
      <section className="wrap sec"><Head {...H.care} />
        <div className="cards2">{[['clip', H.care.before], ['heart', H.care.after]].map(([i, [t, items]]) => <article className="opt" key={t}><span className="ti"><Ico n={i} /></span><h3>{t}</h3><ul>{items.map((x) => <li key={x}>{x}</li>)}</ul></article>)}</div>
      </section>
      <section className="wrap sec"><div className="ctaband">
        <div><small>{H.cta.k}</small><h2>{H.cta.h}</h2><p>{H.cta.p}</p><Link className="btn mint lg" to="/contact">{H.cta.b} ↗</Link></div><i className="ring" aria-hidden="true" />
      </div></section>
      <section className="wrap sec faq2">
        <div><Head k={H.faq.k} h={H.faq.h} p={H.faq.p} /><Link className="more" to="/faqs">{H.faq.link} →</Link></div>
        <div>{H.faq.items.map(([q, a], i) => <details name="faq" key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>
      <ContactSection />
    </>
  );
}

export function SiteFooter() {
  const { lang } = useStore();
  const F = HOME[lang].foot;
  const r1 = ['/', '/about', '/team', '/faqs'], r2 = ['/orthodontics', '/surgery', '/services'];
  return (
    <footer className="sfoot"><div className="wrap fgrid">
      <div><h3>{lang === 'fa' ? 'دکتر سعید رستمی' : 'Dr. Saeed Rostami'}</h3><p>{F.about}</p></div>
      <div><h4>{F.explore}</h4>{F.links.map((l, i) => <Link key={l} to={r1[i]}>{l}</Link>)}</div>
      <div><h4>{F.care}</h4>{F.careLinks.map((l, i) => <Link key={l} to={r2[i]}>{l}</Link>)}</div>
      <div><h4>{F.stay}</h4><p>{F.stayP}</p></div>
    </div></footer>
  );
}
