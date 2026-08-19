/**
 * COSMIC KNIGHT 2D - AUDIO SYNTHESIZER ENGINE
 * Web Audio API procedural sound effects & dynamic multi-track synth music.
 * Zero external audio assets required - runs 100% offline and instantly.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterVolume = 0.6;
        this.bgmVolume = 0.35;
        this.sfxVolume = 0.7;

        this.bgmOscillators = [];
        this.bgmInterval = null;
        this.currentTrack = null;
        this.step = 0;

        // Auto-initialize on first user interaction
        this.initOnInteraction = this.initOnInteraction.bind(this);
        window.addEventListener('click', this.initOnInteraction, { once: true });
        window.addEventListener('keydown', this.initOnInteraction, { once: true });
        window.addEventListener('touchstart', this.initOnInteraction, { once: true });
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnInteraction() {
        this.init();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else if (this.currentTrack) {
            this.playBGM(this.currentTrack);
        }
        return this.isMuted;
    }

    // Helper: Note name to frequency (A4 = 440Hz)
    noteToFreq(note) {
        const notes = {
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
            'C6': 1046.50
        };
        return notes[note] || 440;
    }

    // ================= SFX GENERATORS =================

    playJump() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);

        gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    playDoubleJump() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.15);

        gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    playDash() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        // White noise burst for woosh
        const bufferSize = this.ctx.sampleRate * 0.18;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.18);
        filter.Q.setValueAtTime(3, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start(now);
    }

    playAttack() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);

        gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.11);
    }

    playHit() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);

        gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playCoin() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6

        gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.23);
    }

    playGem() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.05;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.15 * this.sfxVolume, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.19);
        });
    }

    playSecretFound() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // Mystical Arpeggio
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.26);
        });
    }

    playUltimateFinisher() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;

        // 1. Sub-bass build-up
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(80, now);
        subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
        subGain.gain.setValueAtTime(0.6 * this.sfxVolume, now);
        subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.85);

        // 2. Rising Celestial Chord
        [440, 659.25, 880, 1318.51].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq * 0.5, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.4);
            gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.04);
            osc.stop(now + 0.65);
        });

        // 3. Huge explosive impact
        setTimeout(() => {
            if (!this.ctx) return;
            const hitNow = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, hitNow);
            osc.frequency.exponentialRampToValueAtTime(35, hitNow + 0.5);
            gain.gain.setValueAtTime(0.7 * this.sfxVolume, hitNow);
            gain.gain.exponentialRampToValueAtTime(0.01, hitNow + 0.5);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(hitNow);
            osc.stop(hitNow + 0.55);
        }, 300);
    }

    playShuriken() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    playThunder() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(600, now + 0.03);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

        gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    playHurt() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

        gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    playDeath() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [440, 392, 349, 293, 220, 146];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.1;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.2);
        });
    }

    playLevelClear() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 to G6
        arpeggio.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.42);
        });
    }

    playCheckpoint() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.1); // A5

        gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
    }

    // ================= DYNAMIC SYNTH BACKGROUND MUSIC =================

    playBGM(theme = 'forest') {
        this.init();
        this.currentTrack = theme;
        if (this.isMuted || !this.ctx) return;

        this.stopBGM();

        const melodies = {
            menu: {
                tempo: 220,
                scale: ['C4', 'E4', 'G4', 'B4', 'A4', 'G4', 'E4', 'D4', 'C4', 'G4', 'A4', 'C5', 'B4', 'G4', 'E4', 'D4'],
                bass: ['C3', 'C3', 'G3', 'G3', 'A3', 'A3', 'F3', 'G3'],
                wave: 'sine'
            },
            forest: {
                tempo: 190,
                scale: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'A4', 'G4', 'E4', 'G4', 'A4', 'G4', 'E4', 'D4', 'C4', 'D4'],
                bass: ['C3', 'E3', 'A3', 'F3', 'C3', 'G3', 'A3', 'G3'],
                wave: 'triangle'
            },
            cavern: {
                tempo: 260,
                scale: ['A3', 'C4', 'D4', 'E4', 'G4', 'E4', 'D4', 'C4', 'A3', 'E4', 'D4', 'A3', 'G3', 'A3', 'C4', 'E4'],
                bass: ['A3', 'A3', 'D3', 'F3', 'A3', 'G3', 'E3', 'A3'],
                wave: 'sine'
            },
            volcano: {
                tempo: 160,
                scale: ['D4', 'F4', 'G4', 'A4', 'C5', 'A4', 'G4', 'F4', 'D4', 'D4', 'F4', 'G4', 'A4', 'D5', 'C5', 'A4'],
                bass: ['D3', 'D3', 'F3', 'G3', 'D3', 'D3', 'A3', 'C4'],
                wave: 'sawtooth'
            },
            sky: {
                tempo: 200,
                scale: ['E4', 'G4', 'B4', 'C5', 'D5', 'B4', 'G4', 'E4', 'A4', 'C5', 'E5', 'D5', 'B4', 'G4', 'A4', 'B4'],
                bass: ['E3', 'G3', 'A3', 'B3', 'C4', 'B3', 'A3', 'E3'],
                wave: 'triangle'
            },
            cyber: {
                tempo: 150,
                scale: ['C4', 'C4', 'D#4', 'G4', 'A#4', 'G4', 'D#4', 'F4', 'G4', 'F4', 'D#4', 'C4', 'A#3', 'C4', 'D#4', 'F4'],
                bass: ['C3', 'C3', 'G#3', 'G#3', 'A#3', 'A#3', 'G3', 'G3'],
                wave: 'sawtooth'
            },
            boss: {
                tempo: 140,
                scale: ['D4', 'D4', 'F4', 'G4', 'G#4', 'A4', 'F4', 'D4', 'C4', 'D4', 'F4', 'D4', 'G#4', 'G4', 'F4', 'D4'],
                bass: ['D3', 'D3', 'D3', 'G#3', 'A3', 'A3', 'F3', 'E3'],
                wave: 'sawtooth'
            }
        };

        const config = melodies[theme] || melodies.forest;
        this.step = 0;

        this.bgmInterval = setInterval(() => {
            if (this.isMuted || !this.ctx) return;
            const now = this.ctx.currentTime;

            // Lead Note
            const leadNote = config.scale[this.step % config.scale.length];
            const leadFreq = this.noteToFreq(leadNote);

            const oscLead = this.ctx.createOscillator();
            const gainLead = this.ctx.createGain();

            oscLead.type = config.wave;
            oscLead.frequency.setValueAtTime(leadFreq, now);

            gainLead.gain.setValueAtTime(0.08 * this.bgmVolume, now);
            gainLead.gain.exponentialRampToValueAtTime(0.001, now + (config.tempo / 1000) * 0.9);

            oscLead.connect(gainLead);
            gainLead.connect(this.ctx.destination);

            oscLead.start(now);
            oscLead.stop(now + (config.tempo / 1000) * 0.95);

            // Bass Note on every 2nd step
            if (this.step % 2 === 0) {
                const bassIdx = Math.floor(this.step / 2) % config.bass.length;
                const bassNote = config.bass[bassIdx];
                const bassFreq = this.noteToFreq(bassNote);

                const oscBass = this.ctx.createOscillator();
                const gainBass = this.ctx.createGain();

                oscBass.type = 'triangle';
                oscBass.frequency.setValueAtTime(bassFreq, now);

                gainBass.gain.setValueAtTime(0.12 * this.bgmVolume, now);
                gainBass.gain.exponentialRampToValueAtTime(0.001, now + (config.tempo / 1000) * 1.8);

                oscBass.connect(gainBass);
                gainBass.connect(this.ctx.destination);

                oscBass.start(now);
                oscBass.stop(now + (config.tempo / 1000) * 1.9);
            }

            this.step++;
        }, config.tempo);
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }
}

// Global Audio Instance
window.soundEngine = new SoundEngine();
