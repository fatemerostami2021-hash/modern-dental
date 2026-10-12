// Colours used inside the 3D scenes, per site theme.
export const PAL = { glass: '#bfece4', acc: '#35c9b8', emi: '#27d8c4', spark: '#aef3e6', scan: '#7fe9d8' };
const SETS = {
  light: { glass: '#bfece4', acc: '#35c9b8', emi: '#27d8c4', spark: '#aef3e6', scan: '#7fe9d8' },
  dark: { glass: '#8fd8cc', acc: '#4cd9c6', emi: '#27d8c4', spark: '#aef3e6', scan: '#7fe9d8' },
  rose: { glass: '#f7ccd8', acc: '#e0ac3f', emi: '#f0c45c', spark: '#ffe2a0', scan: '#f3c969' },
};
export const setPalette = (t) => Object.assign(PAL, SETS[t] || SETS.light);
