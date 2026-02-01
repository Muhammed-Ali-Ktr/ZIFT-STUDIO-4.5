/**
 * Professional Flip Clock & Productivity Timer
 * Structure:
 * 1. SettingsStore: Manages State & LocalStorage
 * 2. ThemeManager: Updates CSS variables
 * 3. AudioEngine: Sound effects & Mixer
 * 4. FlipNode: Controls a single digit-pair animation
 * 5. TimeKeeper: The Master Clock/Timer logic
 * 6. UIController: DOM Events & Drawer
 * 7. LanguageManager: Handles Localization
 */

/* =========================================
   1. SETTINGS STORE (The functionality core)
   ========================================= */
class SettingsStore {
    constructor() {
        this.defaults = {
            // Visual
            theme: 'dark',
            bgUrl: '',
            font: 'sans',
            cardColor: '#222222',
            numColor: '#eeeeee',
            scale: 1.0,
            radius: 8,
            grain: true,
            shadows: true,
            reflection: false,
            language: 'en', // 'en' or 'tr'
            // Functional
            is24h: true,
            showSeconds: true,
            showAmPm: true,
            showDate: true,
            padZeros: true,
            hourlyChime: false,
            // Productivity
            pomoTime: 25,
            shortBreak: 5,
            longBreak: 15,
            autoStart: false,
            clickSound: true,
            notifications: true,
            // Audio (Volumes 0-100)
            volRain: 0,
            volWhite: 0,
            volCafe: 0,
            volFire: 0,
            masterVolume: 100,
            soundMuted: false,
            // System
            energySaver: false
        };

        this.state = this.load();
    }

    load() {
        const saved = localStorage.getItem('flipClockSettings');
        return saved ? { ...this.defaults, ...JSON.parse(saved) } : { ...this.defaults };
    }

    save() {
        localStorage.setItem('flipClockSettings', JSON.stringify(this.state));
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state[key] = value;
        this.save();
        document.dispatchEvent(new CustomEvent('settingChanged', { detail: { key, value } }));

        if (key === 'notifications' && value === true) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        }
    }

    importSettings(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.state = { ...this.defaults, ...data };
            this.save();
            document.location.reload(); // Reload to apply all fresh
        } catch (e) {
            alert('Invalid Settings JSON');
        }
    }

    exportSettings() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "flip_clock_settings.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

const store = new SettingsStore();

/* =========================================
   7. LANGUAGE MANAGER (Localization)
   ========================================= */
const translations = {
    en: {
        pomodoro: "Pomodoro",
        round: "Round",
        stay_focused: "Stay Focused",
        settings: "Settings",
        visual: "Visual",
        time: "Time",
        focus: "Focus",
        audio: "Audio",
        system: "System",
        theme_appearance: "Theme & Appearance",
        language: "Language / Dil",
        theme_preset: "Theme Preset",
        dark_modern: "Dark Modern",
        soft_light: "Soft Light",
        retro_orange: "Retro Orange",
        cyberpunk_neon: "Cyberpunk Neon",
        forest_zen: "Forest Zen",
        vintage_sepia: "Vintage Sepia",
        background_url: "Background URL (Image/Video)",
        font: "Font",
        flip_card_color: "Flip Card Color",
        number_color: "Number Color",
        card_radius: "Card Radius",
        scale: "Scale",
        effects: "Effects",
        film_grain: "Film Grain",
        "3d_shadows": "3D Shadows",
        reflection: "Reflection",
        time_format: "Time Format",
        "24h_format": "24-Hour Format",
        show_seconds: "Show Seconds",
        show_ampm: "Show AM/PM",
        show_date: "Show Date",
        pad_zeros: "Pad Zeros",
        hourly_chime: "Hourly Chime",
        timer_settings: "Timer Settings",
        pomodoro_min: "Pomodoro (min)",
        short_break_min: "Short Break (min)",
        long_break_min: "Long Break (min)",
        autostart_breaks: "Auto-start Breaks",
        mechanical_click_sound: "Mechanical Click Sound",
        desktop_notifications: "Desktop Notifications",
        master_volume: "Master Volume",
        ambience_mixer: "Ambience Mixer",
        audio_rain: "Rain",
        audio_white_noise: "White Noise",
        audio_coffee_shop: "Coffee Shop",
        audio_fireplace: "Fireplace",
        export_settings: "Export Settings (.json)",
        import_settings: "Import Settings",
        energy_saver: "Energy Saver",

        // Dynamic
        short_break: "Short Break",
        long_break: "Long Break",

        // Tooltips
        switch_mode: "Switch Mode",
        start_pause: "Start/Pause",
        reset_timer: "Reset Timer",
        ambience: "Ambience Mixer",
        fullscreen: "Fullscreen"
    },
    tr: {
        pomodoro: "Pomodoro",
        round: "Tur",
        stay_focused: "Odaklan",
        settings: "Ayarlar",
        visual: "Görünüm",
        time: "Zaman",
        focus: "Odak",
        audio: "Ses",
        system: "Sistem",
        theme_appearance: "Tema & Görünüm",
        language: "Dil / Language",
        theme_preset: "Tema Seçimi",
        dark_modern: "Karanlık Modern",
        soft_light: "Yumuşak Işık",
        retro_orange: "Retro Turuncu",
        cyberpunk_neon: "Siberpunk Neon",
        forest_zen: "Orman Zen",
        vintage_sepia: "Vintage Sepya",
        background_url: "Arkaplan URL (Resim/Video)",
        font: "Yazı Tipi",
        flip_card_color: "Kart Rengi",
        number_color: "Sayı Rengi",
        card_radius: "Kart Köşeleri",
        scale: "Boyut",
        effects: "Efektler",
        film_grain: "Film Greni",
        "3d_shadows": "3D Gölgeler",
        reflection: "Yansıma",
        time_format: "Zaman Biçimi",
        "24h_format": "24 Saat Biçimi",
        show_seconds: "Saniyeyi Göster",
        show_ampm: "ÖÖ/ÖS Göster",
        show_date: "Tarihi Göster",
        pad_zeros: "Sıfır ile Doldur (05:09)",
        hourly_chime: "Saat Başı Sesi",
        timer_settings: "Zamanlayıcı Ayarları",
        pomodoro_min: "Pomodoro (dk)",
        short_break_min: "Kısa Mola (dk)",
        long_break_min: "Uzun Mola (dk)",
        autostart_breaks: "Molaları Otomatik Başlat",
        mechanical_click_sound: "Mekanik Tık Sesi",
        desktop_notifications: "Masaüstü Bildirimleri",
        master_volume: "Ana Ses Seviyesi",
        ambience_mixer: "Ortam Sesleri",
        audio_rain: "Yağmur",
        audio_white_noise: "Beyaz Gürültü",
        audio_coffee_shop: "Kafe",
        audio_fireplace: "Şömine",
        export_settings: "Ayarları Dışa Aktar",
        import_settings: "Ayarları İçe Aktar",
        energy_saver: "Güç Tasarrufu",

        // Dynamic
        short_break: "Kısa Mola",
        long_break: "Uzun Mola",

        // Tooltips
        switch_mode: "Mod Değiştir",
        start_pause: "Başlat/Durdur",
        reset_timer: "Sıfırla",
        ambience: "Ortam Mikseri",
        fullscreen: "Tam Ekran"
    }
};

class LanguageManager {
    constructor() {
        this.currentLang = store.get('language') || 'en';
        this.update(this.currentLang);

        document.addEventListener('settingChanged', (e) => {
            if (e.detail.key === 'language') {
                this.update(e.detail.value);
            }
        });
    }

    update(lang) {
        this.currentLang = lang;
        const dict = translations[lang];
        if (!dict) return;

        // Update Text Content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });

        // Update Titles (Tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (dict[key]) el.title = dict[key];
        });

        // Update dynamic content via TimeKeeper if needed
        if (typeof timeKeeper !== 'undefined') {
            timeKeeper.updateModeLabel();
        }
    }

    get(key) {
        return translations[this.currentLang][key] || key;
    }
}


/* =========================================
   2. THEME MANAGER
   ========================================= */
class ThemeManager {
    constructor() {
        this.root = document.documentElement;
        this.body = document.body;
        this.bgVideo = document.getElementById('bg-video');
        this.init();

        document.addEventListener('settingChanged', (e) => this.update(e.detail.key, e.detail.value));
    }

    init() {
        // Apply all current settings
        Object.keys(store.state).forEach(key => this.update(key, store.state[key]));
    }

    update(key, value) {
        switch (key) {
            case 'theme':
                this.body.className = `theme-${value}`;
                break;
            case 'bgUrl':
                if (value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.includes('googlevideo') || value.includes('blob:'))) {
                    // It's a video
                    this.bgVideo.src = value;
                    this.bgVideo.style.display = 'block';
                    this.bgVideo.play().catch(e => console.log('Video play failed', e));
                    this.root.style.setProperty('--bg-image', 'none');
                } else {
                    // It's an image or empty
                    this.bgVideo.style.display = 'none';
                    this.bgVideo.pause();
                    this.root.style.setProperty('--bg-image', value ? `url(${value})` : 'none');
                }
                break;
            case 'cardColor':
                this.root.style.setProperty('--card-bg', value);
                break;
            case 'numColor':
                this.root.style.setProperty('--text-color', value);
                break;
            case 'scale':
                this.root.style.setProperty('--scale', value);
                break;
            case 'radius':
                this.root.style.setProperty('--card-radius', `${value}px`);
                break;
            case 'font':
                const fontMap = {
                    'sans': "'Inter', sans-serif",
                    'serif': "'Playfair Display', serif",
                    'mono': "'JetBrains Mono', monospace",
                    'digital': "'Orbitron', sans-serif",
                    'retro': "'Righteous', cursive",
                    'huge': "'Bebas Neue', sans-serif",
                    'roboto': "'Roboto', sans-serif",
                    'opensans': "'Open Sans', sans-serif",
                    'lato': "'Lato', sans-serif",
                    'montserrat': "'Montserrat', sans-serif",
                    'raleway': "'Raleway', sans-serif",
                    'poppins': "'Poppins', sans-serif",
                    'oswald': "'Oswald', sans-serif",
                    'sourcesans': "'Source Sans Pro', sans-serif",
                    'ubuntu': "'Ubuntu', sans-serif",
                    'nunito': "'Nunito', sans-serif",
                    'rubik': "'Rubik', sans-serif",
                    'ptsans': "'PT Sans', sans-serif",
                    'merriweather': "'Merriweather', serif",
                    'lora': "'Lora', serif",
                    'crimson': "'Crimson Text', serif",
                    'libre': "'Libre Baskerville', serif",
                    'ptserif': "'PT Serif', serif",
                    'spacemono': "'Space Mono', monospace",
                    'inconsolata': "'Inconsolata', monospace",
                    'courier': "'Courier Prime', monospace",
                    'pixel': "'Press Start 2P', cursive"
                };
                this.root.style.setProperty('--font-clock', fontMap[value] || fontMap['sans']);
                break;
            case 'grain':
                document.getElementById('app-grain').style.display = value ? 'block' : 'none';
                break;
            case 'showSeconds':
                const secGroup = document.getElementById('group-seconds');
                const secSep = document.querySelector('.sec-separator');
                if (value) {
                    secGroup.style.display = 'block';
                    secSep.style.display = 'block';
                } else {
                    secGroup.style.display = 'none';
                    secSep.style.display = 'none';
                }
                break;
            case 'showAmPm':
                document.getElementById('meridiem').style.display = value ? 'block' : 'none';
                break;
            case 'showDate':
                document.getElementById('date-display').style.display = value ? 'block' : 'none';
                break;
        }
    }
}

/* =========================================
   3. AUDIO ENGINE
   ========================================= */
class AudioEngine {
    constructor() {
        // Use local audio files
        this.clickSound = new Audio('assets/flip-click.mp3');
        this.alarmSound = new Audio('assets/alarm.mp3');
        this.chimeSound = new Audio('assets/alarm.mp3'); // Use alarm as chime fallback

        this.ambience = {
            rain: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3'),
            white: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-white-noise-loop-2999.mp3'),
            cafe: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-restaurant-ambience-loop-3000.mp3'),
            fire: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3')
        };

        Object.values(this.ambience).forEach(audio => {
            audio.loop = true;
            audio.volume = 0;
        });

        this.updateMasterVolume();
        document.addEventListener('settingChanged', (e) => this.handleVolumeChange(e.detail.key, e.detail.value));
    }

    updateMasterVolume() {
        const masterVol = store.get('soundMuted') ? 0 : (store.get('masterVolume') / 100);
        
        // Apply to all sounds
        this.clickSound.volume = masterVol;
        this.alarmSound.volume = masterVol;
        this.chimeSound.volume = masterVol;
        
        // Apply to ambience sounds
        Object.values(this.ambience).forEach(audio => {
            if (!audio.paused) {
                const baseVol = this.getAmbienceBaseVolume(audio);
                audio.volume = baseVol * masterVol;
            }
        });
    }

    getAmbienceBaseVolume(audio) {
        // Get the base volume for each ambience type
        const type = Object.keys(this.ambience).find(key => this.ambience[key] === audio);
        if (type === 'rain') return store.get('volRain') / 100;
        if (type === 'white') return store.get('volWhite') / 100;
        if (type === 'cafe') return store.get('volCafe') / 100;
        if (type === 'fire') return store.get('volFire') / 100;
        return 0;
    }

    toggleMute() {
        const currentMuted = store.get('soundMuted');
        store.set('soundMuted', !currentMuted);
        this.updateMasterVolume();
        return !currentMuted;
    }

    playClick() {
        if (store.get('clickSound') && !store.get('soundMuted')) {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(() => { });
        }
    }

    playAlarm() {
        if (!store.get('soundMuted')) {
            this.alarmSound.play().catch(() => { });
        }
    }

    playChime() {
        if (store.get('hourlyChime') && !store.get('soundMuted')) {
            this.chimeSound.play().catch(() => { });
        }
    }

    handleVolumeChange(key, value) {
        if (key === 'masterVolume' || key === 'soundMuted') {
            this.updateMasterVolume();
            // Also update ambience volumes
            const masterVol = store.get('soundMuted') ? 0 : (store.get('masterVolume') / 100);
            const rainVol = (store.get('volRain') / 100) * masterVol;
            const whiteVol = (store.get('volWhite') / 100) * masterVol;
            const cafeVol = (store.get('volCafe') / 100) * masterVol;
            const fireVol = (store.get('volFire') / 100) * masterVol;
            this.toggleAmbience('rain', rainVol);
            this.toggleAmbience('white', whiteVol);
            this.toggleAmbience('cafe', cafeVol);
            this.toggleAmbience('fire', fireVol);
            return;
        }
        
        const masterVol = store.get('soundMuted') ? 0 : (store.get('masterVolume') / 100);
        const vol = (value / 100) * masterVol;
        
        if (key === 'volRain') this.toggleAmbience('rain', vol);
        if (key === 'volWhite') this.toggleAmbience('white', vol);
        if (key === 'volCafe') this.toggleAmbience('cafe', vol);
        if (key === 'volFire') this.toggleAmbience('fire', vol);
    }

    toggleAmbience(type, volume) {
        const audio = this.ambience[type];
        if (audio) {
            // Chrome requires interaction before play
            if (volume > 0 && audio.paused) {
                audio.play().catch(() => { });
            }
            audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
            if (volume === 0) {
                audio.pause();
            }
        }
    }
}

/* =========================================
   4. FLIP NODE (Visual Component)
   ========================================= */
class FlipNode {
    constructor(elementId) {
        this.root = document.getElementById(elementId);
        if (!this.root) {
            console.error(`FlipNode: Element with id "${elementId}" not found`);
            return;
        }
        this.value = null; // Current value
        this.isAnimating = false;

        // DOM Nodes
        this.card = this.root.querySelector('.flip-card');
        this.top = this.root.querySelector('.top');
        this.bottom = this.root.querySelector('.bottom');
        this.topBack = this.root.querySelector('.top-back');
        this.bottomBack = this.root.querySelector('.bottom-back');
        
        if (!this.card || !this.top || !this.bottom || !this.topBack || !this.bottomBack) {
            console.error(`FlipNode: Required DOM elements not found for "${elementId}"`);
        }
    }

    update(newValue) {
        if (!this.root || !this.card) return; // Safety check
        
        // Pad with string conversion if needed
        const shouldPad = store.get('padZeros');
        const valStr = shouldPad ? String(newValue).padStart(2, '0') : String(newValue);

        if (this.value !== valStr) {
            if (this.value === null) {
                // Initial set (no animation)
                this.value = valStr;
                this.setVisuals(valStr);
            } else {
                // Value changed, animate
                this.flip(valStr);
            }
        }
    }

    setVisuals(val) {
        this.top.textContent = val;
        this.bottom.textContent = val;
        this.topBack.textContent = val;
        this.bottomBack.textContent = val;
    }

    flip(nextValue) {
        if (store.get('energySaver')) {
            // Skip animation in energy saver
            this.value = nextValue;
            this.setVisuals(nextValue);
            return;
        }

        // Setup back faces for the new value
        this.topBack.textContent = nextValue;
        this.bottomBack.textContent = nextValue;

        // Trigger animation
        this.card.classList.add('flip-down');

        // Play sound
        if (window.audioEngine) {
            window.audioEngine.playClick();
        }

        // Cleanup after animation
        // Matches CSS animation duration (0.6s)
        setTimeout(() => {
            this.card.classList.remove('flip-down');
            this.value = nextValue;
            this.top.textContent = nextValue;
            this.bottom.textContent = nextValue;
        }, 600);
    }
}

/* =========================================
   5. TIME KEEPER (Engine)
   ========================================= */
class TimeKeeper {
    constructor() {
        this.mode = 'clock'; // clock | pomodoro | break_short | break_long
        this.timerState = 'paused'; // running | paused
        this.timeLeft = 0; // seconds
        this.interval = null;
        this.round = 1;

        // Nodes
        this.hoursNode = new FlipNode('group-hours');
        this.minutesNode = new FlipNode('group-minutes');
        this.secondsNode = new FlipNode('group-seconds');

        this.dateDisplay = document.getElementById('date-display');
        this.meridiemFor = document.getElementById('meridiem');
        this.modeBadge = document.getElementById('mode-badge');
        this.lapCount = document.getElementById('lap-count');
        this.timerStatus = document.getElementById('timer-status');
        this.playPauseBtn = document.getElementById('btn-play-pause');
        this.playPauseIcon = this.playPauseBtn ? this.playPauseBtn.querySelector('i') : null;

        this.startLoop();
    }

    startLoop() {
        // Start main clock pulse - update every second
        setInterval(() => {
            if (this.mode === 'clock') {
                this.updateClock();
            } else if (this.timerState === 'running') {
                this.tickTimer();
            }
        }, 1000);

        // Initial call to show time immediately
        this.updateClock();
    }

    updateClock() {
        if (!this.hoursNode || !this.minutesNode || !this.secondsNode) {
            console.error('TimeKeeper: FlipNodes not initialized');
            return;
        }

        const now = new Date();
        let h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();

        // Date update - Localization aware
        if (this.dateDisplay) {
            let lang = store.get('language') === 'tr' ? 'tr-TR' : 'en-US';
            const dateStr = now.toLocaleDateString(lang, { weekday: 'long', month: 'long', day: 'numeric' });
            if (this.dateDisplay.textContent !== dateStr) this.dateDisplay.textContent = dateStr;
        }

        // AM/PM
        if (this.meridiemFor) {
            let ampm = h >= 12 ? 'PM' : 'AM';
            this.meridiemFor.textContent = ampm;
        }

        // 12/24H
        if (!store.get('is24h')) {
            h = h % 12;
            h = h ? h : 12; // 0 should be 12
        }

        // Update flip cards
        this.hoursNode.update(h);
        this.minutesNode.update(m);
        this.secondsNode.update(s);

        // Hourly Chime
        if (m === 0 && s === 0 && store.get('hourlyChime')) {
            if (window.audioEngine) {
                window.audioEngine.playChime();
            }
        }
    }

    /* Timer Logic */
    switchMode() {
        if (this.mode === 'clock') {
            this.setMode('pomodoro');
        } else {
            this.setMode('clock');
        }
    }

    setMode(newMode) {
        this.mode = newMode;
        this.timerState = 'paused';

        if (newMode === 'clock') {
            this.timerStatus.classList.add('hidden');
            this.dateDisplay.classList.remove('hidden');
            this.updateClock(); // Immediate refresh
        } else {
            this.timerStatus.classList.remove('hidden');
            this.dateDisplay.classList.add('hidden');

            // Set time based on settings
            let mins = 25;
            let labelKey = "pomodoro";

            if (newMode === 'pomodoro') { mins = store.get('pomoTime'); labelKey = "pomodoro"; }
            if (newMode === 'break_short') { mins = store.get('shortBreak'); labelKey = "short_break"; }
            if (newMode === 'break_long') { mins = store.get('longBreak'); labelKey = "long_break"; }

            this.timeLeft = mins * 60;
            this.updateTimerVisuals();

            this.updateModeLabel(labelKey);
        }
        this.updatePlayPauseIcon();
    }

    updateModeLabel(labelKey) {
        // Find current label key based on mode if not provided
        if (!labelKey) {
            if (this.mode === 'pomodoro') labelKey = "pomodoro";
            if (this.mode === 'break_short') labelKey = "short_break";
            if (this.mode === 'break_long') labelKey = "long_break";
        }
        if (this.mode !== 'clock') {
            this.modeBadge.textContent = languageManager.get(labelKey);
            this.lapCount.textContent = `${languageManager.get('round')} ${this.round}`;
        }
    }

    toggleTimer() {
        if (this.mode === 'clock') return;
        this.timerState = this.timerState === 'paused' ? 'running' : 'paused';
        this.updatePlayPauseIcon();
    }

    updatePlayPauseIcon() {
        if (this.playPauseIcon) {
            if (this.timerState === 'running') {
                this.playPauseIcon.className = 'ph ph-pause';
            } else {
                this.playPauseIcon.className = 'ph ph-play';
            }
        } else if (this.playPauseBtn) {
            // Try to get icon again if it wasn't found initially
            this.playPauseIcon = this.playPauseBtn.querySelector('i');
            if (this.playPauseIcon) {
                this.updatePlayPauseIcon();
            }
        }
    }

    resetTimer() {
        if (this.mode === 'clock') return;
        this.setMode(this.mode); // Resets time to default
    }

    tickTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateTimerVisuals();
        } else {
            this.timerComplete();
        }
    }

    updateTimerVisuals() {
        const m = Math.floor(this.timeLeft / 60);
        const s = this.timeLeft % 60;

        this.hoursNode.update(0);
        this.minutesNode.update(m);
        this.secondsNode.update(s);
    }

    timerComplete() {
        this.timerState = 'paused';
        if (window.audioEngine) {
            window.audioEngine.playAlarm();
        }

        if (store.get('autoStart')) {
            // Logic to auto switch to break
            this.nextSession();
        }
    }

    nextSession() {
        if (this.mode === 'pomodoro') {
            if (this.round % 4 === 0) {
                this.setMode('break_long');
            } else {
                this.setMode('break_short');
            }
        } else {
            // Break is over
            if (this.mode === 'break_long') this.round = 0; // Reset rounds
            this.round++;
            this.setMode('pomodoro');
        }

        if (store.get('autoStart')) {
            this.timerState = 'running';
        }
    }
}

/* =========================================
   6. UI CONTROLLER (Glue)
   ========================================= */
// Initialize app when DOM is ready
(function() {
    let themeManager, audioEngine, languageManager, timeKeeper;
    
    function init() {
        themeManager = new ThemeManager();
        audioEngine = new AudioEngine();
        languageManager = new LanguageManager();
        timeKeeper = new TimeKeeper();
        
        // Make them globally accessible for other classes
        window.audioEngine = audioEngine;
        window.timeKeeper = timeKeeper;
        
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Drawer Logic
        const drawer = document.getElementById('settings-drawer');
        const btnSettings = document.getElementById('btn-settings');
        const btnClose = document.getElementById('btn-close-settings');
        const tabs = document.querySelectorAll('.tab-btn');
        const panels = document.querySelectorAll('.settings-panel');

        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                if (drawer) drawer.classList.add('open');
            });
        }
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                if (drawer) drawer.classList.remove('open');
            });
        }
        
        // Close drawer when clicking outside
        if (drawer) {
            drawer.addEventListener('click', (e) => {
                if (e.target === drawer) {
                    drawer.classList.remove('open');
                }
            });
        }

        // Tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Active Tab UI
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Active Panel
                panels.forEach(p => p.classList.remove('active'));
                const panel = document.getElementById(`panel-${tab.dataset.tab}`);
                if (panel) panel.classList.add('active');
            });
        });

        // Control Buttons
        const btnMode = document.getElementById('btn-mode');
        const btnPlayPause = document.getElementById('btn-play-pause');
        const btnReset = document.getElementById('btn-reset');
        const btnFullscreen = document.getElementById('btn-fullscreen');
        const btnAudio = document.getElementById('btn-audio');

        if (btnMode) btnMode.addEventListener('click', () => timeKeeper.switchMode());
        if (btnPlayPause) btnPlayPause.addEventListener('click', () => timeKeeper.toggleTimer());
        if (btnReset) btnReset.addEventListener('click', () => timeKeeper.resetTimer());
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => {
                if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                    // Enter fullscreen
                    const element = document.documentElement;
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                } else {
                    // Exit fullscreen
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
            });
            
            // Update icon when fullscreen changes
            const updateFullscreenIcon = () => {
                const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
                const icon = btnFullscreen.querySelector('i');
                if (icon) {
                    icon.className = isFullscreen ? 'ph ph-corners-in' : 'ph ph-corners-out';
                }
            };
            
            // Listen for fullscreen changes
            document.addEventListener('fullscreenchange', updateFullscreenIcon);
            document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
            document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
            document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
            
            // Initial icon update
            updateFullscreenIcon();
        }
        if (btnAudio) {
            btnAudio.addEventListener('click', () => {
                // Toggle mute/unmute
                const isMuted = audioEngine.toggleMute();
                const icon = btnAudio.querySelector('i');
                if (icon) {
                    icon.className = isMuted ? 'ph ph-speaker-slash' : 'ph ph-speaker-high';
                }
            });
            
            // Update icon on load
            const icon = btnAudio.querySelector('i');
            if (icon && store.get('soundMuted')) {
                icon.className = 'ph ph-speaker-slash';
            }
        }

        // Setting Inputs Listeners
        // Helper to bind input to store
        function bindInput(id, key, type = 'text') {
            const el = document.getElementById(id);
            if (!el) return;

            // Init value
            if (type === 'checkbox') el.checked = store.get(key);
            else el.value = store.get(key);

            // Change event
            const eventType = (type === 'text' || type === 'color' || type === 'number' || type === 'range') ? 'input' : 'change';
            el.addEventListener(eventType, (e) => {
                let val = e.target.value;
                if (type === 'checkbox') val = e.target.checked;
                else if (type === 'number') val = parseInt(e.target.value);
                else if (type === 'range') {
                    // Scale is float, others are int
                    val = (key === 'scale') ? parseFloat(e.target.value) : parseInt(e.target.value);
                }

                store.set(key, val);
            });
        }

        // Bind all settings
        bindInput('set-theme', 'theme', 'select-one');
        bindInput('set-bg-url', 'bgUrl');
        bindInput('set-font', 'font', 'select-one');
        bindInput('set-card-color', 'cardColor', 'color');
        bindInput('set-num-color', 'numColor', 'color');
        bindInput('set-radius', 'radius', 'range');
        bindInput('set-scale', 'scale', 'range');
        bindInput('set-grain', 'grain', 'checkbox');
        bindInput('set-shadows', 'shadows', 'checkbox');
        bindInput('set-reflection', 'reflection', 'checkbox');
        bindInput('set-24h', 'is24h', 'checkbox');
        bindInput('set-seconds', 'showSeconds', 'checkbox');
        bindInput('set-ampm', 'showAmPm', 'checkbox');
        bindInput('set-date', 'showDate', 'checkbox');
        bindInput('set-padding', 'padZeros', 'checkbox');
        bindInput('set-pomo-time', 'pomoTime', 'number');
        bindInput('set-short-break', 'shortBreak', 'number');
        bindInput('set-long-break', 'longBreak', 'number');
        bindInput('set-autostart', 'autoStart', 'checkbox');
        bindInput('set-click-sound', 'clickSound', 'checkbox');
        bindInput('set-saver', 'energySaver', 'checkbox');
        bindInput('set-notifications', 'notifications', 'checkbox');
        bindInput('set-chime', 'hourlyChime', 'checkbox');

        // Master Volume
        const volMaster = document.getElementById('vol-master');
        const volMasterDisplay = document.getElementById('vol-master-display');
        if (volMaster) {
            volMaster.value = store.get('masterVolume');
            if (volMasterDisplay) volMasterDisplay.textContent = store.get('masterVolume') + '%';
            volMaster.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                store.set('masterVolume', val);
                if (volMasterDisplay) volMasterDisplay.textContent = val + '%';
            });
        }
        
        // Audio Volumes
        bindInput('vol-rain', 'volRain', 'range');
        bindInput('vol-white', 'volWhite', 'range');
        bindInput('vol-cafe', 'volCafe', 'range');
        bindInput('vol-fire', 'volFire', 'range');

        // Language Toggle
        const langToggle = document.getElementById('set-language');
        if (langToggle) {
            langToggle.checked = store.get('language') === 'tr';
            langToggle.addEventListener('change', (e) => {
                const newLang = e.target.checked ? 'tr' : 'en';
                store.set('language', newLang);
                // Update language immediately
                if (languageManager) {
                    languageManager.update(newLang);
                }
            });
        }

        // Export/Import System
        const btnExport = document.getElementById('btn-export');
        const btnImport = document.getElementById('btn-import');
        if (btnExport) {
            btnExport.addEventListener('click', () => store.exportSettings());
        }
        if (btnImport) {
            btnImport.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/json';
                input.onchange = e => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.readAsText(file, 'UTF-8');
                    reader.onload = readerEvent => {
                        store.importSettings(readerEvent.target.result);
                    };
                };
                input.click();
            });
        }

        // Zen Mode Logic
        let idleTimer;
        document.addEventListener('mousemove', () => {
            document.body.classList.remove('zen-active');
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                // Only enter zen mode if drawer is closed
                if (drawer && !drawer.classList.contains('open')) {
                    document.body.classList.add('zen-active');
                }
            }, 5000);
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
