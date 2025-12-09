// Particle Network Class
class ParticleNetwork {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = options.particleCount || 80;
    this.connectionDistance = options.connectionDistance || 120;
    this.colors = options.colors || ['#00F5FF', '#0066FF', '#00D4FF'];

    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  resize() {
    const section = this.canvas.closest('section');
    if (section) {
      this.canvas.width = section.offsetWidth;
      this.canvas.height = section.offsetHeight;
      this.init();
    }
  }

  init() {
    this.particles = [];

    for (let i = 0; i < this.particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.particles.push({
        x,
        y,
        size,
        speedX,
        speedY,
        color,
      });
    }
  }

  drawParticle(particle) {
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = particle.color;
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.5;
          this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  update() {
    this.particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.x -= Math.cos(angle) * force * 2;
          particle.y -= Math.sin(angle) * force * 2;
        }
      }

      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.speedX *= -1;
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.speedY *= -1;
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      }
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.shadowBlur = 0;

    this.connectParticles();

    this.particles.forEach((particle) => {
      this.drawParticle(particle);
    });

    this.update();

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize Particle Networks
window.addEventListener('load', () => {
  const canvasConfigs = [
    { id: 'hero-canvas', particleCount: 100, connectionDistance: 150 },
    { id: 'solutions-canvas', particleCount: 80, connectionDistance: 130 },
    { id: 'about-canvas', particleCount: 70, connectionDistance: 120 },
    { id: 'contact-canvas', particleCount: 90, connectionDistance: 140 },
  ];

  canvasConfigs.forEach((config) => {
    const canvas = document.getElementById(config.id);
    if (canvas) {
      new ParticleNetwork(canvas, {
        particleCount: config.particleCount,
        connectionDistance: config.connectionDistance,
        colors: ['#00F5FF', '#0066FF', '#00D4FF', '#4B0082'],
      });
    }
  });
});

// Apple-style Scroll Animations
class AppleScrollAnimations {
  constructor() {
    this.initScrollAnimations();
    this.observeSections();
    this.addParallaxEffects();
    window.addEventListener('scroll', () => this.onScroll());
  }

  initScrollAnimations() {
    const elements = {
      headings: document.querySelectorAll('h1, h2'),
      subheadings: document.querySelectorAll('h3'),
      cards: document.querySelectorAll('.glass-card'),
      paragraphs: document.querySelectorAll(
        'p.text-xl, p.text-gray-300, p.text-gray-400'
      ),
      buttons: document.querySelectorAll('a[class*="bg-gradient"]'),
    };

    elements.headings.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.9) translateY(30px)';
      el.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    elements.subheadings.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-30px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // FIX: Kartların opacity'sini başlangıçta 1 olarak bırakıyoruz
    elements.cards.forEach((el, index) => {
      el.style.transform = 'scale(0.95) translateY(40px)';
      el.style.transition = 'all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      el.style.transitionDelay = `${index * 0.1}s`;
      // opacity değerini ayarlamıyoruz - CSS'teki değer korunuyor
    });

    elements.paragraphs.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    elements.buttons.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.8)';
      el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  }

  observeSections() {
    const options = {
      threshold: 0.1,
      rootMargin: '-10% 0px -10% 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateSection(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });
  }

  animateSection(section) {
    const headings = section.querySelectorAll('h1, h2');
    headings.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1) translateY(0)';
      }, index * 150);
    });

    const subheadings = section.querySelectorAll('h3');
    subheadings.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }, 200 + index * 100);
    });

    // FIX: Kartları animate ederken opacity'yi değiştirmiyoruz
    const cards = section.querySelectorAll('.glass-card');
    cards.forEach((el, index) => {
      setTimeout(() => {
        el.style.transform = 'scale(1) translateY(0)';
        // opacity'yi ayarlamıyoruz - her zaman 1 kalıyor
      }, 300 + index * 150);
    });

    const paragraphs = section.querySelectorAll(
      'p.text-xl, p.text-gray-300, p.text-gray-400'
    );
    paragraphs.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + index * 80);
    });

    const buttons = section.querySelectorAll('a[class*="bg-gradient"]');
    buttons.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, 500 + index * 100);
    });
  }

  addParallaxEffects() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      section.dataset.parallaxSpeed = index % 2 === 0 ? '0.3' : '0.5';
    });
  }

  onScroll() {
    const scrolled = window.pageYOffset;

    document.querySelectorAll('section').forEach((section) => {
      const rect = section.getBoundingClientRect();
      const speed = parseFloat(section.dataset.parallaxSpeed || 0.3);

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = (scrolled - section.offsetTop) * speed;

        // Sadece hero section'da parallax efekti uygula
        if (section.id === 'home') {
          const canvas = section.querySelector('.particle-canvas');
          if (canvas) {
            canvas.style.transform = `translateY(${yPos}px)`;
          }
        }
      }
    });

    const heroSection = document.getElementById('home');
    if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
        const scrollPercent = 1 - heroRect.top / window.innerHeight;
        const scale = 1 + scrollPercent * 0.05;

        const heroContent = heroSection.querySelector('.grid');
        if (heroContent && scrollPercent > 0 && scrollPercent < 1) {
          heroContent.style.transform = `scale(${Math.min(scale, 1.05)})`;
        }
      }
    }
  }
}

// Initialize Animations
window.addEventListener('load', () => {
  new AppleScrollAnimations();
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = 80;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  });
});

// Navbar Effects
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    nav.style.background = 'rgba(5, 10, 30, 0.95)';
    nav.style.boxShadow = '0 10px 30px rgba(0, 245, 255, 0.1)';
  } else {
    nav.style.background = 'rgba(5, 10, 30, 0.8)';
    nav.style.boxShadow = 'none';
  }

  lastScroll = currentScroll;
});

// Intersection Observer for animations - FIX: opacity değişimini kaldırdık
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Sadece transform değiştiriliyor, opacity sabit kalıyor
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.glass-card').forEach((card) => {
  // Başlangıçta sadece transform ayarlıyoruz
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.6s ease';
  observer.observe(card);
});

// Stats Counter Animation
function animateValue(element, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    element.textContent = current + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Trigger stats animation when visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stats = entry.target.querySelectorAll('[class*="text-4xl"]');
        stats.forEach((stat) => {
          const text = stat.textContent.trim();

          if (text.includes('%')) {
            const value = parseInt(text);
            stat.textContent = '0%';
            animateValue(stat, 0, value, 2000, '%');
          } else if (text.includes('+')) {
            const value = parseInt(text);
            stat.textContent = '0+';
            animateValue(stat, 0, value, 2000, '+');
          } else if (!text.includes('/')) {
            const value = parseInt(text);
            if (!isNaN(value)) {
              stat.textContent = '0';
              animateValue(stat, 0, value, 2000);
            }
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.grid-cols-3').forEach((grid) => {
  statsObserver.observe(grid);
});

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className =
  'fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold shadow-lg hover:shadow-cyan-500/50 transition-all opacity-0 pointer-events-none z-50';
scrollToTopBtn.style.backdropFilter = 'blur(10px)';
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    scrollToTopBtn.style.opacity = '1';
    scrollToTopBtn.style.pointerEvents = 'auto';
  } else {
    scrollToTopBtn.style.opacity = '0';
    scrollToTopBtn.style.pointerEvents = 'none';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// Parallax effect for sections
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const speed = 0.5;
      const yPos = -(rect.top * speed);
      section.style.backgroundPosition = `center ${yPos}px`;
    }
  });
});

// Console Branding
console.log(
  '%c🚀 KIRALCORE ',
  'background: linear-gradient(90deg, #00F5FF, #0066FF); color: white; font-size: 24px; padding: 10px 20px; border-radius: 8px; font-weight: bold;'
);
console.log(
  '%c✨ İşletmenizi AI ile Dönüştürün',
  'font-size: 16px; color: #00F5FF; font-weight: bold; margin-top: 10px;'
);
console.log(
  '%c💎 Premium Space-Tech Design',
  'font-size: 14px; color: #0066FF;'
);

// Performance Monitoring
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`⚡ Sayfa ${(loadTime / 1000).toFixed(2)} saniyede yüklendi`);
});

// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
