/**
 * COSMIC KNIGHT 2D - RENDERER & PHYSICS ENGINE (POLISHED & BUG-FREE)
 * 60 FPS Canvas game loop, camera tracking, screen shake, parallax backgrounds and tile rendering.
 */

class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Camera
        this.cameraX = 0;
        this.cameraY = 0;
        this.shakeTimer = 0;
        this.shakeIntensity = 0;

        // Platform entities & Hazards
        this.platforms = [];
        this.hazards = [];
        this.collectibles = [];
        this.enemies = [];
        this.projectiles = [];
        this.checkpoints = [];
        this.exit = null;
        this.currentLevel = null;
        this.activeSpawn = { x: 80, y: 480 };

        this.lastTime = 0;
        this.isRunning = false;

        window.gameEngine = this;
    }

    loadLevel(levelData, player, fromCheckpoint = false) {
        this.currentLevel = levelData;

        // Reset active spawn if not from checkpoint
        if (!fromCheckpoint) {
            this.activeSpawn = { ...levelData.spawn };
        }

        // Clone platforms to keep track of dynamic states (crumble, moving)
        this.platforms = levelData.platforms.map(p => ({
            ...p,
            currentVx: p.vx || 0,
            currentVy: p.vy || 0,
            shaking: false,
            crumbleTimer: 0,
            broken: false,
            respawnTimer: 0,
            squashTimer: 0
        }));

        this.hazards = [...levelData.hazards];
        this.checkpoints = levelData.checkpoints.map(cp => ({ ...cp, activated: false }));
        this.collectibles = levelData.collectibles.map(c => new Collectible(c));
        this.enemies = levelData.enemies.map(e => new Enemy(e.type, e.x, e.y, e.rangeX, e.maxHp));
        this.projectiles = [];
        this.exit = { ...levelData.exit };

        // Position player at active spawn
        player.reset(this.activeSpawn.x, this.activeSpawn.y);

        // Reset camera
        this.cameraX = player.x - this.width * 0.35;
        this.cameraY = player.y - this.height * 0.6;
        this.clampCamera();

        // Clear particles & start biome music
        window.particleSystem.clear();
        window.soundEngine.playBGM(levelData.biome);
    }

    addScreenShake(intensity = 6, duration = 0.25) {
        this.shakeIntensity = intensity;
        this.shakeTimer = duration;
    }

    update(dt, player, input) {
        if (!this.currentLevel) return;

        // Update Screen Shake & Finisher Timer
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
        }
        if (this.ultimateFinisherTimer > 0) {
            this.ultimateFinisherTimer -= dt;
        }

        // ================= 1. UPDATE DYNAMIC PLATFORMS =================
        for (const p of this.platforms) {
            // Moving Platforms
            if (p.type === 'moving') {
                if (p.vx) {
                    p.x += p.currentVx * dt * 60;
                    if (p.x > p.startX + p.rangeX) p.currentVx = -Math.abs(p.vx);
                    else if (p.x < p.startX) p.currentVx = Math.abs(p.vx);
                }
                if (p.vy) {
                    p.y += p.currentVy * dt * 60;
                    if (p.y > p.startY + p.rangeY) p.currentVy = -Math.abs(p.vy);
                    else if (p.y < p.startY) p.currentVy = Math.abs(p.vy);
                }
            }

            // Crumbling Platforms
            if (p.type === 'crumble') {
                if (p.shaking) {
                    p.crumbleTimer -= dt;
                    if (p.crumbleTimer <= 0) {
                        p.broken = true;
                        p.shaking = false;
                        p.respawnTimer = 3.0;
                        window.particleSystem.emitHitSparks(p.x + p.w * 0.5, p.y + p.h * 0.5, '#78716c');
                    }
                } else if (p.broken) {
                    p.respawnTimer -= dt;
                    if (p.respawnTimer <= 0) {
                        p.broken = false;
                    }
                }
            }

            // Bounce Pad Squash
            if (p.type === 'bounce' && p.squashTimer > 0) {
                p.squashTimer -= dt;
            }
        }

        // ================= 2. UPDATE PLAYER =================
        player.update(dt, input, this.platforms, this.hazards, this.currentLevel.width, this.currentLevel.height);

        // ================= 2.5 SECRET WALLS CHECK =================
        for (const p of this.platforms) {
            if (p.type === 'secret_wall' && !p.dissolved) {
                const near = player.rectIntersect(player, { x: p.x - 28, y: p.y - 20, w: p.w + 56, h: p.h + 40 });
                if (near && (player.isAttacking || player.isDashing)) {
                    p.dissolved = true;
                    window.soundEngine.playSecretFound();
                    window.particleSystem.emitBossExplosion(p.x + p.w * 0.5, p.y + p.h * 0.5, p.w, p.h);
                    player.chargeUltimate(45);
                    if (window.gameManager) window.gameManager.showToast('✨ ممر سري! تم اكتشاف غرفة خفية');
                }
            }
        }

        // ================= 3. UPDATE CHECKPOINTS =================
        for (const cp of this.checkpoints) {
            if (!cp.activated && player.rectIntersect(player, cp)) {
                cp.activated = true;
                this.activeSpawn = { x: cp.x, y: cp.y - 10 };
                window.soundEngine.playCheckpoint();
                window.particleSystem.emitCheckpointChime(cp.x + 20, cp.y + 40);
            }
        }

        // ================= 4. UPDATE ENEMIES =================
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(dt, player, this.projectiles);
            if (enemy.isDead && enemy.type !== 'boss') {
                window.gameManager.addScore(enemy.scoreVal);
                window.gameManager.enemiesDefeated++;
                player.chargeUltimate(12);
                this.enemies.splice(i, 1);
            }
        }

        // Update Boss HUD if boss is present
        const boss = this.enemies.find(e => e.type === 'boss');
        const bossHud = document.getElementById('boss-hud-bar');
        if (boss && !boss.isDead) {
            if (bossHud) {
                bossHud.classList.remove('hidden');
                const hpPercent = Math.max(0, (boss.hp / boss.maxHp) * 100);
                document.getElementById('boss-hp-fill').style.width = hpPercent + '%';
                document.getElementById('boss-phase-badge').innerText = 'الطور ' + boss.phase;
            }
        } else if (bossHud) {
            bossHud.classList.add('hidden');
        }

        // ================= 5. UPDATE PROJECTILES =================
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.update(dt, player, this.platforms);

            // Player Projectiles hitting enemies
            if (proj.owner === 'player') {
                for (const enemy of this.enemies) {
                    if (!enemy.isDead && player.rectIntersect(proj, enemy)) {
                        enemy.takeDamage(1, player);
                        proj.isDead = true;
                        window.particleSystem.emitHitSparks(proj.x, proj.y, proj.color);
                        break;
                    }
                }
            }

            if (proj.isDead) {
                this.projectiles.splice(i, 1);
            }
        }

        // ================= 6. UPDATE COLLECTIBLES =================
        for (const c of this.collectibles) {
            c.update(dt, player);
        }

        // ================= 7. CHECK EXIT REACHED =================
        if (this.exit) {
            const exitBox = { x: this.exit.x, y: this.exit.y, w: this.exit.w, h: this.exit.h };
            if (player.rectIntersect(player, exitBox)) {
                if (this.exit.lockedUntilBossDead) {
                    const activeBoss = this.enemies.find(e => e.type === 'boss' && !e.isDead);
                    if (!activeBoss) {
                        window.gameManager.completeLevel();
                    }
                } else {
                    window.gameManager.completeLevel();
                }
            }
        }

        // ================= 8. UPDATE PARTICLES & CAMERA =================
        window.particleSystem.update(dt, this.currentLevel.biome, this.cameraX, this.cameraY, this.width, this.height);

        // Smooth Camera Follow with lookahead
        const targetCamX = player.x - this.width * 0.4 + (player.facingRight ? 40 : -40);
        const targetCamY = player.y - this.height * 0.55;
        this.cameraX += (targetCamX - this.cameraX) * 0.1;
        this.cameraY += (targetCamY - this.cameraY) * 0.08;
        this.clampCamera();
    }

    clampCamera() {
        if (!this.currentLevel) return;
        this.cameraX = Math.max(0, Math.min(this.currentLevel.width - this.width, this.cameraX));
        this.cameraY = Math.max(0, Math.min(this.currentLevel.height - this.height, this.cameraY));
    }

    // ================= RENDERING =================
    render(player) {
        if (!this.currentLevel) return;

        let renderCamX = this.cameraX;
        let renderCamY = this.cameraY;
        if (this.shakeTimer > 0) {
            renderCamX += (Math.random() - 0.5) * this.shakeIntensity;
            renderCamY += (Math.random() - 0.5) * this.shakeIntensity;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Parallax Background
        this.drawParallaxBg(renderCamX, renderCamY);

        // 2. Platforms
        this.drawPlatforms(renderCamX, renderCamY);

        // 3. Hazards
        this.drawHazards(renderCamX, renderCamY);

        // 4. Checkpoints
        this.drawCheckpoints(renderCamX, renderCamY);

        // 5. Collectibles
        for (const c of this.collectibles) {
            c.draw(this.ctx, renderCamX, renderCamY);
        }

        // 7. Enemies
        for (const e of this.enemies) {
            e.draw(this.ctx, renderCamX, renderCamY);
        }

        // 8. Projectiles
        for (const p of this.projectiles) {
            p.draw(this.ctx, renderCamX, renderCamY);
        }

        // 9. Player
        player.draw(this.ctx, renderCamX, renderCamY);

        // 10. Particles & Ambient Weather
        window.particleSystem.draw(this.ctx, renderCamX, renderCamY);

        // 11. ULTIMATE FINISHER CINEMATIC OVERLAY
        if (this.ultimateFinisherTimer > 0) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 229, 255, 0.22)';
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 5;
            this.ctx.shadowColor = '#00e5ff';
            this.ctx.shadowBlur = 20;

            const progress = Math.max(0, Math.min(1, (0.8 - this.ultimateFinisherTimer) / 0.8));
            const slashOffset = progress * this.width * 1.4;

            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(slashOffset - 250 * i, 0);
                this.ctx.lineTo(slashOffset + 350 - 250 * i, this.height);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
    }

    drawParallaxBg(camX, camY) {
        const bg = this.currentLevel.bgGradient;
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, bg[0]);
        grad.addColorStop(0.5, bg[1]);
        grad.addColorStop(1, bg[2]);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Distant Mountain Silhouettes
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        this.ctx.beginPath();
        const offsetFar = camX * 0.15;
        this.ctx.moveTo(0, this.height);
        for (let x = 0; x <= this.width + 100; x += 120) {
            const h = Math.sin((x + offsetFar) * 0.008) * 90 + 260;
            this.ctx.lineTo(x, this.height - h);
        }
        this.ctx.lineTo(this.width, this.height);
        this.ctx.closePath();
        this.ctx.fill();

        // Mid Hill Silhouettes
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        this.ctx.beginPath();
        const offsetMid = camX * 0.3;
        this.ctx.moveTo(0, this.height);
        for (let x = 0; x <= this.width + 100; x += 80) {
            const h = Math.sin((x + offsetMid) * 0.012) * 60 + 160;
            this.ctx.lineTo(x, this.height - h);
        }
        this.ctx.lineTo(this.width, this.height);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawPlatforms(camX, camY) {
        for (const p of this.platforms) {
            if (p.broken) continue;
            if (p.type === 'secret_wall' && p.dissolved) continue;

            const rx = Math.round(p.x - camX);
            const ry = Math.round(p.y - camY + (p.shaking ? (Math.random() - 0.5) * 4 : 0));

            if (rx + p.w < -50 || rx > this.width + 50 || ry + p.h < -50 || ry > this.height + 50) continue;

            this.ctx.save();

            if (p.type === 'bounce') {
                const squash = p.squashTimer > 0 ? 6 : 0;
                this.ctx.fillStyle = p.style === 'mushroom' ? '#e63946' : (p.style === 'void_bounce' ? '#9d4edd' : '#00e5ff');
                this.ctx.shadowColor = this.ctx.fillStyle;
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(rx + p.w * 0.5, ry + p.h + squash, p.w * 0.5, Math.PI, 0);
                this.ctx.fill();

                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(rx + p.w * 0.5, ry + 8 + squash, 4, 0, Math.PI * 2);
                this.ctx.arc(rx + 10, ry + 12 + squash, 3, 0, Math.PI * 2);
                this.ctx.arc(rx + p.w - 10, ry + 12 + squash, 3, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'secret_wall') {
                this.ctx.fillStyle = '#100c24';
                this.ctx.fillRect(rx, ry, p.w, p.h);
                this.ctx.strokeStyle = '#c77dff';
                this.ctx.lineWidth = 2;
                this.ctx.shadowColor = '#00e5ff';
                this.ctx.shadowBlur = 12;
                this.ctx.strokeRect(rx, ry, p.w, p.h);

                this.ctx.fillStyle = '#00e5ff';
                this.ctx.font = '16px sans-serif';
                this.ctx.fillText('✨', rx + p.w * 0.5 - 8, ry + p.h * 0.5 + 6);
            } else if (p.style === 'grass') {
                this.ctx.fillStyle = '#1c2541';
                this.ctx.fillRect(rx, ry + 8, p.w, p.h - 8);
                this.ctx.fillStyle = '#10b981';
                this.ctx.fillRect(rx, ry, p.w, 8);
                this.ctx.fillStyle = '#34d399';
                this.ctx.fillRect(rx, ry, p.w, 2);
            } else if (p.style === 'wood') {
                this.ctx.fillStyle = '#92400e';
                this.ctx.fillRect(rx, ry, p.w, p.h);
                this.ctx.fillStyle = '#b45309';
                this.ctx.fillRect(rx, ry, p.w, 4);
                this.ctx.fillStyle = '#f59e0b';
                this.ctx.fillRect(rx + 4, ry + 6, 4, 4);
                this.ctx.fillRect(rx + p.w - 8, ry + 6, 4, 4);
            } else if (p.style === 'crystal_rock') {
                this.ctx.fillStyle = '#0f172a';
                this.ctx.fillRect(rx, ry, p.w, p.h);
                this.ctx.fillStyle = '#00e5ff';
                this.ctx.shadowColor = '#00e5ff';
                this.ctx.shadowBlur = 8;
                this.ctx.fillRect(rx, ry, p.w, 4);
            } else if (p.style === 'magma_rock') {
                this.ctx.fillStyle = '#1c0f0f';
                this.ctx.fillRect(rx, ry, p.w, p.h);
                this.ctx.fillStyle = '#ff5400';
                this.ctx.shadowColor = '#ff5400';
                this.ctx.shadowBlur = 10;
                this.ctx.fillRect(rx, ry, p.w, 4);
            } else if (p.style === 'shadow_stone') {
                this.ctx.fillStyle = '#0c001f';
                this.ctx.fillRect(rx, ry, p.w, p.h);
                this.ctx.fillStyle = '#9d4edd';
                this.ctx.shadowColor = '#9d4edd';
                this.ctx.shadowBlur = 8;
                this.ctx.fillRect(rx, ry, p.w, 4);
            } else if (p.style === 'cyber_tower' || p.style === 'cyber_grid' || p.style === 'boss_platform' || p.style === 'boss_floor') {
                this.ctx.fillStyle = '#090d16';
                this.ctx.fillRect(rx, ry, p.w, p.h);
                this.ctx.strokeStyle = '#00e5ff';
                this.ctx.lineWidth = 2;
                this.ctx.shadowColor = '#00e5ff';
                this.ctx.shadowBlur = 8;
                this.ctx.strokeRect(rx, ry, p.w, p.h);
            } else if (p.style === 'void_floor' || p.style === 'void_platform') {
                this.ctx.fillStyle = '#05000e';
                this.ctx.fillRect(rx, ry, p.w, p.h);
                this.ctx.strokeStyle = '#ff0054';
                this.ctx.lineWidth = 2;
                this.ctx.shadowColor = '#ff0054';
                this.ctx.shadowBlur = 12;
                this.ctx.strokeRect(rx, ry, p.w, p.h);
            } else if (p.style === 'crumble' || p.style === 'shadow_crumble' || p.style === 'cyber_crumble') {
                this.ctx.fillStyle = p.shaking ? '#ef4444' : '#78716c';
                this.ctx.fillRect(rx, ry, p.w, p.h);
                this.ctx.fillStyle = '#a8a29e';
                this.ctx.fillRect(rx, ry, p.w, 3);
            } else {
                this.ctx.fillStyle = '#475569';
                this.ctx.fillRect(rx, ry, p.w, p.h);
            }

            this.ctx.restore();
        }
    }

    drawHazards(camX, camY) {
        for (const h of this.hazards) {
            const rx = Math.round(h.x - camX);
            const ry = Math.round(h.y - camY);

            this.ctx.save();
            if (h.type === 'spikes') {
                this.ctx.fillStyle = '#94a3b8';
                this.ctx.strokeStyle = '#e2e8f0';
                this.ctx.lineWidth = 1;
                const spikeW = 16;
                const count = Math.ceil(h.w / spikeW);
                this.ctx.beginPath();
                for (let i = 0; i < count; i++) {
                    const sx = rx + i * spikeW;
                    this.ctx.moveTo(sx, ry + h.h);
                    this.ctx.lineTo(sx + spikeW * 0.5, ry);
                    this.ctx.lineTo(sx + spikeW, ry + h.h);
                }
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            } else if (h.type === 'lava') {
                const grad = this.ctx.createLinearGradient(0, ry, 0, ry + h.h);
                grad.addColorStop(0, '#ffbd00');
                grad.addColorStop(0.3, '#ff5400');
                grad.addColorStop(1, '#9e0059');
                this.ctx.fillStyle = grad;
                this.ctx.shadowColor = '#ff5400';
                this.ctx.shadowBlur = 14;
                this.ctx.fillRect(rx, ry, h.w, h.h);
            } else if (h.type === 'laser') {
                this.ctx.fillStyle = '#ff0054';
                this.ctx.shadowColor = '#ff0054';
                this.ctx.shadowBlur = 16;
                this.ctx.fillRect(rx, ry, h.w, h.h);
            }
            this.ctx.restore();
        }
    }

    drawCheckpoints(camX, camY) {
        for (const cp of this.checkpoints) {
            const rx = Math.round(cp.x - camX);
            const ry = Math.round(cp.y - camY);

            this.ctx.save();
            this.ctx.fillStyle = '#cbd5e1';
            this.ctx.fillRect(rx + 6, ry, 4, cp.h);

            this.ctx.fillStyle = cp.activated ? '#00f59b' : '#64748b';
            this.ctx.shadowColor = this.ctx.fillStyle;
            this.ctx.shadowBlur = cp.activated ? 14 : 0;
            this.ctx.beginPath();
            this.ctx.moveTo(rx + 10, ry + 6);
            this.ctx.lineTo(rx + 36, ry + 18);
            this.ctx.lineTo(rx + 10, ry + 30);
            this.ctx.closePath();
            this.ctx.fill();
    }
}

window.GameEngine = GameEngine;
