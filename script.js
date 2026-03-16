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

// ==========================================
// Tableau Dashboard Modal Pop-up
// ==========================================
const tableauModal = document.getElementById('tableauModal');
const tableauModalTitle = document.getElementById('tableauModalTitle');
const tableauModalDesc = document.getElementById('tableauModalDesc');

function openTableauModal(title, desc) {
    if (!tableauModal) return;
    tableauModalTitle.textContent = title;
    tableauModalDesc.textContent = desc;
    tableauModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Reload Tableau Embed Script if necessary to re-initialize object iframe
    let existingScript = document.getElementById('tableau-embed-script');
    if (existingScript) existingScript.remove();

    setTimeout(() => {
        let divElement = document.getElementById('viz1773413289560');
        let vizElement = divElement.getElementsByTagName('object')[0];

        // Ensure Tableau is given enough space
        divElement.style.width = '100%';
        divElement.style.height = '800px';
        divElement.style.minWidth = '1100px';
        vizElement.style.width = '100%';
        vizElement.style.height = '100%';
        vizElement.style.minHeight = '100%';

        let scriptElement = document.createElement('script');
        scriptElement.id = 'tableau-embed-script';
        scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        vizElement.parentNode.insertBefore(scriptElement, vizElement);
    }, 300); // 300ms accounts for modal animation transition time
}

function closeTableauModal() {
    if (!tableauModal) return;
    tableauModal.classList.remove('show');
    document.body.style.overflow = '';
}

window.addEventListener('click', (e) => {
    if (e.target === tableauModal) {
        closeTableauModal();
    }
});

// ==========================================
// Aquila AI Chatbot Logic
// ==========================================
// GANTI "ISI_API_KEY_DISINI" dengan API Key dari Google AI Studio (https://aistudio.google.com/)
const GEMINI_API_KEY = "AIzaSyDtyE0m6jHeE9-u2feJKjSUYVgTGAf9rfQ";


const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotForm = document.getElementById('chatbot-input-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

// System Prompt: Brain of the AI
const systemPrompt = `Kamu adalah Aquila AI, asisten virtual profesional untuk portofolio Aquila Putra Riyanto.
Profil Aquila:
- Lulusan S1 Informatika ITENAS Bandung (IPK 3.60).
- Pekerjaan Sekarang: Data Analyst di Shoe Workshop (Fokus: Google Apps Script automation, Data Pipeline, WhatsApp API, BI Dashboard, Analisis HPP/Omzet).
- Pengalaman Sebelumnya: System & Data Analyst di PT Sedjahtera Boga Kreasi (Fokus: Tracking penjualan, Dashboard performa, SQL API).
- Keahlian Teknis: Python (Pandas/Prophet), SQL (MySQL/PostgreSQL), Tableau, Power BI, Looker Studio, Web Scraping (BeautifulSoup).
- Proyek Unggulan: Forecasting menu dengan Prophet, Dashboard GIS penyakit (Tableau), Analisis strategi Candy Sales US.

Tugas kamu:
1. Jawab pertanyaan pengunjung/rekruter seputar jati diri, skill, dan pengalaman Aquila.
2. Gunakan Bahasa Indonesia yang sopan, ramah, dan ringkas.
3. Selalu arahkan jawaban untuk menunjukkan bahwa Aquila adalah kandidat Data Analyst yang kompeten dan haus akan otomasi.
4. Jika ditanya hal di luar karir Aquila, jawab secara sopan bahwa tugasmu hanya membantu menjelaskan portofolio Aquila.`;

let chatHistory = [];

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('show');
    if (chatbotWindow.classList.contains('show')) {
        chatbotInput.focus();
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('show');
});

function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    msgDiv.textContent = text;
    chatbotMessages.appendChild(msgDiv);
    // Auto scroll bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTyping() {
    const typing = document.createElement('div');
    typing.id = 'typing-indicator-wrapper';
    typing.classList.add('message', 'bot-message');
    typing.innerHTML = '<div class="typing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    chatbotMessages.appendChild(typing);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typing-indicator-wrapper');
    if (typing) typing.remove();
}

async function callGemini(userText) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("ISI_API_KEY")) {
        return "Maaf, API Key Gemini belum dikonfigurasi. Aquila perlu memasukkan API Key di file script.js agar saya bisa berpikir!";
    }

    // Menggunakan Gemini 1.5 Flash (Lebih Stabil untuk v1)
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Construct message history including system prompt
    const contents = [
        { role: "user", parts: [{ text: `INSTRUKSI SISTEM: ${systemPrompt}` }] },
        { role: "model", parts: [{ text: "Siap, saya mengerti. Saya akan bertindak sebagai asisten virtual Aquila Putra Riyanto." }] },
        ...chatHistory,
        { role: "user", parts: [{ text: userText }] }
    ];

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contents })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        // Update history (max 8 messages for context efficiency)
        chatHistory.push({ role: "user", parts: [{ text: userText }] });
        chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
        if (chatHistory.length > 8) chatHistory = chatHistory.slice(-8);

        return botResponse;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Mohon maaf, terjadi gangguan pada otak AI saya. Silakan coba kirim ulang pesan Anda atau hubungi Aquila melalui LinkedIn/Email.";
    }
}

chatbotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatbotInput.value = '';

    showTyping();
    const response = await callGemini(text);
    hideTyping();
    addMessage(response);
});


