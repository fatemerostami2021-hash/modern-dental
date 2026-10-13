import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, useParams, useLocation } from 'react-router-dom';
import { useStore } from './store.js';
import { Blocks, SiteFooter } from './Sections.jsx';
import { UI } from './content.js';
import { PAGES, ORDER } from './copy.js';
import ServiceLanding from './ServiceLanding.jsx';
import Stage, { Spark } from './Stage.jsx';
import { setSeo } from './seo.js';

const CinematicHero = lazy(() => import('./CinematicHero.jsx'));
function Wave({ text, lang, step = 0.06 }) {
  const parts = lang === 'fa' ? text.split(' ') : [...text];   // Persian is animated by word so letters never get split apart
  return (
    <span className="wave" aria-label={text}>
      {parts.map((w, i) => <span key={i} aria-hidden="true" style={{ animationDelay: `${i * step}s` }}>{w === ' ' ? '\u00A0' : w}{lang === 'fa' && i < parts.length - 1 ? ' ' : ''}</span>)}
    </span>
  );
}

const THEMES = [['light', 'Light'], ['dark', 'Dark']];
function LogoMark() {
  const [ok, setOk] = useState(true);
  return <span className="mark">{ok ? <img className="logo-img" src="/images/logo/logo.webp" alt="" onError={() => setOk(false)} /> : <Spark />}<i className="tw t1" /><i className="tw t2" /></span>;
}
const SiteBackground = () => <div className="sitebg" aria-hidden="true"><i className="blob b1" /><i className="blob b2" /><i className="blob b3" /><i className="grid" /><i className="sun" /></div>;

function Header() {
  const { lang, theme, setTheme, cycleTheme } = useStore();
  const u = UI[lang];
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenu(false), [pathname]);
  return (
    <header className="top">
      <div className="wrap bar">
        <Link to="/" className="logo" aria-label={u.brand}>
          <LogoMark />
          <span><b><Wave text={u.brand} lang={lang} step={0.07} /></b>{u.sub && <small>{u.sub}</small>}</span>
        </Link>
        <nav className={'nav' + (menu ? ' open' : '')} aria-label="Main">
          {ORDER.map((s) => <NavLink key={s} to={'/' + s} end={s === ''} className={({ isActive }) => (isActive ? 'act' : '')}><Wave text={PAGES[s].nav[lang]} lang={lang} step={0.035} /></NavLink>)}
          <button className="btn ghost show-sm" onClick={cycleTheme}>Theme: {THEMES.find(([k]) => k === theme)[1]}</button>
          <Link to="/contact#request" className="btn primary show-sm">{u.book} ↗</Link>
        </nav>
        <div className="tools">
          <div className="pill hide-sm" role="group" aria-label="Theme">
            {THEMES.map(([k, n]) => <button key={k} className={theme === k ? 'on' : ''} onClick={() => setTheme(k)}>{n}</button>)}
          </div>
          <Link to="/contact#request" className="btn primary hide-sm">{u.book} ↗</Link>
          <button className="burger" aria-expanded={menu} aria-label={u.menu} onClick={() => setMenu(!menu)}>{menu ? '✕' : '☰'}</button>
        </div>
      </div>
    </header>
  );
}

const applySeo = (slug, lang) => { const [t, d] = PAGES[slug].seo[lang]; setSeo(t, d, slug ? '/' + slug : '/'); };

function Page({ slug }) {
  const { lang } = useStore();
  const { hash } = useLocation();
  const c = PAGES[slug];
  const u = UI[lang];
  useEffect(() => { if (c) applySeo(slug, lang); else document.title = u.nf; }, [slug, lang]);
  useEffect(() => { if (hash) { const id = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); return () => clearTimeout(id); } window.scrollTo(0, 0); }, [slug, hash]);
  if (!c) return <div className="wrap sec"><h1>{u.nf}</h1><Link to="/">←</Link></div>;
  const H = c.hero[lang];
  return (
    <>
      {slug && <nav className="wrap crumb" aria-label="Breadcrumb"><Link to="/">{PAGES[''].nav[lang]}</Link><span>/</span><span>{c.nav[lang]}</span></nav>}
      {slug === '' ? <Suspense fallback={<div className="cine-ph" />}><CinematicHero /></Suspense> : (
        <section className="wrap hero">
          <div className="copy">
            <span className="badge">{H.eyebrow}</span>
            <h1>{H.h.map((line, i) => <span key={i} className={i ? 'em' : ''}>{line.split(' ').map((w, j) => <span key={j}><span className="vw" style={{ animationDelay: `${(i * 4 + j) * 0.15}s` }}>{w}</span>{' '}</span>)}<br /></span>)}</h1>
            <p className="lead">{H.lead}</p>
            <div className="cta"><Link className="btn primary lg" to={H.to1 || '/contact#request'}>{H.cta1} ↗</Link>{H.cta2 && <Link className="btn ghost lg" to={H.to2 || '/services'}>{H.cta2} →</Link>}</div>
            {H.note && <p className="fine">{H.note}</p>}
          </div>
          {c.scene !== 'home' && <Stage kind={c.scene} />}
        </section>
      )}
      <Blocks blocks={c.blocks} lang={lang} photo={c.photo} />
    </>
  );
}
const Slug = () => <Page slug={useParams().slug} />;

// Scroll-triggered reveal: every card / heading slides in from its own direction when it enters the viewport.
function useReveal(dep) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...document.querySelectorAll('main .shead, main .opt, main .steps > div, main .faqlist details, main .formcard, main .crow, main .closing, main .shot, main .ba, main .okcard')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    const count = new Map();
    els.forEach((el) => {
      const n = count.get(el.parentElement) || 0; count.set(el.parentElement, n + 1);
      el.style.setProperty('--d', Math.min(n * 0.09, 0.6) + 's');
      el.classList.add('rv');
      el.addEventListener('transitionend', (e) => { if (e.propertyName === 'transform') el.classList.add('done'); });
      io.observe(el);
    });
    return () => io.disconnect();
  }, [dep]);
}

export default function App() {
  const { lang, theme } = useStore();
  const { pathname } = useLocation();
  useReveal(pathname);
  useEffect(() => { const h = document.documentElement; h.lang = lang; h.dir = lang === 'fa' ? 'rtl' : 'ltr'; h.dataset.theme = theme; }, [lang, theme]);
  const u = UI[lang];
  return (
    <>
      <SiteBackground />
      <Header />
      <main><Routes><Route path="/" element={<Page slug="" />} /><Route path="/services/:sub" element={<ServiceLanding />} /><Route path="/:slug" element={<Slug />} /></Routes></main>
      <SiteFooter />
    </>
  );
}
