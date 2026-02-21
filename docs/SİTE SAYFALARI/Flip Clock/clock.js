/**
 * clock.js — Advanced Clock Features
 * Depends on: utils.js, settings.js (must load first)
 * Namespace: window.FCClock
 */
(function (global) {
    'use strict';

    const U = global.FCUtils;
    const S = global.FCSettings;

    /* ═══════════════════════════════════════════════════════
       1. Millisecond Display
       ═══════════════════════════════════════════════════════ */
    class MillisecondDisplay {
        constructor() {
            this.el = this._createEl();
            this._raf = null;
            this._apply();
            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'showMilliseconds') this._apply();
            });
        }

        _createEl() {
            let el = document.getElementById('fc-adv-ms');
            if (!el) {
                el = document.createElement('div');
                el.id = 'fc-adv-ms';
                el.className = 'fc-adv-ms-display';
                const cc = document.getElementById('clock-container');
                if (cc) cc.insertAdjacentElement('afterend', el);
            }
            return el;
        }

        _apply() {
            const on = S.get('showMilliseconds');
            this.el.style.display = on ? 'block' : 'none';
            if (on) this._start();
            else this._stop();
        }

        _start() {
            const tick = () => {
                this.el.textContent = '.' + String(Date.now() % 1000).padStart(3, '0').slice(0, 2);
                this._raf = requestAnimationFrame(tick);
            };
            if (!this._raf) tick();
        }

        _stop() {
            cancelAnimationFrame(this._raf);
            this._raf = null;
        }
    }

    /* ═══════════════════════════════════════════════════════
       2. UTC / Extra Info Bar
       ═══════════════════════════════════════════════════════ */
    class InfoBar {
        constructor() {
            this.el = this._createEl();
            this._interval = null;
            this._apply();

            const keys = ['showUTC', 'showWeekNumber', 'showDayOfYear'];
            document.addEventListener('fcAdvSettingChanged', e => {
                if (keys.includes(e.detail.key)) this._apply();
            });
        }

        _createEl() {
            let el = document.getElementById('fc-adv-infobar');
            if (!el) {
                el = document.createElement('div');
                el.id = 'fc-adv-infobar';
                el.className = 'fc-adv-infobar';
                const topBar = document.getElementById('top-bar');
                if (topBar) topBar.insertAdjacentElement('afterend', el);
            }
            return el;
        }

        _apply() {
            const showUTC = S.get('showUTC');
            const showWeek = S.get('showWeekNumber');
            const showDOY = S.get('showDayOfYear');
            const any = showUTC || showWeek || showDOY;

            this.el.style.display = any ? 'flex' : 'none';
            if (any) {
                this._update();
                if (!this._interval) this._interval = setInterval(() => this._update(), 1000);
            } else {
                clearInterval(this._interval);
                this._interval = null;
            }
        }

        _update() {
            const now = new Date();
            const parts = [];

            if (S.get('showUTC')) {
                const utcH = U.pad(now.getUTCHours());
                const utcM = U.pad(now.getUTCMinutes());
                const utcS = U.pad(now.getUTCSeconds());
                parts.push(`<span class="fc-adv-chip">UTC ${utcH}:${utcM}:${utcS}</span>`);
            }
            if (S.get('showWeekNumber')) {
                parts.push(`<span class="fc-adv-chip">W${U.pad(U.getWeekNumber(now))}</span>`);
            }
            if (S.get('showDayOfYear')) {
                parts.push(`<span class="fc-adv-chip">${global.FCAdvT('day_label') || 'Day'} ${U.getDayOfYear(now)}</span>`);
            }

            this.el.innerHTML = parts.join('');
        }
    }

    /* ═══════════════════════════════════════════════════════
       3. World Clocks Panel
       ═══════════════════════════════════════════════════════ */
    class WorldClocks {
        constructor() {
            this.container = document.getElementById('fc-adv-world-panel');
            this._interval = null;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (['worldClocksEnabled', 'worldClocks'].includes(e.detail.key)) this._apply();
            });
        }

        _apply() {
            if (!this.container) return;
            const on = S.get('worldClocksEnabled');
            this.container.style.display = on ? 'block' : 'none';
            if (on) {
                this._render();
                if (!this._interval) this._interval = setInterval(() => this._render(), 1000);
            } else {
                clearInterval(this._interval);
                this._interval = null;
            }
        }

        _render() {
            if (!this.container) return;
            const clocks = S.get('worldClocks') || [];
            const list = this.container.querySelector('.fc-adv-world-list');
            if (!list) return;

            list.innerHTML = '';
            clocks.forEach((c, i) => {
                const t = U.getWorldTime(c.tz);
                const isPrimary = c.tz === S.get('primaryWorldClock');

                const div = document.createElement('div');
                div.className = `fc-adv-list-item ${isPrimary ? 'fc-adv-item-primary' : ''}`;
                div.innerHTML = `
                   <div style="display:flex; align-items:center; gap:0.8rem;">
                       <div style="font-family:var(--font-clock); font-size:1.4rem; color:var(--accent-color); min-width:85px;">
                          ${U.pad(t.getHours())}:${U.pad(t.getMinutes())}<small style="font-size:0.65rem; opacity:0.5; margin-left:0.2rem;">${U.pad(t.getSeconds())}</small>
                       </div>
                       <div>
                          <div style="font-weight:600; font-size:0.85rem;">${c.city}</div>
                          <div style="font-size:0.7rem; opacity:0.5; text-transform:uppercase; letter-spacing:0.5px;">${c.tz.split('/').pop().replace('_', ' ')}</div>
                       </div>
                   </div>
                   <div style="display:flex; align-items:center; gap:0.8rem;">
                      <button class="fc-adv-world-main-btn" data-index="${i}" title="${isPrimary ? (global.FCAdvT('main_clock_title') || 'Main Clock') : (global.FCAdvT('set_main_clock_title') || 'Set as Main Clock')}" style="background:none; border:none; color:${isPrimary ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)'}; cursor:pointer; font-size:1.2rem;">
                         <i class="${isPrimary ? 'ph-fill ph-star' : 'ph ph-star'}"></i>
                      </button>
                      <button class="fc-adv-world-remove" data-index="${i}" title="${global.FCAdvT('remove_title') || 'Remove'}" style="background:none; border:none; color:#ff5252; cursor:pointer; opacity:0.5; font-size:1.1rem;"><i class="ph ph-x-circle"></i></button>
                   </div>`;
                list.appendChild(div);
            });

            // Action buttons
            this.container.querySelectorAll('.fc-adv-world-main-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const clocks = S.get('worldClocks') || [];
                    const tz = clocks[parseInt(btn.dataset.index)]?.tz;
                    if (tz) S.set('primaryWorldClock', S.get('primaryWorldClock') === tz ? 'local' : tz);
                });
            });

            this.container.querySelectorAll('.fc-adv-world-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    S.removeWorldClock(parseInt(btn.dataset.index));
                });
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       4. Binary Clock
       ═══════════════════════════════════════════════════════ */
    class BinaryClock {
        constructor() {
            this.el = document.getElementById('fc-adv-binary');
            this._interval = null;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'binaryClockEnabled') this._apply();
            });
        }

        _apply() {
            if (!this.el) return;
            const on = S.get('binaryClockEnabled');
            this.el.style.display = on ? 'block' : 'none';
            if (on) {
                this._render();
                if (!this._interval) this._interval = setInterval(() => this._render(), 1000);
            } else {
                clearInterval(this._interval);
                this._interval = null;
            }
        }

        _render() {
            if (!this.el) return;
            const now = new Date();
            const values = [
                Math.floor(now.getHours() / 10),
                now.getHours() % 10,
                Math.floor(now.getMinutes() / 10),
                now.getMinutes() % 10,
                Math.floor(now.getSeconds() / 10),
                now.getSeconds() % 10
            ];
            const maxBits = [2, 4, 3, 4, 3, 4]; // BCD bit widths

            this.el.innerHTML = `
              <div class="fc-adv-binary-label">H</div>
              <div class="fc-adv-binary-label">H</div>
              <div class="fc-adv-binary-label">M</div>
              <div class="fc-adv-binary-label">M</div>
              <div class="fc-adv-binary-label">S</div>
              <div class="fc-adv-binary-label">S</div>
              ${values.map((val, ci) => {
                const bits = U.decToBits(val, maxBits[ci]);
                return bits.map(b =>
                    `<div class="fc-adv-binary-dot${b ? ' on' : ''}"></div>`
                ).join('');
            }).join('')}
            `;
        }
    }

    /* ═══════════════════════════════════════════════════════
       5. Analog Clock Overlay
       ═══════════════════════════════════════════════════════ */
    class AnalogClock {
        constructor() {
            this.el = document.getElementById('fc-adv-analog');
            this._interval = null;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'analogOverlayEnabled') this._apply();
            });
        }

        _apply() {
            if (!this.el) return;
            const on = S.get('analogOverlayEnabled');
            this.el.style.display = on ? 'block' : 'none';
            if (on) {
                this._render();
                if (!this._interval) this._interval = setInterval(() => this._render(), 1000);
            } else {
                clearInterval(this._interval);
                this._interval = null;
            }
        }

        _render() {
            if (!this.el) return;
            const now = new Date();
            const h = now.getHours() % 12 + now.getMinutes() / 60;
            const m = now.getMinutes() + now.getSeconds() / 60;
            const s = now.getSeconds();

            const hDeg = h * 30;
            const mDeg = m * 6;
            const sDeg = s * 6;

            this.el.innerHTML = `
              <svg class="fc-adv-analog-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" class="fc-adv-analog-face"/>
                ${[...Array(12)].map((_, i) => {
                const a = (i * 30) * Math.PI / 180;
                const x1 = 50 + 40 * Math.sin(a), y1 = 50 - 40 * Math.cos(a);
                const x2 = 50 + 45 * Math.sin(a), y2 = 50 - 45 * Math.cos(a);
                return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="fc-adv-analog-tick"/>`;
            }).join('')}
                <line x1="50" y1="50"
                      x2="${(50 + 28 * Math.sin(hDeg * Math.PI / 180)).toFixed(1)}"
                      y2="${(50 - 28 * Math.cos(hDeg * Math.PI / 180)).toFixed(1)}"
                      class="fc-adv-analog-hour"/>
                <line x1="50" y1="50"
                      x2="${(50 + 38 * Math.sin(mDeg * Math.PI / 180)).toFixed(1)}"
                      y2="${(50 - 38 * Math.cos(mDeg * Math.PI / 180)).toFixed(1)}"
                      class="fc-adv-analog-minute"/>
                <line x1="50" y1="50"
                      x2="${(50 + 42 * Math.sin(sDeg * Math.PI / 180)).toFixed(1)}"
                      y2="${(50 - 42 * Math.cos(sDeg * Math.PI / 180)).toFixed(1)}"
                      class="fc-adv-analog-second"/>
                <circle cx="50" cy="50" r="3" class="fc-adv-analog-center"/>
              </svg>
              <div class="fc-adv-analog-label">${global.FCAdvT('analog_title') || 'ANALOG'}</div>
            `;
        }
    }

    /* ═══════════════════════════════════════════════════════
       6. Time-of-Day Background
       ═══════════════════════════════════════════════════════ */
    class TimeBgManager {
        constructor() {
            this._current = '';
            this._interval = null;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'timeBgAuto') this._apply();
            });
        }

        _apply() {
            const on = S.get('timeBgAuto');
            if (on) {
                this._update();
                if (!this._interval) this._interval = setInterval(() => this._update(), 60000);
            } else {
                clearInterval(this._interval);
                this._interval = null;
                document.body.classList.remove(
                    'fc-tod-night', 'fc-tod-dawn', 'fc-tod-morning',
                    'fc-tod-afternoon', 'fc-tod-dusk', 'fc-tod-evening'
                );
                this._current = '';
            }
        }

        _update() {
            const tod = U.getTimeOfDay();
            if (tod !== this._current) {
                if (this._current) document.body.classList.remove(`fc-tod-${this._current}`);
                document.body.classList.add(`fc-tod-${tod}`);
                this._current = tod;
            }
        }
    }

    /* ═══════════════════════════════════════════════════════
       7. Voice Time Reading
       ═══════════════════════════════════════════════════════ */
    class VoiceReader {
        constructor() {
            this._interval = null;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (['voiceReadEnabled', 'voiceReadInterval'].includes(e.detail.key)) this._apply();
            });
        }

        _apply() {
            clearInterval(this._interval);
            this._interval = null;

            if (!S.get('voiceReadEnabled')) return;

            const minInterval = (S.get('voiceReadInterval') || 60) * 60 * 1000;
            this._interval = setInterval(() => this._speak(), minInterval);
        }

        _speak() {
            const now = new Date();
            const lang = (global.store && global.store.get('language')) === 'tr' ? 'tr-TR' : 'en-US';
            U.speakTime(now.getHours(), now.getMinutes(), lang);
        }
    }

    /* ═══════════════════════════════════════════════════════
       8. Age Calculator
       ═══════════════════════════════════════════════════════ */
    class AgeCalculator {
        constructor() {
            this.el = document.getElementById('fc-adv-age-result');
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (['ageCalcEnabled', 'ageCalcDob'].includes(e.detail.key)) this._apply();
            });
        }

        _apply() {
            if (!this.el) return;
            const on = S.get('ageCalcEnabled');
            const dob = S.get('ageCalcDob');

            if (on && dob) {
                const age = U.calcAge(dob);
                if (age) {
                    this.el.innerHTML = `
                      <div class="fc-adv-age-card">
                        <div class="fc-adv-age-main">${age.years} <span>${global.FCAdvT('years_label') || 'years'}</span></div>
                        <div class="fc-adv-age-sub">${age.months} ${global.FCAdvT('months_label') || 'months'} • ${age.days} ${global.FCAdvT('days_label') || 'days'} • ${age.hours} ${global.FCAdvT('hours_today') || 'hours today'}</div>
                        <div class="fc-adv-age-total">${age.totalDays.toLocaleString()} ${global.FCAdvT('total_days_lived') || 'total days lived'}</div>
                      </div>`;
                    this.el.style.display = 'block';
                }
            } else {
                this.el.style.display = 'none';
            }
        }
    }

    /* ═══════════════════════════════════════════════════════
       9. Time Machine
       ═══════════════════════════════════════════════════════ */
    class TimeMachine {
        constructor() {
            this._offset = 0; // seconds
            this.active = false;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (e.detail.key === 'timeMachineEnabled') this._apply();
                if (e.detail.key === 'timeMachineOffset') {
                    this._offset = parseInt(e.detail.value) * 3600;
                }
            });
        }

        _apply() {
            this.active = S.get('timeMachineEnabled');
            this._offset = (parseInt(S.get('timeMachineOffset')) || 0) * 3600;
            const indicator = document.getElementById('fc-adv-tm-indicator');
            if (indicator) {
                indicator.style.display = this.active ? 'block' : 'none';
            }
        }

        /** Calculate machine offset only */
        getOffsetMs() {
            return this.active ? this._offset * 1000 : 0;
        }
    }

    /* ═══════════════════════════════════════════════════════
       10. Speed Simulation
       ═══════════════════════════════════════════════════════ */
    class SpeedSimulation {
        constructor() {
            this.multiplier = 1;
            this._startReal = Date.now();
            this._startSim = Date.now();
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (['speedSimEnabled', 'speedMultiplier'].includes(e.detail.key)) this._apply();
            });
        }

        _apply() {
            const on = S.get('speedSimEnabled');
            const mult = parseFloat(S.get('speedMultiplier')) || 1;

            if (on) {
                this._startReal = Date.now();
                this._startSim = Date.now();
                this.multiplier = mult;
            } else {
                this.multiplier = 1;
            }
        }

        getTimeScale() {
            return S.get('speedSimEnabled') ? (parseFloat(S.get('speedMultiplier')) || 1) : 1;
        }

        getSimulatedMs() {
            if (!S.get('speedSimEnabled') || this.multiplier === 1) return 0;
            const elapsed = Date.now() - this._startReal;
            return elapsed * (this.multiplier - 1);
        }
    }

    /* ═══════════════════════════════════════════════════════
       INITIALIZE ALL
       ═══════════════════════════════════════════════════════ */
    function init() {
        const msDisplay = new MillisecondDisplay();
        const infoBar = new InfoBar();
        const worldClocks = new WorldClocks();
        const binaryClock = new BinaryClock();
        const analogClock = new AnalogClock();
        const timeBg = new TimeBgManager();
        const voiceReader = new VoiceReader();
        const ageCalc = new AgeCalculator();
        const timeMachine = new TimeMachine();
        const speedSim = new SpeedSimulation();

        /** 
         * UNIFIED TIME ENGINE
         * Drives script.js TimeKeeper digits
         */
        const getNow = () => {
            let now = new Date();
            const tz = S.get('primaryWorldClock');

            // 1. Timezone Offset
            if (tz && tz !== 'local') {
                now = U.getWorldTime(tz);
            }

            // 2. Time Machine Offset
            const tmOffset = timeMachine.getOffsetMs();
            if (tmOffset) now = new Date(now.getTime() + tmOffset);

            // 3. Speed Simulation
            const simMs = speedSim.getSimulatedMs();
            if (simMs) now = new Date(now.getTime() + simMs);

            return now;
        };

        global.FCClock = {
            msDisplay, infoBar, worldClocks, binaryClock,
            analogClock, timeBg, voiceReader, ageCalc, timeMachine, speedSim,
            getNow
        };
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window);
