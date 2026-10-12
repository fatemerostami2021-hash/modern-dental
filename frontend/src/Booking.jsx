import { useState } from 'react';
import { T, AREAS } from './data.js';

const toLatin = (s) => s.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
export const validContact = (s) => { const v = toLatin(s).replace(/\s/g, ''); return /^09\d{9}$/.test(v) || /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v); };

export default function Booking({ lang }) {
  const t = T[lang];
  const [f, setF] = useState({ name: '', contact: '', service: 'preventive', date: '', message: '', consent: false });
  const [bad, setBad] = useState([]);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  async function submit(e) {
    e.preventDefault();
    const errs = [];
    if (f.name.trim().length < 2) errs.push('name');
    if (!validContact(f.contact)) errs.push('contact');
    if (!f.date) errs.push('date');
    if (!f.consent) errs.push('consent');
    setBad(errs);
    if (errs.length) return setMsg(t.fail);
    try {
      const r = await fetch((import.meta.env.VITE_API_URL || '') + '/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      if (r.ok) { setDone(true); setMsg(''); } else setMsg(r.status === 503 ? t.unavail : t.fail);
    } catch { setMsg(t.fail); }
  }
  if (done) return <div className="okcard" role="status"><h3>{t.okT}</h3><p>{t.okP}</p><button className="btn ghost" onClick={() => { setDone(false); setF({ ...f, message: '', consent: false }); }}>{t.again}</button></div>;
  const c = (k) => (bad.includes(k) ? 'err' : '');
  return (
    <form className="book" onSubmit={submit} noValidate>
      <label>{t.name}<input className={c('name')} value={f.name} onChange={set('name')} autoComplete="name" /></label>
      <label>{t.phone}<input className={c('contact')} value={f.contact} onChange={set('contact')} autoComplete="email" dir="ltr" /></label>
      <div className="row2">
        <label>{t.service}<select value={f.service} onChange={set('service')}>{AREAS[lang].map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></label>
        <label>{t.date}<input type="date" min={new Date().toISOString().slice(0, 10)} className={c('date')} value={f.date} onChange={set('date')} /></label>
      </div>
      <label>{t.msg}<textarea rows={3} maxLength={500} placeholder={t.msgP} value={f.message} onChange={set('message')} /></label>
      <label className={'chk ' + c('consent')}><input type="checkbox" checked={f.consent} onChange={set('consent')} /> {t.consent}</label>
      <button className="btn primary lg" type="submit">{t.send}</button>
      <p role="alert" className="msg">{msg}</p>
    </form>
  );
}
