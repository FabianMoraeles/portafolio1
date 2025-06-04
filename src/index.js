import { animate } from 'animejs';

const slider = document.querySelector('.slider');
let slideAnim;           // instancia activa

function launchSliding() {
  // Detén la animación anterior (si existe)
  if (slideAnim) slideAnim.pause();

  const distance = window.innerWidth;  // 100vw en píxeles

  slideAnim = animate(slider, {
    translateX: [0, -distance],
    duration: 15_000,            // 15 s por ciclo; ajusta al gusto
    easing: 'linear',
    loop: true
  });
}


launchSliding();
window.addEventListener('resize', launchSliding);