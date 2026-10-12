// Vercel serverless function: validates the form and emails the clinic through Resend.
// Needs env vars: RESEND_API_KEY, CLINIC_EMAIL (optional: MAIL_FROM). Without them it answers 503 (it never pretends to deliver).
const AREAS = ['preventive', 'restorative', 'ortho', 'gum', 'surgery', 'implant', 'other'];
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
export function validate(b = {}) {
  const name = String(b.name || '').trim(), contact = String(b.contact || '').replace(/\s/g, '');
  const errors = [];
  if (name.length < 2 || name.length > 80) errors.push('name');
  if (contact.length > 80 || !(/^09\d{9}$/.test(contact) || EMAIL.test(contact))) errors.push('contact');
  if (!AREAS.includes(b.service)) errors.push('service');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.date || '')) || Number.isNaN(Date.parse(b.date))) errors.push('date');
  if (b.consent !== true) errors.push('consent');
  return { errors, value: { name, contact, service: b.service, date: b.date, message: String(b.message || '').trim().slice(0, 500) } };
}
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  let body = req.body; if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { errors, value } = validate(body || {});
  if (errors.length) return res.status(400).json({ ok: false, errors });
  const key = process.env.RESEND_API_KEY, to = process.env.CLINIC_EMAIL;
  if (!key || !to) return res.status(503).json({ ok: false, error: 'delivery_not_configured' });
  const text = ['New appointment request', `Name: ${value.name}`, `Contact: ${value.contact}`, `Area of concern: ${value.service}`, `Preferred date: ${value.date}`, `Notes: ${value.message || '-'}`].join('\n');
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.MAIL_FROM || 'onboarding@resend.dev', to: [to], subject: `Appointment request: ${value.name}`, text, ...(EMAIL.test(value.contact) ? { reply_to: value.contact } : {}) }) });
    return res.status(r.ok ? 201 : 502).json({ ok: r.ok });
  } catch { return res.status(502).json({ ok: false }); }
}
