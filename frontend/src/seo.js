const tag = (sel, mk) => document.head.querySelector(sel) || document.head.appendChild(mk());
const meta = (attr, key, val) => { const el = tag(`meta[${attr}="${key}"]`, () => document.createElement('meta')); el.setAttribute(attr, key); el.setAttribute('content', val); };
export function setSeo(title, desc, path) {
  document.title = title;
  meta('name', 'description', desc); meta('property', 'og:title', title); meta('property', 'og:description', desc); meta('property', 'og:type', 'website'); meta('property', 'og:locale', 'en_US');
  const l = tag('link[rel=canonical]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }));
  l.href = window.location.origin + path;
}
