// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(l =>
    l.addEventListener('click', () => navLinks && navLinks.classList.remove('open'))
);

// ── NAVBAR SCROLL SHADOW ──
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.5)' : 'none';
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.module-card, .benefit-item, .func-block, .hero-card').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    revealObserver.observe(el);
});

// ── CONTACT FORM ──
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(f => {
            f.style.borderColor = '';
            if (!f.value.trim() || (f.type === 'checkbox' && !f.checked)) { f.style.borderColor = '#e53935'; valid = false; }
        });
        const tel = document.getElementById('telefono'), mail = document.getElementById('correo');
        if (tel && !/^\d{10}$/.test(tel.value.trim())) { tel.style.borderColor = '#e53935'; valid = false; }
        if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim())) { mail.style.borderColor = '#e53935'; valid = false; }
        if (!valid) return;
        const btnText = document.getElementById('btnText'), btnLoad = document.getElementById('btnLoading');
        if (btnText) btnText.style.display = 'none';
        if (btnLoad) btnLoad.style.display = 'inline';
        setTimeout(() => {
            const ok = document.getElementById('formSuccess');
            if (ok) { ok.style.display = 'block'; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            form.reset();
            if (btnText) btnText.style.display = 'inline';
            if (btnLoad) btnLoad.style.display = 'none';
        }, 1200);
    });
}

// ══════════════════════════════════════════════════════
//  GYM CANVAS — LOGO PRE-RENDERIZADO
// ══════════════════════════════════════════════════════
(function gymCanvas() {
    const canvas = document.getElementById('gymCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, items = [];
    let offCanvas = null;
    let resizeTimer = null;
    let lastW = 0;

    const rand = (a, b) => Math.random() * (b - a) + a;
    const TYPES = ['logo', 'dumbbell'];

    function resize() {
        W = canvas.width = canvas.offsetWidth || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    // ── SVG INLINE A BASE64 ──
    const rawSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2000" zoomAndPan="magnify" viewBox="0 0 1500 1499.999933" height="2000" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><g/><clipPath id="4a39818cb7"><path d="M 734.984375 645 L 752 645 L 752 682 L 734.984375 682 Z M 734.984375 645 " clip-rule="nonzero"/></clipPath><clipPath id="d8ae284d0f"><path d="M 790 570.195312 L 827.984375 570.195312 L 827.984375 756.945312 L 790 756.945312 Z M 790 570.195312 " clip-rule="nonzero"/></clipPath><clipPath id="c245ebf82d"><path d="M 1152 645 L 1169.425781 645 L 1169.425781 682 L 1152 682 Z M 1152 645 " clip-rule="nonzero"/></clipPath><clipPath id="bdc1d83fc8"><path d="M 1077.175781 570.195312 L 1114 570.195312 L 1114 756.945312 L 1077.175781 756.945312 Z M 1077.175781 570.195312 " clip-rule="nonzero"/></clipPath><clipPath id="e7ca5e64cf"><path d="M 827.292969 631.480469 L 1080.441406 631.480469 L 1080.441406 677.597656 L 827.292969 677.597656 Z M 827.292969 631.480469 " clip-rule="nonzero"/></clipPath><clipPath id="98954353de"><path d="M 0.292969 0.480469 L 253.441406 0.480469 L 253.441406 46.597656 L 0.292969 46.597656 Z M 0.292969 0.480469 " clip-rule="nonzero"/></clipPath><clipPath id="f3529466a3"><rect x="0" width="254" y="0" height="47"/></clipPath><clipPath id="37aef24263"><rect x="0" width="239" y="0" height="63"/></clipPath></defs><g clip-path="url(#4a39818cb7)"><path fill="#d94147" d="M 730.222656 654.71875 L 730.222656 672.433594 C 730.222656 677.324219 734.203125 681.304688 739.09375 681.304688 L 751.339844 681.304688 L 751.339844 645.847656 L 739.09375 645.847656 C 734.203125 645.847656 730.222656 649.828125 730.222656 654.71875 " fill-opacity="1" fill-rule="nonzero"/></g><path fill="#d94147" d="M 774.0625 591.949219 L 767.59375 591.949219 C 761.605469 591.949219 756.746094 596.78125 756.746094 602.765625 L 756.746094 724.386719 C 756.746094 730.339844 761.605469 735.203125 767.59375 735.203125 L 774.0625 735.203125 C 780.050781 735.203125 784.910156 730.339844 784.910156 724.386719 L 784.910156 602.765625 C 784.910156 596.78125 780.050781 591.949219 774.0625 591.949219 " fill-opacity="1" fill-rule="nonzero"/><g clip-path="url(#d8ae284d0f)"><path fill="#d94147" d="M 817.480469 570.195312 L 801.164062 570.195312 C 795.179688 570.195312 790.320312 575.058594 790.320312 581.042969 L 790.320312 746.109375 C 790.320312 752.09375 795.179688 756.953125 801.164062 756.953125 L 817.480469 756.953125 C 823.433594 756.953125 828.296875 752.09375 828.296875 746.109375 L 828.296875 581.042969 C 828.296875 575.058594 823.433594 570.195312 817.480469 570.195312 " fill-opacity="1" fill-rule="nonzero"/></g><g clip-path="url(#c245ebf82d)"><path fill="#d94147" d="M 1165.15625 645.847656 L 1152.914062 645.847656 L 1152.914062 681.304688 L 1165.15625 681.304688 C 1170.050781 681.304688 1174.03125 677.324219 1174.03125 672.433594 L 1174.03125 654.71875 C 1174.03125 649.828125 1170.050781 645.847656 1165.15625 645.847656 " fill-opacity="1" fill-rule="nonzero"/></g><path fill="#d94147" d="M 1136.691406 591.949219 L 1130.15625 591.949219 C 1124.203125 591.949219 1119.339844 596.78125 1119.339844 602.765625 L 1119.339844 724.386719 C 1119.339844 730.339844 1124.203125 735.203125 1130.15625 735.203125 L 1136.691406 735.203125 C 1142.644531 735.203125 1147.503906 730.339844 1147.503906 724.386719 L 1147.503906 602.765625 C 1147.503906 596.78125 1142.644531 591.949219 1136.691406 591.949219 " fill-opacity="1" fill-rule="nonzero"/><g clip-path="url(#bdc1d83fc8)"><path fill="#d94147" d="M 1103.085938 570.195312 L 1086.773438 570.195312 C 1080.816406 570.195312 1075.957031 575.058594 1075.957031 581.042969 L 1075.957031 746.109375 C 1075.957031 752.09375 1080.816406 756.953125 1086.773438 756.953125 L 1103.085938 756.953125 C 1109.074219 756.953125 1113.933594 752.09375 1113.933594 746.109375 L 1113.933594 581.042969 C 1113.933594 575.058594 1109.074219 570.195312 1103.085938 570.195312 " fill-opacity="1" fill-rule="nonzero"/></g><g clip-path="url(#e7ca5e64cf)"><g transform="matrix(1, 0, 0, 1, 827, 631)"><g clip-path="url(#f3529466a3)"><g clip-path="url(#98954353de)"><path fill="#d94147" d="M 0.292969 0.480469 L 253.398438 0.480469 L 253.398438 46.597656 L 0.292969 46.597656 Z M 0.292969 0.480469 " fill-opacity="1" fill-rule="nonzero"/></g></g></g></g><path stroke-linecap="butt" transform="matrix(0.749995, 0.00278294, -0.00278294, 0.749995, 828.176746, 630.354118)" fill="none" stroke-linejoin="miter" d="M -0.000922073 1.501815 L 332.006589 1.499038 " stroke="#fefefe" stroke-width="3" stroke-opacity="1" stroke-miterlimit="4"/><path stroke-linecap="butt" transform="matrix(0.75, -0.000000000000000279, 0.000000000000000279, 0.75, 828.172522, 676.471554)" fill="none" stroke-linejoin="miter" d="M -0.000862689 1.50147 L 332.004374 1.50147 " stroke="#fefefe" stroke-width="3" stroke-opacity="1" stroke-miterlimit="4"/><g fill="#d94147" fill-opacity="1"><g transform="translate(424.102351, 1011.326715)"><g><path d="M 482.703125 -313.40625 L 611.1875 -313.40625 L 611.1875 -66.84375 C 578.195312 -41.957031 540 -22.859375 496.59375 -9.546875 C 453.1875 3.765625 409.488281 10.421875 365.5 10.421875 C 302.414062 10.421875 245.695312 -3.035156 195.34375 -29.953125 C 144.988281 -56.867188 105.484375 -94.195312 76.828125 -141.9375 C 48.179688 -189.6875 33.859375 -243.660156 33.859375 -303.859375 C 33.859375 -364.054688 48.179688 -418.023438 76.828125 -465.765625 C 105.484375 -513.515625 145.273438 -550.847656 196.203125 -577.765625 C 247.140625 -604.679688 304.441406 -618.140625 368.109375 -618.140625 C 421.359375 -618.140625 469.6875 -609.164062 513.09375 -591.21875 C 556.5 -573.28125 592.960938 -547.238281 622.484375 -513.09375 L 532.1875 -429.75 C 488.78125 -475.46875 436.398438 -498.328125 375.046875 -498.328125 C 336.265625 -498.328125 301.828125 -490.222656 271.734375 -474.015625 C 241.640625 -457.816406 218.195312 -434.957031 201.40625 -405.4375 C 184.625 -375.914062 176.234375 -342.054688 176.234375 -303.859375 C 176.234375 -266.234375 184.625 -232.660156 201.40625 -203.140625 C 218.195312 -173.628906 241.492188 -150.625 271.296875 -134.125 C 301.109375 -117.632812 335.113281 -109.390625 373.3125 -109.390625 C 413.832031 -109.390625 450.296875 -118.070312 482.703125 -135.4375 Z M 482.703125 -313.40625 "/></g></g></g></svg>`;

    // ── PRERENDER: convierte SVG → canvas rojo UNA SOLA VEZ ──
    const logoImg = new Image();
    logoImg.onload = () => {
        const SIZE = 256;
        offCanvas = document.createElement('canvas');
        offCanvas.width = SIZE;
        offCanvas.height = SIZE;
        const octx = offCanvas.getContext('2d');
        octx.drawImage(logoImg, 0, 0, SIZE, SIZE);
        octx.globalCompositeOperation = 'source-in';
        octx.fillStyle = '#e53935';
        octx.fillRect(0, 0, SIZE, SIZE);
    };
    logoImg.onerror = () => { offCanvas = null; };

    try {
        logoImg.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(rawSVG)));
    } catch (e) {
        logoImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(rawSVG);
    }

    // ── RESIZE: solo debounce en initItems, resize del canvas inmediato ──
    window.addEventListener('resize', () => {
        resize();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (W !== lastW) {   // ← solo reinicia si cambió el ANCHO
                lastW = W;
                initItems();
            }
        }, 400);
    });

    /* ─────────────────────────────────────
       HELPERS de estilo
    ───────────────────────────────────── */
    function setCtx(alpha, color = '#e53935', lw = 2, glow = 10) {
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = color;
        ctx.shadowBlur = glow;
    }

    /* ─────────────────────────────────────
       LOGO — usa el canvas pre-renderizado
    ───────────────────────────────────── */
    function drawLogo(x, y, size, angle, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = alpha;
        ctx.shadowColor = '#e53935';
        ctx.shadowBlur = size * 0.15;
        if (offCanvas) {
            ctx.drawImage(offCanvas, -size / 2, -size / 2, size, size);
        } else {
            ctx.font = `bold ${size * 0.8}px Arial`;
            ctx.fillStyle = '#e53935';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('G', 0, 0);
        }
        ctx.restore();
    }

    /* ─────────────────────────────────────
       MANCUERNA
    ───────────────────────────────────── */
    function drawDumbbell(x, y, size, angle, alpha) {
        ctx.save();
        ctx.translate(x, y); ctx.rotate(angle);
        const barLen = size * 0.58, barH = size * 0.07;
        const pW = size * 0.09, pH = size * 0.38;
        setCtx(alpha, '#e53935', size * 0.028, size * 0.10);
        ctx.beginPath(); ctx.roundRect(-barLen / 2, -barH / 2, barLen, barH, barH / 2); ctx.stroke();
        [-barLen / 2, barLen / 2].forEach(cx => {
            ctx.beginPath(); ctx.roundRect(cx - pW * 0.45, -pH * 0.18, pW * 0.9, pH * 0.36, 2); ctx.stroke();
        });
        [barLen / 2 + pW * 0.5, barLen / 2 + pW * 1.7].forEach(px => {
            ctx.beginPath(); ctx.roundRect(px - pW / 2, -pH / 2, pW, pH, 3); ctx.stroke();
        });
        [-barLen / 2 - pW * 0.5, -barLen / 2 - pW * 1.7].forEach(px => {
            ctx.beginPath(); ctx.roundRect(px - pW / 2, -pH / 2, pW, pH, 3); ctx.stroke();
        });
        ctx.restore();
    }

    function initItems() {
        items = [];
        const count = Math.floor(W / 75) + 22;
        for (let i = 0; i < count; i++) {
            items.push({
                type: TYPES[i % TYPES.length],
                x: rand(0, W),
                y: rand(0, H),
                vx: rand(-0.28, 0.28),
                vy: rand(-0.30, -0.08),
                size: rand(30, 75),
                angle: rand(0, Math.PI * 2),
                vAngle: rand(-0.007, 0.007),
                alpha: rand(0.22, 0.45),
                alphaDir: rand(-0.001, 0.001),
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        items.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.angle += p.vAngle;
            p.alpha = Math.max(0.12, Math.min(0.48, p.alpha + p.alphaDir));
            if (p.y + p.size < 0) { p.y = H + p.size; p.x = rand(0, W); }
            if (p.x < -p.size * 2) p.x = W + p.size;
            if (p.x > W + p.size * 2) p.x = -p.size;
            switch (p.type) {
                case 'logo': drawLogo(p.x, p.y, p.size * 1.25, p.angle, p.alpha); break;
            }
        });
        requestAnimationFrame(animate);
    }

    // ── ARRANQUE ──
    resize();
    lastW = W;
    initItems();
    animate();

})();


// ══════════════════════════════════════════════════════
//  FLOATING ICONS — secciones con .gfloat-container
// ══════════════════════════════════════════════════════
(function spawnFloatIcons() {
    const icons = [
        'fa-dumbbell', 'fa-heart-pulse', 'fa-bolt', 'fa-fire-flame-curved',
        'fa-person-running', 'fa-stopwatch', 'fa-medal', 'fa-weight-hanging',
        'fa-bicycle', 'fa-person-swimming'
    ];
    document.querySelectorAll('.gfloat-container').forEach(container => {
        for (let i = 0; i < 20; i++) {
            const el = document.createElement('i');
            el.className = 'fa-solid ' + icons[i % icons.length] + ' gfloat';
            const size = (Math.random() * 22 + 14).toFixed(1);
            const left = (Math.random() * 96 + 2).toFixed(1);
            const dur = (Math.random() * 12 + 9).toFixed(1);
            const delay = (Math.random() * -22).toFixed(1);
            const opMax = (Math.random() * 0.10 + 0.07).toFixed(3);
            el.style.cssText = `font-size:${size}px;left:${left}%;bottom:-5%;
                animation-duration:${dur}s;animation-delay:${delay}s;`;
            el.style.setProperty('--max-op', opMax);
            container.appendChild(el);
        }
    });
})();


// ══════════════════════════════════════════════════════
//  PAGE TRANSITIONS — Animación suave (CORS FIX)
// ══════════════════════════════════════════════════════
(function pageTransitions() {
    const overlay = document.createElement('div');
    overlay.id = 'pageTransitionOverlay';

    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
        background: #1a0a0a; z-index: 99999;
        opacity: 1; pointer-events: none;
        transition: opacity 0.35s ease-in-out;
    `;
    document.body.appendChild(overlay);

    window.addEventListener('pageshow', () => {
        requestAnimationFrame(() => { overlay.style.opacity = '0'; });
    });

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => overlay.style.opacity = '0', 50);
    });

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetUrl = this.getAttribute('href');

            if (!targetUrl || targetUrl.startsWith('#') || targetUrl.startsWith('http') ||
                targetUrl.startsWith('mailto') || targetUrl.startsWith('tel') ||
                this.getAttribute('target') === '_blank') {
                return;
            }

            // CORRECCIÓN CORS: Si el usuario ya está en la página actual, ignora el click
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const targetPath = targetUrl.split('/').pop() || 'index.html';
            if (currentPath === targetPath) return;

            e.preventDefault();
            overlay.style.opacity = '1';

            setTimeout(() => { window.location.href = targetUrl; }, 350);
        });
    });
})();
