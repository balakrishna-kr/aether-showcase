/**
 * UNWIND THE HELIX - 3D WEBGL INTERACTION ENGINE
 * Built with Three.js | Parametric Double Helix with Scroll-Triggered Unwinding
 */

// Global State
const state = {
  unwindFactor: 0.0,
  rotationSpeed: 0.006,
  baseRadius: 2.5,
  particleCount: 1200,
  autoRotate: true,
  freeOrbit: false,
  themeColor: '#38bdf8',
  secondaryColor: '#818cf8',
  scrollProgress: 0,
  targetScrollProgress: 0,
  mouseX: 0,
  mouseY: 0,
  targetMouseX: 0,
  targetMouseY: 0,
  isDragging: false,
  prevMouseX: 0,
  prevMouseY: 0
};

// Three.js Core Components
let scene, camera, renderer;
let helixGroup, strandAGroup, strandBGroup, rungsGroup;
let particlesMesh;
let basePairMeshes = [];
let strandSpheresA = [];
let strandSpheresB = [];
let dirLight1, dirLight2, pointLight;

const NUM_POINTS = 80;
const HELIX_HEIGHT = 28;
const TURNS = 3.5;

document.addEventListener('DOMContentLoaded', () => {
  initThree();
  initHelix();
  initParticles();
  initEventListeners();
  initUIControllers();
  animate();
});

/* ==========================================================================
   1. THREE.JS INITIALIZATION
   ========================================================================== */
function initThree() {
  const canvas = document.getElementById('webgl-canvas');

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030712, 0.032);

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 22);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(0x38bdf8, 3, 40);
  pointLight.position.set(5, 5, 10);
  scene.add(pointLight);

  dirLight1 = new THREE.DirectionalLight(0x818cf8, 1.5);
  dirLight1.position.set(-10, 10, 8);
  scene.add(dirLight1);

  dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
  dirLight2.position.set(10, -10, 8);
  scene.add(dirLight2);
}

/* ==========================================================================
   2. PARAMETRIC 3D DOUBLE HELIX GENERATION
   ========================================================================== */
function initHelix() {
  helixGroup = new THREE.Group();
  strandAGroup = new THREE.Group();
  strandBGroup = new THREE.Group();
  rungsGroup = new THREE.Group();

  helixGroup.add(strandAGroup);
  helixGroup.add(strandBGroup);
  helixGroup.add(rungsGroup);
  scene.add(helixGroup);

  // Initial positioning: shift right for Hero text balance
  helixGroup.position.set(3.5, 0, 0);
  helixGroup.rotation.z = 0.35; // Tilted aesthetic from Figma
  helixGroup.rotation.x = 0.15;

  const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const rungCylinderGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 12);

  const matA = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8
  });

  const matB = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8
  });

  const matRungCyan = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.4,
    roughness: 0.3,
    metalness: 0.5
  });

  const matRungViolet = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.4,
    roughness: 0.3,
    metalness: 0.5
  });

  for (let i = 0; i < NUM_POINTS; i++) {
    const t = i / (NUM_POINTS - 1);
    const y = (t - 0.5) * HELIX_HEIGHT;
    const angle = t * Math.PI * 2 * TURNS;

    // Strand A Sphere
    const sphereA = new THREE.Mesh(sphereGeo, matA);
    sphereA.userData = { originalY: y, originalAngle: angle };
    strandAGroup.add(sphereA);
    strandSpheresA.push(sphereA);

    // Strand B Sphere
    const sphereB = new THREE.Mesh(sphereGeo, matB);
    sphereB.userData = { originalY: y, originalAngle: angle + Math.PI };
    strandBGroup.add(sphereB);
    strandSpheresB.push(sphereB);

    // Base pair rung (every second point)
    if (i % 2 === 0) {
      const mat = (i % 4 === 0) ? matRungCyan : matRungViolet;
      const rungMesh = new THREE.Mesh(rungCylinderGeo, mat);
      rungMesh.userData = { idxA: i, idxB: i };
      rungsGroup.add(rungMesh);
      basePairMeshes.push(rungMesh);
    }
  }

  updateHelixGeometry(0);
}

/* ==========================================================================
   3. HELIX UNWINDING & GEOMETRY UPDATES
   ========================================================================== */
function updateHelixGeometry(unwind) {
  const currentRadius = state.baseRadius * (1 + unwind * 0.8);
  const unwindSeparation = unwind * 5.0; // Distance strands drift apart when unwound

  for (let i = 0; i < NUM_POINTS; i++) {
    const sA = strandSpheresA[i];
    const sB = strandSpheresB[i];

    const angleA = sA.userData.originalAngle;
    const angleB = sB.userData.originalAngle;
    const y = sA.userData.originalY;

    // As unwind progresses, helical twist decreases and strands pull apart laterally
    const twistFactor = 1 - unwind * 0.75;
    const currentAngleA = angleA * twistFactor;
    const currentAngleB = angleB * twistFactor;

    const xA = Math.cos(currentAngleA) * currentRadius - unwindSeparation * 0.6;
    const zA = Math.sin(currentAngleA) * currentRadius;

    const xB = Math.cos(currentAngleB) * currentRadius + unwindSeparation * 0.6;
    const zB = Math.sin(currentAngleB) * currentRadius;

    sA.position.set(xA, y, zA);
    sB.position.set(xB, y, zB);
  }

  // Update Rung Connections between Strand A and Strand B
  for (let j = 0; j < basePairMeshes.length; j++) {
    const rung = basePairMeshes[j];
    const sA = strandSpheresA[rung.userData.idxA];
    const sB = strandSpheresB[rung.userData.idxB];

    // When unwinding passes 35%, base pairs uncouple and fade out
    if (unwind > 0.35) {
      const scale = Math.max(0, 1 - (unwind - 0.35) * 2.2);
      rung.scale.set(scale, scale, scale);
    } else {
      rung.scale.set(1, 1, 1);
    }

    const posA = sA.position;
    const posB = sB.position;
    const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
    rung.position.copy(midPoint);

    const distance = posA.distanceTo(posB);
    rung.scale.y = distance;

    const direction = new THREE.Vector3().subVectors(posB, posA).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    rung.quaternion.setFromUnitVectors(up, direction);
  }
}

/* ==========================================================================
   4. AMBIENT GLOWING PARTICLE CLOUD
   ========================================================================== */
function initParticles() {
  const count = state.particleCount;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 45;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    scales[i] = Math.random() * 0.25 + 0.05;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // Custom soft particle shader material
  const material = new THREE.PointsMaterial({
    size: 0.18,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);
}

/* ==========================================================================
   5. EVENT LISTENERS & SCROLL CONTROLLER
   ========================================================================== */
function initEventListeners() {
  window.addEventListener('resize', onWindowResize);

  // Mouse Parallax & Drag Orbit
  const canvas = document.getElementById('webgl-canvas');

  window.addEventListener('mousemove', (e) => {
    state.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    state.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (state.isDragging && state.freeOrbit) {
      const deltaX = e.clientX - state.prevMouseX;
      const deltaY = e.clientY - state.prevMouseY;
      helixGroup.rotation.y += deltaX * 0.01;
      helixGroup.rotation.x += deltaY * 0.01;
      state.prevMouseX = e.clientX;
      state.prevMouseY = e.clientY;
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    state.isDragging = true;
    state.prevMouseX = e.clientX;
    state.prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    state.isDragging = false;
  });

  // Touch controls for mobile
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      state.targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
      state.targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
  }, { passive: true });

  // Scroll Progress Calculation
  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    state.targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / scrollHeight));

    // Header styling on scroll
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link
    const sections = ['hero', 'architecture', 'sequencing', 'lab'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop - 200;
        const height = el.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
          document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      }
    });
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

/* ==========================================================================
   6. UI INTERACTIVE CONTROLLERS
   ========================================================================== */
function initUIControllers() {
  // Mobile Nav Toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // 3D Color Mode Switcher
  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const colorKey = btn.dataset.color;
      document.body.setAttribute('data-theme', colorKey);

      themeButtons.forEach(b => b.classList.toggle('active', b === btn));

      let primaryHex = 0x38bdf8;
      let secondaryHex = 0x818cf8;

      if (colorKey === 'violet') {
        primaryHex = 0xa855f7;
        secondaryHex = 0x38bdf8;
      } else if (colorKey === 'emerald') {
        primaryHex = 0x10b981;
        secondaryHex = 0x06b6d4;
      } else if (colorKey === 'amber') {
        primaryHex = 0xf59e0b;
        secondaryHex = 0xef4444;
      }

      // Update 3D materials dynamically
      strandSpheresA.forEach(s => s.material.color.setHex(primaryHex));
      strandSpheresB.forEach(s => s.material.color.setHex(secondaryHex));
      if (particlesMesh) particlesMesh.material.color.setHex(primaryHex);
      if (pointLight) pointLight.color.setHex(primaryHex);

      showToast(`3D Bioluminescence shifted to ${colorKey.toUpperCase()}`);
    });
  });

  // Sandbox Sliders
  const unwindSlider = document.getElementById('unwind-slider');
  const speedSlider = document.getElementById('speed-slider');
  const radiusSlider = document.getElementById('radius-slider');
  const particlesSlider = document.getElementById('particles-slider');

  if (unwindSlider) {
    unwindSlider.addEventListener('input', (e) => {
      state.unwindFactor = parseFloat(e.target.value) / 100;
      document.getElementById('unwind-val').textContent = `${e.target.value}%`;
      updateHelixGeometry(state.unwindFactor);
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 10;
      state.rotationSpeed = 0.006 * val;
      document.getElementById('speed-val').textContent = `${val.toFixed(1)}x`;
    });
  }

  if (radiusSlider) {
    radiusSlider.addEventListener('input', (e) => {
      state.baseRadius = parseFloat(e.target.value) / 10;
      document.getElementById('radius-val').textContent = state.baseRadius.toFixed(1);
      updateHelixGeometry(state.unwindFactor);
    });
  }

  if (particlesSlider) {
    particlesSlider.addEventListener('input', (e) => {
      document.getElementById('particles-val').textContent = e.target.value;
      state.particleCount = parseInt(e.target.value, 10);
      if (particlesMesh) scene.remove(particlesMesh);
      initParticles();
    });
  }

  // Sandbox Buttons
  const resetBtn = document.getElementById('reset-cam-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      helixGroup.rotation.set(0.15, 0, 0.35);
      helixGroup.position.set(3.5, 0, 0);
      state.unwindFactor = 0;
      if (unwindSlider) unwindSlider.value = 0;
      document.getElementById('unwind-val').textContent = '0%';
      updateHelixGeometry(0);
      showToast('Camera and Helix reset to Hero position');
    });
  }

  const toggleOrbitBtn = document.getElementById('toggle-orbit-btn');
  if (toggleOrbitBtn) {
    toggleOrbitBtn.addEventListener('click', () => {
      state.freeOrbit = !state.freeOrbit;
      toggleOrbitBtn.textContent = state.freeOrbit ? 'Disable Orbit' : 'Toggle Free Orbit';
      showToast(state.freeOrbit ? 'Free 3D mouse drag enabled!' : 'Scroll-locked mode enabled');
    });
  }
}

/* ==========================================================================
   7. TOAST NOTIFICATIONS
   ========================================================================== */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ==========================================================================
   8. RENDER & ANIMATION LOOP (60 FPS)
   ========================================================================== */
function animate() {
  requestAnimationFrame(animate);

  // Smooth lerp for scroll and mouse
  state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * 0.07;
  state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
  state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

  // Auto Rotation + Mouse Parallax
  if (!state.isDragging) {
    helixGroup.rotation.y += state.rotationSpeed;
  }

  // Camera subtle parallax
  camera.position.x = state.mouseX * 1.5;
  camera.position.y = -state.mouseY * 1.2;
  camera.lookAt(0, 0, 0);

  // Scroll Choreography (Spatial Camera & Helix Movement)
  const sp = state.scrollProgress;

  if (!state.freeOrbit) {
    // Stage 1 (0 to 0.3): Hero Position (Shifted right)
    // Stage 2 (0.3 to 0.7): Architecture & Sequencing (Shifts left to allow text readability on right)
    // Stage 3 (0.7 to 1.0): Lab & Controls (Moves to center and unwinds)
    let targetX = 3.5;
    let targetY = 0;
    let targetZ = 0;
    let targetUnwind = 0;

    if (sp < 0.35) {
      const p = sp / 0.35;
      targetX = 3.5 - p * 1.0;
      targetUnwind = p * 0.15;
    } else if (sp < 0.75) {
      const p = (sp - 0.35) / 0.4;
      targetX = 2.5 - p * 6.5; // Glides to -4.0 (left side)
      targetY = p * 1.5;
      targetUnwind = 0.15 + p * 0.55; // Unwinds up to 70%
    } else {
      const p = (sp - 0.75) / 0.25;
      targetX = -4.0 + p * 4.0; // Returns to center 0.0
      targetY = 1.5 - p * 1.5;
      targetUnwind = 0.70 + p * 0.30; // Unwinds up to 100%
    }

    helixGroup.position.x += (targetX - helixGroup.position.x) * 0.08;
    helixGroup.position.y += (targetY - helixGroup.position.y) * 0.08;
    helixGroup.position.z += (targetZ - helixGroup.position.z) * 0.08;

    // Apply scroll-driven unwind if user hasn't manually overridden via sandbox
    if (document.getElementById('unwind-slider')?.value === '0') {
      updateHelixGeometry(targetUnwind);
      document.getElementById('hud-unwind').textContent = `${(targetUnwind * 100).toFixed(1)}%`;
    }
  }

  // Gentle particle drift
  if (particlesMesh) {
    particlesMesh.rotation.y += 0.0006;
    particlesMesh.rotation.x += 0.0003;
  }

  // Update Telemetry HUD
  const hudRot = document.getElementById('hud-rotation');
  if (hudRot) {
    hudRot.textContent = `${(helixGroup.rotation.y % (Math.PI * 2)).toFixed(2)} rad`;
  }

  renderer.render(scene, camera);
}
