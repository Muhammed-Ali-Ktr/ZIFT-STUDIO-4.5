/**
 * utils.js — Shared Utilities for Advanced Flip Clock
 * All functions are pure / side-effect-free unless noted.
 * Namespace: window.FCUtils
 */
(function (global) {
    'use strict';

    const FCUtils = {};

    /* ─── String / Number ─────────────────────────────────── */

    /** Zero-pad a number to at least `width` digits */
    FCUtils.pad = (n, width = 2) => String(n).padStart(width, '0');

    /** Format seconds → HH:MM:SS */
    FCUtils.formatDuration = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${FCUtils.pad(h)}:${FCUtils.pad(m)}:${FCUtils.pad(s)}`;
    };

    /** Format milliseconds → MM:SS.mmm */
    FCUtils.formatStopwatch = (totalMs) => {
        const ms = totalMs % 1000;
        const s = Math.floor(totalMs / 1000) % 60;
        const m = Math.floor(totalMs / 60000) % 60;
        const h = Math.floor(totalMs / 3600000);
        if (h > 0) return `${FCUtils.pad(h)}:${FCUtils.pad(m)}:${FCUtils.pad(s)}.${FCUtils.pad(Math.floor(ms / 10))}`;
        return `${FCUtils.pad(m)}:${FCUtils.pad(s)}.${FCUtils.pad(Math.floor(ms / 10))}`;
    };

    /* ─── Date Calculations ───────────────────────────────── */

    /** ISO 8601 Week Number */
    FCUtils.getWeekNumber = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    /** Day of the year (1-366) */
    FCUtils.getDayOfYear = (date) => {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / 86400000);
    };

    /** Age calculation from a date of birth */
    FCUtils.calcAge = (dob) => {
        const now = new Date();
        const birth = new Date(dob);
        if (isNaN(birth)) return null;

        const diffMs = now - birth;
        const totalDays = Math.floor(diffMs / 86400000);
        const years = Math.floor(totalDays / 365.25);
        const remainDays = totalDays - Math.floor(years * 365.25);
        const months = Math.floor(remainDays / 30.44);
        const days = Math.floor(remainDays - months * 30.44);
        const hours = Math.floor((diffMs % 86400000) / 3600000);

        return { years, months, days, hours, totalDays };
    };

    /* ─── World Time ──────────────────────────────────────── */

    /** Get a Date object adjusted to a specific IANA timezone */
    FCUtils.getWorldTime = (timezone) => {
        try {
            const now = new Date();
            const formatted = now.toLocaleString('en-US', { timeZone: timezone });
            return new Date(formatted);
        } catch {
            return new Date();
        }
    };

    /** Get UTC offset string like "+03:00" */
    FCUtils.getUTCOffset = (timezone) => {
        try {
            const now = new Date();
            const utcOffset = now.toLocaleString('en-US', {
                timeZone: timezone,
                timeZoneName: 'short'
            }).split(' ').pop();
            return utcOffset;
        } catch {
            return 'UTC';
        }
    };

    /* ─── Moon Phase ──────────────────────────────────────── */

    /**
     * Returns moon phase info for a given date.
     * Uses J.Meeus algorithm (simplified).
     * @returns {{ emoji: string, name: string, phase: number }}
     */
    FCUtils.getMoonPhase = (date = new Date()) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Julian Day Number
        let Y = year, M = month;
        if (M <= 2) { Y--; M += 12; }
        const A = Math.floor(Y / 100);
        const B = 2 - A + Math.floor(A / 4);
        const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5;

        // Days since known new moon (Jan 6 2000 was a new moon → JD 2451549.5)
        const daysSince = JD - 2451549.5;
        const synodic = 29.53058867;
        const phase = ((daysSince % synodic) + synodic) % synodic;
        const fraction = phase / synodic;

        const phases = [
            { min: 0, max: 0.033, emoji: '🌑', name: 'New Moon' },
            { min: 0.033, max: 0.25, emoji: '🌒', name: 'Waxing Crescent' },
            { min: 0.25, max: 0.283, emoji: '🌓', name: 'First Quarter' },
            { min: 0.283, max: 0.5, emoji: '🌔', name: 'Waxing Gibbous' },
            { min: 0.5, max: 0.533, emoji: '🌕', name: 'Full Moon' },
            { min: 0.533, max: 0.75, emoji: '🌖', name: 'Waning Gibbous' },
            { min: 0.75, max: 0.783, emoji: '🌗', name: 'Last Quarter' },
            { min: 0.783, max: 1, emoji: '🌘', name: 'Waning Crescent' },
        ];

        const p = phases.find(p => fraction >= p.min && fraction < p.max) || phases[0];
        return { emoji: p.emoji, name: p.name, phase: fraction };
    };

    /* ─── Sunrise / Sunset ────────────────────────────────── */

    /**
     * NOAA simplified sunrise/sunset algorithm.
     * @param {number} lat  Latitude in degrees
     * @param {number} lng  Longitude in degrees
     * @param {Date}   date
     * @returns {{ sunrise: Date|null, sunset: Date|null }}
     */
    FCUtils.getSunriseSunset = (lat, lng, date = new Date()) => {
        const toRad = d => d * Math.PI / 180;
        const toDeg = r => r * 180 / Math.PI;

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Julian Date
        let Y = year, M = month;
        if (M <= 2) { Y--; M += 12; }
        const A = Math.floor(Y / 100);
        const B = 2 - A + Math.floor(A / 4);
        const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5;

        const n = JD - 2451545.0 + 0.5;
        const L = (280.46 + 0.9856474 * n) % 360;
        const g = toRad((357.528 + 0.9856003 * n) % 360);
        const lam = toRad(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));
        const sinDec = Math.sin(toRad(23.439)) * Math.sin(lam);
        const dec = Math.asin(sinDec);

        const cosHA = (Math.cos(toRad(90.833)) - Math.sin(toRad(lat)) * sinDec)
            / (Math.cos(toRad(lat)) * Math.cos(dec));

        if (cosHA < -1 || cosHA > 1) {
            // Midnight sun or polar night
            return { sunrise: null, sunset: null };
        }

        const HA = toDeg(Math.acos(cosHA));
        const transit = 12 + (lng < 0 ? -lng : -lng) / 15;

        const sunriseH = transit - HA / 15;
        const sunsetH = transit + HA / 15;

        const toDate = (h) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            d.setMinutes(d.getMinutes() + h * 60);
            return d;
        };

        return { sunrise: toDate(sunriseH), sunset: toDate(sunsetH) };
    };

    /* ─── Browser APIs ────────────────────────────────────── */

    /** Speak text using Web Speech API */
    FCUtils.speak = (text, lang = 'en-US') => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 0.95;
        utter.pitch = 1;
        window.speechSynthesis.speak(utter);
    };

    /** Speak current time */
    FCUtils.speakTime = (h, m, lang = 'en-US') => {
        const am = global.FCAdvT('speak_am') || 'AM';
        const pm = global.FCAdvT('speak_pm') || 'PM';
        const period = h >= 12 ? pm : am;
        const h12 = h % 12 || 12;
        const prefix = global.FCAdvT('speak_time_prefix') || 'The time is';
        const text = lang.startsWith('tr')
            ? `${prefix} ${h12} ${m === 0 ? '' : m} ${period}`
            : `${prefix} ${h12}:${FCUtils.pad(m)} ${period}`;
        FCUtils.speak(text, lang);
    };

    /** Vibrate device (if supported) */
    FCUtils.vibrate = (pattern = [200, 100, 200]) => {
        if ('vibrate' in navigator) navigator.vibrate(pattern);
    };

    /** Detect user's IANA timezone */
    FCUtils.detectTimezone = () => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        } catch {
            return 'UTC';
        }
    };

    /* ─── Time of Day ─────────────────────────────────────── */

    /**
     * Returns the time-of-day category for background theming.
     * @returns {'night'|'dawn'|'morning'|'afternoon'|'dusk'|'evening'}
     */
    FCUtils.getTimeOfDay = (date = new Date()) => {
        const h = date.getHours() + date.getMinutes() / 60;
        if (h < 5) return 'night';
        if (h < 7) return 'dawn';
        if (h < 12) return 'morning';
        if (h < 17) return 'afternoon';
        if (h < 19) return 'dusk';
        if (h < 22) return 'evening';
        return 'night';
    };

    /* ─── Binary Clock ────────────────────────────────────── */

    /**
     * Convert a decimal number to an array of bits (MSB first), padded to `bits` length.
     */
    FCUtils.decToBits = (n, bits = 6) => {
        const arr = [];
        for (let i = bits - 1; i >= 0; i--) {
            arr.push((n >> i) & 1);
        }
        return arr;
    };

    /* ─── Unique ID ───────────────────────────────────────── */
    FCUtils.uid = () => `fc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    /* ─── Exports ─────────────────────────────────────────── */
    global.FCUtils = FCUtils;

})(window);
