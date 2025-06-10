import { animate } from 'animejs';
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('.webgl');
  if (!canvas) return;

  const scene = new THREE.Scene();


  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

 
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);


  const cylinderHeight = 2;
  const geometry = new THREE.CylinderGeometry(1, 1, cylinderHeight, 64);
  

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
  

  const bottomMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A4A4A,
    roughness: 0.9
  });
  

  const materials = [
    sideMaterial,   
    bottomMaterial,  
    topMaterial      
  ];
  
  const cylinder = new THREE.Mesh(geometry, materials);
  

  const fovInRadians = THREE.MathUtils.degToRad(camera.fov);
  const visibleHeightAtZ = 2 * Math.tan(fovInRadians / 2) * Math.abs(camera.position.z);
  cylinder.position.y = -visibleHeightAtZ / 2 + (cylinderHeight / 2);
  
  scene.add(cylinder);

 
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(4, 4, 4);
  scene.add(dirLight);


  const spinDuration = 10000;
  const spin = animate(cylinder.rotation, {
    y: 2 * Math.PI * 2, 
    duration: spinDuration,
    easing: 'linear',
    autoplay: false,
  });

 
  const contentSections = [
    { 
      id: 'about', 
      title: 'Sobre Mí - Fabián Morales', 
      content: '<p style="color: white;">Me llamo Fabián. Me apasionan los videojuegos sobre cualquier cosa y también me gusta programar para experimentar con los diferentes entornos con los que puedo trabajar. Siempre es un placer conocer nuevas personas! :D </p>',
      sound: './about.mp3',
      image: './about.png'
    },
    { 
      id: 'projects', 
      title: 'Mis Proyectos', 
      content: `
        <div class="projects-grid">
        <div class="project-card">
          <h3>Portafolio</h3>
          <p>Este mismo proyecto interactivo creado con HTML5, CSS, JS, Anime.js y Three.js</p>
        </div>
        <a href="https://23267.dernait.my/Lab5-web/main.html" target="_blank" class="project-card">
          <h3>Chat Interactivo</h3>
          <p>Chat interactivo conectado con API hecha con express.</p>
        </a>
        
        <a href="https://23267.dernait.my/interactiveH/src/" target="_blank" class="project-card">
          <h3>Historia Interactiva</h3>
          <p>Historia Interactiva desarrollada únicamente con HTML5, CSS Y JS.</p>
        </a>
        
        <a href="https://23267.dernait.my/Lab6-web/" target="_blank" class="project-card">
          <h3>Juego de Memoria</h3>
          <p>Juego de memoria desarrollado con REACT.</p>
        </a>
        
        <a href="https://23267.dernait.my/ProyectoCalcu/Protecto1WebCalculadora/" target="_blank" class="project-card">
          <h3>Calculadora</h3>
          <p>Desarrollado con React.</p>
        </a>
       
      </div>
      `,
      sound: './projects.mp3',
      image: './projects.png'
    },
    { 
      id: 'contact', 
      title: 'Contacto', 
      content: `
        <p style="color: white;">Email: fabimoradav2004@gmail.com</p>
        <p style="color: white;">Teléfono: +502 5515-5810</p>
        <button id="cv-download">Descargar CV</button>
      `,
      sound: './contact.mp3',
      image: './contact.png'
    }
  ];

 
  contentSections.forEach(section => {
    const sectionEl = document.createElement('section');
    sectionEl.id = section.id;
    sectionEl.className = 'content-section';
    
    sectionEl.innerHTML = `
      <div class="section-content">
        <h2>${section.title}</h2>
        ${section.content}
      </div>
      <div class="section-image-container">
        <img src="${section.image}" alt="${section.title}" class="section-image">
      </div>
    `;
    
    document.body.appendChild(sectionEl);
    section.element = sectionEl;
    section.audio = new Audio(section.sound);
    section.audio.volume = 0.9;
  });


  document.getElementById('cv-download')?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = './cv.pdf';
    link.download = 'CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

 
  const bgMusic = document.getElementById('bg-music');
  const muteToggle = document.getElementById('mute-toggle');
  let isMuted = false;

 
  const tryAutoplay = () => {
    bgMusic.volume = 0.3;
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          muteToggle.style.display = 'flex';
        })
        .catch(error => {
          console.log('Autoplay prevented. Music will start after interaction.');
        });
    }
  };


  tryAutoplay();


  document.body.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play()
        .then(() => {
          muteToggle.style.display = 'flex';
        });
    }
  }, { once: true });

 
  muteToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    muteToggle.classList.toggle('muted', isMuted);
    
 
    contentSections.forEach(section => {
      section.audio.muted = isMuted;
    });
  });

 
  const syncScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    spin.seek(ratio * spinDuration);
    
    const rotation = (cylinder.rotation.y % (2 * Math.PI));
    const segmentSize = (2 * Math.PI) / contentSections.length;
    
    contentSections.forEach((section, index) => {
      const startAngle = index * segmentSize;
      const endAngle = (index + 1) * segmentSize;
      
      if (rotation >= startAngle && rotation < endAngle) {
        section.element.style.display = 'grid';
        
   
        if (section.audio.paused && !isMuted) {
          section.audio.currentTime = 0;
          section.audio.play().catch(e => console.log('Audio play failed:', e));
        }
        
 
        if (window.scrollY < section.element.offsetTop || 
            window.scrollY > section.element.offsetTop + section.element.offsetHeight) {
          section.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        section.element.style.display = 'none';
        section.audio.pause();
      }
    });
  };

  window.addEventListener('scroll', syncScroll);
  syncScroll();


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


  const tick = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
});