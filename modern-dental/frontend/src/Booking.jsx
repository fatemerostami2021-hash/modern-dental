import { useState } from 'react';
import { T, SERVICES, TIMES } from './data.js';

const toLatin = (s) => s.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
export const validPhone = (s) => /^09\d{9}$/.test(toLatin(s).replace(/\s/g, ''));

export default function Booking({ lang }) {
  const t = T[lang];
  const [f, setF] = useState({ name: '', phone: '', service: 'checkup', date: '', time: TIMES[0], message: '', consent: false });
  const [bad, setBad] = useState([]);
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  async function submit(e) {
    e.preventDefault();
    const errs = [];
    if (f.name.trim().length < 2) errs.push('name');
    if (!validPhone(f.phone)) errs.push('phone');
    if (!f.date) errs.push('date');
    if (!f.consent) errs.push('consent');
    setBad(errs);
    if (errs.length) return setMsg(t.fail);
    try {
      const r = await fetch((import.meta.env.VITE_API_URL || '') + '/api/appointments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
      });
      setMsg(r.ok ? t.ok : t.fail);
    } catch { setMsg(t.fail); }
  }
  const c = (k) => (bad.includes(k) ? 'err' : '');
  return (
    <form className="book" onSubmit={submit} noValidate>
      <label>{t.name}<input className={c('name')} value={f.name} onChange={set('name')} autoComplete="name" /></label>
      <label>{t.phone}<input className={c('phone')} value={f.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" /></label>
      <label>{t.service}<select value={f.service} onChange={set('service')}>{SERVICES.map((s) => <option key={s} value={s}>{t.svc[s]}</option>)}</select></label>
      <div className="row2">
        <label>{t.date}<input type="date" className={c('date')} value={f.date} onChange={set('date')} /></label>
        <label>{t.time}<select value={f.time} onChange={set('time')}>{TIMES.map((x) => <option key={x}>{x}</option>)}</select></label>
      </div>
      <label>{t.msg}<textarea rows={3} maxLength={500} placeholder={t.msgP} value={f.message} onChange={set('message')} /></label>
      <label className={'chk ' + c('consent')}><input type="checkbox" checked={f.consent} onChange={set('consent')} /> {t.consent}</label>
      <button className="btn primary" type="submit">{t.send}</button>
      <p role="status" className="msg">{msg}</p>
    </form>
  );
}
