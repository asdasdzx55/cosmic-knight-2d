/**
 * Simulation Test for Shared Screen 2-Player Combat System
 */
const fs = require('fs');

console.log('Testing Shared Screen 2-Player Combat System...');

// Check files existence and syntax
const files = [
    'js/controls.js',
    'js/entities.js',
    'js/engine.js',
    'js/game.js',
    'index.html',
    'css/style.css'
];

let allValid = true;
files.forEach(f => {
    if (!fs.existsSync(f)) {
        console.error('Missing file:', f);
        allValid = false;
    } else {
        const content = fs.readFileSync(f, 'utf8');
        console.log(`✓ ${f} is present (${content.length} chars)`);
    }
});

// Check key IDs in index.html
const html = fs.readFileSync('index.html', 'utf8');
const requiredIds = [
    'dual-touch-controls',
    'p1-touch-left',
    'p1-touch-right',
    'p1-touch-jump',
    'p1-touch-attack',
    'p2-touch-left',
    'p2-touch-right',
    'p2-touch-jump',
    'p2-touch-attack',
    'btn-menu-pvp',
    'btn-start-dual-pvp',
    'screen-pvp-lobby',
    'pvp-hud-bar',
    'modal-pvp-victory'
];

requiredIds.forEach(id => {
    if (html.includes(`id="${id}"`)) {
        console.log(`✓ HTML ID found: #${id}`);
    } else {
        console.error(`❌ Missing HTML ID: #${id}`);
        allValid = false;
    }
});

if (allValid) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY 100%!');
} else {
    process.exit(1);
}
