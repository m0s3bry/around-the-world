(() => {
    const CONFIG = window.EVENT_CONFIG || {};

    const state = {
        scenes: [],
        currentIndex: 0,
        activeScene: null,
        isTransitioning: false,
        presentationLive: false,
        presentationPaused: false,
        timelineButtons: new Map(),
        lightingMode: CONFIG.lighting?.defaultMode || 'cinematic',
        gameCleanup: null
    };

    const intermissionMap = buildIntermissionMap(CONFIG.intermissions || []);
    const elements = {};

    let countdownDuration = Math.max(30, Math.round((CONFIG.countdown?.minutes ?? 5) * 60));
    let countdownIntervalId = null;
    let introLaunched = false;

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        cacheElements();
        applyCountdownBackground();
        initAudioEngine();
        initVisuals();
        buildScenes();
        buildTimeline();
        setupSoundboard();
        attachGlobalListeners();
        prepareCountdown();
        exposeAPI();
    }

    function cacheElements() {
        elements.countdownScreen = document.getElementById('countdownScreen');
        elements.countdownMinutes = document.getElementById('countdownMinutes');
        elements.countdownSeconds = document.getElementById('countdownSeconds');
        elements.cinematicIntro = document.getElementById('cinematicIntro');
        elements.emergencyOverlay = document.getElementById('emergencyOverlay');
        elements.presentationRoot = document.getElementById('presentationRoot');
        elements.sceneContainer = document.getElementById('sceneContainer');
        elements.countryTimeline = document.getElementById('countryTimeline');
        elements.pressHint = document.getElementById('pressHint');
        elements.progressOrb = document.getElementById('progressOrb');
        elements.orbLabel = document.getElementById('orbLabel');
        elements.particles = document.getElementById('particles');
        elements.neonFlash = document.getElementById('neonFlash');
        elements.soundboardPanel = document.getElementById('soundboardPanel');
    }

    function applyCountdownBackground() {
        if (CONFIG.countdown?.backgroundImage) {
            document.documentElement.style.setProperty('--countdown-background', `url('${CONFIG.countdown.backgroundImage}')`);
        }
    }

    function initAudioEngine() {
        if (!window.AudioEngine) return;
        AudioEngine.configure({
            master: CONFIG.audio?.masterVolume ?? 0.85,
            ambient: CONFIG.audio?.ambientVolume ?? 0.7,
            effects: CONFIG.audio?.effectsVolume ?? 0.8
        });
        if (CONFIG.audio?.introMusic) {
            AudioEngine.preload(CONFIG.audio.introMusic, { loop: false });
        }
        (CONFIG.countries || []).forEach(country => {
            (country.scenes || []).forEach(scene => {
                if (scene.audio) AudioEngine.preload(scene.audio, { loop: scene.media?.type === 'video' });
            });
        });
    }
    

    function initVisuals() {
        if (!window.VisualEffects) return;
        VisualEffects.init({ neonEl: elements.neonFlash });
        VisualEffects.createParticles(elements.particles, 64);
        const defaultMode = CONFIG.lighting?.modes?.[state.lightingMode];
        if (defaultMode) VisualEffects.setLighting(defaultMode);
    }

    function buildScenes() {
        if (!elements.sceneContainer) return;
        elements.sceneContainer.innerHTML = '';
        state.scenes = [];

        addScene({
            id: 'welcome',
            title: CONFIG.welcome?.title || 'Around the World',
            caption: CONFIG.welcome?.caption || '',
            tagline: CONFIG.welcome?.subtitle || '',
            media: CONFIG.welcome?.media || { type: 'gradient', value: 'radial-gradient(circle, rgba(92,244,255,0.2) 0%, rgba(3,5,18,1) 70%)' },
            overlay: CONFIG.welcome?.overlay || 'rgba(0,0,0,0.28)',
            themeColor: CONFIG.welcome?.themeColor || '#5CF4FF',
            neonColor: CONFIG.welcome?.neonColor || '#FF5DA2'
        });

        (CONFIG.countries || []).forEach(country => {
            const total = country.scenes?.length || 0;
            (country.scenes || []).forEach((sceneData, index) => {
                const enriched = {
                    ...sceneData,
                    countryId: country.id,
                    countryLabel: country.label,
                    tagline: sceneData.tagline ?? (index === 1 ? country.tagline : undefined),
                    orderInCountry: index,
                    scenesInCountry: total,
                    themeColor: country.theme?.primary || CONFIG.welcome?.themeColor,
                    neonColor: country.theme?.neon || CONFIG.welcome?.neonColor,
                    accentColor: country.theme?.accent || CONFIG.welcome?.themeColor
                };
                addScene(enriched);
            });

            const breaks = intermissionMap.get(country.id);
            if (breaks?.length) {
                breaks.forEach(b => addScene({
                    ...b,
                    countryId: `${country.id}-break`,
                    overlay: b.overlay ?? 'rgba(0,0,0,0.45)',
                    themeColor: b.themeColor || country.theme?.primary,
                    neonColor: b.neonColor || country.theme?.neon,
                    variant: b.type === 'image' ? 'intermission' : 'game',
                    game: b.game
                }));
            }
        });

        updatePressHint();
    }

    function addScene(sceneData) {
        const sceneElement = createSceneElement(sceneData);
        elements.sceneContainer.appendChild(sceneElement);
        state.scenes.push({ data: sceneData, element: sceneElement });
    }

    function createSceneElement(scene) {
        const wrapper = document.createElement('section');
        wrapper.className = 'scene';
        wrapper.dataset.sceneId = scene.id || '';
        wrapper.dataset.countryId = scene.countryId || '';
        if (scene.variant) wrapper.dataset.variant = scene.variant;

        const hideContent = Boolean(scene.hideContent);
        if (hideContent) wrapper.classList.add('scene-immersive');

        const mediaBundle = normalizeMedia(scene.media);
        applySceneBackdrop(wrapper, mediaBundle.primary);

        if (hideContent) return wrapper;

        const overlay = document.createElement('div');
        overlay.className = 'scene-overlay';
        overlay.style.background = scene.overlay || 'rgba(0,0,0,0.35)';
        wrapper.appendChild(overlay);

        const content = document.createElement('div');
        content.className = 'scene-content';

        if (scene.tagline) {
            const subtitle = document.createElement('h3');
            subtitle.className = 'scene-subtitle';
            subtitle.textContent = scene.tagline;
            content.appendChild(subtitle);
        }

        const title = document.createElement('h2');
        title.className = 'scene-title';
        title.textContent = scene.title || 'Untitled Scene';
        content.appendChild(title);

        if (scene.caption) {
            const caption = document.createElement('p');
            caption.className = 'scene-caption';
            caption.textContent = scene.caption;
            content.appendChild(caption);
        }

        if (scene.variant === 'intermission' && mediaBundle.primary?.src) {
            const intermissionFigure = document.createElement('figure');
            intermissionFigure.className = 'intermission-media';
            const img = document.createElement('img');
            img.src = mediaBundle.primary.src;
            img.alt = scene.title || 'Intermission';
            intermissionFigure.appendChild(img);
            content.appendChild(intermissionFigure);
        }

        const gallerySources = [
            ...mediaBundle.extras,
            ...(scene.gallery || [])
        ];
        if (gallerySources.length && !scene.game) {
            appendGallery(content, gallerySources);
        }

        if (scene.flags?.length) {
            const flagRow = document.createElement('div');
            flagRow.className = 'scene-flags';
            flagRow.innerHTML = scene.flags.map(flag => `<span>${flag}</span>`).join('');
            content.appendChild(flagRow);
        }

        if (scene.game) {
            appendGameShell(content, scene);
        }

        wrapper.appendChild(content);
        return wrapper;
    }

    function appendGameShell(container, scene) {
        const shell = document.createElement('div');
        shell.className = 'game-shell';
        if (scene.game?.type === 'timedGallery') {
            shell.innerHTML = `
                <div class="timed-gallery-viewer" data-timed-gallery="${scene.id}">
                    <img src="" alt="Game frame">
                </div>
                <div class="timed-gallery-caption" data-timed-gallery-caption>Ready?</div>
                <div class="timed-gallery-progress">
                    <span data-timed-gallery-progress></span>
                </div>
                <p class="timed-gallery-status" data-timed-gallery-status>Image 0 of ${scene.game.images?.length || 0}</p>
            `;
        } else if (scene.game?.type === 'match') {
            shell.innerHTML = `
                <p class="match-status" data-match-status>${scene.game.instructions || 'Match the pairs'}</p>
                <div class="match-grid" data-match-grid>
                    <div class="match-column" data-match-images>
                        <h4>Images</h4>
                        ${scene.game.pairs.map(pair => `
                            <div class="match-card" data-match-image="${pair.id}">
                                <img src="${pair.image}" alt="${pair.word}">
                            </div>
                        `).join('')}
                    </div>
                    <div class="match-column" data-match-words>
                        <h4>Mots</h4>
                        ${scene.game.pairs.map(pair => `
                            <div class="match-card" data-match-word="${pair.id}">
                                <span>${pair.word}</span>
                                ${pair.hint ? `<small>${pair.hint}</small>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        container.appendChild(shell);
    }

    function normalizeMedia(media) {
        if (!media) return { primary: null, extras: [] };
        if (Array.isArray(media)) {
            const [primary, ...extras] = media;
            return { primary: primary || null, extras };
        }
        return { primary: media, extras: [] };
    }

    function applySceneBackdrop(wrapper, media) {
        if (!media) return;

        if (media.type === 'video') {
    const video = document.createElement('video');
    video.className = 'scene-video-bg';
    video.dataset.src = media.src;      // بدل src العادي
    video.loop = media.loop ?? false;
    video.preload = 'none';             // بدل auto
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.muted = media.muted ?? false;  // خليه يبدأ mute
    if (media.poster) video.poster = media.poster;
    wrapper.appendChild(video);
}
         else if (media.type === 'gradient') {
            wrapper.style.background = media.value;
        } else if (media.src) {
            wrapper.style.backgroundImage = `url('${media.src}')`;
        }
    }

    function appendGallery(container, items) {
        if (!items?.length) return;
        const gallery = document.createElement('div');
        gallery.className = 'scene-gallery';

        items.forEach(item => {
            if (!item) return;
            const figure = document.createElement('figure');
            figure.className = 'gallery-item';

            if (item.type === 'video') {
    const video = document.createElement('video');
    video.dataset.src = item.src;
    video.loop = item.loop ?? true;
    video.muted = false;
    video.playsInline = true;
    video.preload = 'none';
    figure.appendChild(video);
} else {
    
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.caption || 'Gallery item';
                figure.appendChild(img);
            }

            if (item.caption) {
                const caption = document.createElement('figcaption');
                caption.className = 'gallery-caption';
                caption.textContent = item.caption;
                figure.appendChild(caption);
            }

            gallery.appendChild(figure);
        });

        container.appendChild(gallery);
    }

    function buildTimeline() {
        if (!elements.countryTimeline) return;
        elements.countryTimeline.innerHTML = '';
        state.timelineButtons.clear();

        (CONFIG.countries || []).forEach(country => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = country.label;
            button.addEventListener('click', () => {
                if (!state.presentationLive) {
                    startPresentationImmediately();
                }
                jumpToCountry(country.id);
            });
            elements.countryTimeline.appendChild(button);
            state.timelineButtons.set(country.id, button);
        });
    }

    function setupSoundboard() {
        if (!elements.soundboardPanel) return;
        elements.soundboardPanel.innerHTML = '';

        (CONFIG.soundboard || []).forEach(effect => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = `${effect.label} (${effect.key.replace('Digit', '')})`;
            button.addEventListener('click', () => AudioEngine?.playEffect(effect.src));
            elements.soundboardPanel.appendChild(button);
        });

        elements.soundboardPanel.classList.add('is-hidden');
        elements.soundboardPanel.setAttribute('aria-hidden', 'true');
    }

    function attachGlobalListeners() {
        document.addEventListener('keydown', handleKeydown);

        elements.pressHint?.addEventListener('click', () => {
            if (!state.presentationLive) {
                startPresentationImmediately();
            } else if (!state.presentationPaused && state.currentIndex === state.scenes.length - 1) {
                restartPresentation();
            } else {
                nextScene();
            }
        });
    }

    function handleKeydown(event) {
        if (state.presentationPaused && event.code !== 'Escape') return;

        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (!state.presentationLive) {
                    startPresentationImmediately();
                } else if (event.shiftKey) {
                    previousScene();
                } else {
                    nextScene();
                }
                break;
            case 'ArrowRight':
            case 'KeyN':
                nextScene();
                break;
            case 'ArrowLeft':
            case 'KeyB':
                previousScene();
                break;
            case 'KeyR':
                restartPresentation();
                break;
            case 'Escape':
                if (state.presentationPaused) {
                    resumePresentation();
                } else {
                    pausePresentation();
                }
                break;
            default:
                break;
        }

        const boardItem = (CONFIG.soundboard || []).find(item => item.key === event.code);
        if (boardItem) {
            event.preventDefault();
            AudioEngine?.playEffect(boardItem.src);
        }
    }

    function prepareCountdown() {
        if (!elements.countdownScreen || !CONFIG.countdown?.enabled) {
            elements.countdownScreen?.classList.add('hidden');
            startCinematicIntro();
            return;
        }

        renderCountdown();
        elements.countdownScreen.classList.remove('hidden');
        startCountdownTimer();

        window.addTime = (seconds = 60) => adjustCountdown(Math.abs(seconds));
        window.subtractTime = (seconds = 60) => adjustCountdown(-Math.abs(seconds));
        window.startNow = () => triggerIntroFromCountdown();
    }

    function renderCountdown() {
        if (!elements.countdownMinutes || !elements.countdownSeconds) return;
        const minutes = Math.floor(countdownDuration / 60).toString().padStart(2, '0');
        const seconds = (countdownDuration % 60).toString().padStart(2, '0');
        elements.countdownMinutes.textContent = minutes;
        elements.countdownSeconds.textContent = seconds;
    }

    function adjustCountdown(delta) {
        countdownDuration = Math.max(30, countdownDuration + delta);
        renderCountdown();
    }

    function startCountdownTimer() {
        stopCountdownTimer();
        countdownIntervalId = setInterval(() => {
            countdownDuration -= 1;
            renderCountdown();
            if (countdownDuration <= 0) {
                triggerIntroFromCountdown();
            }
        }, 1000);
    }

    function stopCountdownTimer() {
        if (countdownIntervalId) clearInterval(countdownIntervalId);
        countdownIntervalId = null;
    }

    function triggerIntroFromCountdown() {
        if (introLaunched) return;
        introLaunched = true;
        stopCountdownTimer();
        elements.countdownScreen?.classList.add('hidden');
        startCinematicIntro();
    }

    function startCinematicIntro(skipAnimation = false) {
        if (skipAnimation) {
            elements.cinematicIntro?.classList.add('hidden');
            beginPresentation();
            return;
        }

        if (CONFIG.audio?.introMusic) {
            AudioEngine?.playTrack(CONFIG.audio.introMusic, { type: 'music', loop: false, fadeIn: 1.5 });
        }

        elements.cinematicIntro?.classList.remove('hidden');
        const duration = CONFIG.intro?.duration ?? 6000;

        setTimeout(() => {
            elements.cinematicIntro?.classList.add('hidden');
            beginPresentation();
        }, duration);
    }

    function beginPresentation() {
        if (!elements.presentationRoot) return;
        elements.presentationRoot.classList.remove('hidden');
        state.presentationLive = true;
        state.currentIndex = 0;
        activateScene(0);
    }

    function activateScene(index) {
        if (state.isTransitioning || !state.scenes[index]) return;
        state.isTransitioning = true;
        if (state.activeScene) {
    const prevVideos = state.activeScene.element.querySelectorAll('video');
    prevVideos.forEach(v => {
        v.pause();
        v.currentTime = 0;
        v.removeAttribute('src');
        v.load();
    });
}
        if (state.gameCleanup) {
            state.gameCleanup();
            state.gameCleanup = null;
        }

        const nextScene = state.scenes[index];
        const previousScene = state.activeScene;

        if (previousScene && previousScene.element !== nextScene.element) {
            const previousVideo = previousScene.element.querySelector('.scene-video-bg');
            if (previousVideo) previousVideo.pause();
            previousScene.element.classList.remove('active');
        }

        const nextElement = nextScene.element;
        nextElement.classList.add('active');

        const video = nextElement.querySelector('.scene-video-bg');
if (video && video.dataset.src && !video.src) {
    video.src = video.dataset.src;
    video.load();
}
if (video) {
    video.currentTime = 0;
    video.play().catch(() => {
        video.muted = false;
        video.play().catch(() => {});
    });
}

        state.activeScene = nextScene;
        state.currentIndex = index;

        applySceneTheme(nextScene.data);
        handleSceneAudio(nextScene.data);
        updateTimelineHighlight(nextScene.data.countryId);
        updateProgressOrb(index);
        updatePressHint();

        state.gameCleanup = initSceneGame(nextScene);

        gsap.fromTo(nextElement,
            { opacity: 0, scale: 1.025 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.85,
                ease: 'power2.out',
                onComplete: () => { state.isTransitioning = false; }
            }
        );
        if (previousScene && previousScene.element !== nextElement) {
    toggleGalleryVideos(previousScene.element, false); // أوقف القديم
    const previousVideo = previousScene.element.querySelector('.scene-video-bg');
    if (previousVideo) previousVideo.pause();
}

toggleGalleryVideos(nextElement, true); // شغّل الجاليري للمشهد الجديد
    }

    function applySceneTheme(sceneData) {
        const primary = sceneData.themeColor || CONFIG.welcome?.themeColor || '#5CF4FF';
        const neon = sceneData.neonColor || CONFIG.welcome?.neonColor || '#FF5DA2';
        VisualEffects?.setThemeColors(primary, neon);

        const lighting = CONFIG.lighting?.modes?.[state.lightingMode];
        if (lighting) VisualEffects?.setLighting(lighting);
    }

    function handleSceneAudio(sceneData) {
        if (!window.AudioEngine) return;
        if (sceneData.audio) {
            AudioEngine.playTrack(sceneData.audio, {
                type: sceneData.audioType || 'ambient',
                loop: Array.isArray(sceneData.media) ? sceneData.media[0]?.type === 'video' : sceneData.media?.type === 'video',
                volume: 0.95
            });
        } else {
            AudioEngine.stopTrack({ fade: 0.9 });
        }

        if (sceneData.soundCue) {
            const cue = (CONFIG.soundboard || []).find(item => item.id === sceneData.soundCue);
            if (cue) AudioEngine.playEffect(cue.src);
        }
    }

    function updateTimelineHighlight(countryId) {
        state.timelineButtons.forEach((button, id) => {
            button.classList.toggle('active', id === countryId);
        });
    }

    function updateProgressOrb(index) {
        if (!elements.progressOrb) return;
        const total = Math.max(state.scenes.length - 1, 1);
        const percent = Math.round((index / total) * 100);
        const label = elements.orbLabel;
        if (label) label.textContent = `${percent}%`;

        const circle = elements.progressOrb.querySelector('.orb-fill');
        if (circle) {
            const path = 326;
            const dashOffset = path - (path * percent) / 100;
            circle.style.strokeDashoffset = dashOffset;
        }
    }

    function updatePressHint() {
        if (!elements.pressHint) return;

        if (!state.presentationLive) {
            elements.pressHint.textContent = 'Tap to start the journey';
            elements.pressHint.classList.remove('hidden');
            return;
        }

        const isLast = state.currentIndex === state.scenes.length - 1;
        if (isLast) {
            elements.pressHint.textContent = 'Journey complete — press R to replay';
            elements.pressHint.classList.remove('hidden');
        } else {
            elements.pressHint.classList.add('hidden');
        }
    }

    function nextScene() {
        if (!state.presentationLive || state.presentationPaused) return;
        const nextIndex = Math.min(state.scenes.length - 1, state.currentIndex + 1);
        if (nextIndex !== state.currentIndex) activateScene(nextIndex);
    }

    function previousScene() {
        if (!state.presentationLive || state.presentationPaused) return;
        const prevIndex = Math.max(0, state.currentIndex - 1);
        if (prevIndex !== state.currentIndex) activateScene(prevIndex);
    }

    function jumpToScene(index) {
        if (!state.presentationLive || state.presentationPaused) return;
        if (index >= 0 && index < state.scenes.length) activateScene(index);
    }

    function jumpToCountry(countryId) {
        if (!countryId) return;
        const targetIndex = state.scenes.findIndex(scene => scene.data.countryId === countryId && !scene.data.hideContent);
        if (targetIndex >= 0) jumpToScene(targetIndex);
    }

    function restartPresentation() {
        if (!state.presentationLive) return;
        state.currentIndex = 0;
        activateScene(0);
    }

    function pausePresentation() {
        if (state.presentationPaused) return;
        state.presentationPaused = true;
        elements.emergencyOverlay?.classList.remove('hidden');
        AudioEngine?.stopTrack({ fade: 0.6 });
        const video = state.scenes[state.currentIndex]?.element.querySelector('.scene-video-bg');
        if (video) video.pause();
    }

    function resumePresentation() {
        if (!state.presentationPaused) return;
        state.presentationPaused = false;
        elements.emergencyOverlay?.classList.add('hidden');
        const sceneData = state.scenes[state.currentIndex]?.data;
        if (sceneData?.audio) handleSceneAudio(sceneData);
        const video = state.scenes[state.currentIndex]?.element.querySelector('.scene-video-bg');
        if (video) video.play().catch(() => {});
    }

    function startPresentationImmediately() {
        if (state.presentationLive) return;
        if (elements.countdownScreen && !elements.countdownScreen.classList.contains('hidden')) {
            triggerIntroFromCountdown();
        } else {
            startCinematicIntro(true);
        }
    }

    function initSceneGame(sceneEntry) {
        const { data, element } = sceneEntry;
        if (!data.game) return null;

        if (data.game.type === 'timedGallery') {
            return initTimedGalleryGame(element, data.game);
        }

        if (data.game.type === 'match') {
            return initMatchGame(element, data.game);
        }

        return null;
    }

    function initTimedGalleryGame(sceneElement, game) {
        const viewer = sceneElement.querySelector(`[data-timed-gallery="${sceneElement.dataset.sceneId}"] img`);
        const captionEl = sceneElement.querySelector('[data-timed-gallery-caption]');
        const progressEl = sceneElement.querySelector('[data-timed-gallery-progress]');
        const statusEl = sceneElement.querySelector('[data-timed-gallery-status]');
        if (!viewer || !captionEl || !progressEl || !statusEl) return null;

        const images = game.images || [];
        if (!images.length) return null;
        const duration = Math.max(1, game.durationPerImage ?? 10) * 1000;
        let index = 0;
        let timeoutId = null;

        const showFrame = (i) => {
            const frame = images[i];
            viewer.src = frame.src;
            viewer.alt = frame.caption || `Frame ${i + 1}`;
            captionEl.textContent = frame.caption || `Frame ${i + 1}`;
            progressEl.style.width = `${((i + 1) / images.length) * 100}%`;
            statusEl.textContent = `Image ${i + 1} of ${images.length}`;
        };

        const advance = () => {
            showFrame(index);
            if (index < images.length - 1) {
                timeoutId = setTimeout(() => {
                    index += 1;
                    advance();
                }, duration);
            } else {
                statusEl.textContent = 'Sequence complete — اسألهم عن التفاصيل الآن!';
                VisualEffects?.flash('rgba(255,255,255,0.4)', { repeat: 2 });
            }
        };

        advance();

        return () => timeoutId && clearTimeout(timeoutId);
    }

    function initMatchGame(sceneElement, game) {
        const imageCards = Array.from(sceneElement.querySelectorAll('[data-match-image]'));
        const wordCards = Array.from(sceneElement.querySelectorAll('[data-match-word]'));
        const statusEl = sceneElement.querySelector('[data-match-status]');
        if (!imageCards.length || !wordCards.length) return null;

        let selectedImage = null;
        let selectedWord = null;
        let matchedPairs = 0;
        const totalPairs = Math.min(imageCards.length, wordCards.length);

        const resetSelections = () => {
            imageCards.forEach(card => card.classList.remove('is-selected'));
            wordCards.forEach(card => card.classList.remove('is-selected'));
            selectedImage = null;
            selectedWord = null;
        };

        const updateStatus = (msg) => {
            if (statusEl) statusEl.textContent = msg;
        };

        const checkMatch = () => {
            if (!selectedImage || !selectedWord) return;
            if (selectedImage === selectedWord) {
                const imgCard = imageCards.find(card => card.dataset.matchImage === selectedImage);
                const wordCard = wordCards.find(card => card.dataset.matchWord === selectedWord);
                imgCard?.classList.add('is-matched');
                wordCard?.classList.add('is-matched');
                imgCard?.setAttribute('data-matched', 'true');
                wordCard?.setAttribute('data-matched', 'true');
                matchedPairs += 1;
                AudioEngine?.playEffect(CONFIG.soundboard?.find(s => s.id === 'transition')?.src || '', { volume: 0.7 });
                updateStatus(`Matched ${matchedPairs} / ${totalPairs}`);
                if (matchedPairs === totalPairs) {
                    updateStatus('Bravo! Tous les couples sont corrects.');
                    VisualEffects?.flash('rgba(255,0,110,0.5)', { repeat: 3 });
                }
                resetSelections();
            } else {
                updateStatus('Presque! حاول مرة تانية.');
                setTimeout(() => resetSelections(), 400);
            }
        };

        const handleImageClick = (event) => {
            const card = event.currentTarget;
            if (card.dataset.matched === 'true') return;
            imageCards.forEach(c => c.classList.remove('is-selected'));
            card.classList.add('is-selected');
            selectedImage = card.dataset.matchImage;
            checkMatch();
        };

        const handleWordClick = (event) => {
            const card = event.currentTarget;
            if (card.dataset.matched === 'true') return;
            wordCards.forEach(c => c.classList.remove('is-selected'));
            card.classList.add('is-selected');
            selectedWord = card.dataset.matchWord;
            checkMatch();
        };

        imageCards.forEach(card => card.addEventListener('click', handleImageClick));
        wordCards.forEach(card => card.addEventListener('click', handleWordClick));

        updateStatus(game.instructions || 'Match the pairs');

        return () => {
            imageCards.forEach(card => card.removeEventListener('click', handleImageClick));
            wordCards.forEach(card => card.removeEventListener('click', handleWordClick));
        };
    }

    function buildIntermissionMap(entries) {
        const map = new Map();
        entries.forEach(entry => {
            if (!entry?.after) return;
            const list = map.get(entry.after) || [];
            list.push(entry);
            map.set(entry.after, list);
        });
        return map;
    }

    function exposeAPI() {
        window.PresentationController = {
            start: () => startPresentationImmediately(),
            next: () => nextScene(),
            previous: () => previousScene(),
            goToScene: index => jumpToScene(index),
            goToCountry: id => jumpToCountry(id),
            pauseForEmergency: () => pausePresentation(),
            resumeFromEmergency: () => resumePresentation(),
            restart: () => restartPresentation()
        };
    }
function toggleGalleryVideos(sceneElement, shouldPlay) {
    if (!sceneElement) return;
    const videos = sceneElement.querySelectorAll('.scene-gallery video');

    videos.forEach(video => {
        if (shouldPlay) {
            if (video.dataset.src && !video.src) {
                video.src = video.dataset.src;
            }
            video.currentTime = 0;
            video.play().catch(() => {});
        } else {
            video.pause();
            video.currentTime = 0;
            video.removeAttribute('src');
            video.load();
        }
    });
}
})();
