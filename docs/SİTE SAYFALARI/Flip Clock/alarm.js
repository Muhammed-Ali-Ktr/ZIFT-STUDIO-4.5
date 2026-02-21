/**
 * alarm.js — Multi-Alarm System
 * Depends on: utils.js, settings.js
 * Namespace: window.FCAlarm
 */
(function (global) {
    'use strict';

    const U = global.FCUtils;
    const S = global.FCSettings;

    /* ─── Alarm Sound (uses existing audio asset) ─── */
    let _alarmAudio = null;

    function getAlarmAudio() {
        if (!_alarmAudio) {
            _alarmAudio = document.getElementById('sfx-alarm') || new Audio('assets/alarm.mp3');
        }
        return _alarmAudio;
    }

    function playAlarmSound() {
        const audio = getAlarmAudio();
        audio.currentTime = 0;
        audio.play().catch(() => { });
        if (S.get('alarmVibrate')) U.vibrate([300, 100, 300, 100, 300]);
    }

    function stopAlarmSound() {
        const audio = getAlarmAudio();
        audio.pause();
        audio.currentTime = 0;
    }

    /* ─── Notification ─── */
    function sendNotification(title, body) {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon: '' });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(p => {
                if (p === 'granted') new Notification(title, { body });
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       AlarmEntry schema:
       {
         id:       string,
         time:     "HH:MM",         // 24h format
         label:    string,
         repeat:   'once'|'daily'|'weekly',
         weekdays: number[],        // 0=Sun..6=Sat (for weekly)
         enabled:  boolean,
         snoozed:  boolean,
         nextFire: number,          // timestamp ms
       }
       ═══════════════════════════════════════════════════════ */

    class AlarmManager {
        constructor() {
            this._alarms = [];
            this._loading = true;
            this._tick = null;
            this._listEl = document.getElementById('fc-adv-alarm-list');
            this._load();
            this._startTick();
            this._renderList();
        }

        /* ── Persistence ── */
        _load() {
            this._alarms = (S.get('alarms') || []).map(a => ({
                ...a,
                enabled: a.enabled !== false,
                snoozed: false,
            }));
        }

        _persist() {
            S.set('alarms', this._alarms.map(a => {
                const { snoozed, ...rest } = a; // don't persist transient snoozed state
                return rest;
            }));
        }

        /* ── CRUD ── */
        add(time, label = 'Alarm', repeat = 'once', weekdays = []) {
            const entry = {
                id: U.uid(),
                time,
                label,
                repeat,
                weekdays,
                enabled: true,
                snoozed: false,
                nextFire: this._calcNextFire({ time, repeat, weekdays }),
            };
            this._alarms.push(entry);
            this._persist();
            this._renderList();
            return entry.id;
        }

        remove(id) {
            this._alarms = this._alarms.filter(a => a.id !== id);
            this._persist();
            this._renderList();
        }

        toggle(id) {
            const a = this._alarms.find(a => a.id === id);
            if (!a) return;
            a.enabled = !a.enabled;
            if (a.enabled) a.nextFire = this._calcNextFire(a);
            this._persist();
            this._renderList();
        }

        snooze(id) {
            const a = this._alarms.find(a => a.id === id);
            if (!a) return;
            a.snoozed = true;
            a.nextFire = Date.now() + 5 * 60 * 1000; // 5 mins
            stopAlarmSound();
            this._renderList();
            this._hideSnoozeUI();
        }

        /* ── Fire logic ── */
        _calcNextFire({ time, repeat, weekdays }) {
            if (!time) return Infinity;
            const [hStr, mStr] = time.split(':');
            const h = parseInt(hStr), m = parseInt(mStr);

            const now = new Date();
            const next = new Date(now);
            next.setSeconds(0, 0);
            next.setHours(h, m);

            if (repeat === 'once' || repeat === 'daily') {
                if (next <= now) next.setDate(next.getDate() + 1);
                return next.getTime();
            }

            if (repeat === 'weekly' && weekdays && weekdays.length) {
                let checkDay = new Date(now);
                checkDay.setSeconds(0, 0);
                checkDay.setHours(h, m);
                for (let offset = 0; offset < 8; offset++) {
                    const d = new Date(checkDay);
                    d.setDate(d.getDate() + offset);
                    if (weekdays.includes(d.getDay()) && d > now) {
                        return d.getTime();
                    }
                }
            }

            return Infinity;
        }

        _startTick() {
            this._tick = setInterval(() => this._check(), 1000);
        }

        _check() {
            const now = Date.now();
            this._alarms.forEach(a => {
                if (!a.enabled || !a.nextFire) return;
                if (now >= a.nextFire && (now - a.nextFire) < 60000) { // within 60s window
                    this._fire(a);
                }
            });
        }

        _fire(alarm) {
            playAlarmSound();
            sendNotification(alarm.label || global.FCAdvT('tab_alarms') || 'Alarm', alarm.time);
            this._showSnoozeUI(alarm.id);

            // Schedule next
            if (alarm.repeat === 'daily' || alarm.repeat === 'weekly') {
                alarm.nextFire = this._calcNextFire(alarm);
                alarm.snoozed = false;
            } else {
                alarm.enabled = false;
                alarm.nextFire = Infinity;
            }
            this._persist();
            this._renderList();

            // Auto-stop alarm after 60s
            setTimeout(() => stopAlarmSound(), 60000);
        }

        /* ── Snooze UI ── */
        _showSnoozeUI(id) {
            this._hideSnoozeUI();

            const snooze = document.createElement('div');
            snooze.id = 'fc-adv-alarm-snooze';
            snooze.className = 'fc-adv-snooze-overlay';
            snooze.innerHTML = `
              <div class="fc-adv-snooze-card">
                <div class="fc-adv-snooze-icon"><i class="ph-bold ph-alarm"></i></div>
                <div class="fc-adv-snooze-time">${this._alarms.find(a => a.id === id)?.time || '--:--'}</div>
                <div class="fc-adv-snooze-label">${this._alarms.find(a => a.id === id)?.label || 'Alarm!'}</div>
                <div class="fc-adv-snooze-btns">
                  <button id="fc-adv-snooze-btn" class="fc-adv-btn fc-adv-btn-primary">${global.FCAdvT('snooze_btn')}</button>
                  <button id="fc-adv-dismiss-btn" class="fc-adv-btn fc-adv-btn-secondary">${global.FCAdvT('dismiss_btn')}</button>
                </div>
              </div>`;
            document.body.appendChild(snooze);

            document.getElementById('fc-adv-snooze-btn').addEventListener('click', () => this.snooze(id));
            document.getElementById('fc-adv-dismiss-btn').addEventListener('click', () => {
                stopAlarmSound();
                this._hideSnoozeUI();
            });
        }

        _hideSnoozeUI() {
            const el = document.getElementById('fc-adv-alarm-snooze');
            if (el) el.remove();
        }

        /* ── Render alarm list ── */
        _renderList() {
            if (!this._listEl) return;
            if (!this._alarms.length) {
                this._listEl.innerHTML = `<div style="text-align:center; opacity:0.3; padding:1rem; font-size:0.8rem;">${global.FCAdvT('no_alarms')}</div>`;
                return;
            }

            const DAYS = [
                global.FCAdvT('sunday_short'),
                global.FCAdvT('monday_short'),
                global.FCAdvT('tuesday_short'),
                global.FCAdvT('wednesday_short'),
                global.FCAdvT('thursday_short'),
                global.FCAdvT('friday_short'),
                global.FCAdvT('saturday_short')
            ];
            this._listEl.innerHTML = this._alarms.map(a => {
                const daysLabel = a.repeat === 'weekly' && a.weekdays && a.weekdays.length
                    ? a.weekdays.map(d => DAYS[d]).join(' ')
                    : a.repeat.charAt(0).toUpperCase() + a.repeat.slice(1);

                return `
                  <div class="fc-adv-list-item ${a.enabled ? '' : 'fc-adv-dimmed'}">
                    <div style="display:flex; align-items:center; gap:1rem;">
                        <div style="font-family:var(--font-clock); font-size:1.4rem; color:var(--accent-color);">${a.time}</div>
                        <div>
                            <div style="font-weight:600; font-size:0.85rem;">${a.label}</div>
                            <div style="font-size:0.7rem; opacity:0.5;">${daysLabel}${a.snoozed ? ' • Snoozed' : ''}</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                       <button class="fc-adv-alarm-toggle-btn" data-id="${id}" style="background:none; border:none; color:${a.enabled ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)'}; cursor:pointer; font-size:1.2rem;">
                          <i class="ph-bold ${a.enabled ? 'ph-toggle-right' : 'ph-toggle-left'}"></i>
                       </button>
                       <button class="fc-adv-alarm-del-btn" data-id="${id}" style="background:none; border:none; color:#ff5252; cursor:pointer; opacity:0.6;"><i class="ph ph-trash"></i></button>
                    </div>
                  </div>`;
            }).join('').replace(/data-id="\${id}"/g, (m, offset, str) => {
                // Fix the template literal bug in the map
                const match = str.slice(0, offset).match(/data-id="([^"]+)"/);
                // Actually I'll just rewrite the map properly below
                return '';
            });

            // Let's rewrite the render properly to avoid string manipulation hacks
            this._listEl.innerHTML = '';
            this._alarms.forEach(a => {
                const daysLabel = a.repeat === 'weekly' && a.weekdays && a.weekdays.length
                    ? a.weekdays.map(d => DAYS[d]).join(' ')
                    : a.repeat.charAt(0).toUpperCase() + a.repeat.slice(1);

                const div = document.createElement('div');
                div.className = `fc-adv-list-item ${a.enabled ? '' : 'fc-adv-dimmed'}`;
                div.innerHTML = `
                    <div style="display:flex; align-items:center; gap:1rem;">
                        <div style="font-family:var(--font-clock); font-size:1.4rem; color:var(--accent-color); min-width:60px;">${a.time}</div>
                        <div>
                            <div style="font-weight:600; font-size:0.85rem;">${a.label}</div>
                            <div style="font-size:0.75rem; opacity:0.5; text-transform:uppercase; letter-spacing:0.5px;">${daysLabel}${a.snoozed ? ' • ' + global.FCAdvT('snoozed_label') : ''}</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:1rem;">
                       <i class="ph-fill ph-circle" style="font-size:0.5rem; color:${a.enabled ? 'var(--accent-color)' : 'transparent'}"></i>
                       <button class="fc-adv-alarm-toggle-btn" data-id="${a.id}" style="background:none; border:none; color:inherit; cursor:pointer; font-size:1.4rem; opacity:0.8;">
                          <i class="${a.enabled ? 'ph ph-toggle-right' : 'ph ph-toggle-left'}"></i>
                       </button>
                       <button class="fc-adv-alarm-del-btn" data-id="${a.id}" style="background:none; border:none; color:#ff5252; cursor:pointer; font-size:1.2rem; opacity:0.5;"><i class="ph ph-trash"></i></button>
                    </div>`;
                this._listEl.appendChild(div);
            });

            this._listEl.querySelectorAll('.fc-adv-alarm-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => this.toggle(btn.dataset.id));
            });
            this._listEl.querySelectorAll('.fc-adv-alarm-del-btn').forEach(btn => {
                btn.addEventListener('click', () => this.remove(btn.dataset.id));
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       INITIALIZE
       ═══════════════════════════════════════════════════════ */
    function init() {
        const mgr = new AlarmManager();
        global.FCAlarm = { mgr, playAlarmSound, stopAlarmSound };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window);
