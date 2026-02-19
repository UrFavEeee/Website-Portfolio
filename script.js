/* ===================================
   JAVASCRIPT — Portfolio Interactivity
   =================================== */

// ---- DOM ELEMENTS ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typedTextEl = document.getElementById('typed-text');
const contactForm = document.getElementById('contact-form');

// ---- TYPING ANIMATION ----
const phrases = [
    'web applications.',
    'mobile apps.',
    'RESTful APIs.',
    'clean interfaces.',
    'digital experiences.'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 80;
const deleteSpeed = 45;
const pauseAfterType = 1800;
const pauseAfterDelete = 400;

function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, pauseAfterType);
            return;
        }
        setTimeout(type, typeSpeed);
    } else {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, pauseAfterDelete);
            return;
        }
        setTimeout(type, deleteSpeed);
    }
}

// Start typing after a short delay
setTimeout(type, 600);

// ---- NAVBAR SCROLL EFFECT ----
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Add scrolled class for background
    if (currentScroll > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;

    // Highlight active section
    highlightActiveLink();
});

// ---- MOBILE MENU ----
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ---- ACTIVE NAV LINK HIGHLIGHT ----
function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ---- SCROLL REVEAL (Intersection Observer) ----
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for siblings
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            let delay = 0;
            siblings.forEach((sibling, i) => {
                if (sibling === entry.target) {
                    delay = i * 80;
                }
            });

            setTimeout(() => {
                entry.target.classList.add('active');
            }, delay);

            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ---- EMAILJS CONFIGURATION ----
// ⚠️ Replace these with your own EmailJS credentials:
//   1. Sign up at https://www.emailjs.com
//   2. Create an Email Service (e.g. Gmail) → copy the Service ID
//   3. Create an Email Template → copy the Template ID
//   4. Go to Account → copy your Public Key
const EMAILJS_PUBLIC_KEY = 'ZgdrL-UjL6VssOLMO';
const EMAILJS_SERVICE_ID = 'service_drotdzs';
const EMAILJS_TEMPLATE_ID = 'template_u8z7p3c';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ---- CONTACT FORM ----
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Update button state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Send email via EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        subject: subject || 'New Contact Form Message',
        message: message,
    })
        .then(() => {
            showFormMessage('Message sent successfully! I\'ll be in touch soon. 🎉', 'success');
            contactForm.reset();
        })
        .catch((error) => {
            console.error('EmailJS Error:', error);
            showFormMessage('Oops! Something went wrong. Please try again or email me directly.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(text, type) {
    // Remove existing message
    const existing = contactForm.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = `form-message form-message--${type}`;
    msg.textContent = text;
    msg.style.cssText = `
        padding: 0.85rem 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        font-weight: 500;
        animation: fadeIn 0.3s ease;
        ${type === 'success'
            ? 'background: rgba(0, 212, 100, 0.1); color: #00d464; border: 1px solid rgba(0, 212, 100, 0.2);'
            : 'background: rgba(255, 80, 80, 0.1); color: #ff5050; border: 1px solid rgba(255, 80, 80, 0.2);'
        }
    `;
    contactForm.prepend(msg);

    setTimeout(() => msg.remove(), 5000);
}

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
