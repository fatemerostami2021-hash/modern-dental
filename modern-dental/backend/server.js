import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10kb' }));

const toLatin = (s) => String(s).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const SERVICES = ['checkup', 'whitening', 'implant', 'aligner', 'veneer', 'emergency'];
const appointments = []; // TODO: replace with PostgreSQL table (no health details stored)

export function validate(b = {}) {
  const name = String(b.name || '').trim();
  const phone = toLatin(b.phone || '').replace(/\s/g, '');
  const date = String(b.date || '');
  const time = String(b.time || '');
  const message = String(b.message || '').trim().slice(0, 500);
  const errors = [];
  if (name.length < 2 || name.length > 80) errors.push('name');
  if (!/^09\d{9}$/.test(phone)) errors.push('phone');
  if (!SERVICES.includes(b.service)) errors.push('service');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) errors.push('date');
  if (!/^\d{2}:\d{2}$/.test(time)) errors.push('time');
  if (b.consent !== true) errors.push('consent');
  return { errors, value: { name, phone, service: b.service, date, time, message } };
}

app.post('/api/appointments', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), (req, res) => {
  const { errors, value } = validate(req.body);
  if (errors.length) return res.status(400).json({ ok: false, errors });
  appointments.push({ ...value, createdAt: new Date().toISOString() });
  res.status(201).json({ ok: true });
});
app.get('/api/health', (_q, r) => r.json({ ok: true }));
app.listen(process.env.PORT || 5000, () => console.log('API on', process.env.PORT || 5000));
