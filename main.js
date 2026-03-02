document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initMobileMenu();
});

// Setup 3D Möbius-Toroid Background Animation using Three.js
function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  
  // Get Hero section dimensions
  const heroSection = document.getElementById('hero');
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 35;

  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Torus Knot (Möbius-like loop)
  // Parameters: radius, tube, tubularSegments, radialSegments, p, q
  const geometry = new THREE.TorusKnotGeometry(12, 3.5, 300, 40, 2, 3);
  
  // Use a wireframe material to give it a futuristic "tech" structure
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  // Add floating particles/dust
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 700;
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles across a wide area
    posArray[i] = (Math.random() - 0.5) * 120;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xb026ff,
    transparent: true,
    opacity: 0.4
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Animation variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // Track mouse to add slight parallax/interaction
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  });

  // Main animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate Torus
    torusKnot.rotation.x += 0.002;
    torusKnot.rotation.y += 0.003;

    // Rotate Particles slowly
    particlesMesh.rotation.y -= 0.0005;
    particlesMesh.rotation.x += 0.0002;

    // Smooth camera movement based on mouse
    targetX = mouseX * 2;
    targetY = mouseY * 2;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };
  
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
  });
}

// Minimal Mobile Menu Logic
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  // Simple interaction since full menu layout isn't specced heavily for mobile,
  // we could just toggle a class or alert for now.
  if(btn) {
    btn.addEventListener('click', () => {
      alert("Mobile menu toggle functionality can be added here.");
    });
  }
}