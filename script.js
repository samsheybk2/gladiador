const EMAILJS_CONFIG = {
  publicKey: 'bL35kW953b_Qv1EoJ',
  serviceID: 'service_q9u4s8m',
  templateID: 'template_rlxkbni',
};

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const submitBtn = contactForm?.querySelector('.button');

if (contactForm) {
  emailjs.init(EMAILJS_CONFIG.publicKey);

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm));
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    formNote.textContent = '';

    try {
      await emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, {
        name: data.name,
        company: data.company,
        email: data.email,
        message: data.message,
      });
      formNote.textContent = 'Gracias por tu interés. En breve te contactaremos.';
      formNote.style.color = 'var(--primary)';
      contactForm.reset();
    } catch {
      formNote.textContent = 'Hubo un error. Intenta de nuevo o escríbenos a contacto@gladiador.com';
      formNote.style.color = '#dc2626';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar solicitud';
    }
  });
}

const canvas = document.getElementById('neuralCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const points = [];
  const pointCount = Math.max(22, Math.min(32, Math.floor(window.innerWidth / 50)));
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const createPoints = () => {
    points.length = 0;
    for (let i = 0; i < pointCount; i += 1) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 1.4 + Math.random() * 1.6,
      });
    }
  };

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createPoints();
  };

  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
      if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const effect = Math.min(1, 180 / (dist + 1));

      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 120, 174, ${0.65 * effect + 0.16})`;
      ctx.fill();
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) {
          ctx.strokeStyle = `rgba(0, 120, 174, ${0.2 - distance / 1000})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    const mouseLines = points.filter((point) => {
      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      return Math.sqrt(dx * dx + dy * dy) < 180;
    });

    mouseLines.forEach((point) => {
      ctx.strokeStyle = 'rgba(0, 120, 174, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(pointer.x, pointer.y);
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  resizeCanvas();
  draw();
}

const projects = [
  { name: 'Antojos Oy', url: 'https://antojosoy.vercel.app/' },
  { name: 'Creaciones DJ', url: 'https://creacionesdj.vercel.app/' },
  { name: 'Amieluz Body', url: 'https://amieluzbody.vercel.app/' },
  { name: 'CCS Commission System', url: 'https://ccs-commission-system.vercel.app/' },
];

const track = document.getElementById('carouselTrack');
const modal = document.getElementById('projectModal');
const modalIframe = document.getElementById('modalIframe');
const modalVisit = document.getElementById('modalVisit');
const modalClose = document.getElementById('modalClose');

if (track) {
  const buildCards = (items) => {
    items.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.dataset.url = p.url;
      card.innerHTML = `<span>${p.name}</span>`;

      card.addEventListener('click', () => {
        if (!isDown) {
          modalIframe.src = p.url;
          modalVisit.href = p.url;
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });

      track.appendChild(card);
    });
  };

  buildCards(projects);
  buildCards(projects);

  if (modal) {
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      modalIframe.src = '';
    };

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  let isDown = false;
  let startX;
  let scrollLeft;
  let autoScroll = true;

  const cardWidth = 240;
  const step = 0.8;
  const totalWidth = projects.length * (cardWidth + 16);

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    autoScroll = false;
    track.classList.add('grabbing');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    autoScroll = true;
    track.classList.remove('grabbing');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    setTimeout(() => { autoScroll = true; }, 1000);
    track.classList.remove('grabbing');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  track.addEventListener('mouseenter', () => {
    autoScroll = false;
  });

  track.addEventListener('mouseleave', () => {
    setTimeout(() => { autoScroll = true; }, 500);
  });

  const loop = () => {
    if (autoScroll) {
      track.scrollLeft += step;
      if (track.scrollLeft >= totalWidth) {
        track.scrollLeft = 0;
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
