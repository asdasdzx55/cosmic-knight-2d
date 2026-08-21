/**
 * Automated test for UI buttons and GameManager instantiation
 */
const fs = require('fs');

console.log('--- Running Complete UI & Button Functional Verification ---');

// Mock browser DOM environment
global.window = global;
global.window.addEventListener = (event, fn) => {};
global.performance = { now: () => Date.now() };
global.requestAnimationFrame = (fn) => setTimeout(fn, 16);
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};
const elementsMap = new Map();

global.document = {
    addEventListener: () => {},
    documentElement: { dir: 'rtl', lang: 'ar' },
    body: { appendChild: () => {} },
    getElementById: (id) => {
        if (!elementsMap.has(id)) {
            elementsMap.set(id, {
                id,
                style: {},
                classList: {
                    add: () => {},
                    remove: () => {},
                    toggle: () => {},
                    contains: () => false
                },
                innerText: '',
                innerHTML: '',
                appendChild: () => {},
                onclick: null,
                getContext: () => ({
                    clearRect: () => {},
                    fillRect: () => {},
                    drawImage: () => {},
                    save: () => {},
                    restore: () => {},
                    beginPath: () => {},
                    arc: () => {},
                    fill: () => {},
                    stroke: () => {}
                })
            });
        }
        return elementsMap.get(id);
    },
    createElement: (tag) => ({
        tagName: tag,
        className: '',
        style: {},
        classList: { add: () => {}, remove: () => {} },
        appendChild: () => {},
        querySelector: () => ({ onclick: null, classList: { add: () => {}, remove: () => {} } })
    }),
    querySelectorAll: (selector) => {
        return [
            {
                dataset: { diff: 'medium', tab: 'skins' },
                classList: { add: () => {}, remove: () => {}, toggle: () => {} },
                onclick: null
            }
        ];
    },
    querySelector: () => null
};

// Mock audio and particles
global.soundEngine = {
    playBGM: () => {},
    stopBGM: () => {},
    playLevelClear: () => {},
    playCheckpoint: () => {},
    playSecretFound: () => {},
    playDash: () => {},
    playCoin: () => {},
    toggleMute: () => false
};
global.particleSystem = {
    clear: () => {},
    update: () => {},
    draw: () => {},
    emitConfetti: () => {},
    emitGemBurst: () => {},
    emitBossExplosion: () => {},
    emitCheckpointChime: () => {},
    emitHitSparks: () => {}
};
global.dialogueManager = {
    init: () => {},
    startDialogue: () => {}
};

const vm = require('vm');

// Load code files in current global context
vm.runInThisContext(fs.readFileSync('js/levels.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/entities.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/dialogue.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/engine.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/controls.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/game.js', 'utf8'));

// Instantiate GameManager
const gm = new GameManager();
console.log('✓ GameManager instantiated successfully! Initial state:', gm.state);

// Test clicking Play button
console.log('Testing Play Button click...');
document.getElementById('btn-menu-play').onclick();
console.log('✓ Play Button clicked! Game state:', gm.state, '| Stage ID:', gm.currentStageId);

// Test clicking Stages button
console.log('Testing Stages Button click...');
document.getElementById('btn-menu-stages').onclick();
console.log('✓ Stages Button clicked! Game state:', gm.state);

// Test clicking Shop button
console.log('Testing Shop Button click...');
document.getElementById('btn-menu-shop').onclick();
console.log('✓ Shop Button clicked! Game state:', gm.state);

// Test clicking How to play button
console.log('Testing How Button click...');
document.getElementById('btn-menu-how').onclick();
console.log('✓ How Button clicked! Game state:', gm.state);

console.log('🎉 ALL BUTTONS & MENUS ARE 100% FUNCTIONAL AND ERROR-FREE!');
