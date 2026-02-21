/**
 * settings.js — Advanced Settings Store
 * Extends the existing SettingsStore (defined in script.js) via composition.
 * Uses separate localStorage key: 'flipClockAdvSettings'
 * Namespace: window.FCSettings
 */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'flipClockAdvSettings';

    const DEFAULTS = {
        /* ── Time Display ── */
        showMilliseconds: false,
        showUTC: false,
        showWeekNumber: false,
        showDayOfYear: false,
        showISOWeek: false,
        timeBgAuto: false,   // time-of-day background

        /* ── World Clocks ── */
        worldClocks: [
            { city: 'New York', tz: 'America/New_York' },
            { city: 'London', tz: 'Europe/London' },
            { city: 'Tokyo', tz: 'Asia/Tokyo' }
        ],
        worldClocksEnabled: false,
        primaryWorldClock: 'local',  // 'local' or IANA timezone string

        /* ── Binary Clock ── */
        binaryClockEnabled: false,

        /* ── Analog ── */
        analogOverlayEnabled: false,

        /* ── Voice ── */
        voiceReadEnabled: false,
        voiceReadInterval: 60,      // minutes
        voiceLang: 'en-US',

        /* ── Alarms ── */
        alarms: [],                  // Array of AlarmEntry objects
        alarmVibrate: true,

        /* ── Stopwatch / Countdown / Multi-timer ── */
        stopwatchEnabled: false,
        countdownEnabled: false,
        multiTimerEnabled: false,
        targetDateEnabled: false,
        targetDate: '',

        /* ── Advanced ── */
        sunMoonEnabled: false,
        autoTimezone: true,
        ntpSyncEnabled: false,
        speedSimEnabled: false,
        speedMultiplier: 1,

        /* ── Age Calculator ── */
        ageCalcEnabled: false,
        ageCalcDob: '',

        /* ── Time Machine ── */
        timeMachineEnabled: false,
        timeMachineOffset: 0,        // seconds offset

        /* ── Performance ── */
        performanceMode: false,
        animationSpeed: 1.0,      // 0.5 = fast, 2.0 = slow

        /* ── Advanced Styling ── */
        advancedDesign: 'default', // default | glass | phantom | brutalist | matrix | neon

        /* ── Language (mirrors main store) ── */
        lang: 'en',
    };

    class AdvancedSettingsStore {
        constructor() {
            this._state = this._load();
            this._listeners = {};
        }

        _load() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return { ...DEFAULTS };
                const parsed = JSON.parse(raw);
                return { ...DEFAULTS, ...parsed };
            } catch {
                return { ...DEFAULTS };
            }
        }

        _save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
        }

        get(key) {
            return this._state[key];
        }

        set(key, value) {
            this._state[key] = value;
            this._save();
            // Dispatch global event (same system as base SettingsStore)
            document.dispatchEvent(new CustomEvent('fcAdvSettingChanged', {
                detail: { key, value }
            }));
            // Call local listeners
            if (this._listeners[key]) {
                this._listeners[key].forEach(fn => fn(value));
            }
        }

        on(key, fn) {
            if (!this._listeners[key]) this._listeners[key] = [];
            this._listeners[key].push(fn);
        }

        /** Toggle a boolean setting */
        toggle(key) {
            this.set(key, !this.get(key));
        }

        getAll() { return { ...this._state }; }

        importAll(data) {
            try {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                this._state = { ...DEFAULTS, ...parsed };
                this._save();
            } catch {
                console.error('[FCSettings] Import failed');
            }
        }

        exportAll() {
            return JSON.stringify(this._state, null, 2);
        }

        /* ── Alarm helpers ── */
        addAlarm(entry) {
            const alarms = this.get('alarms') || [];
            entry.id = (global.FCUtils && global.FCUtils.uid) ? global.FCUtils.uid() : Math.random().toString(36).slice(2);
            alarms.push(entry);
            this.set('alarms', alarms);
            return entry.id;
        }

        removeAlarm(id) {
            const alarms = (this.get('alarms') || []).filter(a => a.id !== id);
            this.set('alarms', alarms);
        }

        updateAlarm(id, changes) {
            const alarms = (this.get('alarms') || []).map(a =>
                a.id === id ? { ...a, ...changes } : a
            );
            this.set('alarms', alarms);
        }

        /* ── World Clock helpers ── */
        addWorldClock(city, tz) {
            const clocks = this.get('worldClocks') || [];
            clocks.push({ city, tz });
            this.set('worldClocks', clocks);
        }

        removeWorldClock(index) {
            const clocks = (this.get('worldClocks') || []).filter((_, i) => i !== index);
            this.set('worldClocks', clocks);
        }
    }

    /* ── i18n strings for advanced features ── */
    const ADV_TRANSLATIONS = {
        en: {
            tab_visual: "Visual Gallery",
            tab_time: "Time & Date",
            tab_focus: "Focus Mode",
            tab_audio: "Soundscape",
            tab_system: "Core System",
            tab_alarms: "Alarm Center",
            tab_world: "Global Clocks",
            tab_advanced: "Power User",
            tab_extra: "Utility Tools",

            add_alarm: "Add Alarm",
            alarm_time: "Alarm Time",
            alarm_label: "Alarm Label",
            alarm_repeat: "Repeat Interval",
            repeat_once: "Once Only",
            repeat_daily: "Daily",
            repeat_weekly: "Weekly",
            alarm_vibrate: "Vibration Pattern",
            active_alarms: "Active Alarms",
            alarm_enabled: "Enable This Tool",

            world_clocks: "World Clock Hub",
            city_name: "City/Region Name",
            timezone: "Timezone Selection",
            add_city: "Add to Dashboard",
            timezone_sync: "Timezone Synchronization",
            auto_timezone: "Auto-detect Location",
            set_main: "Set as Main Clock",

            time_display: "Display Parameters",
            show_ms: "Display Milliseconds",
            show_utc: "Show UTC/GMT Info",
            show_weeknum: "Week Number",
            show_dayofyear: "Day of the Year",
            visual_styles: "Advanced Styling",
            time_bg_auto: "Dynamic Background (Day/Night)",
            binary_clock: "Binary Clock View",
            analog_overlay: "Analog Clock View",
            voice_reading: "Voice Feedback",
            voice_read: "Announce Time Aloud",
            voice_interval: "Reading Interval (min)",
            sun_moon: "Sun & Moon Telemetry",
            ntp_sync: "Precision NTP Sync",
            anim_speed: "Engine Animation Speed",
            design_selection: "Advanced Style Selection",
            design_default: "Original Flip",
            design_glass: "Glass Fusion",
            design_phantom: "Ethereal Glow",
            design_brutalist: "Brutalist Raw",
            design_matrix: "Cyber Matrix",
            design_neon: "Neon Nights",

            stopwatch: "Stopwatch Pro",
            countdown: "Precise Countdown",
            multi_timer: "Multi-Timer Grid",
            add_timer: "Add New Timer",
            set_time: "SET DURATION",
            time_machine_sim: "Simulation Engine",
            time_machine: "Temporal Offset (Time Machine)",
            speed_sim: "Execution Speed Sim",
            offset_hours: "Temporal Offset (Hours)",
            calculators: "Calculators / Math",
            age_calc: "Age & Milestone Calc",
            birth_date: "Reference Birth Date",
            target_date: "Target Event Countdown",

            tz_utc: "UTC (Greenwich)",
            tz_ny: "New York (EST/EDT)",
            tz_london: "London (GMT/BST)",
            tz_ist: "Istanbul (TRT)",
            tz_tokyo: "Tokyo (JST)",
            tz_dubai: "Dubai (GST)",
            tz_sydney: "Sydney (AEST/AEDT)",
            tz_la: "Los Angeles (PST/PDT)",
            tz_paris: "Paris (CET/CEST)",
            tz_shanghai: "Shanghai (CST)",

            // Sun/Moon
            sunrise: "Sunrise",
            sunset: "Sunset",
            new_moon: "New Moon",
            waxing_crescent: "Waxing Crescent",
            first_quarter: "First Quarter",
            waxing_gibbous: "Waxing Gibbous",
            full_moon: "Full Moon",
            waning_gibbous: "Waning Gibbous",
            last_quarter: "Last Quarter",
            waning_crescent: "Waning Crescent",

            // Clock & Utils
            day_label: "Day",
            offset_hours: "hours",
            main_clock_title: "Main Clock",
            set_main_clock_title: "Set as Main Clock",
            remove_title: "Remove",
            analog_title: "ANALOG",
            years_label: "years",
            months_label: "months",
            hours_today: "hours today",
            total_days_lived: "total days lived",
            speak_time_prefix: "The time is",
            speak_am: "AM",
            speak_pm: "PM",
            city_name: "City",

            // Dynamic Labels
            lap: "Lap",
            timer: "Timer",
            target_reached: "Time Reached!",
            day_short: "d",
            hour_short: "h",
            minute_short: "m",
            second_short: "s",
            snooze_btn: "Snooze 5m",
            dismiss_btn: "Dismiss",
            no_alarms: "No alarms active",
            snoozed_label: "Snoozed",
            monday_short: "M",
            tuesday_short: "T",
            wednesday_short: "W",
            thursday_short: "T",
            friday_short: "F",
            saturday_short: "S",
            sunday_short: "S"
        },
        tr: {
            tab_visual: "Görsel Galeri",
            tab_time: "Zaman ve Tarih",
            tab_focus: "Odaklanma Modu",
            tab_audio: "Ses Dünyası",
            tab_system: "Çekirdek Sistem",
            tab_alarms: "Alarm Merkezi",
            tab_world: "Küresel Saatler",
            tab_advanced: "Gelişmiş Özellikler",
            tab_extra: "Yardımcı Araçlar",

            add_alarm: "Alarm Ekle",
            alarm_time: "Alarm Saati",
            alarm_label: "Alarm Etiketi",
            alarm_repeat: "Tekrar Aralığı",
            repeat_once: "Sadece Bir Kez",
            repeat_daily: "Günlük",
            repeat_weekly: "Haftalık",
            alarm_vibrate: "Titreşim Deseni",
            active_alarms: "Aktif Alarmlar",
            alarm_enabled: "Bu Aracı Etkinleştir",

            world_clocks: "Dünya Saati Merkezi",
            city_name: "Şehir/Bölge Adı",
            timezone: "Zaman Dilimi Seçimi",
            add_city: "Panoya Ekle",
            timezone_sync: "Zaman Dilimi Senkronizasyonu",
            auto_timezone: "Konumu Otomatik Algıla",
            set_main: "Ana Saat Yap",

            time_display: "Görüntüleme Parametreleri",
            show_ms: "Milisaniyeleri Göster",
            show_utc: "UTC/GMT Bilgisini Göster",
            show_weeknum: "Hafta Numarası",
            show_dayofyear: "Yılın Günü",
            visual_styles: "Gelişmiş Stil",
            time_bg_auto: "Dinamik Arkaplan (Gece/Gündüz)",
            binary_clock: "İkili (Binary) Saat",
            analog_overlay: "Analog Saat Görünümü",
            voice_reading: "Sesli Geri Bildirim",
            voice_read: "Zamanı Sesli Oku",
            voice_interval: "Okuma Aralığı (dk)",
            sun_moon: "Güneş & Ay Bilgisi",
            ntp_sync: "Hassas NTP Senkronizasyonu",
            anim_speed: "Motor Animasyon Hızı",
            design_selection: "Gelişmiş Tasarım Seçimi",
            design_default: "Orijinal Kapaklı",
            design_glass: "Cam Füzyon",
            design_phantom: "Ruhani Parıltı",
            design_brutalist: "Brütalist Hamlık",
            design_matrix: "Siber Matris",
            design_neon: "Neon Geceler",

            stopwatch: "Kronometre Pro",
            countdown: "Hassas Geri Sayım",
            multi_timer: "Çoklu Zamanlayıcı",
            add_timer: "Yeni Zamanlayıcı Ekle",
            set_time: "SÜREYİ AYARLA",
            time_machine_sim: "Simülasyon Motoru",
            time_machine: "Zaman Kayması (Zaman Makinesi)",
            speed_sim: "Çalışma Hızı Simülasyonu",
            offset_hours: "Zaman Kayması (Saat)",
            calculators: "Hesaplayıcılar / Matematik",
            age_calc: "Yaş & Dönüm Noktası",
            birth_date: "Doğum Tarihi",
            target_date: "Hedef Etkinlik Geri Sayımı",

            tz_utc: "UTC (Greenwich)",
            tz_ny: "New York (EST/EDT)",
            tz_london: "Londra (GMT/BST)",
            tz_ist: "İstanbul (TRT)",
            tz_tokyo: "Tokyo (JST)",
            tz_dubai: "Dubai (GST)",
            tz_sydney: "Sidney (AEST/AEDT)",
            tz_la: "Los Angeles (PST/PDT)",
            tz_paris: "Paris (CET/CEST)",
            tz_shanghai: "Şangay (CST)",

            // Sun/Moon
            sunrise: "Gün Doğumu",
            sunset: "Gün Batımı",
            new_moon: "Yeni Ay",
            waxing_crescent: "Hilal (Büyüyen)",
            first_quarter: "İlk Dördün",
            waxing_gibbous: "Şişkin Ay (Büyüyen)",
            full_moon: "Dolunay",
            waning_gibbous: "Şişkin Ay (Küçülen)",
            last_quarter: "Son Dördün",
            waning_crescent: "Hilal (Küçülen)",

            // Clock & Utils
            day_label: "Gün",
            offset_hours: "saat",
            main_clock_title: "Ana Saat",
            set_main_clock_title: "Ana Saat Yap",
            remove_title: "Kaldır",
            analog_title: "ANALOG",
            years_label: "yıl",
            months_label: "ay",
            hours_today: "saat (bugün)",
            total_days_lived: "toplam gün yaşandı",
            speak_time_prefix: "Saat",
            speak_am: "öğleden önce",
            speak_pm: "öğleden sonra",
            city_name: "Şehir",

            // Dynamic Labels
            lap: "Tur",
            timer: "Zamanlayıcı",
            target_reached: "Süre Doldu!",
            day_short: "g",
            hour_short: "s",
            minute_short: "dk",
            second_short: "sn",
            snooze_btn: "5dk Ertele",
            dismiss_btn: "Kapat",
            no_alarms: "Aktif alarm yok",
            snoozed_label: "Ertelendi",
            monday_short: "Pzt",
            tuesday_short: "Sal",
            wednesday_short: "Çar",
            thursday_short: "Per",
            friday_short: "Cum",
            saturday_short: "Cmt",
            sunday_short: "Paz"
        }
    };

    /** Get translation from ADV dict, fallback to base languageManager */
    function advT(key) {
        const lang = (global.store && global.store.get('language')) || 'en';
        const dict = ADV_TRANSLATIONS[lang] || ADV_TRANSLATIONS['en'];
        return dict[key] || key;
    }

    /* ── Export ── */
    global.FCSettings = new AdvancedSettingsStore();
    global.FCAdvT = advT;
    global.ADV_TRANSLATIONS = ADV_TRANSLATIONS;

})(window);
