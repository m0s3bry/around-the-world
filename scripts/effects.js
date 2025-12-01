(() => {
    const trackPool = new Map();
    const effectPool = new Map();
    let currentTrack = null;

    let masterVolume = 0.85;
    let ambientVolume = 0.7;
    let effectsVolume = 0.8;

    const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value ?? min));

    const AudioEngine = {
        configure({ master, ambient, effects } = {}) {
            masterVolume = clamp(master, 0, 1);
            ambientVolume = clamp(ambient, 0, 1);
            effectsVolume = clamp(effects, 0, 1);
        },
        preload(src, { loop = true } = {}) {
            if (!src) return null;
            if (!trackPool.has(src)) {
                const audio = new Audio(src);
                audio.preload = 'auto';
                audio.loop = loop;
                audio.volume = 0;
                trackPool.set(src, audio);
            }
            return trackPool.get(src);
        },
        playTrack(src, options = {}) {
            if (!src) return;
            const {
                fadeIn = 1.2,
                fadeOut = 1.0,
                volume = 0.9,
                type = 'ambient',
                loop = true
            } = options;

            const targetVolume = clamp(volume) * (type === 'music' ? masterVolume : ambientVolume);
            const next = trackPool.get(src) || this.preload(src, { loop });

            if (!next) return;
            next.loop = loop;
            next.dataset.trackType = type;

            next.play().catch(err => console.warn('Audio play issue:', err?.message));
            gsap.to(next, { volume: targetVolume, duration: fadeIn, ease: 'power2.out' });

            if (currentTrack && currentTrack !== next) {
                gsap.to(currentTrack, {
                    volume: 0,
                    duration: fadeOut,
                    onComplete: () => {
                        currentTrack.pause();
                        currentTrack.currentTime = 0;
                    }
                });
            }
            currentTrack = next;
        },
        stopTrack({ fade = 1.0 } = {}) {
            if (!currentTrack) return;
            gsap.to(currentTrack, {
                volume: 0,
                duration: fade,
                onComplete: () => {
                    currentTrack.pause();
                    currentTrack.currentTime = 0;
                    currentTrack = null;
                }
            });
        },
        playEffect(src, { volume = 0.9 } = {}) {
            if (!src) return;
            if (!effectPool.has(src)) {
                const base = new Audio(src);
                base.preload = 'auto';
                effectPool.set(src, base);
            }
            const instance = effectPool.get(src).cloneNode(true);
            instance.volume = clamp(volume) * effectsVolume;
            instance.play().catch(err => console.warn('Effect play issue:', err?.message));
        }
    };

    const VisualEffects = (() => {
        let neonElement = null;

        function createParticles(container, count = 56) {
            if (!container) return;
            container.innerHTML = '';
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < count; i += 1) {
                const particle = document.createElement('span');
                particle.className = 'particle';
                const startX = Math.random() * window.innerWidth;
                const startY = Math.random() * window.innerHeight;
                const travelX = (Math.random() - 0.5) * 400;
                const travelY = 150 + Math.random() * 300;
                const duration = 12 + Math.random() * 14;
                const delay = Math.random() * duration;

                particle.style.setProperty('--startX', `${startX}px`);
                particle.style.setProperty('--startY', `${startY}px`);
                particle.style.setProperty('--travelX', `${travelX}px`);
                particle.style.setProperty('--travelY', `${travelY}px`);
                particle.style.setProperty('--duration', `${duration}s`);
                particle.style.setProperty('--delay', `${delay}s`);

                fragment.appendChild(particle);
            }
            container.appendChild(fragment);
        }

        return {
            init({ neonEl } = {}) { neonElement = neonEl || null; },
            flash(color, { intensity = 0.45, repeat = 4 } = {}) {
                if (!neonElement) return;
                gsap.fromTo(neonElement,
                    { opacity: 0, background: color },
                    { opacity: intensity, duration: 0.12, yoyo: true, repeat, ease: 'power1.inOut' }
                );
            },
            setThemeColors(primary, accent) {
                document.documentElement.style.setProperty('--accent-color', primary || '#5CF4FF');
                document.documentElement.style.setProperty('--accent-secondary', accent || '#FF5DA2');
                document.documentElement.style.setProperty('--panel-glow', accent || 'rgba(255,255,255,0.45)');
            },
            setLighting({ vignette = 0.45, contrast = 1.2 } = {}) {
                document.documentElement.style.setProperty('--vignette-strength', vignette);
                document.documentElement.style.setProperty('--contrast-level', contrast);
            },
            createParticles
        };
    })();

    window.AudioEngine = AudioEngine;
    window.VisualEffects = VisualEffects;
})();