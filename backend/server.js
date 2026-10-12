import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10kb' }));

const toLatin = (s) => String(s).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const AREAS = ['preventive', 'restorative', 'ortho', 'gum', 'surgery', 'implant', 'other'];
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const requests = []; // TODO: PostgreSQL table; keep it minimal (no health details)

export function validate(b = {}) {
  const name = String(b.name || '').trim();
  const contact = toLatin(b.contact || '').replace(/\s/g, '');
  const errors = [];
  if (name.length < 2 || name.length > 80) errors.push('name');
  if (contact.length > 80 || !(/^09\d{9}$/.test(contact) || EMAIL.test(contact))) errors.push('contact');
  if (!AREAS.includes(b.service)) errors.push('service');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.date || '')) || Number.isNaN(Date.parse(b.date))) errors.push('date');
  if (b.consent !== true) errors.push('consent');
  return { errors, value: { name, contact, service: b.service, date: b.date, message: String(b.message || '').trim().slice(0, 500) } };
}
app.post('/api/appointments', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), (req, res) => {
  const { errors, value } = validate(req.body);
  if (errors.length) return res.status(400).json({ ok: false, errors });
  requests.push({ ...value, createdAt: new Date().toISOString() });
  res.status(201).json({ ok: true });
});
app.get('/api/health', (_q, r) => r.json({ ok: true }));
app.listen(process.env.PORT || 5000, () => console.log('API on', process.env.PORT || 5000));
