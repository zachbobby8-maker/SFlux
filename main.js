// Global User State for Gamification
let userState = {
  status: 'Silent Node',
  resonance: 0,
  quizzesPassed: []
};

document.addEventListener('DOMContentLoaded', async () => {
  await initUserState();
  initRouter();
  initThreeJSHero();
  initThreeJSGlobe();
  initCounters();
  initMobileMenu();
  initUplinkModal();
  initQuiz();
  initDialectToggle();
  initPatentDownload();
});

const patentText = `UNITED STATES PATENT APPLICATION
Jan 30, 2026

TITLE: SYSTEM AND METHOD FOR MANIFOLD DISPLACEMENT VIA SUPERFLUID TORSION FIELDS (AERO-FLUX V-1)

INVENTOR: Mobius Braid 
ASSIGNEE: Architects of Harmonic Technologies (5th Rev Loom)
FIELD: 5th Industrial Revolution / Topological Physics / Syntropic Propulsion


I. ABSTRACT
A method and system for the navigation of a craft through atmospheric or vacuum gradients without the use of reactionary propellant. The system comprises a Möbius-Toroid Core containing a superfluid Bose-Einstein Condensate (BEC), a Topological Hull woven from an Elemental Braid of 2D materials, and a Neural Exo-Braid Interface. By establishing a phase-lock between the Architect’s intent and the core’s winding number, the craft effectively deletes the distance between coordinates, sliding along the manifold of the Abstract Vacuum at zero-latency.


II. BACKGROUND OF THE INVENTION
The 4th Industrial Revolution (4th Rev) propulsion systems rely on Newton’s Third Law—ejecting mass to create force. This is an entropic, high-viscosity process that limits travel speed and increases systemic friction. The present invention rejects "Reactionary Physics" in favor of Manifold Displacement, where the environment is warped around a Laminar Bubble, allowing for propellant-less, zero-G travel.


III. SUMMARY OF THE INVENTION
The Aero-Flux V-1 utilizes the following three core subsystems to achieve terminal emergence:

1. The Superfluid Torsion Engine: A Graphene-printed Möbius-Toroid vessel containing a BEC of polarized excitons. The non-orientable geometry of the Möbius twist ensures a permanent quantized circulation, generating a torsion field (τ_φ) that couples directly with the Abstract Vacuum (∅).
2. The Elemental Braid Hull: A 12-layer composite of Graphene (signal), hBN (insulation), MoS2 (logic), and MXenes (energy harvesting). This hull acts as a Super-Lens, making the craft invisible to radar and eliminating atmospheric drag.
3. The Radiant Sync Interface: A neural-display bridge (based on upgraded Loos protocol) that allows the pilot to shift the ship’s winding number via internal resonance.


IV. DETAILED DESCRIPTION OF THE DRAWINGS
(Note: Visual references correlate to the Radiant Sync Interface and Flux Ship Prototype docs)

FIG 1: The Möbius-Toroid Core showing quantized circulation paths and the central Vortex Core (⊛).
FIG 2: The 12-layer Elemental Braid stack showing the dielectric isolation of the hBN "White Flux" layers.
FIG 3: The Neural Exo-Braid interface mapping the coupling between the pilot's phonons and the core's polaritons.


V. CLAIMS
1. A propulsion system for manifold displacement, comprising a non-orientable Möbius-Toroid vessel and a superfluid medium maintained at zero viscosity (μ = ∅).
2. A method for navigation comprising the steps of: (a) establishing a phase-lock between an architect's intent and a superfluid core; (b) shifting the winding number of said core to create an anisotropic resonance; and (c) sliding the vessel along the resulting topological gradient.
3. A topological shielding hull woven from at least four distinct 2D material manifolds, configured to harvest atmospheric vacuum gradients for zero-latency power.


"The math is locked. The vacuum is open. Flow not Code. ;p"

Mobius braid 
Architect of Harmonic Technologies
5th Rev Signal: [AERO_FLUX_PATENT_FILED]`;

function initPatentDownload() {
  const btn = document.getElementById('btn-download-patent');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const blob = new Blob([patentText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AERO_FLUX_PATENT_FILED.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}
});

// Load user state from Miniapps AI Storage
async function initUserState() {
  try {
    if (typeof miniappsAI !== 'undefined' && miniappsAI.storage) {
      const stored = await miniappsAI.storage.getItem('sinterUserState');
      if (stored) {
        userState = JSON.parse(stored);
      }
    }
  } catch (e) {
    console.warn('Storage not available', e);
  }
  updateUIWithState();
}

// Update state and save
async function updateUserState(updates) {
  userState = { ...userState, ...updates };
  try {
    if (typeof miniappsAI !== 'undefined' && miniappsAI.storage) {
      await miniappsAI.storage.setItem('sinterUserState', JSON.stringify(userState));
    }
  } catch (e) {
    console.warn('Storage not available', e);
  }
  updateUIWithState();
}

// Reflect state changes in the UI (HUD, Buttons, Quiz)
function updateUIWithState() {
  const hud = document.getElementById('user-hud');
  const uplinkBtns = document.querySelectorAll('.uplink-trigger');
  const hudStatus = document.getElementById('hud-status');
  const hudRes = document.getElementById('hud-resonance');

  if (userState.status !== 'Silent Node') {
    // User is verified/logged in
    if(hud) {
      hud.classList.remove('hidden');
      hud.classList.add('flex');
    }
    
    uplinkBtns.forEach(btn => {
      if (btn.id === 'nav-uplink-btn') {
        btn.classList.add('hidden'); // Hide the nav uplink button
      } else {
        // Change text for hero/footer buttons
        btn.innerHTML = '<span class="fluid-text">Access Task-Pool</span><span class="basic-text">Find Work Now</span>';
        btn.classList.remove('uplink-trigger');
        btn.onclick = (e) => {
          e.preventDefault();
          alert(`Task-Pool access granted for [${userState.status.toUpperCase()}]. Routing via Vortex Engine ready.`);
        };
      }
    });

    if (hudStatus) {
      hudStatus.textContent = userState.status;
      if (userState.status === 'Scholar Node' || userState.status === 'Architect Node') {
        hudStatus.className = 'text-[10px] font-mono text-neonPurple uppercase tracking-widest leading-none mb-1';
      } else {
        hudStatus.className = 'text-[10px] font-mono text-neon uppercase tracking-widest leading-none mb-1';
      }
    }
    if (hudRes) hudRes.textContent = userState.resonance.toLocaleString() + ' RY';

  } else {
    if(hud) {
      hud.classList.add('hidden');
      hud.classList.remove('flex');
    }
  }

  // Quiz UI specific update
  if (userState.quizzesPassed.includes('mod1')) {
    const form = document.getElementById('quiz-mod1');
    const success = document.getElementById('quiz-success');
    if (form && success) {
      form.classList.add('hidden');
      success.classList.remove('hidden');
    }
  }
}

// Router for Page Views (SPA Simulation)
function initRouter() {
  const btnStart = document.getElementById('btn-start-assessment');
  const btnBack = document.getElementById('btn-back-assessment');
  const viewMain = document.getElementById('view-main');
  const viewAssessment = document.getElementById('view-assessment');
  const navLinks = document.querySelectorAll('.nav-link');

  if(btnStart) {
    btnStart.addEventListener('click', () => {
      viewMain.classList.add('hidden');
      viewAssessment.classList.remove('hidden');
      window.scrollTo(0, 0);
    });
  }

  if(btnBack) {
    btnBack.addEventListener('click', () => {
      viewAssessment.classList.add('hidden');
      viewMain.classList.remove('hidden');
      
      // Force canvas resize trigger just in case container dimensions glitched while hidden
      window.dispatchEvent(new Event('resize'));
      
      // Scroll back to academy seamlessly
      const academySection = document.getElementById('academy');
      if(academySection) {
        academySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Ensuring top nav works when inside the assessment view
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if(!viewAssessment.classList.contains('hidden')) {
        viewAssessment.classList.add('hidden');
        viewMain.classList.remove('hidden');
        window.dispatchEvent(new Event('resize'));
      }
    });
  });
}

// Setup 3D Möbius-Toroid Background Animation using Three.js
function initThreeJSHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const heroSection = document.getElementById('hero');
  
  // Guard against hidden elements giving 0 width/height
  let width = heroSection.clientWidth || window.innerWidth;
  let height = heroSection.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 35;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry = new THREE.TorusKnotGeometry(12, 3.5, 300, 40, 2, 3);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.15
  });

  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 700;
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 120;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15, color: 0xb026ff, transparent: true, opacity: 0.4
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  let mouseX = 0;
  let mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.002;
    torusKnot.rotation.y += 0.003;
    particlesMesh.rotation.y -= 0.0005;
    particlesMesh.rotation.x += 0.0002;
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    width = heroSection.clientWidth || window.innerWidth;
    height = heroSection.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// Setup 3D Interactive Network Globe for the Ecosystem Section
function initThreeJSGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const section = document.getElementById('global');
  let width = section.clientWidth || window.innerWidth;
  let height = section.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  // Offset camera to the right so text has space on the left (on desktop)
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 40;
  if(window.innerWidth > 768) {
    camera.position.x = -10; 
  }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Globe Group
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // 1. Core Sphere (Wireframe)
  const sphereGeo = new THREE.IcosahedronGeometry(14, 2);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xb026ff, wireframe: true, transparent: true, opacity: 0.1
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  globeGroup.add(sphere);

  // 2. Network Nodes (Points)
  const nodesGeo = new THREE.IcosahedronGeometry(14.2, 4);
  const nodesMat = new THREE.PointsMaterial({
    color: 0x00f0ff, size: 0.2, transparent: true, opacity: 0.8
  });
  const nodes = new THREE.Points(nodesGeo, nodesMat);
  globeGroup.add(nodes);

  // 3. Network Lines (Connecting Nodes)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.15 });
  const wireframeGeo = new THREE.WireframeGeometry(nodesGeo);
  const lines = new THREE.LineSegments(wireframeGeo, lineMat);
  globeGroup.add(lines);

  // Mouse Drag Interaction Variables
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', (e) => { isDragging = true; });
  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
      globeGroup.rotation.y += deltaMove.x * 0.005;
      globeGroup.rotation.x += deltaMove.y * 0.005;
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };
  });
  document.addEventListener('mouseup', () => { isDragging = false; });
  
  // Touch support for mobile
  canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });
  canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
      };
      globeGroup.rotation.y += deltaMove.x * 0.005;
      globeGroup.rotation.x += deltaMove.y * 0.005;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });
  document.addEventListener('touchend', () => { isDragging = false; });

  const animate = () => {
    requestAnimationFrame(animate);
    if (!isDragging) {
      globeGroup.rotation.y += 0.001; // Auto-rotate
    }
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    width = section.clientWidth || window.innerWidth;
    height = section.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    if(window.innerWidth > 768) {
      camera.position.x = -10; 
    } else {
      camera.position.x = 0;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// Live Counters Animation
function initCounters() {
  const animateValue = (id, start, end, duration, formatFunc) => {
    const obj = document.getElementById(id);
    if(!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      obj.innerHTML = formatFunc ? formatFunc(current) : current;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Trigger counters when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue("stat-nodes", 0, 14208, 2500, (v) => v.toLocaleString());
        animateValue("stat-tb", 0, 8940, 3000, (v) => v.toLocaleString());
        // Show actual user resonance if logged in, otherwise default visual
        const displayRes = userState.resonance > 500000 ? userState.resonance : 500000;
        animateValue("stat-syntropy", 0, displayRes, 3500, (v) => (v/1000).toFixed(1) + 'M');
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stat-nodes');
  if(statsSection) observer.observe(statsSection);
}

// Uplink Modal / Cinematic Onboarding
function initUplinkModal() {
  const modal = document.getElementById('uplink-modal');
  const overlay = document.getElementById('uplink-close-overlay');
  const closeBtn = document.getElementById('close-modal-btn');
  const termContent = document.getElementById('terminal-content');
  const form = document.getElementById('uplink-form');
  const emailInput = document.getElementById('uplink-email');

  // Trigger setup is done via event delegation to handle dynamically changed buttons
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.uplink-trigger')) {
      e.preventDefault();
      modal.classList.add('modal-open');
      startUplinkSequence();
    }
  });

  const typeText = async (text, delay = 30) => {
    const p = document.createElement('p');
    termContent.appendChild(p);
    termContent.scrollTop = termContent.scrollHeight;
    
    for (let i = 0; i < text.length; i++) {
      p.textContent += text.charAt(i);
      await new Promise(r => setTimeout(r, delay));
    }
    return p;
  };

  const startUplinkSequence = async () => {
    termContent.innerHTML = '';
    form.classList.add('hidden');
    form.classList.remove('opacity-100');
    form.style.opacity = '0';
    
    await typeText("> INITIATING PROTOCOL 5IR...", 5);
    await typeText("> CONNECTING TO NEAREST LATTICE NODE...", 5);
    
    const p = await typeText("> SYNC: [", 5);
    for(let i=0; i<10; i++) {
      p.textContent += "█";
      await new Promise(r => setTimeout(r, 15));
    }
    p.textContent += "] 100%";
    
    const p2 = await typeText("> CONNECTION ESTABLISHED.", 5);
    p2.classList.add('text-white');
    
    await typeText("> PLEASE VERIFY IDENTITY TO PROCEED.", 5);
    
    form.classList.remove('hidden');
    setTimeout(() => {
      form.style.opacity = '1';
      emailInput.focus();
    }, 50);
  };

  const closeModal = () => {
    modal.classList.remove('modal-open');
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    form.style.opacity = '0';
    setTimeout(() => form.classList.add('hidden'), 500);
    
    await typeText(`> VERIFYING HASH: ${email}...`, 10);
    await new Promise(r => setTimeout(r, 200));
    
    const successMsg = await typeText("> UPLINK SUCCESSFUL. STATUS UPGRADED: SILENT NODE -> VERIFIED NODE.", 10);
    successMsg.classList.add('text-white', 'font-bold', 'text-lg');
    
    // Gamification Integration!
    await updateUserState({ 
      status: 'Verified Node', 
      resonance: userState.resonance + 500 
    });

    // Close modal after success
    setTimeout(closeModal, 2500);
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  if(btn) {
    btn.addEventListener('click', () => {
      alert("Mobile menu integration can be added here.");
    });
  }
}

function initDialectToggle() {
  const btnBasic = document.getElementById('btn-lang-basic');
  const btnFluid = document.getElementById('btn-lang-fluid');
  if(!btnBasic || !btnFluid) return;

  const isBasic = localStorage.getItem('sinter_dialect') === 'basic';
  if (isBasic) {
    document.body.classList.add('lang-basic');
    updateToggleUI(true);
  }

  btnBasic.addEventListener('click', () => {
    document.body.classList.add('lang-basic');
    localStorage.setItem('sinter_dialect', 'basic');
    updateToggleUI(true);
  });

  btnFluid.addEventListener('click', () => {
    document.body.classList.remove('lang-basic');
    localStorage.setItem('sinter_dialect', 'fluid');
    updateToggleUI(false);
  });

  function updateToggleUI(isBasic) {
    if (isBasic) {
      btnBasic.classList.add('bg-neon', 'text-obsidian', 'font-bold');
      btnBasic.classList.remove('text-gray-400', 'hover:text-white');
      btnFluid.classList.remove('bg-neon', 'text-obsidian', 'font-bold');
      btnFluid.classList.add('text-gray-400', 'hover:text-white');
    } else {
      btnFluid.classList.add('bg-neon', 'text-obsidian', 'font-bold');
      btnFluid.classList.remove('text-gray-400', 'hover:text-white');
      btnBasic.classList.remove('bg-neon', 'text-obsidian', 'font-bold');
      btnBasic.classList.add('text-gray-400', 'hover:text-white');
    }
  }
}

// Academy Quiz Logic
function initQuiz() {
  const form = document.getElementById('quiz-mod1');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const feedback = document.getElementById('quiz-feedback');

    // User must be verified
    if (userState.status === 'Silent Node') {
      feedback.textContent = 'ACCESS DENIED: You must Initiate Uplink before syncing knowledge modules.';
      feedback.classList.remove('hidden');
      return;
    }

    const q1 = form.elements['q1'].value;
    const q2 = form.elements['q2'].value;
    const q3 = form.elements['q3'].value;
    
    if (!q1 || !q2 || !q3) {
      feedback.textContent = 'ERROR: Incomplete data sequence. Please answer all queries.';
      feedback.classList.remove('hidden');
      return;
    }

    // Answers: 1-c, 2-b, 3-a
    if (q1 === 'c' && q2 === 'b' && q3 === 'a') {
      // Success
      feedback.classList.add('hidden');
      
      let newStatus = userState.status === 'Verified Node' ? 'Scholar Node' : userState.status;
      
      // Update state
      await updateUserState({
        resonance: userState.resonance + 1000,
        status: newStatus,
        quizzesPassed: [...userState.quizzesPassed, 'mod1']
      });

    } else {
      // Fail
      feedback.textContent = 'SYNC FAILED: Incorrect parameters detected. Review Module 1 and try again.';
      feedback.classList.remove('hidden');
    }
  });
}
