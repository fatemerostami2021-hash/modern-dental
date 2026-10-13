import { useEffect, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { SERVICE_PAGES } from './services.js';
import Stage from './Stage.jsx';
import { Head, Card, Rail } from './Sections.jsx';
import { setSeo } from './seo.js';

const BOOK = '/contact#request';

// Vertical timeline: the line fills and each step lights up as the visitor scrolls through it.
function Timeline({ items }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current, steps = [...el.querySelectorAll('.tl-step')];
    const on = () => { const r = el.getBoundingClientRect(), mid = window.innerHeight * 0.58; el.style.setProperty('--p', Math.min(1, Math.max(0, (mid - r.top) / r.height))); steps.forEach((d) => d.classList.toggle('on', d.getBoundingClientRect().top < mid)); };
    on(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return <ol className="tl" ref={ref}>{items.map(([t, d], i) => <li className="tl-step" key={t}><span className="tl-dot">{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>;
}

export default function ServiceLanding() {
  const { sub } = useParams();
  const { hash } = useLocation();
  const s = SERVICE_PAGES.find((x) => x.slug === sub);
  useEffect(() => { if (s) setSeo(s.seo[0], s.seo[1], '/services/' + s.slug); else document.title = 'Page not found'; }, [sub]);
  useEffect(() => { if (hash) { const id = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 80); return () => clearTimeout(id); } window.scrollTo(0, 0); }, [sub, hash]);
  if (!s) return <div className="wrap sec"><h1>Page not found</h1><Link to="/services">← Services</Link></div>;
  const others = SERVICE_PAGES.filter((x) => x.slug !== s.slug);
  return (
    <>
      <nav className="wrap crumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/services">Services</Link><span>/</span><span>{s.title}</span></nav>
      <section className="wrap hero svc-hero">
        <div className="copy">
          <span className="badge">{s.title}</span>
          <h1>{s.hero.h.map((line, i) => <span key={i} className={i ? 'em' : ''}>{line.split(' ').map((w, j) => <span key={j}><span className="vw" style={{ animationDelay: `${(i * 4 + j) * 0.15}s` }}>{w}</span>{' '}</span>)}<br /></span>)}</h1>
          {s.hero.lead.map((p) => <p className="lead" key={p}>{p}</p>)}
          <div className="cta"><Link className="btn primary lg" to={BOOK}>{s.hero.cta} ↗</Link><Link className="btn ghost lg" to={{ pathname: '/services/' + s.slug, hash: '#treatments' }}>{s.hero.cta2 || 'See Your Options'} ↓</Link></div>
        </div>
        <Stage kind={s.scene} />
      </section>

      <section id="treatments" className="wrap sec"><Head h={s.offer.h} p={s.offer.p} /><div className="cards3">{s.offer.items.map(([t, d]) => <Card key={t} t={t} d={d} />)}</div></section>

      <section className="band"><div className="wrap sec two">
        <div>
          <Head h={s.text.h} />
          {s.text.ps.map((p) => <p key={p}>{p}</p>)}
          {s.text.list && <ul className="tick">{s.text.list.map((x) => <li key={x}>{x}</li>)}</ul>}
          {s.text.after && <p>{s.text.after}</p>}
        </div>
        <aside className="opt"><h3>Have a question about this treatment?</h3><p>Every plan starts with an individual examination. Tell us what concerns you and the clinic will follow up.</p><Link className="btn primary" to={BOOK}>Request a Consultation ↗</Link></aside>
      </div></section>

      <section className="wrap sec narrow"><Head h={s.steps.h} /><Timeline items={s.steps.items} /></section>

      <section className="wrap sec narrow faqlist"><Head h="Frequently Asked Questions" />{s.faq.map(([q, a], i) => <details name="faq" key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}</section>

      <section className="wrap sec"><div className="ctaband"><div><h2>{s.final.h}</h2><p>{s.final.p}</p><Link className="btn mint lg" to={BOOK}>{s.final.cta} ↗</Link></div><i className="ring" aria-hidden="true" /></div><p className="fine">Information on this page is general and does not replace an individual dental examination or professional advice.</p></section>

      <section className="wrap sec"><Head h="Explore Other Services" /><Rail>{others.map((o) => <Card key={o.slug} t={o.title} d={o.blurb} to={'/services/' + o.slug} />)}</Rail></section>
    </>
  );
}
