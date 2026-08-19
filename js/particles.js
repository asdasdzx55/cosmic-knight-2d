/**
 * COSMIC KNIGHT 2D - HIGH-PERFORMANCE PARTICLE ENGINE
 * Ultra-optimized 2D particle simulation for combat, movement, environment and effects without GPU lag.
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
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
        this.shape = shape; // 'circle', 'square', 'spark', 'star'
        this.alphaDecay = alphaDecay;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.15;
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
        const currentSize = this.size * (0.4 + 0.6 * progress);

        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = this.color;

        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(1, currentSize), 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'square') {
            ctx.fillRect(-currentSize * 0.5, -currentSize * 0.5, currentSize, currentSize);
        } else if (this.shape === 'spark') {
            ctx.rotate(this.rotation);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-currentSize, 0); ctx.lineTo(currentSize, 0);
            ctx.moveTo(0, -currentSize); ctx.lineTo(0, currentSize);
            ctx.stroke();
        } else if (this.shape === 'star') {
            ctx.rotate(this.rotation);
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.lineTo(Math.cos(i * Math.PI / 2) * currentSize * 1.4, Math.sin(i * Math.PI / 2) * currentSize * 1.4);
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
        this.maxParticles = 50;
        this.maxAmbient = 18;
    }

    clear() {
        this.particles = [];
        this.ambientParticles = [];
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

        // Limit particles to prevent memory/GPU overload
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }

        // Update ambient weather/atmosphere particles
        this.ambientTimer += dt;
        if (this.ambientTimer > 0.15 && this.ambientParticles.length < this.maxAmbient) {
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
        // Draw ambient particles first (behind player)
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
        if (this.particles.length >= this.maxParticles) return;
        const vx = -dir * (Math.random() * 1.2 + 0.3);
        const vy = -(Math.random() * 0.8 + 0.2);
        const p = new Particle(x, y, vx, vy, '#94a3b8', Math.random() * 2.5 + 2, 0.2, 'circle');
        p.gravity = 0.05;
        this.particles.push(p);
    }

    // Jump burst
    emitJumpDust(x, y) {
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI / 4) * i + Math.PI;
            const speed = Math.random() * 1.5 + 0.8;
            const p = new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed * 0.4, '#cbd5e1', Math.random() * 2.5 + 1.5, 0.22, 'circle');
            this.particles.push(p);
        }
    }

    // Dash trail
    emitDashTrail(x, y, w, h, trailType = 'cyan', facingRight = true) {
        const colors = {
            cyan: ['#00e5ff', '#00b4d8'],
            flame: ['#ff3b30', '#ff9500'],
            void: ['#9d4edd', '#c77dff'],
            rainbow: ['#ff0054', '#00f59b', '#00e5ff']
        };
        const colorSet = colors[trailType] || colors.cyan;
        const color = colorSet[Math.floor(Math.random() * colorSet.length)];
        const p = new Particle(x, y, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, color, Math.random() * 6 + 4, 0.2, 'square');
        this.particles.push(p);
    }

    // Hit sparks
    emitHitSparks(x, y, color = '#ff0054') {
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3.5 + 1.5;
            const p = new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, Math.random() * 3 + 2, 0.28, 'spark');
            p.gravity = 0.1;
            this.particles.push(p);
        }
    }

    // Gem burst
    emitGemBurst(x, y, color = '#ffb703') {
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const speed = Math.random() * 3 + 1.5;
            const p = new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, Math.random() * 3.5 + 2, 0.35, 'star');
            p.gravity = 0.08;
            this.particles.push(p);
        }
    }

    // Coin Shimmer
    emitCoinShimmer(x, y) {
        for (let i = 0; i < 3; i++) {
            const p = new Particle(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10, 0, -Math.random() * 1.5 - 0.5, '#ffd166', Math.random() * 2.5 + 1.5, 0.25, 'circle');
            this.particles.push(p);
        }
    }

    // Boss explosion
    emitBossExplosion(x, y, w, h) {
        const colors = ['#ff0054', '#ff5400', '#ffb703', '#ffffff'];
        for (let i = 0; i < 15; i++) {
            const px = x + (Math.random() - 0.5) * w;
            const py = y + (Math.random() - 0.5) * h;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4.5 + 1.5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = new Particle(px, py, Math.cos(angle) * speed, Math.sin(angle) * speed, color, Math.random() * 5 + 3, 0.5, 'star');
            p.gravity = 0.1;
            this.particles.push(p);
        }
    }

    // Confetti Victory
    emitConfetti(cameraX, cameraY, width, height) {
        const colors = ['#ff0054', '#00f59b', '#00e5ff', '#ffb703', '#c77dff'];
        for (let i = 0; i < 20; i++) {
            const x = cameraX + Math.random() * width;
            const y = cameraY + Math.random() * (height * 0.4);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = new Particle(x, y, (Math.random() - 0.5) * 2, Math.random() * 2 + 1, color, Math.random() * 4 + 3, 0.9, 'square');
            p.gravity = 0.05;
            this.particles.push(p);
        }
    }

    // Ambient Atmosphere Spawner
    spawnAmbientParticle(biome, cameraX, cameraY, viewW, viewH) {
        let x, y, vx, vy, color, size, life, shape;

        if (biome === 'forest') {
            x = cameraX + Math.random() * viewW;
            y = cameraY - 10;
            vx = Math.sin(this.ambientTimer * 2) * 0.5 + 0.3;
            vy = Math.random() * 0.8 + 0.4;
            color = Math.random() > 0.5 ? '#00f59b' : '#70e000';
            size = Math.random() * 2.5 + 1.5;
            life = 4.0;
            shape = 'circle';
        } else if (biome === 'volcano') {
            x = cameraX + Math.random() * viewW;
            y = cameraY + viewH + 10;
            vx = (Math.random() - 0.5) * 0.8;
            vy = -(Math.random() * 1.5 + 0.8);
            color = Math.random() > 0.5 ? '#ff5400' : '#ffb703';
            size = Math.random() * 3 + 2;
            life = 3.5;
            shape = 'square';
        } else {
            x = cameraX + Math.random() * viewW;
            y = cameraY + Math.random() * viewH;
            vx = (Math.random() - 0.5) * 0.3;
            vy = (Math.random() - 0.5) * 0.3;
            color = '#00e5ff';
            size = Math.random() * 2 + 1;
            life = 3.0;
            shape = 'star';
        }

        const p = new Particle(x, y, vx, vy, color, size, life, shape);
        this.ambientParticles.push(p);
    }
}

window.particleSystem = new ParticleSystem();
