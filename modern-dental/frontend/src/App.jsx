import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, useParams, useLocation } from 'react-router-dom';
import { useStore } from './store.js';
import { T, SERVICES } from './data.js';
import { HomeSections, ContactSection, SiteFooter } from './Sections.jsx';
import { UI, PAGES, ORDER } from './content.js';
import Booking from './Booking.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const Jaw3D = lazy(() => import('./Jaw3D.jsx'));
const webgl = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } };
function useReady() {
  const [r, s] = useState(false);
  useEffect(() => { const ric = window.requestIdleCallback; const id = ric ? ric(() => s(true), { timeout: 300 }) : setTimeout(() => s(true), 200); return () => (ric ? window.cancelIdleCallback(id) : clearTimeout(id)); }, []);
  return r && webgl();
}
const Spark = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" /></svg>;

function Header() {
  const { lang, theme, setLang, toggleTheme } = useStore();
  const u = UI[lang];
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenu(false), [pathname]);
  const light = theme === 'light';
  return (
    <header className="top">
      <div className="wrap row1">
        <Link to="/" className="logo"><span className="mark"><Spark /></span><span><b>{u.brand}</b><small>{u.sub}</small></span></Link>
        <div className="tools">
          <div className="pill" role="group" aria-label="Language">
            <button className={lang === 'fa' ? 'on' : ''} onClick={() => setLang('fa')}>فارسی</button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
          </div>
          <div className="pill hide-sm" role="group" aria-label="Theme">
            <button className={light ? 'on' : ''} onClick={() => !light && toggleTheme()}>{u.light}</button>
            <button className={!light ? 'on' : ''} onClick={() => light && toggleTheme()}>{u.dark}</button>
          </div>
          <Link to="/contact" className="btn primary hide-sm">{u.book} ↗</Link>
          <button className="burger" aria-expanded={menu} aria-label={u.menu} onClick={() => setMenu(!menu)}>{menu ? '✕' : '☰'}</button>
        </div>
      </div>
      <nav className={'wrap navrow' + (menu ? ' open' : '')}>
        {ORDER.map((s) => <NavLink key={s} to={'/' + s} end className={({ isActive }) => (isActive ? 'act' : '')}>{PAGES[s][lang].nav}</NavLink>)}
        <button className="btn ghost show-sm" onClick={toggleTheme}>{light ? u.dark : u.light}</button>
      </nav>
    </header>
  );
}

function Stage() {
  const ready = useReady();
  const u = UI[useStore().lang];
  return (
    <div className="stage" aria-hidden="false">
      <div className="disc" />
      <svg className="orbit" viewBox="0 0 400 300"><ellipse cx="200" cy="150" rx="190" ry="105" /></svg>
      <i className="orb o1" /><i className="orb o2" />
      <div className="cv">{ready && <ErrorBoundary inline><Suspense fallback={null}><Jaw3D /></Suspense></ErrorBoundary>}</div>
      <span className="spark"><Spark /></span>
      <div className="float"><span className="ico">♡</span><div><b>{u.cardT}</b><small>{u.cardD}</small></div></div>
    </div>
  );
}

const Cards = ({ items }) => <div className="cards">{items.map(([a, b]) => <article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>;

function Page({ slug }) {
  const { lang } = useStore();
  const c = PAGES[slug];
  const L = c?.[lang], u = UI[lang], t = T[lang];
  useEffect(() => { document.title = L ? `${L.nav} | ${u.brand}` : u.nf; window.scrollTo(0, 0); }, [slug, lang]);
  if (!c) return <div className="wrap sec"><h1>{u.nf}</h1><Link to="/">←</Link></div>;
  return (
    <>
      {slug && <nav className="wrap crumb" aria-label="Breadcrumb"><Link to="/">{PAGES[''][lang].nav}</Link><span>/</span><span>{L.badge}</span></nav>}
      <section className="wrap hero">
        <div className="copy">
          <span className="badge">{L.badge}</span>
          <h1>{L.h[0]}<br /><em>{L.h[1]}</em></h1>
          <p className="lead">{L.lead}</p>
          <div className="cta"><Link className="btn primary lg" to="/contact">{L.cta} ↗</Link>{L.cta2 && <Link className="btn ghost lg" to="/services">{L.cta2} ↗</Link>}</div>
          {L.note && <p className="fine">{L.note}</p>}
        </div>
        {c.visual && <Stage />}
      </section>
      {c.kind === 'home' && <HomeSections />}
      {(c.kind === 'cards' || c.kind === 'home') && c.kind === 'cards' && <section className="wrap sec"><Cards items={L.items} /></section>}
      {c.kind === 'services' && <section className="wrap sec"><h2>{u.svcH}</h2><Cards items={SERVICES.map((s) => [t.svc[s], `${t.from} {{PRICE}}`])} /></section>}
      {c.kind === 'faq' && <section className="wrap sec narrow">{L.items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>}
      {c.kind === 'contact' && <ContactSection />}
    </>
  );
}
const Slug = () => <Page slug={useParams().slug} />;

export default function App() {
  const { lang, theme } = useStore();
  useEffect(() => { const h = document.documentElement; h.lang = lang; h.dir = lang === 'fa' ? 'rtl' : 'ltr'; h.dataset.theme = theme; }, [lang, theme]);
  const u = UI[lang];
  return (
    <>
      <Header />
      <main><Routes><Route path="/" element={<Page slug="" />} /><Route path="/:slug" element={<Slug />} /></Routes></main>
      <SiteFooter />
    </>
  );
}
