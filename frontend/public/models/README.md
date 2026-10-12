# 3D assets still required (production)
Drop optimized GLB files here (Draco/meshopt, textures <= 2K) and swap them into `src/HeroScene.jsx`:
- `face-lower.glb`   realistic lower-face / neck (licensed or commissioned)
- `upper-arch.glb`, `lower-arch.glb`   individual teeth + gums (named meshes: tooth_11 ... tooth_47)
- `jaw-overlay.glb`   translucent jaw / bone anatomy
- `tooth-hero.glb`    single tooth for the floating bubble
Until then the scene uses procedural placeholder geometry (HeroScene.jsx) and a photo in `public/images/smile-closeup.jpg`.
Only use photos/models you own or have licensed; real before/after photos need written patient consent.
