/**
 * Verification test for pure single-player Cosmic Knight 2D
 */
const fs = require('fs');

console.log('Verifying clean single-player state...');

const html = fs.readFileSync('index.html', 'utf8');

// Ensure NO leftover PvP artifacts exist in HTML
const forbiddenIds = [
    'screen-pvp-lobby',
    'pvp-hud-bar',
    'dual-touch-controls',
    'modal-pvp-victory',
    'btn-menu-pvp',
    'js/qrcode.min.js',
    'js/multiplayer.js'
];

let failed = false;
forbiddenIds.forEach(id => {
    if (html.includes(id)) {
        console.error(`❌ Found unwanted PvP artifact in index.html: ${id}`);
        failed = true;
    } else {
        console.log(`✓ Clean: No ${id}`);
    }
});

// Check that essential single-player elements exist
const essentialIds = [
    'screen-main-menu',
    'screen-stages',
    'screen-shop',
    'screen-how',
    'touch-controls',
    'btn-menu-play',
    'hud-overlay',
    'boss-hud-bar',
    'modal-victory',
    'modal-gameover',
    'modal-pause'
];

essentialIds.forEach(id => {
    if (!html.includes(`id="${id}"`)) {
        console.error(`❌ Missing essential single player ID: #${id}`);
        failed = true;
    } else {
        console.log(`✓ Essential element present: #${id}`);
    }
});

if (failed) {
    process.exit(1);
} else {
    console.log('🎉 PURE CLEAN SINGLE-PLAYER PLATFORMER VERIFIED 100% SUCCESS!');
}
