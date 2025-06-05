import { animate } from 'animejs';
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('.webgl');
  if (!canvas) return;

  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Create textured cylinder (mountain style)
  const cylinderHeight = 2;
  const geometry = new THREE.CylinderGeometry(1, 1, cylinderHeight, 64);
  
  // Side texture (brown earth with spiral path)
  const sideCanvas = document.createElement('canvas');
  sideCanvas.width = 512;
  sideCanvas.height = 256;
  const sideContext = sideCanvas.getContext('2d');
  
  const gradient = sideContext.createLinearGradient(0, 0, 0, sideCanvas.height);
  gradient.addColorStop(0, '#8B4513');
  gradient.addColorStop(0.3, '#A0522D');
  gradient.addColorStop(0.7, '#8B4513');
  gradient.addColorStop(1, '#654321');
  sideContext.fillStyle = gradient;
  sideContext.fillRect(0, 0, sideCanvas.width, sideCanvas.height);
  
  sideContext.strokeStyle = '#D2691E';
  sideContext.lineWidth = 8;
  sideContext.beginPath();
  for (let i = 0; i < sideCanvas.width; i += 40) {
    const wave = Math.sin(i * 0.02) * 20 + sideCanvas.height / 2;
    if (i === 0) {
      sideContext.moveTo(i, wave);
    } else {
      sideContext.lineTo(i, wave);
    }
  }
  sideContext.stroke();
  
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * sideCanvas.width;
    const y = Math.random() * sideCanvas.height;
    const size = Math.random() * 3 + 1;
    sideContext.fillStyle = '#5D4037';
    sideContext.fillRect(x, y, size, size);
  }
  
  const sideTexture = new THREE.CanvasTexture(sideCanvas);
  sideTexture.wrapS = THREE.RepeatWrapping;
  sideTexture.wrapT = THREE.RepeatWrapping;
  sideTexture.repeat.set(4, 2);
  
  const sideMaterial = new THREE.MeshStandardMaterial({
    map: sideTexture,
    roughness: 0.8
  });
  
  // Top texture (green grass)
  const topCanvas = document.createElement('canvas');
  topCanvas.width = 256;
  topCanvas.height = 256;
  const topContext = topCanvas.getContext('2d');
  
  const grassGradient = topContext.createRadialGradient(
    topCanvas.width/2, topCanvas.height/2, 0,
    topCanvas.width/2, topCanvas.height/2, topCanvas.width/2
  );
  grassGradient.addColorStop(0, '#90EE90');
  grassGradient.addColorStop(0.5, '#228B22');
  grassGradient.addColorStop(1, '#006400');
  
  topContext.fillStyle = grassGradient;
  topContext.fillRect(0, 0, topCanvas.width, topCanvas.height);
  
  topContext.strokeStyle = '#32CD32';
  topContext.lineWidth = 1;
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * topCanvas.width;
    const y = Math.random() * topCanvas.height;
    const length = Math.random() * 8 + 2;
    const angle = Math.random() * Math.PI * 2;
    
    topContext.beginPath();
    topContext.moveTo(x, y);
    topContext.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    topContext.stroke();
  }
  
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * topCanvas.width;
    const y = Math.random() * topCanvas.height;
    const colors = ['#FFD700', '#FF69B4', '#FF4500', '#9370DB'];
    topContext.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    topContext.beginPath();
    topContext.arc(x, y, 2, 0, Math.PI * 2);
    topContext.fill();
  }
  
  const topTexture = new THREE.CanvasTexture(topCanvas);
  const topMaterial = new THREE.MeshStandardMaterial({
    map: topTexture,
    roughness: 0.3
  });
  
  // Bottom material (dark earth)
  const bottomMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A4A4A,
    roughness: 0.9
  });
  
  // Create cylinder with multiple materials
  const materials = [
    sideMaterial,    // Side
    bottomMaterial,  // Bottom
    topMaterial      // Top
  ];
  
  const cylinder = new THREE.Mesh(geometry, materials);
  
  // Position cylinder at bottom of viewport
  const fovInRadians = THREE.MathUtils.degToRad(camera.fov);
  const visibleHeightAtZ = 2 * Math.tan(fovInRadians / 2) * Math.abs(camera.position.z);
  cylinder.position.y = -visibleHeightAtZ / 2 + (cylinderHeight / 2);
  
  scene.add(cylinder);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(4, 4, 4);
  scene.add(dirLight);

  // Animation setup
  const spin = animate(cylinder.rotation, {
    y: 2 * Math.PI * 2, // 2 full rotations
    duration: 10000,
    easing: 'linear',
    autoplay: false,
  });

  // Scroll synchronization
  const syncScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    spin.seek(ratio * spin.duration);
  };

  window.addEventListener('scroll', syncScroll);
  syncScroll();

  // Slider animation
  const slider = document.querySelector('.slider');
  let slideAnim = null;

  const launchSliding = () => {
    if (slideAnim) {
      slideAnim.pause();
      slideAnim = null;
    }
    const dist = window.innerWidth;
    slideAnim = animate(slider, {
      translateX: [0, -dist],
      duration: 15000,
      easing: 'linear',
      loop: true
    });
  };
  launchSliding();

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const fovInRadians = THREE.MathUtils.degToRad(camera.fov);
    const visibleHeightAtZ = 2 * Math.tan(fovInRadians / 2) * Math.abs(camera.position.z);
    cylinder.position.y = -visibleHeightAtZ / 2 + (cylinderHeight / 2);
    
    launchSliding();
    syncScroll();
  });

  // Animation loop
  const tick = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
});