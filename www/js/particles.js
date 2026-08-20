/**
 * COSMIC KNIGHT 2D - PARTICLE ENGINE
 * High-performance 2D particle simulation for combat, movement, environment and effects.
 */

class Particle {
    constructor(x, y, vx, vy, color, size, life, shape = 'circle', alphaDecay = true) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.initialSize = size;
        this.maxLife = life;
        this.life = life;
        this.shape = shape; // 'circle', 'square', 'star', 'spark', 'dust', 'trail'
        this.alphaDecay = alphaDecay;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.2;
        this.gravity = 0;
        this.friction = 0.98;
    }

    update(dt) {
        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity * dt * 60;
        this.rotation += this.rotSpeed * dt * 60;
        this.life -= dt;
    }

    draw(ctx, cameraX = 0, cameraY = 0) {
        if (this.life <= 0) return;
        const progress = Math.max(0, this.life / this.maxLife);
        const alpha = this.alphaDecay ? progress : 1;
        const currentSize = this.size * (0.3 + 0.7 * progress);

        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = currentSize > 4 ? 8 : 0;

        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(1, currentSize), 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'square') {
            ctx.fillRect(-currentSize / 2, -currentSize / 2, currentSize, currentSize);
        } else if (this.shape === 'spark') {
            ctx.beginPath();
            ctx.moveTo(-currentSize * 1.5, 0);
            ctx.lineTo(currentSize * 1.5, 0);
            ctx.moveTo(0, -currentSize * 1.5);
            ctx.lineTo(0, currentSize * 1.5);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (this.shape === 'star') {
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.lineTo(Math.cos(i * Math.PI / 2) * currentSize * 1.5, Math.sin(i * Math.PI / 2) * currentSize * 1.5);
                ctx.lineTo(Math.cos(i * Math.PI / 2 + Math.PI / 4) * currentSize * 0.4, Math.sin(i * Math.PI / 2 + Math.PI / 4) * currentSize * 0.4);
            }
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.ambientParticles = [];
        this.ambientTimer = 0;
    }

    update(dt, currentBiome = 'forest', cameraX = 0, cameraY = 0, viewW = 960, viewH = 540) {
        // Update active action particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(dt);
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update ambient weather/atmosphere particles
        this.ambientTimer += dt;
        if (this.ambientTimer > 0.08) {
            this.ambientTimer = 0;
            this.spawnAmbientParticle(currentBiome, cameraX, cameraY, viewW, viewH);
        }

        for (let i = this.ambientParticles.length - 1; i >= 0; i--) {
            const ap = this.ambientParticles[i];
            ap.update(dt);
            if (ap.life <= 0) {
                this.ambientParticles.splice(i, 1);
            }
        }
    }

    draw(ctx, cameraX, cameraY) {
        // Draw ambient particles first (behind some foreground)
        for (let i = 0; i < this.ambientParticles.length; i++) {
            this.ambientParticles[i].draw(ctx, cameraX, cameraY);
        }

        // Draw foreground action particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(ctx, cameraX, cameraY);
        }
    }

    // ================= SPECIFIC EMITTERS =================

    // Running dust on ground
    emitRunDust(x, y, dir = 1) {
        for (let i = 0; i < 2; i++) {
            const vx = -dir * (Math.random() * 1.5 + 0.5);
            const vy = -(Math.random() * 1.2 + 0.2);
            const size = Math.random() * 3 + 2;
            const p = new Particle(x + (Math.random() - 0.5) * 6, y, vx, vy, '#cbd5e1', size, 0.25, 'circle');
            p.gravity = 0.05;
            this.particles.push(p);
        }
    }

    // Jump burst
    emitJumpDust(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 8) * i + Math.PI;
            const speed = Math.random() * 2 + 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed * 0.4;
            const p = new Particle(x, y, vx, vy, '#e2e8f0', Math.random() * 3 + 2, 0.3, 'circle');
            this.particles.push(p);
        }
    }

    // Dash trail
    emitDashTrail(x, y, w, h, trailType = 'cyan', facingRight = true) {
        const colors = {
            cyan: ['#00e5ff', '#00b4d8', '#90e0ef'],
            fire: ['#ff3b30', '#ff9500', '#ffcc00'],
            ice: ['#a0c4ff', '#bdb2ff', '#e0aaff'],
            rainbow: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93']
        };
        const palette = colors[trailType] || colors.cyan;
        const color = palette[Math.floor(Math.random() * palette.length)];

        for (let i = 0; i < 3; i++) {
            const px = x + (Math.random() - 0.5) * w;
            const py = y + (Math.random() - 0.5) * h;
            const vx = (facingRight ? -1 : 1) * (Math.random() * 1.5 + 0.5);
            const vy = (Math.random() - 0.5) * 1.2;
            const p = new Particle(px, py, vx, vy, color, Math.random() * 4 + 3, 0.35, 'spark');
            this.particles.push(p);
        }
    }

    // Sword Slash Sparks & Arc
    emitSwordSparks(x, y, dir = 1) {
        for (let i = 0; i < 14; i++) {
            const angle = (Math.random() - 0.5) * Math.PI * 0.8 + (dir > 0 ? 0 : Math.PI);
            const speed = Math.random() * 4 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = Math.random() > 0.4 ? '#00e5ff' : '#ffffff';
            const p = new Particle(x, y, vx, vy, color, Math.random() * 3 + 2, 0.28, 'spark');
            p.friction = 0.95;
            this.particles.push(p);
        }
    }

    // Impact / Hit on enemy
    emitHitSparks(x, y, enemyColor = '#ff2e63') {
        for (let i = 0; i < 16; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1.5;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = Math.random() > 0.5 ? enemyColor : '#ffffff';
            const p = new Particle(x, y, vx, vy, color, Math.random() * 4 + 2, 0.35, 'square');
            p.gravity = 0.15;
            this.particles.push(p);
        }
    }

    // Coin collected shimmer
    emitCoinShimmer(x, y) {
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const p = new Particle(x, y, vx, vy, '#ffb703', Math.random() * 3 + 2, 0.4, 'star');
            this.particles.push(p);
        }
    }

    // Star Gem collected burst
    emitGemBurst(x, y, color = '#ffb703') {
        for (let i = 0; i < 24; i++) {
            const angle = (Math.PI * 2 / 24) * i;
            const speed = Math.random() * 4 + 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const p = new Particle(x, y, vx, vy, color, Math.random() * 5 + 3, 0.6, 'star');
            p.friction = 0.96;
            this.particles.push(p);
        }
    }

    // Checkpoint flag reached
    emitCheckpointChime(x, y) {
        for (let i = 0; i < 20; i++) {
            const vx = (Math.random() - 0.5) * 4;
            const vy = -(Math.random() * 5 + 2);
            const color = Math.random() > 0.5 ? '#00f59b' : '#00e5ff';
            const p = new Particle(x, y, vx, vy, color, Math.random() * 4 + 2, 0.8, 'spark');
            p.gravity = 0.12;
            this.particles.push(p);
        }
    }

    // Level Victory Confetti
    emitConfetti(cameraX, cameraY, viewW, viewH) {
        const colors = ['#ff2e63', '#00e5ff', '#ffb703', '#00f59b', '#9d4edd', '#ffffff'];
        for (let i = 0; i < 50; i++) {
            const x = cameraX + Math.random() * viewW;
            const y = cameraY - 20;
            const vx = (Math.random() - 0.5) * 3;
            const vy = Math.random() * 3 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = new Particle(x, y, vx, vy, color, Math.random() * 6 + 3, 2.5, 'square');
            p.friction = 0.99;
            p.rotSpeed = (Math.random() - 0.5) * 0.4;
            this.particles.push(p);
        }
    }

    // Boss Defeat Explosion
    emitBossExplosion(x, y, w, h) {
        for (let i = 0; i < 60; i++) {
            const px = x + (Math.random() - 0.5) * w;
            const py = y + (Math.random() - 0.5) * h;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const colors = ['#ff2e63', '#ff758c', '#ffb703', '#ffffff', '#9d4edd'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = new Particle(px, py, vx, vy, color, Math.random() * 6 + 3, 0.9, 'star');
            p.friction = 0.94;
            this.particles.push(p);
        }
    }

    // Ambient particles per biome
    spawnAmbientParticle(biome, cameraX, cameraY, viewW, viewH) {
        if (this.ambientParticles.length > 50) return;

        const x = cameraX + Math.random() * viewW;
        const y = cameraY + Math.random() * viewH;

        if (biome === 'forest') {
            // Glowing spores & drifting leaves
            const isSpore = Math.random() > 0.5;
            const color = isSpore ? '#70e000' : '#38b000';
            const vx = (Math.random() - 0.5) * 0.6;
            const vy = Math.random() * 0.8 + 0.2;
            const p = new Particle(x, y - 50, vx, vy, color, Math.random() * 3 + 1, 3.5, 'circle');
            this.ambientParticles.push(p);
        } else if (biome === 'cavern') {
            // Cyan crystal dust
            const vx = (Math.random() - 0.5) * 0.4;
            const vy = (Math.random() - 0.5) * 0.4;
            const p = new Particle(x, y, vx, vy, '#48cae4', Math.random() * 2.5 + 1, 3.0, 'star');
            this.ambientParticles.push(p);
        } else if (biome === 'volcano') {
            // Rising lava embers
            const vx = (Math.random() - 0.5) * 1.2;
            const vy = -(Math.random() * 1.8 + 0.6);
            const colors = ['#ff5400', '#ff0054', '#ffbd00'];
            const p = new Particle(x, y + 50, vx, vy, colors[Math.floor(Math.random() * colors.length)], Math.random() * 3 + 1.5, 2.8, 'spark');
            this.ambientParticles.push(p);
        } else if (biome === 'sky') {
            // Drifting mist & feathers
            const vx = -(Math.random() * 2.5 + 1.5);
            const vy = (Math.random() - 0.5) * 0.3;
            const p = new Particle(cameraX + viewW + 20, y, vx, vy, 'rgba(255, 255, 255, 0.4)', Math.random() * 4 + 2, 4.0, 'circle');
            this.ambientParticles.push(p);
        } else if (biome === 'cyber' || biome === 'boss') {
            // Digital matrix sparks
            const vx = (Math.random() - 0.5) * 0.8;
            const vy = -(Math.random() * 1.2 + 0.3);
            const colors = ['#00e5ff', '#9d4edd', '#ff2e63'];
            const p = new Particle(x, y, vx, vy, colors[Math.floor(Math.random() * colors.length)], Math.random() * 3 + 1, 2.5, 'square');
            this.ambientParticles.push(p);
        }
    }

    clear() {
        this.particles = [];
        this.ambientParticles = [];
    }
}

window.particleSystem = new ParticleSystem();
