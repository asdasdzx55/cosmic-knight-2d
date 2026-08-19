/**
 * COSMIC KNIGHT 2D - LEVELS & STAGES DATABASE
 * 6 Handcrafted, rich worlds with diverse mechanics, hazards, platforms and biomes.
 */

const GAME_LEVELS = [
    // ==========================================
    // STAGE 1: THE MYSTIC FOREST (الغابة الساحرة)
    // ==========================================
    {
        id: 1,
        titleAr: "الغابة الساحرة",
        titleEn: "The Mystic Forest",
        biome: "forest",
        targetTime: 50, // seconds for time star
        width: 2800,
        height: 700,
        spawn: { x: 80, y: 480 },
        bgGradient: ['#0b1d1b', '#133a2d', '#1f5945'],
        platforms: [
            // Starting ground
            { x: 0, y: 560, w: 450, h: 140, type: 'solid', style: 'grass' },
            // Floating introductory platforms
            { x: 260, y: 440, w: 120, h: 26, type: 'solid', style: 'wood' },
            { x: 420, y: 340, w: 130, h: 26, type: 'solid', style: 'wood' },
            
            // Middle section with bounce mushroom
            { x: 550, y: 560, w: 320, h: 140, type: 'solid', style: 'grass' },
            { x: 620, y: 536, w: 48, h: 24, type: 'bounce', bounceForce: -16, style: 'mushroom' },
            { x: 700, y: 260, w: 140, h: 26, type: 'solid', style: 'wood' },

            // Moving platform across the chasm
            { x: 920, y: 460, w: 110, h: 24, type: 'moving', vx: 2, rangeX: 180, startX: 920, style: 'stone' },

            // Checkpoint plateau
            { x: 1250, y: 540, w: 300, h: 160, type: 'solid', style: 'grass' },

            // Crumbling bridge section
            { x: 1600, y: 460, w: 80, h: 24, type: 'crumble', style: 'crumble' },
            { x: 1720, y: 400, w: 80, h: 24, type: 'crumble', style: 'crumble' },
            { x: 1840, y: 340, w: 80, h: 24, type: 'crumble', style: 'crumble' },

            // High secret ledge for Star #2
            { x: 1680, y: 200, w: 140, h: 26, type: 'solid', style: 'stone' },

            // Final run-up & portal cliff
            { x: 1980, y: 560, w: 400, h: 140, type: 'solid', style: 'grass' },
            { x: 2100, y: 420, w: 110, h: 24, type: 'solid', style: 'wood' },
            { x: 2260, y: 310, w: 120, h: 24, type: 'solid', style: 'wood' },
            { x: 2450, y: 480, w: 350, h: 220, type: 'solid', style: 'grass' }
        ],
        hazards: [
            // Spikes in chasms
            { x: 450, y: 660, w: 100, h: 40, type: 'spikes' },
            { x: 870, y: 660, w: 380, h: 40, type: 'spikes' },
            { x: 1550, y: 660, w: 430, h: 40, type: 'spikes' }
        ],
        collectibles: [
            // Coins
            { x: 300, y: 400, type: 'coin', val: 5 },
            { x: 480, y: 300, type: 'coin', val: 5 },
            { x: 740, y: 220, type: 'coin', val: 5 },
            { x: 960, y: 410, type: 'coin', val: 5 },
            { x: 1300, y: 490, type: 'coin', val: 5 },
            { x: 1360, y: 490, type: 'coin', val: 5 },
            { x: 1640, y: 410, type: 'coin', val: 5 },
            { x: 1760, y: 350, type: 'coin', val: 5 },
            { x: 1880, y: 290, type: 'coin', val: 5 },
            { x: 2140, y: 370, type: 'coin', val: 5 },
            { x: 2300, y: 260, type: 'coin', val: 5 },
            // 3 Star Gems
            { x: 770, y: 150, type: 'star_gem', starIdx: 1 }, // High mushroom jump
            { x: 1750, y: 140, type: 'star_gem', starIdx: 2 }, // Secret high ledge
            { x: 2320, y: 210, type: 'star_gem', starIdx: 3 }  // Near the exit high jump
        ],
        checkpoints: [
            { x: 1320, y: 460, w: 40, h: 80, activated: false }
        ],
        enemies: [
            { type: 'slime', x: 680, y: 520, rangeX: 120 },
            { type: 'slime', x: 1400, y: 500, rangeX: 100 },
            { type: 'bat', x: 1000, y: 300, rangeX: 160 },
            { type: 'slime', x: 2100, y: 520, rangeX: 140 }
        ],
        exit: { x: 2650, y: 390, w: 60, h: 90 }
    },

    // ==========================================
    // STAGE 2: CRYSTAL CAVERNS (كهوف الكريستال)
    // ==========================================
    {
        id: 2,
        titleAr: "كهوف الكريستال",
        titleEn: "Crystal Caverns",
        biome: "cavern",
        targetTime: 65,
        width: 3200,
        height: 750,
        spawn: { x: 80, y: 500 },
        bgGradient: ['#050814', '#0d1b2a', '#1b263b'],
        platforms: [
            { x: 0, y: 580, w: 400, h: 170, type: 'solid', style: 'crystal_rock' },
            { x: 280, y: 450, w: 100, h: 24, type: 'solid', style: 'crystal_rock' },
            { x: 440, y: 360, w: 110, h: 24, type: 'moving', vy: 1.8, rangeY: 100, startY: 360, style: 'crystal_rock' },

            // Lower cavern with bounce crystal
            { x: 600, y: 600, w: 300, h: 150, type: 'solid', style: 'crystal_rock' },
            { x: 700, y: 576, w: 48, h: 24, type: 'bounce', bounceForce: -17, style: 'crystal_bounce' },

            // Upper tunnel with crumbling ledges
            { x: 800, y: 260, w: 180, h: 24, type: 'solid', style: 'crystal_rock' },
            { x: 1040, y: 280, w: 80, h: 24, type: 'crumble', style: 'crumble' },
            { x: 1160, y: 320, w: 80, h: 24, type: 'crumble', style: 'crumble' },

            // Middle hub & Checkpoint
            { x: 1300, y: 480, w: 320, h: 270, type: 'solid', style: 'crystal_rock' },

            // High crystal spires
            { x: 1700, y: 400, w: 90, h: 24, type: 'moving', vx: 2.2, rangeX: 160, startX: 1700, style: 'crystal_rock' },
            { x: 1950, y: 320, w: 120, h: 24, type: 'solid', style: 'crystal_rock' },
            { x: 2150, y: 240, w: 100, h: 24, type: 'solid', style: 'crystal_rock' },

            // Deep pit with bouncing crystal run
            { x: 2350, y: 560, w: 200, h: 190, type: 'solid', style: 'crystal_rock' },
            { x: 2400, y: 536, w: 48, h: 24, type: 'bounce', bounceForce: -18, style: 'crystal_bounce' },

            // Final cavern exit chamber
            { x: 2650, y: 420, w: 140, h: 24, type: 'solid', style: 'crystal_rock' },
            { x: 2850, y: 520, w: 350, h: 230, type: 'solid', style: 'crystal_rock' }
        ],
        hazards: [
            { x: 400, y: 700, w: 200, h: 50, type: 'spikes' },
            { x: 900, y: 700, w: 400, h: 50, type: 'spikes' },
            { x: 1620, y: 700, w: 730, h: 50, type: 'spikes' },
            { x: 2550, y: 700, w: 300, h: 50, type: 'spikes' }
        ],
        collectibles: [
            { x: 320, y: 400, type: 'coin', val: 5 },
            { x: 480, y: 280, type: 'coin', val: 5 },
            { x: 860, y: 210, type: 'coin', val: 5 },
            { x: 1380, y: 430, type: 'coin', val: 5 },
            { x: 1800, y: 350, type: 'coin', val: 5 },
            { x: 2000, y: 270, type: 'coin', val: 5 },
            { x: 2200, y: 190, type: 'coin', val: 5 },
            { x: 2700, y: 370, type: 'coin', val: 5 },
            // 3 Star Gems
            { x: 720, y: 120, type: 'star_gem', starIdx: 1 },
            { x: 1200, y: 220, type: 'star_gem', starIdx: 2 },
            { x: 2420, y: 120, type: 'star_gem', starIdx: 3 }
        ],
        checkpoints: [
            { x: 1400, y: 400, w: 40, h: 80, activated: false }
        ],
        enemies: [
            { type: 'bat', x: 500, y: 250, rangeX: 180 },
            { type: 'slime', x: 740, y: 560, rangeX: 100 },
            { type: 'bat', x: 1500, y: 300, rangeX: 200 },
            { type: 'knight', x: 1420, y: 420, rangeX: 80 },
            { type: 'bat', x: 2050, y: 200, rangeX: 150 }
        ],
        exit: { x: 3020, y: 430, w: 60, h: 90 }
    },

    // ==========================================
    // STAGE 3: VOLCANIC CORE (البركان الثائر)
    // ==========================================
    {
        id: 3,
        titleAr: "البركان الثائر",
        titleEn: "Volcanic Core",
        biome: "volcano",
        targetTime: 70,
        width: 3200,
        height: 750,
        spawn: { x: 80, y: 480 },
        bgGradient: ['#1a0500', '#3f0c00', '#6a1b00'],
        platforms: [
            { x: 0, y: 560, w: 350, h: 190, type: 'solid', style: 'magma_rock' },
            { x: 250, y: 430, w: 100, h: 24, type: 'solid', style: 'magma_rock' },
            { x: 420, y: 340, w: 110, h: 24, type: 'crumble', style: 'crumble' },
            { x: 600, y: 440, w: 120, h: 24, type: 'moving', vx: 2.5, rangeX: 180, startX: 600, style: 'magma_rock' },

            // Fiery Pillar & Checkpoint 1
            { x: 920, y: 420, w: 220, h: 330, type: 'solid', style: 'magma_rock' },

            // High lava jumping sequence
            { x: 1220, y: 350, w: 100, h: 24, type: 'moving', vy: 2, rangeY: 120, startY: 350, style: 'magma_rock' },
            { x: 1420, y: 260, w: 100, h: 24, type: 'crumble', style: 'crumble' },
            { x: 1600, y: 360, w: 120, h: 24, type: 'moving', vx: -2.5, rangeX: 180, startX: 1600, style: 'magma_rock' },

            // Mid magma fortress
            { x: 1850, y: 460, w: 280, h: 290, type: 'solid', style: 'magma_rock' },
            { x: 1920, y: 436, w: 48, h: 24, type: 'bounce', bounceForce: -19, style: 'magma_bounce' },

            // Upper gauntlet for final star
            { x: 2200, y: 300, w: 110, h: 24, type: 'solid', style: 'magma_rock' },
            { x: 2380, y: 230, w: 110, h: 24, type: 'crumble', style: 'crumble' },
            { x: 2560, y: 320, w: 120, h: 24, type: 'moving', vx: 2, rangeX: 140, startX: 2560, style: 'magma_rock' },

            // Final Volcano Exit Gate
            { x: 2800, y: 480, w: 400, h: 270, type: 'solid', style: 'magma_rock' }
        ],
        hazards: [
            // Entire bottom floor is bubbling lava!
            { x: 350, y: 680, w: 570, h: 70, type: 'lava' },
            { x: 1140, y: 680, w: 710, h: 70, type: 'lava' },
            { x: 2130, y: 680, w: 670, h: 70, type: 'lava' }
        ],
        collectibles: [
            { x: 280, y: 380, type: 'coin', val: 5 },
            { x: 460, y: 290, type: 'coin', val: 5 },
            { x: 980, y: 360, type: 'coin', val: 5 },
            { x: 1460, y: 210, type: 'coin', val: 5 },
            { x: 1980, y: 400, type: 'coin', val: 5 },
            { x: 2240, y: 250, type: 'coin', val: 5 },
            { x: 2600, y: 270, type: 'coin', val: 5 },
            // 3 Star Gems
            { x: 660, y: 240, type: 'star_gem', starIdx: 1 },
            { x: 1460, y: 120, type: 'star_gem', starIdx: 2 },
            { x: 2420, y: 110, type: 'star_gem', starIdx: 3 }
        ],
        checkpoints: [
            { x: 1000, y: 340, w: 40, h: 80, activated: false }
        ],
        enemies: [
            { type: 'imp', x: 500, y: 280, rangeX: 100 },
            { type: 'knight', x: 980, y: 360, rangeX: 70 },
            { type: 'imp', x: 1350, y: 220, rangeX: 120 },
            { type: 'bat', x: 1700, y: 250, rangeX: 180 },
            { type: 'imp', x: 2450, y: 170, rangeX: 100 }
        ],
        exit: { x: 3000, y: 390, w: 60, h: 90 }
    },

    // ==========================================
    // STAGE 4: ANCIENT SKY RUINS (أطلال السماء)
    // ==========================================
    {
        id: 4,
        titleAr: "أطلال السماء",
        titleEn: "Ancient Sky Ruins",
        biome: "sky",
        targetTime: 75,
        width: 3400,
        height: 800,
        spawn: { x: 80, y: 520 },
        bgGradient: ['#0f2027', '#203a43', '#2c5364'],
        platforms: [
            { x: 0, y: 600, w: 320, h: 200, type: 'solid', style: 'sky_marble' },
            { x: 260, y: 470, w: 100, h: 24, type: 'solid', style: 'sky_marble' },
            { x: 420, y: 370, w: 100, h: 24, type: 'moving', vy: 2.2, rangeY: 140, startY: 370, style: 'sky_marble' },

            // High Wind floating island
            { x: 620, y: 280, w: 180, h: 26, type: 'solid', style: 'sky_marble' },
            { x: 880, y: 340, w: 90, h: 24, type: 'crumble', style: 'crumble' },
            { x: 1040, y: 420, w: 120, h: 24, type: 'moving', vx: 3, rangeX: 220, startX: 1040, style: 'sky_marble' },

            // Center Floating Palace & Checkpoint
            { x: 1380, y: 480, w: 360, h: 320, type: 'solid', style: 'sky_marble' },
            { x: 1480, y: 456, w: 48, h: 24, type: 'bounce', bounceForce: -19, style: 'sky_bounce' },

            // Upper cloud temple
            { x: 1540, y: 200, w: 160, h: 26, type: 'solid', style: 'sky_marble' },
            { x: 1780, y: 260, w: 90, h: 24, type: 'crumble', style: 'crumble' },
            { x: 1940, y: 340, w: 110, h: 24, type: 'moving', vy: -2, rangeY: 150, startY: 340, style: 'sky_marble' },

            // Laser turret gauntlet
            { x: 2180, y: 480, w: 240, h: 320, type: 'solid', style: 'sky_marble' },
            { x: 2500, y: 380, w: 110, h: 24, type: 'solid', style: 'sky_marble' },
            { x: 2680, y: 280, w: 100, h: 24, type: 'crumble', style: 'crumble' },
            { x: 2860, y: 380, w: 110, h: 24, type: 'moving', vx: -2.5, rangeX: 160, startX: 2860, style: 'sky_marble' },

            // Sky Portal Peak
            { x: 3080, y: 460, w: 320, h: 340, type: 'solid', style: 'sky_marble' }
        ],
        hazards: [
            // Endless bottomless sky pit
            { x: 320, y: 760, w: 1060, h: 40, type: 'spikes' },
            { x: 1740, y: 760, w: 440, h: 40, type: 'spikes' },
            { x: 2420, y: 760, w: 660, h: 40, type: 'spikes' }
        ],
        collectibles: [
            { x: 300, y: 420, type: 'coin', val: 5 },
            { x: 680, y: 220, type: 'coin', val: 5 },
            { x: 1100, y: 360, type: 'coin', val: 5 },
            { x: 1600, y: 140, type: 'coin', val: 5 },
            { x: 1820, y: 210, type: 'coin', val: 5 },
            { x: 2280, y: 420, type: 'coin', val: 5 },
            { x: 2540, y: 320, type: 'coin', val: 5 },
            { x: 2720, y: 220, type: 'coin', val: 5 },
            // 3 Star Gems
            { x: 700, y: 130, type: 'star_gem', starIdx: 1 },
            { x: 1600, y: 80, type: 'star_gem', starIdx: 2 },
            { x: 2720, y: 130, type: 'star_gem', starIdx: 3 }
        ],
        checkpoints: [
            { x: 1420, y: 400, w: 40, h: 80, activated: false }
        ],
        enemies: [
            { type: 'turret', x: 740, y: 240, rangeX: 0 },
            { type: 'bat', x: 950, y: 250, rangeX: 180 },
            { type: 'turret', x: 2320, y: 440, rangeX: 0 },
            { type: 'knight', x: 2240, y: 420, rangeX: 60 },
            { type: 'bat', x: 2600, y: 200, rangeX: 180 }
        ],
        exit: { x: 3240, y: 370, w: 60, h: 90 }
    },

    // ==========================================
    // STAGE 5: NEON CYBER LAB (المختبر السايبراني)
    // ==========================================
    {
        id: 5,
        titleAr: "المختبر السايبراني",
        titleEn: "Neon Cyber Lab",
        biome: "cyber",
        targetTime: 85,
        width: 3600,
        height: 800,
        spawn: { x: 80, y: 520 },
        bgGradient: ['#03071e', '#370617', '#6a040f'],
        platforms: [
            { x: 0, y: 600, w: 320, h: 200, type: 'solid', style: 'cyber_grid' },
            { x: 280, y: 460, w: 110, h: 24, type: 'solid', style: 'cyber_grid' },
            { x: 460, y: 350, w: 100, h: 24, type: 'crumble', style: 'crumble' },
            { x: 620, y: 450, w: 130, h: 24, type: 'moving', vx: 3, rangeX: 200, startX: 620, style: 'cyber_grid' },

            // Security Gate & Turrets
            { x: 940, y: 520, w: 300, h: 280, type: 'solid', style: 'cyber_grid' },
            { x: 1020, y: 496, w: 48, h: 24, type: 'bounce', bounceForce: -19.5, style: 'cyber_bounce' },

            // High Data Stream Bridges
            { x: 1100, y: 220, w: 160, h: 24, type: 'solid', style: 'cyber_grid' },
            { x: 1340, y: 280, w: 90, h: 24, type: 'crumble', style: 'crumble' },
            { x: 1500, y: 360, w: 120, h: 24, type: 'moving', vy: 2.5, rangeY: 160, startY: 360, style: 'cyber_grid' },

            // Central Core & Checkpoint
            { x: 1720, y: 500, w: 360, h: 300, type: 'solid', style: 'cyber_grid' },

            // Laser gauntlet corridor
            { x: 2180, y: 420, w: 110, h: 24, type: 'moving', vx: -2.5, rangeX: 160, startX: 2180, style: 'cyber_grid' },
            { x: 2400, y: 320, w: 120, h: 24, type: 'solid', style: 'cyber_grid' },
            { x: 2600, y: 240, w: 90, h: 24, type: 'crumble', style: 'crumble' },
            { x: 2760, y: 330, w: 110, h: 24, type: 'moving', vy: -2.2, rangeY: 140, startY: 330, style: 'cyber_grid' },

            // Final Plateau
            { x: 2980, y: 560, w: 620, h: 240, type: 'solid', style: 'cyber_grid' }
        ],
        hazards: [
            { x: 320, y: 760, w: 620, h: 40, type: 'lava' },
            { x: 1240, y: 760, w: 480, h: 40, type: 'lava' },
            { x: 2080, y: 760, w: 900, h: 40, type: 'lava' }
        ],
        collectibles: [
            { x: 320, y: 410, type: 'coin', val: 5 },
            { x: 500, y: 300, type: 'coin', val: 5 },
            { x: 1160, y: 160, type: 'coin', val: 5 },
            { x: 1780, y: 440, type: 'coin', val: 5 },
            { x: 2240, y: 360, type: 'coin', val: 5 },
            { x: 2460, y: 260, type: 'coin', val: 5 },
            { x: 2820, y: 270, type: 'coin', val: 5 },
            // 3 Star Gems
            { x: 740, y: 200, type: 'star_gem', starIdx: 1 },
            { x: 1180, y: 100, type: 'star_gem', starIdx: 2 },
            { x: 2640, y: 110, type: 'star_gem', starIdx: 3 }
        ],
        checkpoints: [
            { x: 1800, y: 420, w: 40, h: 80, activated: false }
        ],
        enemies: [
            { type: 'turret', x: 1160, y: 480, rangeX: 0 },
            { type: 'knight', x: 1000, y: 460, rangeX: 60 },
            { type: 'bat', x: 1400, y: 220, rangeX: 180 },
            { type: 'knight', x: 1900, y: 440, rangeX: 80 },
            { type: 'turret', x: 2450, y: 280, rangeX: 0 },
            { type: 'imp', x: 2800, y: 200, rangeX: 120 }
        ],
        exit: { x: 3420, y: 470, w: 60, h: 90 }
    },

    // ==========================================
    // STAGE 6: SHADOW REALM (بُعد الظلال - مسارات سرية)
    // ==========================================
    {
        id: 6,
        titleAr: "بُعد الظلال",
        titleEn: "Shadow Realm",
        biome: "shadow",
        targetTime: 90,
        width: 3200,
        height: 800,
        spawn: { x: 80, y: 520 },
        bgGradient: ['#050014', '#150030', '#2d004d'],
        platforms: [
            { x: 0, y: 600, w: 400, h: 200, type: 'solid', style: 'shadow_stone' },
            { x: 340, y: 470, w: 120, h: 24, type: 'crumble', style: 'shadow_crumble' },
            { x: 530, y: 380, w: 140, h: 24, type: 'solid', style: 'shadow_stone' },

            // High Upper Passage
            { x: 810, y: 340, w: 280, h: 30, type: 'solid', style: 'shadow_stone' },
            { x: 810, y: 180, w: 280, h: 30, type: 'solid', style: 'shadow_stone' },

            // Main Route
            { x: 720, y: 540, w: 200, h: 260, type: 'solid', style: 'shadow_stone' },
            { x: 990, y: 460, w: 150, h: 24, type: 'moving', vx: 2.2, rangeX: 180, startX: 990, style: 'shadow_stone' },
            { x: 1350, y: 360, w: 120, h: 24, type: 'crumble', style: 'shadow_crumble' },
            { x: 1550, y: 480, w: 300, h: 320, type: 'solid', style: 'shadow_stone' },
            { x: 1920, y: 390, w: 130, h: 24, type: 'moving', vx: -2, rangeX: 160, startX: 1920, style: 'shadow_stone' },
            { x: 2150, y: 280, w: 140, h: 24, type: 'solid', style: 'shadow_stone' },
            { x: 2360, y: 390, w: 110, h: 24, type: 'bounce', bounceForce: -19, style: 'shadow_bounce' },
            { x: 2550, y: 260, w: 160, h: 24, type: 'solid', style: 'shadow_stone' },
            { x: 2800, y: 480, w: 400, h: 320, type: 'solid', style: 'shadow_stone' }
        ],
        hazards: [
            { x: 400, y: 720, w: 320, h: 80, type: 'void_spikes' },
            { x: 920, y: 720, w: 630, h: 80, type: 'void_spikes' },
            { x: 1850, y: 720, w: 950, h: 80, type: 'void_spikes' }
        ],
        collectibles: [
            { x: 220, y: 400, type: 'coin', val: 5 },
            { x: 580, y: 320, type: 'coin', val: 5 },
            // Upper High Ledge: Ultimate Rune + Gold Cache + Star 1
            { x: 900, y: 280, type: 'ultimate_rune' },
            { x: 960, y: 280, type: 'coin', val: 20 },
            { x: 1020, y: 280, type: 'star_gem', starIdx: 1 },

            { x: 1400, y: 300, type: 'coin', val: 5 },
            { x: 1680, y: 420, type: 'star_gem', starIdx: 2 },
            { x: 2200, y: 220, type: 'coin', val: 10 },
            { x: 2620, y: 200, type: 'star_gem', starIdx: 3 }
        ],
        checkpoints: [
            { x: 1650, y: 400, w: 40, h: 80, activated: false }
        ],
        enemies: [
            { type: 'bat', x: 480, y: 300, rangeX: 140 },
            { type: 'knight', x: 780, y: 490, rangeX: 90 },
            { type: 'imp', x: 1420, y: 280, rangeX: 120 },
            { type: 'turret', x: 1720, y: 440 },
            { type: 'bat', x: 2000, y: 260, rangeX: 180 },
            { type: 'knight', x: 2900, y: 430, rangeX: 80 }
        ],
        exit: { x: 3050, y: 390, w: 60, h: 90 }
    },

    // ==========================================
    // STAGE 7: NEON CYBER METROPOLIS (المدينة السيبرانية)
    // ==========================================
    {
        id: 7,
        titleAr: "المدينة السيبرانية",
        titleEn: "Neon Cyber Metropolis",
        biome: "metropolis",
        targetTime: 100,
        width: 3600,
        height: 800,
        spawn: { x: 80, y: 520 },
        bgGradient: ['#020b14', '#002b47', '#005f73'],
        platforms: [
            { x: 0, y: 600, w: 380, h: 200, type: 'solid', style: 'cyber_tower' },
            { x: 320, y: 470, w: 130, h: 24, type: 'solid', style: 'cyber_tower' },
            { x: 520, y: 360, w: 140, h: 24, type: 'bounce', bounceForce: -19, style: 'cyber_bounce' },
            { x: 740, y: 260, w: 180, h: 24, type: 'moving', vx: 2.5, rangeX: 200, startX: 740, style: 'cyber_tower' },

            // High rooftop bridge
            { x: 1060, y: 180, w: 260, h: 24, type: 'solid', style: 'cyber_tower' },

            { x: 1200, y: 520, w: 320, h: 280, type: 'solid', style: 'cyber_tower' },
            { x: 1600, y: 420, w: 140, h: 24, type: 'moving', vx: -2, rangeX: 180, startX: 1600, style: 'cyber_tower' },
            { x: 1850, y: 310, w: 130, h: 24, type: 'crumble', style: 'cyber_crumble' },
            { x: 2060, y: 420, w: 130, h: 24, type: 'bounce', bounceForce: -20, style: 'cyber_bounce' },
            { x: 2280, y: 260, w: 200, h: 24, type: 'solid', style: 'cyber_tower' },
            { x: 2560, y: 360, w: 140, h: 24, type: 'moving', vx: 2.2, rangeX: 160, startX: 2560, style: 'cyber_tower' },
            { x: 2800, y: 480, w: 180, h: 24, type: 'crumble', style: 'cyber_crumble' },
            { x: 3100, y: 560, w: 500, h: 240, type: 'solid', style: 'cyber_tower' }
        ],
        hazards: [
            { x: 380, y: 720, w: 820, h: 80, type: 'laser_pit' },
            { x: 1520, y: 720, w: 1580, h: 80, type: 'laser_pit' },
            { x: 1300, y: 380, w: 24, h: 140, type: 'laser' }
        ],
        collectibles: [
            { x: 220, y: 400, type: 'coin', val: 5 },
            { x: 600, y: 220, type: 'coin', val: 10 },
            // Rooftop Secret: Star 1 + Ultimate Rune
            { x: 1120, y: 120, type: 'ultimate_rune' },
            { x: 1180, y: 120, type: 'star_gem', starIdx: 1 },

            { x: 1350, y: 460, type: 'coin', val: 10 },
            { x: 1900, y: 250, type: 'star_gem', starIdx: 2 },
            { x: 2360, y: 200, type: 'coin', val: 10 },
            { x: 2900, y: 420, type: 'star_gem', starIdx: 3 }
        ],
        checkpoints: [
            { x: 1300, y: 440, w: 40, h: 80, activated: false }
        ],
        enemies: [
            { type: 'turret', x: 360, y: 430 },
            { type: 'imp', x: 800, y: 190, rangeX: 140 },
            { type: 'knight', x: 1320, y: 470, rangeX: 100 },
            { type: 'turret', x: 2350, y: 220 },
            { type: 'bat', x: 2700, y: 280, rangeX: 160 },
            { type: 'knight', x: 3250, y: 510, rangeX: 120 }
        ],
        exit: { x: 3450, y: 470, w: 60, h: 90 }
    },

    // ==========================================
    // STAGE 8: SANCTUM OF THE COSMIC VOID (محراب الفراغ الكوني)
    // ==========================================
    {
        id: 8,
        titleAr: "محراب الفراغ الكوني",
        titleEn: "Sanctum of the Void",
        biome: "void_sanctum",
        targetTime: 110,
        width: 3200,
        height: 800,
        spawn: { x: 80, y: 520 },
        bgGradient: ['#000000', '#0a0017', '#1a0033'],
        platforms: [
            { x: 0, y: 600, w: 400, h: 200, type: 'solid', style: 'void_floor' },
            { x: 340, y: 470, w: 120, h: 24, type: 'solid', style: 'void_platform' },
            { x: 530, y: 380, w: 140, h: 24, type: 'bounce', bounceForce: -19, style: 'void_bounce' },
            { x: 740, y: 260, w: 180, h: 24, type: 'moving', vx: 2.5, rangeX: 200, startX: 740, style: 'void_platform' },
            { x: 1060, y: 380, w: 140, h: 24, type: 'crumble', style: 'crumble' },

            { x: 1300, y: 500, w: 350, h: 300, type: 'solid', style: 'void_floor' },
            { x: 1720, y: 420, w: 130, h: 24, type: 'moving', vx: -2, rangeX: 160, startX: 1720, style: 'void_platform' },
            { x: 1950, y: 320, w: 140, h: 24, type: 'solid', style: 'void_platform' },
            { x: 2200, y: 240, w: 120, h: 24, type: 'bounce', bounceForce: -20, style: 'void_bounce' },
            { x: 2450, y: 360, w: 150, h: 24, type: 'moving', vy: 2, rangeY: 140, startY: 360, style: 'void_platform' },
            { x: 2750, y: 520, w: 450, h: 280, type: 'solid', style: 'void_floor' }
        ],
        hazards: [
            { x: 400, y: 720, w: 900, h: 80, type: 'void_spikes' },
            { x: 1650, y: 720, w: 1100, h: 80, type: 'void_spikes' }
        ],
        collectibles: [
            { x: 220, y: 400, type: 'coin', val: 10 },
            { x: 600, y: 240, type: 'ultimate_rune' },
            { x: 800, y: 150, type: 'star_gem', starIdx: 1 },
            { x: 1400, y: 420, type: 'coin', val: 10 },
            { x: 2000, y: 230, type: 'star_gem', starIdx: 2 },
            { x: 2500, y: 260, type: 'ultimate_rune' },
            { x: 2850, y: 420, type: 'star_gem', starIdx: 3 }
        ],
        checkpoints: [
            { x: 1400, y: 420, w: 40, h: 80, activated: false }
        ],
        enemies: [
            { type: 'bat', x: 500, y: 260, rangeX: 160 },
            { type: 'knight', x: 1380, y: 430, rangeX: 80 },
            { type: 'turret', x: 1980, y: 280 },
            { type: 'imp', x: 2500, y: 220, rangeX: 120 }
        ],
        exit: { x: 3050, y: 430, w: 60, h: 90 }
    },

    // ==========================================
    // STAGE 9: THE ANCIENT COSMIC DRAGON (عرش التنين الكوني الأسطوري - الزعيم النهائي)
    // ==========================================
    {
        id: 9,
        titleAr: "عرش التنين الكوني الأسطوري",
        titleEn: "The Cosmic Dragon Sovereign",
        biome: "boss",
        targetTime: 160,
        width: 1800,
        height: 750,
        spawn: { x: 120, y: 520 },
        bgGradient: ['#000000', '#1c0303', '#3d0808'],
        platforms: [
            // Grand Obsidian Arena floor
            { x: 0, y: 600, w: 1800, h: 150, type: 'solid', style: 'boss_floor' },
            // Left tactical battle dais
            { x: 180, y: 440, w: 160, h: 24, type: 'solid', style: 'boss_platform' },
            { x: 230, y: 416, w: 48, h: 24, type: 'bounce', bounceForce: -19, style: 'magma_bounce' },

            // High Center Celestial Dragon Altars
            { x: 500, y: 300, w: 260, h: 24, type: 'solid', style: 'boss_platform' },
            { x: 1040, y: 300, w: 260, h: 24, type: 'solid', style: 'boss_platform' },

            // Right tactical battle dais
            { x: 1460, y: 440, w: 160, h: 24, type: 'solid', style: 'boss_platform' },
            { x: 1510, y: 416, w: 48, h: 24, type: 'bounce', bounceForce: -19, style: 'magma_bounce' }
        ],
        hazards: [
            { x: 0, y: 150, w: 24, h: 450, type: 'laser' },
            { x: 1776, y: 150, w: 24, h: 450, type: 'laser' }
        ],
        collectibles: [
            { x: 560, y: 240, type: 'coin', val: 20 },
            { x: 640, y: 240, type: 'ultimate_rune' },
            { x: 1100, y: 240, type: 'ultimate_rune' },
            { x: 1180, y: 240, type: 'coin', val: 20 },
            // Dragon Trophy Stars (Unlocked on HP phases!)
            { x: 630, y: 140, type: 'star_gem', starIdx: 1 },
            { x: 900, y: 110, type: 'star_gem', starIdx: 2 },
            { x: 1170, y: 140, type: 'star_gem', starIdx: 3 }
        ],
        checkpoints: [],
        enemies: [
            { type: 'boss', x: 900, y: 380, maxHp: 60, isDragon: true }
        ],
        exit: { x: 1660, y: 510, w: 60, h: 90, lockedUntilBossDead: true }
    }
];

window.GAME_LEVELS = GAME_LEVELS;

