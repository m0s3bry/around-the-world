// config.js
window.EVENT_CONFIG = {
    countdown: {
        enabled: true,
        minutes: 5,
        showAnimation: true,
        soundEffects: true,
        backgroundImage: 'assets/user/counter-bg.jpg'
    },

    intro: {
        duration: 6500,
        flashColor: 'rgba(255, 0, 110, 0.55)',
        displayTagline: true
    },

  welcome: {
    title: 'START',
    subtitle: '',
    media: {
        type: 'image',
        src: 'assets/backgrounds/global-streaks.jpg'
    },
    overlay: 'rgba(3, 8, 20, 0.28)'
},

    audio: {
        masterVolume: 0.85,
        ambientVolume: 0.7,
        effectsVolume: 0.8,
        introMusic: 'assets/audio/global/intro-music.mp3'
    },

    lighting: {
        enabled: true,
        defaultMode: 'cinematic',
        modes: {
            cinematic: { vignette: 0.4, contrast: 1.18 },
            bright: { vignette: 0.22, contrast: 1.05 },
            dramatic: { vignette: 0.58, contrast: 1.32 }
        }
    },

    soundboard: [
        { id: 'transition', label: 'Transition Whoosh', key: 'Digit1', src: 'assets/audio/soundboard/transition-whoosh.mp3' },
        { id: 'audience',   label: 'Audience Reaction', key: 'Digit2', src: 'assets/audio/soundboard/audience-react.mp3' },
        { id: 'applause',   label: 'Applause',          key: 'Digit3', src: 'assets/audio/soundboard/applause.mp3' },
        { id: 'suspense',   label: 'Suspense Hit',      key: 'Digit4', src: 'assets/audio/soundboard/suspense.mp3' },
        { id: 'flash',      label: 'Flash Impact',      key: 'Digit5', src: 'assets/audio/soundboard/flash.mp3' }
    ],

    countries: [
        /* ========================= JAPAN ========================= */
        {
            id: 'japan',
            label: 'Japan',
            tagline: 'Can You Survive in Japan?',
            theme: { primary: '#BC002D', accent: '#FFFFFF', neon: '#FF4DA6' },
            scenes: [
                { id: 'jp-cold-open', hideContent: true, media: { type: 'video', src: 'assets/countries/japan/jp_intro.mp4', loop: false } },
                {
                    id: 'jp-hero',
                    title: 'Welcome to Japan ',
                    caption: '',
                    tagline: 'Can You Survive in Japan?',
                    media: { 
                        type: 'image', 
                        src: 'assets/countries/japan/jp_welcome.jpg' 
                    },
                    audio: 'assets/audio/japan/intro.mp3',
                    audioType: 'music'
                },
                {
                    id: 'jp-topic-1',
                    title: 'Manners & Etiquette',
                    caption: 'Every gesture counts in the rush-hour ballet.',
                    media: { type: 'image', src: 'assets/countries/japan/jp_scene_1_tokyo-night.jpg' },
                    audio: 'assets/audio/japan/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/japan/jp_gallery_crossing.jpg', caption: 'Shibuya Crossing POV' },
                        { type: 'video', src: 'assets/countries/japan/jp_gallery_shinkansen.mp4', caption: 'Shinkansen blur', loop: true, muted: true }
                    ]
                },
                {
                    id: 'jp-topic-2',
                    title: 'The Art of Bowing',
                    caption: 'Respect is choreographed with millimetric precision.',
                    media: { type: 'image', src: 'assets/countries/japan/jp_scene_1_tokyo-night.jpg' },
                    audio: 'assets/audio/japan/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/japan/jp_gallery_crossing.jpg', caption: 'Shibuya Crossing POV'},
                        {type: 'video', src: 'assets/countries/japan/jp_gallery_shinkansen.mp4', caption: 'Shinkansen blur', loop: true, muted: true }
                    ]
                },
                {
                    id: 'jp-topic-3',
                    title: 'Kimono Traditions',
                    caption: 'Heritage woven into silk gradients.',
                    media: { type: 'image', src: 'assets/countries/japan/jp_scene_3_kimono-atelier.jpg' },
                    audio: 'assets/audio/japan/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/japan/jp_scene_3_kimono-atelier.jpg' },
                        { type: 'image', src: 'assets/countries/japan/jp_scene_3_kimono-atelier1.jpg' }
                    ]
                    
                },
                {
                    id: 'jp-topic-4',
                    title: 'Testing',
                    caption: 'Umami stories in every lacquered bowl.',
                    media: { type: 'image', src: 'assets/countries/japan/jp_scene_4_street-food.jpg' },
                    audio: 'assets/audio/japan/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'transition',
                    
                },
                 {
                    id: 'jp-topic-5',
                    title: 'Japanese food',
                    caption: 'Umami stories in every lacquered bowl.',
                    media: { type: 'image', src: 'assets/countries/japan/jp_scene_4_street-food.jpg' },
                    audio: 'assets/audio/japan/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'transition',
                    gallery: [
                        { type: 'video', src: 'assets/countries/japan/IMG_9831.MP4', loop: true, muted: true },
                        { type: 'image', src: 'assets/countries/japan/jp_scene_14_street-food.jpg' },
                        { type: 'image', src: 'assets/countries/japan/jp_scene_2_sushi-counter.jpg' },
                        {type: 'video', src: 'assets/countries/japan/IMG_9832.MP4', loop: true, muted: true },
                    ]
                },
                
                 
                {
                    id: 'jp-outro',
                    title: 'Arigatou Gozaimasu',
                    caption: 'You made it through the neon maze.',
                    media: { type: 'image', src: 'assets/countries/japan/jp_outro_arigato.jpg' },
                    audio: 'assets/audio/japan/outro.mp3',
                    audioType: 'music',
                    isOutro: true,
                    flags: ['🇯🇵'],
                    gallery: [
                        { type: 'image', src: 'assets/countries/japan/5859318493038185529_120.jpg' }
                    ]
                },
                
            ]
        },

        /* ========================= ITALY ========================= */
        {
            id: 'italy',
            label: 'Italy',
            tagline: 'Welcome to Italy',
            theme: { primary: '#009246', accent: '#CE2B37', neon: '#FF6F61' },
            scenes: [
                { id: 'it-cold-open', hideContent: true, media: { type: 'video', src: 'assets/countries/italy/it_intro.mp4', loop: false } },
                {
                    id: 'it-hero',
                    title: 'Welcome to Italy',
                    caption: '',
                    tagline: '',
                    media: { 
                        type: 'image', 
                        src: 'assets/countries/italy/it_welcome.jpg' 
                    },
                    audio: 'assets/audio/italy/intro.mp3',
                    audioType: 'music'
                },
                {
                    id: 'it-topic-1',
                    title: 'Rome',
                    caption: 'Stone thunderbolts from Rome.',
                    media: { type: 'image', src: 'assets/countries/italy/it_scene_1_colosseum.jpg' },
                    audio: 'assets/audio/italy/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/italy/it_scene_1_colosseum.jpg' },
                        { type: 'image', src: 'assets/countries/italy/5834865826882849955_120.jpg' },
                    ]
                },
                {
                    id: 'it-topic-2',
                    title: 'Venice Canals',
                    caption: 'Waterways that whisper arias.',
                    media: { type: 'image', src: 'assets/countries/italy/5834865826882849957_121.jpg' },
                    audio: 'assets/audio/italy/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/italy/5834865826882849957_121.jpg' },
                        { type: 'image', src: 'assets/countries/italy/5834865826882849956_121.jpg' },
                    ]
                },
                {
                    id: 'it-topic-3',
                    title: 'Italians fashion',
                    caption: '',
                    media: { type: 'image', src: 'assets/countries/italy/it_scene_3_milan-fashion.jpg' },
                    audio: 'assets/audio/italy/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        
                        { type: 'image', src: 'assets/countries/italy/5834865826882849959_120.jpg' },
                        { type: 'video', src: 'assets/countries/italy/it.mp4', loop: true, muted: true },
                        { type: 'image', src: 'assets/countries/italy/it_scene_3_milan-fashion.jpg' },
                    ]
                },
                {
                    id: 'it-topic-4',
                    title: 'Italian food',
                    caption: '',
                    media: [
                        { type: 'image', src: 'assets/countries/italy/5834865826882849959_120.jpg' },                    ],
                    audio: 'assets/audio/italy/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        
                        { type: 'image', src: 'assets/countries/italy/3.jpg' },
                        { type: 'video', src: 'assets/countries/italy/4.MP4', loop: true, muted: true },
                        { type: 'image', src: 'assets/countries/italy/5834865826882849961_121.jpg' },
                    ]
                },
                {
                    id: 'it-outro',
                    title: 'Italian Families',
                    caption: '',
                    media: { type: 'image', src: 'assets/countries/italy/5834865826882849963_121.jpg' },
                    audio: 'assets/audio/italy/outro.mp3',
                    audioType: 'music',
                    isOutro: true,
                    gallery: [
                        { type: 'image', src: 'assets/countries/italy/5834865826882849964_120.jpg' },
                        { type: 'image', src: 'assets/countries/italy/5834865826882849965_120.jpg' },
                    ]
                },
                {
                    id: 'it-outro1',
                    title: 'Grazie mille!',
                    caption: '',
                    media: { type: 'image', src: 'assets/countries/italy/5834865826882849952_121.jpg' },
                    audio: 'assets/audio/italy/outro.mp3',
                    audioType: 'music',
                    isOutro: true,
                    
                },
                
            ]
        },

        /* ========================= GREECE ========================= */
        {
            id: 'greece',
            label: 'Greece',
            tagline: 'Where History Meets the Sea',
            theme: { primary: '#0D5EAF', accent: '#FFFFFF', neon: '#5CE1FF' },
            scenes: [
                { id: 'gr-cold-open', hideContent: true, media: { type: 'video', src: 'assets/countries/greece/gr_intro.mp4', loop: false } },
                {
                    id: 'gr-hero',
                    title: 'Kalimera everyone 🌞',
                    media: { 
                        type: 'image', 
                        src: 'assets/countries/greece/gr_welcome.jpg' 
                    },
                    audio: 'assets/audio/greece/intro.mp3',
                    audioType: 'music'
                },
                {
                    id: 'gr-topic-1',
                    title: 'Athens',
                    caption: 'Democracy carved in stone.',
                    media: { type: 'image', src: 'assets/countries/greece/120.jpg' },
                    audio: 'assets/audio/greece/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/greece/120.jpg' },
                    ]
                },
                {
                    id: 'gr-topic-2',
                    title: 'parthenon',
                    
                    media: { type: 'image', src: 'assets/countries/greece/4.jpg' },
                    audio: 'assets/audio/greece/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/greece/2.jpg' },
                        { type: 'video', src: 'assets/countries/greece/3.MP4', loop: true, muted: true },
                        { type: 'image', src: 'assets/countries/greece/1.jpg' },
                    ]
                },
                {
                    id: 'gr-topic-3',
                    title: ' Traditional greek customs',
                    
                    media: { type: 'image', src: 'assets/countries/greece/5834865826882849923_121.jpg' },
                    audio: 'assets/audio/greece/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/greece/5834865826882849922_121.jpg' },
                        { type: 'image', src: 'assets/countries/greece/5834865826882849924_120.jpg' },
                    ]
                },
                {
                    id: 'gr-topic-4',
                    title: 'Souvlaki - greek salad',
                    media: [
                        { type: 'image', src: 'assets/countries/greece/gr_scene_4_meze.jpg' },
                    ],
                    audio: 'assets/audio/greece/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'video', src: 'assets/countries/greece/IMG_0054.MP4', loop: true, muted: true },
                        { type: 'image', src: 'assets/countries/greece/5834865826882849925_121.jpg' },
                        { type: 'image', src: 'assets/countries/greece/5834865826882849926_120.jpg' },
                        { type: 'video', src: 'assets/countries/greece/IMG_0056.MP4', loop: true, muted: true },
                    ]
                },
                {
                    id: 'gr-outro',
                    title: 'Enjoy your time in Greece',
                    media: { type: 'image', src: 'assets/countries/greece/5834865826882849919_120.jpg' },
                    audio: 'assets/audio/greece/outro.mp3',
                    audioType: 'music',
                    isOutro: true,
                },
                
            ]
        },

        /* ========================= MOROCCO ========================= */
        {
            id: 'morocco',
            label: 'Morocco',
            theme: { primary: '#C1272D', accent: '#FFB347', neon: '#FF6B35' },
            scenes: [
                { id: 'ma-cold-open', hideContent: true, media: { type: 'video', src: 'assets/countries/morocco/ma_intro.mp4', loop: false } },
                
                {
                    id: 'ma-topic-1',
                    title: 'Salam everyone!',
                    media: { type: 'image', src: 'assets/countries/morocco/5834865826882849900_121.jpg' },
                    audio: 'assets/audio/morocco/ambient.mp3',
                    audioType: 'ambient',
                },
                {
                    id: 'ma-topic-2',
                    title: 'Streets & markets of Morocco',
                    media: { type: 'image', src: 'assets/countries/morocco/5834865826882849897_121.jpg' },
                    audio: 'assets/audio/morocco/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849898_121.jpg' },
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849901_121.jpg' },
                    ]
                },
                {
                    id: 'ma-topic-3',
                    title: ' Lbass w Taqalids',
                    media: [
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849897_121.jpg' },
                    ],
                    audio: 'assets/audio/morocco/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849906_121.jpg' },
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849907_121.jpg' },
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849909_121.jpg' },
                    ]
                },
                {
                    id: 'ma-topic-4',
                    title: 'Genwa rythms',
                    caption: '',
                    media: { type: 'image', src: 'assets/countries/morocco/5834865826882849897_121.jpg' },
                    audio: 'assets/audio/morocco/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'suspense',
                    gallery: [
                        { type: 'video', src: 'assets/countries/morocco/IMG_9986.mp4', loop: true, muted: true },
                    ]
                },
                {
                    id: 'ma-outro',
                    title: 'Food with Tawabel',
                    caption: '',
                    media: { type: 'image', src: 'assets/countries/morocco/5859318493038185556_121.jpg' },
                    audio: 'assets/audio/morocco/outro.mp3',
                    audioType: 'music',
                    isOutro: true,
                    gallery: [
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849912_121.jpg'},
                        { type: 'image', src: 'assets/countries/morocco/5859318493038185556_121.jpg' },
                    ]
                },
                
                {
                    id: 'ma-game-break',
                    title: '(noqosh w zakharef)',
                    media: { type: 'image', src: 'assets/countries/morocco/5834865826882849914_121.jpg' },
                     gallery: [
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849914_121.jpg'},
                    ]
                },
                {
                    id: 'ma-outro',
                    title: 'Shukran ',
                    caption: '',
                    media: { type: 'image', src: 'assets/countries/morocco/5859318493038185556_121.jpg' },
                    audio: 'assets/audio/morocco/outro.mp3',
                    audioType: 'music',
                    isOutro: true,
                    gallery: [
                        { type: 'image', src: 'assets/countries/morocco/5834865826882849913_121.jpg'},
                    ]
                },
            ]
        },

        /* ========================= FRANCE ========================= */
        {
            id: 'france',
            label: 'France',
            tagline: 'A Walk in Paris',
            theme: { primary: '#0055A4', accent: '#EF4135', neon: '#FF006E' },
            scenes: [
                { id: 'fr-cold-open', hideContent: true, media: { type: 'video', src: 'assets/countries/france/fr_intro.mp4', loop: false } },
                {
                    id: 'fr-hero',
                    title: 'bonjour everyone',
                    tagline: 'A Walk in Paris',
                    media: { 
                        type: 'image', 
                        src: 'assets/countries/france/5834865826882849930_121.jpg' // ← صورة صفحة welcome لفرنسا
                    },
                    audio: 'assets/audio/france/intro.mp3',
                    audioType: 'music',
                    
                },
                {
                    id: 'fr-topic-1',
                    title: 'famous landmarks',
                    media: { type: 'image', src: 'assets/countries/france/5859318493038185558_121.jpg' },
                    audio: 'assets/audio/france/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/france/5859318493038185558_121.jpg' },
                        { type: 'image', src: 'assets/countries/france/5834865826882849932_121.jpg' },
                        { type: 'image', src: 'assets/countries/france/5859318493038185560_121.jpg' },
                        { type: 'image', src: 'assets/countries/france/5834865826882849931_120.jpg' },
                    ]
                    
                },
                {
                    id: 'fr-topic-2',
                    title: 'Paris fashion week👠',
                    caption: 'Runways under Parisian rain.',
                    media: { type: 'image', src: 'assets/countries/france/5834865826882849931_120.jpg' },
                    audio: 'assets/audio/france/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'video', src: 'assets/countries/france/IMG_9776.MP4', loop: true, muted: true },
                        { type: 'video', src: 'assets/countries/france/IMG_9777.MP4', loop: true, muted: true },
                    ]
                },
                {
                    id: 'fr-topic-3',
                    title: 'France original customs',
                    media: { type: 'image', src: 'assets/countries/france5834865826882849938_120.jpg' },
                    audio: 'assets/audio/france/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/france/5834865826882849938_120.jpg' },
                    ]
                },
                {
                    id: 'fr-topic-4',
                    title: 'Cuisine française',
                    media: { type: 'image', src: 'assets/countries/france/5834865826882849935_120.jpg' },
                    audio: 'assets/audio/france/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'transition',
                    gallery: [
                        { type: 'image', src: 'assets/countries/france/5834865826882849933_121.jpg' },
                        { type: 'image', src: 'assets/countries/france/5834865826882849934_121.jpg' }, 
                    ]
                },
                {
                    id: 'fr-outro',
                    title: 'Au revoir',
                    caption: 'Paris lights fade to gold.',
                    media: { type: 'image', src: 'assets/countries/france/5834865826882849940_120.jpg' },
                    audio: 'assets/audio/france/outro.mp3',
                    audioType: 'music',
                    isOutro: true,
                    

                },
                
            ]
        },

        /* ========================= EGYPT  ========================= */
        {
            id: 'egypt',
            label: 'Egypt',
            tagline: 'Mother of the World',
            theme: { primary: '#FFD700', accent: '#C19A3F', neon: '#FFB347' },
            scenes: [
                { id: 'eg-cold-open', hideContent: true, media: { type: 'video', src: 'assets/countries/egypt/eg_intro.mp4', loop: false } },
                {
                    id: 'eg-hero',
                    title: 'Welcome to Egypt',
                    tagline: 'Mother of the World',
                    media: { 
                        type: 'image', 
                        src: 'assets/countries/egypt/3.jpg' 
                    },
                    audio: 'assets/audio/egypt/intro.mp3',
                    audioType: 'music',
                    gallery: [
                        { type: 'image', src: 'assets/countries/egypt/1.jpg' },
                        { type: 'image', src: 'assets/countries/egypt/3.jpg' },
                        { type: 'image', src: 'assets/countries/egypt/6.jpg' }, 
                    ]
                },
                {
                    id: 'eg-topic-1',
                    title: 'An Ancient Civilization',
                    caption: 'Stone equations pointing skyward.',
                    media: [
                        { type: 'image', src: 'assets/countries/egypt/5859318493038185622_121.jpg' },
                    ],
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient'
                },
                {
                    id: 'eg-topic-21',
                    hideContent: true,
                    media: { type: 'image', src: 'assets/countries/egypt/8.jpg' },
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'suspense',
                    gallery: [
                        { type: 'image', src: 'assets/countries/egypt/8.jpg' }
                    ]
                },
                {
                    id: 'eg-topic-22',
                    hideContent: true,
                    media: { type: 'image', src: 'assets/countries/egypt/9.jpg' },
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'suspense',
                    gallery: [
                        { type: 'image', src: 'assets/countries/egypt/9.jpg' }
                    ]
                },
                {
                    id: 'eg-topic-23',
                    hideContent: true,
                    media: { type: 'image', src: 'assets/countries/egypt/10.jpg' },
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'suspense',
                    gallery: [
                        { type: 'image', src: 'assets/countries/egypt/10.jpg' }
                    ]
                },
                {
                    id: 'eg-topic-3',
                    title: 'hieroglyphics',
                    media: { type: 'image', src: 'assets/countries/egypt/15.jpg' },
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/egypt/15.jpg' }
                    ]
                },
                {
                    id: 'eg-topic-4',
                    title: 'Egypt is not only ancient!”',
                    media: { type: 'image', src: 'assets/countries/egypt/13.jpg' },
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'image', src: 'assets/countries/egypt/13.jpg' }
                    ]
                },
                {
                    id: 'eg-topic-23',
                    hideContent: true,
                    media: { type: 'image', src: 'assets/countries/egypt/14.jpg' },
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'suspense',
                    gallery: [
                        { type: 'image', src: 'assets/countries/egypt/14.jpg' }
                    ]
                },
                {
                    id: 'eg-topic-23',
                    hideContent: true,
                    media: { type: 'image', src: 'assets/countries/egypt/12.jpg' },
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'suspense',
                    gallery: [
                        { type: 'image', src: 'assets/countries/egypt/12.jpg' }
                    ]
                },
                {
                    id: 'eg-topic-1',
                    title: 'Thank you',
                    media: [
                        { type: 'video', src: 'assets/countries/egypt/IMG_0332.MP4', loop: true, muted: true },
                    ],
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    gallery: [
                        { type: 'video', src: 'assets/countries/egypt/IMG_0332.MP4', loop: true, muted: true }
                    ]
                },
                {
                    id: 'eg-topic-201',
                    hideContent: true,
                    media: { type: 'video', src: 'assets/countries/egypt/IMG_0734.MOV' },
                    audio: 'assets/audio/egypt/ambient.mp3',
                    audioType: 'ambient',
                    soundCue: 'suspense',
                    gallery: [
                        { type: 'video', src: 'assets/countries/egypt/IMG_0734.MOV' }
                    ]
                },
            ]
        }
    ]
};
