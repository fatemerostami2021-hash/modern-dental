// Colours used inside the 3D scenes, per site theme.
export const PAL = { glass: '#cfe3ff', acc: '#e0a190', emi: '#f3c3b5', spark: '#ffe6dd', scan: '#f0b8a8' };
const SETS = {
  light: { glass: '#cfe3ff', acc: '#e0a190', emi: '#f3c3b5', spark: '#ffe6dd', scan: '#f0b8a8' },   // light blue glass, rose-gold accents
  dark: { glass: '#c2324f', acc: '#e2b650', emi: '#f0c45c', spark: '#8ff0e3', scan: '#2fd6c3' },    // pomegranate gums, gold ribbons, turquoise scan + sparkles
};
export const setPalette = (t) => Object.assign(PAL, SETS[t] || SETS.light);
