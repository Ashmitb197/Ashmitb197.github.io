(function () {
    const body = document.body;
    const toggle = document.getElementById('theme-toggle');
    const hudScore = document.getElementById('hud-score');
    const toast = document.getElementById('toast');
    const secretLevel = document.getElementById('secret-level');
    const bootScreen = document.getElementById('boot-screen');
    const bootLines = document.getElementById('boot-lines');

    let score = 0;

    /* ---- Boot screen sequence ---- */
    (function boot() {
        if (!bootScreen || !bootLines) return;
        const lines = [
            '> INITIALIZING SYSTEM...',
            '> LOADING PLAYER PROFILE: ASHMIT_BHARDWAJ',
            '> MOUNTING PROJECTS... OK',
            '> READY.'
        ];
        let text = '';
        let i = 0, c = 0;

        function typeNext() {
            if (i >= lines.length) {
                setTimeout(dismissBoot, 500);
                return;
            }
            const line = lines[i];
            if (c <= line.length) {
                bootLines.textContent = text + line.slice(0, c);
                c++;
                setTimeout(typeNext, 18);
            } else {
                text += line + '\n';
                i++; c = 0;
                setTimeout(typeNext, 120);
            }
        }
        typeNext();

        function dismissBoot() {
            bootScreen.classList.add('hidden');
            setTimeout(() => bootScreen.remove(), 550);
        }
        bootScreen.addEventListener('click', dismissBoot, { once: true });
        window.addEventListener('keydown', dismissBoot, { once: true });
    })();

    /* ---- Coin particle burst on click ---- */
    document.addEventListener('click', (e) => {
        if (bootScreen && document.body.contains(bootScreen)) return;
        for (let n = 0; n < 5; n++) {
            const p = document.createElement('div');
            p.className = 'coin-particle';
            const angle = (Math.PI * 2 * n) / 5;
            const dist = 26 + Math.random() * 18;
            p.style.left = e.clientX - 5 + 'px';
            p.style.top = e.clientY - 5 + 'px';
            p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
            document.body.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        }
    });

    /* ---- Palette toggle (Night <-> Mono CRT) ---- */
    const saved = localStorage.getItem('palette');
    if (saved) body.setAttribute('data-theme', saved);

    toggle && toggle.addEventListener('click', () => {
        const next = body.getAttribute('data-theme') === 'mono' ? 'color' : 'mono';
        body.setAttribute('data-theme', next);
        localStorage.setItem('palette', next);
        beep(next === 'mono' ? 220 : 440);
    });

    /* ---- Smooth scroll for anchor nav ---- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const el = document.querySelector(href);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---- Reveal on scroll ---- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* ---- HUD score bump on project hover ---- */
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('mouseenter', () => addScore(10));
    });

    function addScore(amount) {
        score += amount;
        hudScore.textContent = 'SCORE ' + String(score).padStart(6, '0');
    }

    /* ---- Tiny WebAudio beep, no external assets ---- */
    function beep(freq) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) { /* audio not available, fail silently */ }
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2600);
    }

    /* ---- Konami code easter egg ---- */
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let progress = 0;

    window.addEventListener('keydown', (e) => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (key === konami[progress]) {
            progress++;
            if (progress === konami.length) {
                unlockSecret();
                progress = 0;
            }
        } else {
            progress = (key === konami[0]) ? 1 : 0;
        }
    });

    function unlockSecret() {
        if (secretLevel.classList.contains('unlocked')) {
            showToast('ALREADY UNLOCKED ★');
            return;
        }
        secretLevel.classList.add('unlocked');
        addScore(500);
        beep(660);
        setTimeout(() => beep(880), 150);
        showToast('★ ACHIEVEMENT UNLOCKED ★');
        secretLevel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
})();