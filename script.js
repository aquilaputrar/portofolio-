// ==========================================
// Typing Effect
// ==========================================
const typingTexts = ['Data Analyst', 'Python Developer', 'SQL', 'Data Visualizer', 'Problem Solver'];
let textIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeEffect() {
    const currentText = typingTexts[textIndex];
    typingEl.textContent = isDeleting
        ? currentText.substring(0, charIndex--)
        : currentText.substring(0, charIndex++);

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex > currentText.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        speed = 400;
    }
    setTimeout(typeEffect, speed);
}
typeEffect();

// ==========================================
// Navbar Scroll Effect
// ==========================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ==========================================
// Mobile Menu
// ==========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ==========================================
// Active Nav Link on Scroll
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navLinksList.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ==========================================
// Scroll Reveal (Intersection Observer)
// ==========================================
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ==========================================
// Counter Animation
// ==========================================
const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

function animateCounters() {
    statNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                num.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                num.textContent = target;
            }
        };
        updateCounter();
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ==========================================
// Particle Background
// ==========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        // Purple hue variations
        const purpleR = 100 + Math.floor(Math.random() * 60);
        const purpleG = 50 + Math.floor(Math.random() * 50);
        const purpleB = 200 + Math.floor(Math.random() * 56);
        this.color = `rgba(${purpleR}, ${purpleG}, ${purpleB},`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x += (dx / dist) * force * 1.5;
                this.y += (dy / dist) * force * 1.5;
            }
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const opacity = (1 - dist / 150) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================
// Smooth Scroll for anchor links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==========================================
// Certificate Modal Pop-up
// ==========================================
const certModal = document.getElementById('certModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

function openCertModal(imageSrc, title, desc) {
    if (!certModal) return;
    modalImg.src = imageSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    certModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // cegah background scroll
}

function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('show');
    setTimeout(() => {
        modalImg.src = '';
    }, 300);
    document.body.style.overflow = '';
}

// Menutup modal jika user mengklik area abu-abu di luar modal gambar
window.addEventListener('click', (e) => {
    if (e.target === certModal) {
        closeCertModal();
    }
});

// ==========================================
// Project Multi-Image Modal Pop-up
// ==========================================
const projectModal = document.getElementById('projectModal');
const projectModalImages = document.getElementById('projectModalImages');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalDesc = document.getElementById('projectModalDesc');

function openProjectModal(imagesStr, title, desc) {
    if (!projectModal) return;

    // Clear previous
    projectModalImages.innerHTML = '';

    // Pecah string koma jadi array
    const imgArray = imagesStr.split(',');

    imgArray.forEach(src => {
        const img = document.createElement('img');
        img.src = src.trim();
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        projectModalImages.appendChild(img);
    });

    projectModalTitle.textContent = title;
    projectModalDesc.textContent = desc;
    projectModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('show');
    setTimeout(() => {
        projectModalImages.innerHTML = '';
    }, 300);
    document.body.style.overflow = '';
}

window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeProjectModal();
    }
});
