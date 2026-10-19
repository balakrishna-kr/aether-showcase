# 🧬 Unwind the Helix — 3D Interactive Scrolling Website

[![Live Demo](https://img.shields.io/badge/Live-GitHub%20Pages-38bdf8?style=for-the-badge&logo=github)](https://balakrishna-kr.github.io/aether-showcase/)
[![Figma Clone](https://img.shields.io/badge/Figma-Design%20Cloned-a855f7?style=for-the-badge&logo=figma)](assets/figma-design-reference.png)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-10b981?style=for-the-badge&logo=three.js)](https://threejs.org/)

An interactive 3D scrolling experience cloned from the Figma design **"3D Interactive Scrolling Website" (Unwind the Helix)**. Powered by WebGL and Three.js with real-time parametric double-helix generation, scroll-driven molecular strand unwinding, dynamic bioluminescent lighting, and spatial mouse parallax.

🌐 **Live Website:** [https://balakrishna-kr.github.io/aether-showcase/](https://balakrishna-kr.github.io/aether-showcase/)  
🎨 **Figma Reference File:** `https://www.figma.com/make/tveVDIesgOUejjr6Dvri97/3D-Interactive-Scrolling-Website`

---

## ✨ Key Features

- **Exact Figma Typography & Layout**: Replicating the headline *"Unwind the helix."*, glowing cyan neon bloom, clean frosted glass navigation, and minimal biotech dark mode.
- **Parametric 3D Double Helix**: Built natively with Three.js without any heavy pre-rendered video. Two spiraling nucleotide backbone chains connected by base-pair rungs (Adenine-Thymine and Guanine-Cytosine).
- **Scroll-Linked Unwinding Choreography**: As you scroll down through the narrative sections, the 3D double helix rotates, pitches in perspective, and physically uncouples and "unwinds" into separate parallel strands in 60 FPS real-time.
- **Dynamic Bioluminescent Palettes**: Live switcher between **Cyan Bioluminescence**, **Violet Quantum**, **Emerald Biosynthesis**, and **Solar Core** affecting all 3D materials, lights, and CSS variables.
- **Interactive 3D Control Studio**: Tweak unwind percentage, rotation velocity, helical radius, and particle starfield density on the fly.
- **Free Orbit Drag**: Toggle between scroll-locked cinematic path and interactive 3D mouse/touch dragging.
- **Zero Build Tool Overhead**: Runs natively on vanilla HTML5, CSS3, and ES6 JavaScript — deployed straight to GitHub Pages.

---

## 🚀 Running Locally

Open [index.html](index.html) in any browser, or run a local static server:

```bash
# Clone the repository
git clone https://github.com/balakrishna-kr/aether-showcase.git

# Navigate into folder
cd aether-showcase

# Run with Python
python -m http.server 8000

# Or run with Node
npx serve
```

---

## 🛠️ Deployment

Hosted automatically on **GitHub Pages** from the `main` branch.
