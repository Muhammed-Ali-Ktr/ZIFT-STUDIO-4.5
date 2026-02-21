/**
 * timer.js — Advanced Timer Features
 * Depends on: utils.js, settings.js
 * Namespace: window.FCTimer
 */
(function (global) {
    'use strict';

    const U = global.FCUtils;
    const S = global.FCSettings;

    /* ═══════════════════════════════════════════════════════
       1. Stopwatch
       ═══════════════════════════════════════════════════════ */
    class Stopwatch {
        constructor(displayEl, lapsEl) {
            this.display = displayEl;
            this.lapsEl = lapsEl;
            this._startTime = 0;
            this._elapsed = 0;
            this._running = false;
            this._raf = null;
            this._laps = [];
            this._lapStart = 0;
        }

        start() {
            if (this._running) return;
            this._running = true;
            this._startTime = performance.now() - this._elapsed;
            this._lapStart = this._lapStart || performance.now();
            this._tick();
        }

        pause() {
            if (!this._running) return;
            this._running = false;
            cancelAnimationFrame(this._raf);
            this._elapsed = performance.now() - this._startTime;
        }

        toggle() {
            this._running ? this.pause() : this.start();
            return this._running;
        }

        reset() {
            cancelAnimationFrame(this._raf);
            this._running = false;
            this._elapsed = 0;
            this._startTime = 0;
            this._lapStart = 0;
            this._laps = [];
            if (this.display) this.display.textContent = '00:00.00';
            this._renderLaps();
        }

        lap() {
            if (!this._running) return;
            const now = performance.now();
            const total = this._elapsed + (now - this._startTime);
            const lapTime = now - (this._lapStart || this._startTime);
            this._lapStart = now;
            this._laps.push({ n: this._laps.length + 1, total, lap: lapTime });
            this._renderLaps();
        }

        _tick() {
            if (!this._running) return;
            this._elapsed = performance.now() - this._startTime;
            if (this.display) {
                this.display.textContent = U.formatStopwatch(Math.floor(this._elapsed));
            }
            this._raf = requestAnimationFrame(() => this._tick());
        }

        _renderLaps() {
            if (!this.lapsEl) return;
            this.lapsEl.innerHTML = [...this._laps].reverse().map(l => `
              <div class="fc-adv-lap-row">
                <span class="fc-adv-lap-num">${global.FCAdvT('lap')} ${l.n}</span>
                <span class="fc-adv-lap-time">${U.formatStopwatch(Math.floor(l.lap))}</span>
                <span class="fc-adv-lap-total">${U.formatStopwatch(Math.floor(l.total))}</span>
              </div>`).join('');
        }

        isRunning() { return this._running; }
    }

    /* ═══════════════════════════════════════════════════════
       2. Countdown Timer
       ═══════════════════════════════════════════════════════ */
    class CountdownTimer {
        constructor(displayEl, onComplete) {
            this.display = displayEl;
            this.onComplete = onComplete || (() => { });
            this._total = 0;
            this._remaining = 0;
            this._running = false;
            this._interval = null;
        }

        set(hours, minutes, seconds) {
            this.stop();
            this._total = hours * 3600 + minutes * 60 + seconds;
            this._remaining = this._total;
            this._updateDisplay();
        }

        start() {
            if (this._running || this._remaining <= 0) return;
            this._running = true;
            this._interval = setInterval(() => this._tick(), 1000);
        }

        stop() {
            this._running = false;
            clearInterval(this._interval);
        }

        toggle() {
            this._running ? this.stop() : this.start();
            return this._running;
        }

        reset() {
            this.stop();
            this._remaining = this._total;
            this._updateDisplay();
            if (this.display) this.display.classList.remove('fc-adv-countdown-alert');
        }

        _tick() {
            if (this._remaining <= 0) {
                this.stop();
                this._onDone();
                return;
            }
            this._remaining--;
            this._updateDisplay();

            // Flash when < 10 seconds
            if (this._remaining < 10 && this.display) {
                this.display.classList.toggle('fc-adv-countdown-alert');
            }
        }

        _updateDisplay() {
            if (this.display) {
                this.display.textContent = U.formatDuration(this._remaining);
            }
        }

        _onDone() {
            if (this.display) {
                this.display.textContent = '00:00:00';
                this.display.classList.add('fc-adv-countdown-done');
                setTimeout(() => this.display && this.display.classList.remove('fc-adv-countdown-done'), 3000);
            }
            this.onComplete();
        }

        isRunning() { return this._running; }
        getRemaining() { return this._remaining; }
    }

    /* ═══════════════════════════════════════════════════════
       3. Target Date Countdown
       ═══════════════════════════════════════════════════════ */
    class TargetDateCountdown {
        constructor(displayEl) {
            this.display = displayEl;
            this._interval = null;
            this._apply();

            document.addEventListener('fcAdvSettingChanged', e => {
                if (['targetDateEnabled', 'targetDate'].includes(e.detail.key)) this._apply();
            });
        }

        _apply() {
            clearInterval(this._interval);
            this._interval = null;

            const on = S.get('targetDateEnabled');
            const date = S.get('targetDate');

            if (this.display) this.display.style.display = (on && date) ? 'block' : 'none';

            if (on && date) {
                this._render();
                this._interval = setInterval(() => this._render(), 1000);
            }
        }

        _render() {
            if (!this.display) return;
            const target = new Date(S.get('targetDate'));
            if (isNaN(target)) return;

            const diff = target - Date.now();
            if (diff <= 0) {
                this.display.innerHTML = `<span class="fc-adv-chip">🎉 ${global.FCAdvT('target_reached') || 'Reachable!'}</span>`;
                return;
            }

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            this.display.innerHTML = `
              <div class="fc-adv-target-row">
                <span class="fc-adv-target-unit">${d}<small>${global.FCAdvT('day_short') || 'd'}</small></span>
                <span class="fc-adv-target-unit">${U.pad(h)}<small>${global.FCAdvT('hour_short') || 'h'}</small></span>
                <span class="fc-adv-target-unit">${U.pad(m)}<small>${global.FCAdvT('minute_short') || 'm'}</small></span>
                <span class="fc-adv-target-unit">${U.pad(s)}<small>${global.FCAdvT('second_short') || 's'}</small></span>
              </div>`;
        }
    }

    /* ═══════════════════════════════════════════════════════
       4. Multi Timer Manager
       ═══════════════════════════════════════════════════════ */
    class MultiTimerManager {
        constructor(containerEl) {
            this.container = containerEl;
            this._timers = [];
        }

        add(name, durationSeconds) {
            if (this._timers.length >= 4) return;
            const id = U.uid();
            const entry = { id, name, duration: durationSeconds, remaining: durationSeconds, running: false, interval: null };
            this._timers.push(entry);
            this._renderAll();
        }

        remove(id) {
            const t = this._timers.find(t => t.id === id);
            if (t) clearInterval(t.interval);
            this._timers = this._timers.filter(t => t.id !== id);
            this._renderAll();
        }

        _renderAll() {
            if (!this.container) return;
            this.container.innerHTML = this._timers.map(t => `
              <div class="fc-adv-mt-item" data-id="${t.id}">
                <div class="fc-adv-mt-name">${t.name}</div>
                <div class="fc-adv-mt-display" id="mt-disp-${t.id}">${U.formatDuration(t.remaining)}</div>
                <div class="fc-adv-mt-controls">
                  <button class="fc-adv-mt-toggle" data-id="${t.id}">${t.running ? '⏸' : '▶'}</button>
                  <button class="fc-adv-mt-reset" data-id="${t.id}">↺</button>
                  <button class="fc-adv-mt-del" data-id="${t.id}">✕</button>
                </div>
              </div>`).join('');

            this.container.querySelectorAll('.fc-adv-mt-toggle').forEach(btn => {
                btn.addEventListener('click', () => this._toggleTimer(btn.dataset.id));
            });
            this.container.querySelectorAll('.fc-adv-mt-reset').forEach(btn => {
                btn.addEventListener('click', () => this._resetTimer(btn.dataset.id));
            });
            this.container.querySelectorAll('.fc-adv-mt-del').forEach(btn => {
                btn.addEventListener('click', () => this.remove(btn.dataset.id));
            });
        }

        _toggleTimer(id) {
            const t = this._timers.find(t => t.id === id);
            if (!t) return;
            if (t.running) {
                clearInterval(t.interval);
                t.running = false;
            } else {
                t.interval = setInterval(() => {
                    if (t.remaining > 0) {
                        t.remaining--;
                        const el = document.getElementById(`mt-disp-${t.id}`);
                        if (el) el.textContent = U.formatDuration(t.remaining);
                    } else {
                        clearInterval(t.interval);
                        t.running = false;
                        if (global.FCAlarm) global.FCAlarm.playAlarmSound();
                        this._renderAll();
                    }
                }, 1000);
                t.running = true;
            }
            this._renderAll();
        }

        _resetTimer(id) {
            const t = this._timers.find(t => t.id === id);
            if (!t) return;
            clearInterval(t.interval);
            t.running = false;
            t.remaining = t.duration;
            this._renderAll();
        }
    }

    /* ═══════════════════════════════════════════════════════
       5. Duration Calculator
       ═══════════════════════════════════════════════════════ */
    class DurationCalculator {
        constructor(startEl, endEl, resultEl) {
            this.startEl = startEl;
            this.endEl = endEl;
            this.resultEl = resultEl;
        }

        calculate() {
            if (!this.startEl || !this.endEl || !this.resultEl) return;
            const t1 = new Date(this.startEl.value);
            const t2 = new Date(this.endEl.value);
            if (isNaN(t1) || isNaN(t2)) {
                this.resultEl.textContent = '--';
                return;
            }
            const diff = Math.abs(t2 - t1);
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            this.resultEl.textContent =
                `${d > 0 ? d + 'd ' : ''}${U.pad(h)}:${U.pad(m)}:${U.pad(s)}`;
        }
    }

    /* ═══════════════════════════════════════════════════════
       INITIALIZE
       ═══════════════════════════════════════════════════════ */
    function init() {
        // Stopwatch
        const swDisplay = document.getElementById('fc-adv-sw-display');
        const swLaps = document.getElementById('fc-adv-sw-laps');
        const sw = new Stopwatch(swDisplay, swLaps);

        const btnSwStart = document.getElementById('fc-adv-sw-start');
        const btnSwLap = document.getElementById('fc-adv-sw-lap');
        const btnSwReset = document.getElementById('fc-adv-sw-reset');
        if (btnSwStart) btnSwStart.addEventListener('click', () => {
            const running = sw.toggle();
            btnSwStart.innerHTML = running ? '<i class="ph ph-pause"></i>' : '<i class="ph ph-play"></i>';
        });
        if (btnSwLap) btnSwLap.addEventListener('click', () => sw.lap());
        if (btnSwReset) btnSwReset.addEventListener('click', () => {
            sw.reset();
            if (btnSwStart) btnSwStart.innerHTML = '<i class="ph ph-play"></i>';
        });

        // Countdown
        const cdDisplay = document.getElementById('fc-adv-cd-display');
        const onComplete = () => {
            if (global.FCAlarm) global.FCAlarm.playAlarmSound();
            if (global.FCUtils) global.FCUtils.vibrate([500, 200, 500]);
        };
        const cd = new CountdownTimer(cdDisplay, onComplete);

        const btnCdSet = document.getElementById('fc-adv-cd-set');
        const btnCdStart = document.getElementById('fc-adv-cd-start');
        const btnCdReset = document.getElementById('fc-adv-cd-reset');
        const cdH = document.getElementById('fc-adv-cd-h');
        const cdM = document.getElementById('fc-adv-cd-m');
        const cdS = document.getElementById('fc-adv-cd-s');

        if (btnCdSet) btnCdSet.addEventListener('click', () => {
            const h = parseInt(cdH && cdH.value) || 0;
            const m = parseInt(cdM && cdM.value) || 0;
            const s = parseInt(cdS && cdS.value) || 0;
            cd.set(h, m, s);
        });
        if (btnCdStart) btnCdStart.addEventListener('click', () => {
            const running = cd.toggle();
            btnCdStart.innerHTML = running ? '<i class="ph ph-pause"></i>' : '<i class="ph ph-play"></i>';
        });
        if (btnCdReset) btnCdReset.addEventListener('click', () => {
            cd.reset();
            if (btnCdStart) btnCdStart.innerHTML = '<i class="ph ph-play"></i>';
        });

        // Target Date Countdown
        const tdDisplay = document.getElementById('fc-adv-target-display');
        const targetDate = new TargetDateCountdown(tdDisplay);

        // Multi Timer
        const mtContainer = document.getElementById('fc-adv-mt-container');
        const mt = new MultiTimerManager(mtContainer);
        const btnMtAdd = document.getElementById('fc-adv-mt-add');
        if (btnMtAdd) btnMtAdd.addEventListener('click', () => {
            const nameEl = document.getElementById('fc-adv-mt-name');
            const minEl = document.getElementById('fc-adv-mt-min');
            const name = (nameEl && nameEl.value) || global.FCAdvT('timer');
            const mins = parseInt(minEl && minEl.value) || 5;
            mt.add(name, mins * 60);
            if (nameEl) nameEl.value = '';
            if (minEl) minEl.value = '';
        });

        // Duration Calculator
        const dcStart = document.getElementById('fc-adv-dc-start');
        const dcEnd = document.getElementById('fc-adv-dc-end');
        const dcResult = document.getElementById('fc-adv-dc-result');
        const dcCalc = new DurationCalculator(dcStart, dcEnd, dcResult);
        const btnDcCalc = document.getElementById('fc-adv-dc-calc');
        if (btnDcCalc) btnDcCalc.addEventListener('click', () => dcCalc.calculate());

        global.FCTimer = { sw, cd, targetDate, mt, dcCalc };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window);
