document.addEventListener('DOMContentLoaded', () => {
  initThreeJSHero();
  initThreeJSGlobe();
  initCounters();
  initMobileMenu();
  initUplinkModal();
});

// Setup 3D Möbius-Toroid Background Animation using Three.js
function initThreeJSHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const heroSection = document.getElementById('hero');
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

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
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// Setup 3D Interactive Network Globe for the Ecosystem Section
function initThreeJSGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const section = document.getElementById('ecosystem');
  let width = section.clientWidth;
  let height = section.clientHeight;

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
    width = section.clientWidth;
    height = section.clientHeight;
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
        animateValue("stat-syntropy", 0, 500000, 3500, (v) => (v/1000).toFixed(1) + 'M');
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
  const triggers = document.querySelectorAll('.uplink-trigger');
  const termContent = document.getElementById('terminal-content');
  const form = document.getElementById('uplink-form');
  const emailInput = document.getElementById('uplink-email');

  let typeTimer;

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
    
    await new Promise(r => setTimeout(r, 500));
    await typeText("> INITIATING PROTOCOL 5IR...");
    await new Promise(r => setTimeout(r, 400));
    await typeText("> CONNECTING TO NEAREST LATTICE NODE...", 20);
    
    // Simulate loading bar
    const p = await typeText("> SYNC: [");
    for(let i=0; i<10; i++) {
      p.textContent += "█";
      await new Promise(r => setTimeout(r, 100));
    }
    p.textContent += "] 100%";
    
    await new Promise(r => setTimeout(r, 300));
    const p2 = await typeText("> CONNECTION ESTABLISHED.", 10);
    p2.classList.add('text-white');
    
    await new Promise(r => setTimeout(r, 300));
    await typeText("> PLEASE VERIFY IDENTITY TO PROCEED.");
    
    // Show form
    form.classList.remove('hidden');
    setTimeout(() => {
      form.style.opacity = '1';
      emailInput.focus();
    }, 100);
  };

  const openModal = (e) => {
    e.preventDefault();
    modal.classList.add('modal-open');
    startUplinkSequence();
  };

  const closeModal = () => {
    modal.classList.remove('modal-open');
  };

  triggers.forEach(t => t.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    form.style.opacity = '0';
    setTimeout(() => form.classList.add('hidden'), 500);
    
    await typeText(`> VERIFYING HASH: ${email}...`);
    await new Promise(r => setTimeout(r, 800));
    
    const successMsg = await typeText("> UPLINK SUCCESSFUL. WELCOME TO THE NETWORK.");
    successMsg.classList.add('text-white', 'font-bold', 'text-lg');
    
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
