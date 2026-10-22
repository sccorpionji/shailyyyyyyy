const progress = document.querySelector('#progress');
const toast = document.querySelector('#toast');

addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${(scrollY / scrollable * 100) || 0}%`;
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.moment').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const box = card.getBoundingClientRect();
    card.style.setProperty('--x', `${(event.clientX - box.left) / box.width * 100}%`);
    card.style.setProperty('--y', `${(event.clientY - box.top) / box.height * 100}%`);
  });
});

function burst(x, y, count = 13) {
  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = ['♥', '✦', '♡', '✧'][Math.floor(Math.random() * 4)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.color = ['#ff86b1', '#fff', '#cdbdff'][Math.floor(Math.random() * 3)];
    heart.style.setProperty('--dx', `${Math.random() * 170 - 85}px`);
    heart.style.fontSize = `${13 + Math.random() * 16}px`;
    document.body.append(heart);
    setTimeout(() => heart.remove(), 1400);
  }
}

document.querySelectorAll('.reason').forEach((item) => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
    item.querySelector('.heart').textContent = item.classList.contains('active') ? '♥' : '♡';
    const box = item.getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + 30, 7);
  });
});

document.querySelector('#surprise').addEventListener('click', (event) => {
  const box = event.target.getBoundingClientRect();
  burst(box.left + box.width / 2, box.top, 24);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
});

document.querySelector('#secretButton').addEventListener('click', (event) => {
  document.querySelector('#secretBox').classList.add('show');
  event.target.style.display = 'none';
  burst(innerWidth / 2, event.target.getBoundingClientRect().top, 36);
});

const meterObserver = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting) return;
  document.querySelector('#meterFill').style.width = '100%';
  let value = 0;
  const animation = setInterval(() => {
    value = Math.min(100, value + 2);
    document.querySelector('#meterNum').textContent = `${value}%`;
    if (value === 100) clearInterval(animation);
  }, 22);
  meterObserver.disconnect();
}, { threshold: 0.5 });
meterObserver.observe(document.querySelector('.meter-wrap'));

const canvas = document.querySelector('#sky');
const context = canvas.getContext('2d');
let stars = [];
function resizeSky() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  stars = Array.from({ length: Math.min(100, innerWidth / 10) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    radius: Math.random() * 1.3 + 0.25, phase: Math.random(), speed: Math.random() * 0.006 + 0.002
  }));
}
function drawSky() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  stars.forEach((star) => {
    star.phase += star.speed;
    context.globalAlpha = 0.25 + Math.abs(Math.sin(star.phase)) * 0.65;
    context.fillStyle = '#fff2fa';
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fill();
  });
  requestAnimationFrame(drawSky);
}
resizeSky();
drawSky();
addEventListener('resize', resizeSky);
