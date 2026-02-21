/**
 * advanced.js — Advanced & Extra Features
 * Depends on: utils.js, settings.js, clock.js, timer.js, alarm.js
 * Namespace: window.FCAdvanced
 */
(function (global) {
    'use strict';

    const U = global.FCUtils;
    const S = global.FCSettings;

    /* ═══════════════════════════════════════════════════════
       1. Sun & Moon Info
       ═══════════════════════════════════════════════════════ */
    class SunMoonPanel {
        constructor() {
            this.el = document.getElementById('fc-adv-sunmoon');
            this._interval = null;
            this._lat = null;
            this._lng = null;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'sunMoonEnabled') this._apply();
            });
        }

        _apply() {
            if (!this.el) return;
            const on = S.get('sunMoonEnabled');
            this.el.style.display = on ? 'block' : 'none';

            if (on) {
                this._getLocation();
                if (!this._interval) this._interval = setInterval(() => this._render(), 60000);
            } else {
                clearInterval(this._interval);
                this._interval = null;
            }
        }

        _getLocation() {
            if (!navigator.geolocation) {
                // Fallback: Istanbul
                this._lat = 41.0; this._lng = 28.9;
                this._render();
                return;
            }
            navigator.geolocation.getCurrentPosition(
                pos => {
                    this._lat = pos.coords.latitude;
                    this._lng = pos.coords.longitude;
                    this._render();
                },
                () => {
                    this._lat = 41.0; this._lng = 28.9; // Istanbul fallback
                    this._render();
                },
                { timeout: 5000 }
            );
        }

        _render() {
            if (!this.el || this._lat === null) return;
            const today = new Date();
            const sun = U.getSunriseSunset(this._lat, this._lng, today);
            const moon = U.getMoonPhase(today);

            const fmtTime = (d) => d ? `${U.pad(d.getHours())}:${U.pad(d.getMinutes())}` : '--:--';

            this.el.innerHTML = `
              <div class="fc-adv-sunmoon-row">
                  <span class="fc-adv-sunmoon-icon">🌅</span>
                  <span class="fc-adv-sunmoon-val">${fmtTime(sun.sunrise)}</span>
                  <span class="fc-adv-sunmoon-lbl">${global.FCAdvT('sunrise') || 'Sunrise'}</span>
                </div>
                <div class="fc-adv-sunmoon-item">
                  <span class="fc-adv-sunmoon-icon">🌇</span>
                  <span class="fc-adv-sunmoon-val">${fmtTime(sun.sunset)}</span>
                  <span class="fc-adv-sunmoon-lbl">${global.FCAdvT('sunset') || 'Sunset'}</span>
                </div>
                <div class="fc-adv-sunmoon-item">
                  <span class="fc-adv-sunmoon-icon">${moon.emoji}</span>
                  <span class="fc-adv-sunmoon-val">${Math.round(moon.phase * 100)}%</span>
                  <span class="fc-adv-sunmoon-lbl">${global.FCAdvT(moon.name.toLowerCase().replace(/\s+/g, '_')) || moon.name}</span>
                </div>
              </div>`;
        }
    }

    /* ═══════════════════════════════════════════════════════
       2. Auto Timezone Detection
       ═══════════════════════════════════════════════════════ */
    class AutoTimezone {
        constructor() {
            this._detected = U.detectTimezone();
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'autoTimezone') this._apply();
            });
        }

        _apply() {
            const on = S.get('autoTimezone');
            const el = document.getElementById('fc-adv-tz-display');
            if (el) {
                el.textContent = this._detected;
                el.style.display = on ? 'inline-block' : 'none';
            }
        }

        getTimezone() { return this._detected; }
    }

    /* ═══════════════════════════════════════════════════════
       3. NTP Synchronization (simulated)
       ═══════════════════════════════════════════════════════ */
    class NTPSync {
        constructor() {
            this._syncedAt = null;
            this._offset = 0; // ms
            this._interval = null;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'ntpSyncEnabled') this._apply();
            });
        }

        _apply() {
            clearInterval(this._interval);
            this._interval = null;

            if (S.get('ntpSyncEnabled')) {
                this._sync();
                this._interval = setInterval(() => this._sync(), 5 * 60 * 1000); // every 5 min
            }

            const el = document.getElementById('fc-adv-ntp-status');
            if (el) el.style.display = S.get('ntpSyncEnabled') ? 'block' : 'none';
        }

        _sync() {
            // Simulate NTP: measure round-trip of fetch to a tiny endpoint
            // Since we can't reach a real NTP server in-browser, we use
            // the browser's own clock but show the "last synced" indicator.
            const t0 = performance.now();
            fetch('https://worldtimeapi.org/api/timezone/UTC', { cache: 'no-store', mode: 'cors' })
                .then(r => r.json())
                .then(data => {
                    const t1 = performance.now();
                    const rtt = t1 - t0;
                    const serverMs = new Date(data.utc_datetime).getTime();
                    this._offset = serverMs - (Date.now() - rtt / 2);
                    this._syncedAt = new Date();
                    this._updateUI(true);
                })
                .catch(() => {
                    // Fallback: mark as synced with local time
                    this._syncedAt = new Date();
                    this._updateUI(false);
                });
        }

        _updateUI(success) {
            const el = document.getElementById('fc-adv-ntp-status');
            if (!el) return;
            const t = this._syncedAt ? `${U.pad(this._syncedAt.getHours())}:${U.pad(this._syncedAt.getMinutes())}` : '--';
            el.innerHTML = `<span class="fc-adv-chip${success ? ' fc-adv-chip-ok' : ' fc-adv-chip-warn'}">
              ${success ? '✓' : '⚠'} NTP ${t}</span>`;
        }

        getNow() {
            return new Date(Date.now() + this._offset);
        }
    }

    /* ═══════════════════════════════════════════════════════
       4. Performance Mode
       ═══════════════════════════════════════════════════════ */
    class PerformanceManager {
        constructor() {
            this._apply();
            document.addEventListener('fcAdvSettingChanged', e => {
                if (['performanceMode', 'animationSpeed'].includes(e.detail.key)) this._apply();
            });
        }

        _apply() {
            const perf = S.get('performanceMode');
            const speed = parseFloat(S.get('animationSpeed')) || 1.0;

            // CSS variable for flip speed (syncs with existing --flip-speed)
            document.documentElement.style.setProperty(
                '--flip-speed',
                perf ? '0s' : `${0.6 / speed}s`
            );

            // Body class for reduced motion
            document.body.classList.toggle('fc-adv-perf', perf);
        }
    }

    /* ═══════════════════════════════════════════════════════
       5. Design Manager
          Handles the advanced clock designs (Glass, Matrix etc)
       ═══════════════════════════════════════════════════════ */
    class DesignManager {
        constructor() {
            this.container = document.getElementById('clock-container');
            this.gallery = document.getElementById('fc-adv-design-gallery');
            this._apply();
            this._setupGallery();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'advancedDesign') {
                    this._apply();
                    this._updateGalleryUI();
                }
            });
        }

        _setupGallery() {
            if (!this.gallery) return;
            this.gallery.addEventListener('click', e => {
                const card = e.target.closest('.fc-adv-design-card');
                if (card) {
                    const design = card.dataset.design;
                    S.set('advancedDesign', design);
                }
            });
            this._updateGalleryUI();
        }

        _updateGalleryUI() {
            if (!this.gallery) return;
            const design = S.get('advancedDesign') || 'default';
            this.gallery.querySelectorAll('.fc-adv-design-card').forEach(card => {
                card.classList.toggle('active', card.dataset.design === design);
            });
        }

        _apply() {
            if (!this.container) return;
            const design = S.get('advancedDesign') || 'default';

            // Remove old design classes
            this.container.classList.remove('adv-design-glass', 'adv-design-phantom', 'adv-design-brutalist', 'adv-design-matrix', 'adv-design-neon');

            // Add new one if not default
            if (design !== 'default') {
                this.container.classList.add(`adv-design-${design}`);
            }

            // Custom logic for matrix (can be extended)
            if (design === 'matrix' && global.FCAdvanced && global.FCAdvanced.matrixEffect) {
                global.FCAdvanced.matrixEffect.start();
            }
        }
    }

    /* ═══════════════════════════════════════════════════════
       5. Settings Panel UI Controller
          Wires all Advanced Settings toggles in the drawer
       ═══════════════════════════════════════════════════════ */
    class AdvancedSettingsUI {
        constructor() {
            this._init();

            // Re-apply language strings when language changes
            document.addEventListener('settingChanged', e => {
                if (e.detail.key === 'language') this._updateLabels();
            });
        }

        _init() {
            this._bindToggles();
            this._bindInputs();
            this._syncAllToggles();
            this._updateLabels();
        }

        /** Map of element-id → FCSettings key */
        _toggleMap() {
            return {
                'fc-set-ms': 'showMilliseconds',
                'fc-set-utc': 'showUTC',
                'fc-set-weeknum': 'showWeekNumber',
                'fc-set-dayofyear': 'showDayOfYear',
                'fc-set-timebg': 'timeBgAuto',
                'fc-set-worldclocks': 'worldClocksEnabled',
                'fc-set-binary': 'binaryClockEnabled',
                'fc-set-analog': 'analogOverlayEnabled',
                'fc-set-voice': 'voiceReadEnabled',
                'fc-set-sunmoon': 'sunMoonEnabled',
                'fc-set-autotz': 'autoTimezone',
                'fc-set-ntp': 'ntpSyncEnabled',
                'fc-set-spedsim': 'speedSimEnabled',
                'fc-set-agecalc': 'ageCalcEnabled',
                'fc-set-timemachine': 'timeMachineEnabled',
                'fc-set-perf': 'performanceMode',
                'fc-set-alarm-vib': 'alarmVibrate',
                'fc-set-stopwatch': 'stopwatchEnabled',
                'fc-set-countdown': 'countdownEnabled',
                'fc-set-multitimer': 'multiTimerEnabled',
                'fc-set-targetdate': 'targetDateEnabled',
            };
        }

        _inputMap() {
            return {
                'fc-set-voice-interval': { key: 'voiceReadInterval', type: 'number' },
                'fc-set-speed-mult': { key: 'speedMultiplier', type: 'float' },
                'fc-set-anim-speed': { key: 'animationSpeed', type: 'float' },
                'fc-set-age-dob': { key: 'ageCalcDob', type: 'text' },
                'fc-set-target-date': { key: 'targetDate', type: 'text' },
                'fc-set-tm-offset': { key: 'timeMachineOffset', type: 'number' },
            };
        }

        _bindToggles() {
            const map = this._toggleMap();
            Object.entries(map).forEach(([id, key]) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('change', () => S.set(key, el.checked));
            });

            // Special: Alarm Repeat Toggle
            const repeatSelect = document.getElementById('fc-adv-alarm-repeat');
            const weekdayRow = document.getElementById('fc-adv-alarm-weekdays');
            if (repeatSelect && weekdayRow) {
                repeatSelect.addEventListener('change', () => {
                    weekdayRow.style.display = repeatSelect.value === 'weekly' ? 'flex' : 'none';
                });
            }

            // Special: Weekday Buttons
            document.querySelectorAll('.fc-adv-weekday-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.classList.toggle('active');
                });
            });
        }

        _bindInputs() {
            const map = this._inputMap();
            Object.entries(map).forEach(([id, { key, type }]) => {
                const el = document.getElementById(id);
                if (!el) return;
                const evt = el.tagName === 'SELECT' ? 'change' : 'input';
                el.addEventListener(evt, () => {
                    let val = el.value;
                    if (type === 'number') val = parseInt(val) || 0;
                    if (type === 'float') val = parseFloat(val) || 1;
                    S.set(key, val);
                });
            });
        }

        _syncAllToggles() {
            const tmap = this._toggleMap();
            Object.entries(tmap).forEach(([id, key]) => {
                const el = document.getElementById(id);
                if (el) el.checked = !!S.get(key);
            });

            const imap = this._inputMap();
            Object.entries(imap).forEach(([id, { key }]) => {
                const el = document.getElementById(id);
                if (el) el.value = S.get(key);
            });
        }

        _updateLabels() {
            document.querySelectorAll('[data-fc-i18n]').forEach(el => {
                const key = el.getAttribute('data-fc-i18n');
                el.textContent = global.FCAdvT(key);
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       6. Panel visibility (stopwatch / countdown etc.)
       ═══════════════════════════════════════════════════════ */
    class PanelVisibility {
        constructor() {
            this._panelMap = {
                'stopwatchEnabled': 'fc-adv-panel-stopwatch',
                'countdownEnabled': 'fc-adv-panel-countdown',
                'multiTimerEnabled': 'fc-adv-panel-multitimer',
                'targetDateEnabled': 'fc-adv-panel-targetdate',
                'binaryClockEnabled': 'fc-adv-binary',
                'analogOverlayEnabled': 'fc-adv-analog',
                'speedSimEnabled': 'fc-adv-panel-speedsim',
                'ageCalcEnabled': 'fc-adv-age-result',
                'timeMachineEnabled': 'fc-adv-panel-timemachine',
                'sunMoonEnabled': 'fc-adv-sunmoon',
            };
            this._syncAll();

            document.addEventListener('fcAdvSettingChanged', e => {
                const panelId = this._panelMap[e.detail.key];
                if (!panelId) return;
                const el = document.getElementById(panelId);
                if (el) el.style.display = e.detail.value ? '' : 'none';
            });
        }

        _syncAll() {
            Object.entries(this._panelMap).forEach(([key, panelId]) => {
                const el = document.getElementById(panelId);
                if (el) el.style.display = S.get(key) ? '' : 'none';
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       7. World Clock Add/Remove UI
       ═══════════════════════════════════════════════════════ */
    function initWorldClockUI() {
        const btnAdd = document.getElementById('fc-adv-world-add');
        const cityInp = document.getElementById('fc-adv-world-city');
        const tzSelect = document.getElementById('fc-adv-world-tz');

        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                const city = (cityInp && cityInp.value.trim()) || global.FCAdvT('city_name') || 'City';
                const tz = (tzSelect && tzSelect.value) || 'UTC';
                S.addWorldClock(city, tz);
                if (cityInp) cityInp.value = '';
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       8. Alarm Add Logic (supports refined UI)
       ═══════════════════════════════════════════════════════ */
    function initAlarmAddUI() {
        const btnAdd = document.getElementById('fc-adv-alarm-add');
        const timeInp = document.getElementById('fc-adv-alarm-time');
        const labelInp = document.getElementById('fc-adv-alarm-label');
        const repeatInp = document.getElementById('fc-adv-alarm-repeat');

        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                if (!timeInp || !timeInp.value) return;

                const days = [];
                if (repeatInp.value === 'weekly') {
                    document.querySelectorAll('.fc-adv-weekday-btn.active').forEach(btn => {
                        days.push(parseInt(btn.dataset.day));
                    });
                }

                S.addAlarm({
                    time: timeInp.value,
                    label: (labelInp && labelInp.value) || global.FCAdvT('tab_alarms') || 'Alarm',
                    repeat: repeatInp.value,
                    days: days
                });

                // Reset
                if (labelInp) labelInp.value = '';
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       9. Time Machine offset display
       ═══════════════════════════════════════════════════════ */
    function initTimeMachineUI() {
        const slider = document.getElementById('fc-set-tm-offset');
        const display = document.getElementById('tm-offset-val');

        if (slider) {
            slider.addEventListener('input', () => {
                const v = parseInt(slider.value) || 0;
                S.set('timeMachineOffset', v);
                if (display) display.textContent = (v >= 0 ? '+' : '') + v + ' ' + (global.FCAdvT('offset_hours') || 'hours');
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       9. Language Sync for Advanced panels
       ═══════════════════════════════════════════════════════ */
    function syncAdvancedLang() {
        const lang = (global.store && global.store.get('language')) || 'en';
        const dict = global.ADV_TRANSLATIONS && (global.ADV_TRANSLATIONS[lang] || global.ADV_TRANSLATIONS['en']);
        if (!dict) return;

        // Text content
        document.querySelectorAll('[data-fc-i18n]').forEach(el => {
            const key = el.getAttribute('data-fc-i18n');
            if (dict[key]) el.textContent = dict[key];
        });

        // Title tooltips
        document.querySelectorAll('[data-fc-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-fc-i18n-title');
            if (dict[key]) el.title = dict[key];
        });
    }

    /* ═══════════════════════════════════════════════════════
       INITIALIZE ALL
       ═══════════════════════════════════════════════════════ */
    function init() {
        const sunMoon = new SunMoonPanel();
        const autoTz = new AutoTimezone();
        const ntp = new NTPSync();
        const perfMgr = new PerformanceManager();
        const designMgr = new DesignManager();
        const settingsUI = new AdvancedSettingsUI();
        const panelVis = new PanelVisibility();

        initWorldClockUI();
        initAlarmAddUI();
        initTimeMachineUI();
        syncAdvancedLang();

        document.addEventListener('settingChanged', e => {
            if (e.detail.key === 'language') syncAdvancedLang();
        });

        global.FCAdvanced = { sunMoon, autoTz, ntp, perfMgr, designMgr, settingsUI, panelVis };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window);
