/**
 * COSMIC KNIGHT 2D - ENTITIES ENGINE (ENHANCED & BUG-FREE)
 * Player character physics, robust attack buffering, combos, enemies, projectiles, boss logic & items.
 */

// ==========================================
// PLAYER CLASS
// ==========================================
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 46;
        this.vx = 0;
        this.vy = 0;

        // Physics Constants
        this.accel = 1.4;
        this.maxSpeed = 6.4;
        this.friction = 0.82;
        this.gravity = 0.58;
        this.jumpForce = -12.8;
        this.doubleJumpForce = -11.2;

        // State Machine
        this.isGrounded = false;
        this.wasGrounded = false;
        this.maxJumps = 2;
        this.jumpsLeft = 2;
        this.facingRight = true;
        this.state = 'idle'; // 'idle', 'run', 'jump', 'fall', 'dash', 'wall_slide', 'attack', 'hurt'

        // Wall Jump & Slide
        this.isWallSliding = false;
        this.wallDir = 0; // -1 left wall, 1 right wall

        // Coyote Time & Jump Buffer
        this.coyoteTimer = 0;
        this.coyoteMax = 0.12;
        this.jumpBufferTimer = 0;
        this.jumpBufferMax = 0.14;

        // Dash Mechanics
        this.canDash = true;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashDuration = 0.16;
        this.dashCooldown = 0.75;
        this.dashCooldownTimer = 0;
        this.dashBufferTimer = 0;
        this.dashSpeed = 16.5;
        this.dashTrailType = 'cyan'; // 'cyan', 'fire', 'ice', 'rainbow'

        // Combat Mechanics & Buffering
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.22;
        this.attackCombo = 1;
        this.attackCooldownTimer = 0;
        this.attackBufferTimer = 0;
        this.hasHitEnemies = new Set();
        this.attackHitbox = { x: 0, y: 0, w: 0, h: 0 };

        // Ultimate Finisher Meter (0 to 100%)
        this.ultimateEnergy = 0;
        this.isExecutingUltimate = false;
        this.ultimateTimer = 0;
        this.ultimateCooldownTimer = 0;

        // Health & Special Character Traits
        this.maxHp = 3;
        this.hp = 3;
        this.invulnerableTimer = 0;
        this.isDead = false;
        this.isLavaImmune = false;
        this.isThunderLord = false;

        // Visual Customization
        this.skin = 'classic'; // 'classic', 'ninja', 'paladin', 'valkyrie', 'shadow'
        this.animTimer = 0;
    }

    applySkin(skinId) {
        this.skin = skinId;
        if (skinId === 'ninja') {
            this.maxJumps = 3; // Triple Jump!
            this.maxSpeed = 7.6;
            this.dashCooldown = 0.6;
            this.isLavaImmune = false;
            this.isThunderLord = false;
        } else if (skinId === 'paladin' || skinId === 'magma') {
            this.maxJumps = 2;
            this.maxSpeed = 6.2;
            this.maxHp = 4;
            this.hp = Math.max(this.hp, 4);
            this.isLavaImmune = true; // Lava & Void Spike Immunity!
            this.isThunderLord = false;
            this.dashCooldown = 0.75;
        } else if (skinId === 'valkyrie' || skinId === 'thunder') {
            this.maxJumps = 2;
            this.maxSpeed = 7.1;
            this.dashCooldown = 0.42; // Fast lightning dash!
            this.isThunderLord = true;
            this.isLavaImmune = false;
        } else {
            // Classic Cosmic Knight
            this.maxJumps = 2;
            this.maxSpeed = 6.4;
            this.maxHp = 3;
            this.isLavaImmune = false;
            this.isThunderLord = false;
            this.dashCooldown = 0.75;
        }
    }

    chargeUltimate(amount) {
        this.ultimateEnergy = Math.min(100, Math.max(0, this.ultimateEnergy + amount));
        const bar = document.getElementById('hud-ultimate-bar');
        const btn = document.getElementById('btn-ultimate');
        if (bar) bar.style.width = `${this.ultimateEnergy}%`;
        if (btn) {
            if (this.ultimateEnergy >= 100) {
                btn.classList.add('ready');
                btn.classList.add('pulse-anim');
            } else {
                btn.classList.remove('ready');
                btn.classList.remove('pulse-anim');
            }
        }
    }

    executeUltimate(gameEngine) {
        if (this.ultimateEnergy < 100 || this.ultimateCooldownTimer > 0 || !gameEngine) return;
        
        // Reset meter & set safety cooldown
        this.ultimateEnergy = 0;
        this.ultimateCooldownTimer = 2.0;
        this.chargeUltimate(0);

        this.invulnerableTimer = 1.8;
        this.isExecutingUltimate = true;
        this.ultimateTimer = 0.8;

        window.soundEngine.playUltimateFinisher();
        if (navigator.vibrate) navigator.vibrate([100, 50, 150]);

        gameEngine.addScreenShake(14, 0.6);
        gameEngine.ultimateFinisherTimer = 0.8;

        // Destroy all enemy projectiles
        gameEngine.projectiles = gameEngine.projectiles.filter(p => p.owner === 'player');

        // Massive Finisher Damage with isUltimate flag to prevent recursive charging
        for (let i = gameEngine.enemies.length - 1; i >= 0; i--) {
            const e = gameEngine.enemies[i];
            window.particleSystem.emitHitSparks(e.x + e.w * 0.5, e.y + e.h * 0.5, '#00e5ff');
            if (e.type === 'boss') {
                e.takeDamage(25, this, true);
            } else {
                e.takeDamage(10, this, true);
            }
        }

        if (window.gameManager) window.gameManager.showToast('⚔️ الضربة القاضية الكونية!');
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.hp = this.maxHp;
        this.isDead = false;
        this.invulnerableTimer = 0;
        this.isDashing = false;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackCooldownTimer = 0;
        this.attackBufferTimer = 0;
        this.dashCooldownTimer = 0;
        this.dashBufferTimer = 0;
        this.jumpBufferTimer = 0;
        this.ultimateCooldownTimer = 0;
        this.jumpsLeft = this.maxJumps || 2;
        this.hasHitEnemies.clear();
        this.ultimateEnergy = 0;
        this.chargeUltimate(35); // Start with 35% ultimate charge
    }

    update(dt, input, platforms, hazards, levelWidth, levelHeight) {
        if (this.isDead) return;

        this.animTimer += dt;
        if (this.ultimateTimer > 0) this.ultimateTimer -= dt;
        if (this.ultimateCooldownTimer > 0) this.ultimateCooldownTimer -= dt;

        // Check Ultimate Activation (U / Q key or Mobile Button or state)
        if ((input.ultimateJustPressed || input.ultimate) && this.ultimateEnergy >= 100 && this.ultimateCooldownTimer <= 0) {
            input.ultimate = false;
            input.ultimateJustPressed = false;
            if (window.gameEngine) {
                this.executeUltimate(window.gameEngine);
            }
        }

        // ================= UPDATE ALL TIMERS =================
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
        if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= dt;
        if (this.dashBufferTimer > 0) this.dashBufferTimer -= dt;
        if (this.jumpBufferTimer > 0) this.jumpBufferTimer -= dt;
        if (this.coyoteTimer > 0) this.coyoteTimer -= dt;
        if (this.attackCooldownTimer > 0) this.attackCooldownTimer -= dt;
        if (this.attackBufferTimer > 0) this.attackBufferTimer -= dt;

        // Check ground status for coyote time
        if (this.isGrounded) {
            this.coyoteTimer = this.coyoteMax;
            this.jumpsLeft = this.maxJumps || 2;
        }

        // ================= 1. ATTACK BUFFER & EXECUTION =================
        if (input.attack || input.attackJustPressed) {
            this.attackBufferTimer = 0.18;
        }

        if (this.attackBufferTimer > 0 && !this.isAttacking && this.attackCooldownTimer <= 0 && !this.isDashing) {
            this.isAttacking = true;
            this.attackTimer = this.attackDuration;
            this.attackCooldownTimer = 0.16;
            this.attackBufferTimer = 0;
            this.hasHitEnemies.clear();
            this.attackCombo = (this.attackCombo % 3) + 1;
            window.soundEngine.playAttack();

            this.chargeUltimate(8); // Generous +8% ultimate charge on swing

            if (navigator.vibrate) navigator.vibrate(25);

            // CHARACTER SPECIAL SKILLS ON ATTACK
            const dir = this.facingRight ? 1 : -1;
            if (this.skin === 'ninja' && window.gameEngine) {
                // Ninja Shuriken Throw
                window.soundEngine.playShuriken();
                window.gameEngine.projectiles.push(new Projectile(
                    this.facingRight ? this.x + this.w + 10 : this.x - 10,
                    this.y + this.h * 0.45,
                    dir * 11,
                    0,
                    '#00f5d4',
                    8,
                    'player'
                ));
            } else if ((this.skin === 'paladin' || this.skin === 'magma') && window.gameEngine) {
                // Magma Shockwave
                window.gameEngine.projectiles.push(new Projectile(
                    this.facingRight ? this.x + this.w + 10 : this.x - 10,
                    this.y + this.h - 10,
                    dir * 8.5,
                    0,
                    '#ffb703',
                    10,
                    'player'
                ));
            } else if ((this.skin === 'valkyrie' || this.skin === 'thunder') && window.gameEngine) {
                // Thunder Spark
                window.soundEngine.playThunder();
                window.gameEngine.projectiles.push(new Projectile(
                    this.facingRight ? this.x + this.w + 10 : this.x - 10,
                    this.y + this.h * 0.4,
                    dir * 10,
                    (Math.random() - 0.5) * 1.5,
                    '#c77dff',
                    9,
                    'player'
                ));
            }

            // Emit sword particle arc
            const swordX = this.facingRight ? this.x + this.w + 14 : this.x - 14;
            window.particleSystem.emitSwordSparks(swordX, this.y + this.h * 0.5, dir);
        }

        if (this.isAttacking) {
            this.attackTimer -= dt;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.attackHitbox = { x: 0, y: 0, w: 0, h: 0 };
            } else {
                const reach = 54;
                const hitboxX = this.facingRight ? (this.x + 4) : (this.x + this.w - 4 - reach);
                this.attackHitbox = {
                    x: hitboxX,
                    y: this.y - 12,
                    w: reach,
                    h: this.h + 24
                };
            }
        } else {
            this.attackHitbox = { x: 0, y: 0, w: 0, h: 0 };
        }

        // ================= 2. DASH BUFFER & HANDLING =================
        if (input.dash || input.dashJustPressed) {
            this.dashBufferTimer = 0.15;
        }

        if (this.dashBufferTimer > 0 && this.dashCooldownTimer <= 0 && !this.isDashing) {
            this.isDashing = true;
            this.dashTimer = this.dashDuration;
            this.dashCooldownTimer = this.dashCooldown;
            this.dashBufferTimer = 0;
            this.invulnerableTimer = Math.max(this.invulnerableTimer, this.dashDuration);
            window.soundEngine.playDash();

            if (navigator.vibrate) navigator.vibrate(35);

            // Burst velocity
            const dir = this.facingRight ? 1 : -1;
            this.vx = dir * this.dashSpeed;
            this.vy = 0;

            // Thunder Lord Dash Electrocution Aura
            if (this.isThunderLord && window.gameEngine) {
                window.soundEngine.playThunder();
                for (const enemy of window.gameEngine.enemies) {
                    const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                    if (dist < 90) {
                        enemy.takeDamage(2, this);
                        window.particleSystem.emitHitSparks(enemy.x + enemy.w * 0.5, enemy.y + enemy.h * 0.5, '#c77dff');
                    }
                }
            }
        }

        if (this.isDashing) {
            this.dashTimer -= dt;
            window.particleSystem.emitDashTrail(this.x + this.w * 0.5, this.y + this.h * 0.5, this.w, this.h, this.dashTrailType, this.facingRight);

            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.vx *= 0.45;
            } else {
                this.x += this.vx * dt * 60;
                this.handleHorizontalCollisions(platforms);
                return;
            }
        }

        // ================= 3. JUMP BUFFER & JUMP LOGIC (TRIPLE JUMP SUPPORT) =================
        if (input.jumpJustPressed) {
            this.jumpBufferTimer = this.jumpBufferMax;
        }

        if (this.jumpBufferTimer > 0) {
            if (this.isGrounded || this.coyoteTimer > 0) {
                // First Jump
                this.vy = this.jumpForce;
                this.isGrounded = false;
                this.coyoteTimer = 0;
                this.jumpBufferTimer = 0;
                this.jumpsLeft = (this.maxJumps || 2) - 1;
                window.soundEngine.playJump();
                window.particleSystem.emitJumpDust(this.x + this.w * 0.5, this.y + this.h);
                if (navigator.vibrate) navigator.vibrate(20);
            } else if (this.isWallSliding) {
                // Wall Jump
                this.vy = this.jumpForce * 0.95;
                this.vx = -this.wallDir * (this.maxSpeed * 1.25);
                this.facingRight = this.wallDir < 0;
                this.isWallSliding = false;
                this.jumpBufferTimer = 0;
                this.jumpsLeft = (this.maxJumps || 2) - 1;
                window.soundEngine.playJump();
                window.particleSystem.emitJumpDust(this.x + this.w * 0.5, this.y + this.h * 0.5);
                if (navigator.vibrate) navigator.vibrate(25);
            } else if (this.jumpsLeft > 0) {
                // Double / Triple Jump
                this.vy = this.doubleJumpForce;
                this.jumpsLeft--;
                this.jumpBufferTimer = 0;
                window.soundEngine.playDoubleJump();
                window.particleSystem.emitJumpDust(this.x + this.w * 0.5, this.y + this.h);
                if (navigator.vibrate) navigator.vibrate(30);
            }
        }

        // Variable Jump Height
        if (!input.jump && this.vy < -3) {
            this.vy *= 0.65;
        }

        // ================= 4. HORIZONTAL MOVEMENT =================
        let moveDir = 0;
        if (input.left) moveDir -= 1;
        if (input.right) moveDir += 1;

        if (moveDir !== 0) {
            this.vx += moveDir * this.accel;
            this.facingRight = moveDir > 0;
            if (this.isGrounded && Math.random() < 0.25) {
                window.particleSystem.emitRunDust(this.x + this.w * 0.5, this.y + this.h, moveDir);
            }
        } else {
            this.vx *= this.friction;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }

        // Clamp max speed
        this.vx = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.vx));

        // ================= 5. VERTICAL PHYSICS & WALL SLIDE =================
        this.vy += this.gravity;
        this.vy = Math.min(this.vy, 14); // terminal velocity

        // Check Wall Slide
        this.isWallSliding = false;
        if (!this.isGrounded && this.vy > 0) {
            if (input.left && this.checkWallCollision(platforms, -1)) {
                this.isWallSliding = true;
                this.wallDir = -1;
                this.vy = Math.min(this.vy, 2.5); // slow descent
            } else if (input.right && this.checkWallCollision(platforms, 1)) {
                this.isWallSliding = true;
                this.wallDir = 1;
                this.vy = Math.min(this.vy, 2.5);
            }
        }

        // ================= 6. COLLISION RESOLUTION =================
        // Horizontal
        this.x += this.vx * dt * 60;
        this.handleHorizontalCollisions(platforms);

        // Vertical
        this.wasGrounded = this.isGrounded;
        this.isGrounded = false;
        this.y += this.vy * dt * 60;
        this.handleVerticalCollisions(platforms);

        // Map Boundary clamp
        if (this.x < 0) this.x = 0;
        if (this.x + this.w > levelWidth) this.x = levelWidth - this.w;

        // Falling into pit / off screen
        if (this.y > levelHeight + 100) {
            this.takeDamage(999);
        }

        // Check Hazard collisions (spikes / lava)
        this.checkHazardCollisions(hazards);

        // State Machine
        if (this.isAttacking) this.state = 'attack';
        else if (this.isWallSliding) this.state = 'wall_slide';
        else if (!this.isGrounded && this.vy < 0) this.state = 'jump';
        else if (!this.isGrounded && this.vy >= 0) this.state = 'fall';
        else if (Math.abs(this.vx) > 0.5) this.state = 'run';
        else this.state = 'idle';
    }

    checkWallCollision(platforms, dir) {
        const testX = dir > 0 ? this.x + this.w + 2 : this.x - 2;
        const testBox = { x: testX, y: this.y + 4, w: 2, h: this.h - 8 };
        for (const p of platforms) {
            if (p.type === 'solid' && this.rectIntersect(testBox, p)) {
                return true;
            }
        }
        return false;
    }

    handleHorizontalCollisions(platforms) {
        for (const p of platforms) {
            if (p.type === 'solid' || (p.type === 'crumble' && !p.broken)) {
                if (this.rectIntersect(this, p)) {
                    if (this.vx > 0) {
                        this.x = p.x - this.w;
                    } else if (this.vx < 0) {
                        this.x = p.x + p.w;
                    }
                    this.vx = 0;
                }
            }
        }
    }

    handleVerticalCollisions(platforms) {
        for (const p of platforms) {
            if (p.type === 'bounce') {
                if (this.rectIntersect(this, p) && this.vy > 0 && this.y + this.h - this.vy <= p.y + 12) {
                    this.y = p.y - this.h;
                    this.vy = p.bounceForce || -16.5;
                    this.jumpsLeft = 2;
                    window.soundEngine.playDoubleJump();
                    window.particleSystem.emitJumpDust(this.x + this.w * 0.5, this.y + this.h);
                    p.squashTimer = 0.25;
                    return;
                }
            } else if (p.type === 'solid' || p.type === 'moving' || (p.type === 'crumble' && !p.broken)) {
                if (this.rectIntersect(this, p)) {
                    if (this.vy > 0 && (this.y + this.h - (this.vy * 1.5) <= p.y + 12)) {
                        // Landing on top of platform
                        this.y = p.y - this.h;
                        this.vy = 0;
                        this.isGrounded = true;
                        if (!this.wasGrounded) {
                            window.particleSystem.emitRunDust(this.x + this.w * 0.5, this.y + this.h, 0);
                        }
                        if (p.type === 'moving') {
                            if (p.vx) this.x += p.currentVx || 0;
                        }
                        if (p.type === 'crumble' && !p.shaking) {
                            p.shaking = true;
                            p.crumbleTimer = 0.6;
                        }
                    } else if (this.vy < 0) {
                        // Ceiling collision
                        this.y = p.y + p.h;
                        this.vy = 0;
                    }
                }
            }
        }
    }

    checkHazardCollisions(hazards) {
        if (this.invulnerableTimer > 0 || this.isDead) return;
        for (const h of hazards) {
            const hazardBox = { x: h.x + 4, y: h.y + 4, w: h.w - 8, h: h.h - 8 };
            if (this.rectIntersect(this, hazardBox)) {
                this.takeDamage(1);
                this.vy = -7.5;
                this.vx = this.facingRight ? -5 : 5;
                break;
            }
        }
    }

    takeDamage(amount = 1) {
        if (this.invulnerableTimer > 0 || this.isDead) return;
        this.hp -= amount;
        this.invulnerableTimer = 1.2;
        window.soundEngine.playHurt();
        if (navigator.vibrate) navigator.vibrate(100);

        window.particleSystem.emitHitSparks(this.x + this.w * 0.5, this.y + this.h * 0.5, '#ff2e63');

        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
            window.soundEngine.playDeath();
            if (navigator.vibrate) navigator.vibrate([150, 80, 200]);
        }
    }

    heal(amount = 1) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        window.particleSystem.emitGemBurst(this.x + this.w * 0.5, this.y + this.h * 0.5, '#00f59b');
    }

    rectIntersect(r1, r2) {
        return !(r2.x >= r1.x + r1.w ||
                 r2.x + r2.w <= r1.x ||
                 r2.y >= r1.y + r1.h ||
                 r2.y + r2.h <= r1.y);
    }

    // ================= RENDERING =================
    draw(ctx, cameraX, cameraY) {
        if (this.isDead) return;

        // Invulnerability Blink
        if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 20) % 2 === 0) {
            return;
        }

        const screenX = Math.round(this.x - cameraX);
        const screenY = Math.round(this.y - cameraY);

        ctx.save();
        ctx.translate(screenX + this.w * 0.5, screenY + this.h * 0.5);
        if (!this.facingRight) ctx.scale(-1, 1);

        // Skin Palettes
        const skins = {
            classic: { armor: '#00b4d8', visor: '#00f5d4', cape: '#ff0054', glow: '#00e5ff' },
            ninja: { armor: '#212529', visor: '#ff2e63', cape: '#ff2e63', glow: '#ff2e63' },
            paladin: { armor: '#ffb703', visor: '#ffffff', cape: '#fb8500', glow: '#ffb703' },
            valkyrie: { armor: '#7209b7', visor: '#4cc9f0', cape: '#f72585', glow: '#4cc9f0' },
            shadow: { armor: '#10002b', visor: '#c77dff', cape: '#7b2cbf', glow: '#c77dff' }
        };
        const palette = skins[this.skin] || skins.classic;

        const bob = (this.state === 'run') ? Math.sin(this.animTimer * 16) * 3 : 0;
        const capeSway = (this.state === 'run') ? Math.cos(this.animTimer * 16) * 8 : (this.state === 'jump' ? 12 : 2);

        // 1. Cape
        ctx.fillStyle = palette.cape;
        ctx.beginPath();
        ctx.moveTo(-6, -10 + bob);
        ctx.lineTo(-18 - capeSway, 14 + bob);
        ctx.lineTo(-6, 12 + bob);
        ctx.closePath();
        ctx.fill();

        // 2. Armor
        ctx.fillStyle = palette.armor;
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 8;
        ctx.fillRect(-10, -12 + bob, 20, 24);

        // 3. Helmet & Glowing Visor
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-12, -22 + bob, 24, 14);

        ctx.fillStyle = palette.visor;
        ctx.shadowColor = palette.visor;
        ctx.shadowBlur = 10;
        ctx.fillRect(2, -18 + bob, 8, 4);

        // 4. Boots
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0f172a';
        if (this.state === 'run') {
            const legSwing = Math.sin(this.animTimer * 16) * 6;
            ctx.fillRect(-8 + legSwing, 12, 6, 10);
            ctx.fillRect(2 - legSwing, 12, 6, 10);
        } else {
            ctx.fillRect(-8, 12, 6, 10);
            ctx.fillRect(2, 12, 6, 10);
        }

        // 5. Sword Animation & Huge Glowing Arc
        if (this.isAttacking) {
            const slashProgress = 1 - (this.attackTimer / this.attackDuration);
            const swordAngle = -Math.PI * 0.45 + slashProgress * Math.PI * 1.05;

            ctx.save();
            ctx.translate(6, 0 + bob);
            ctx.rotate(swordAngle);

            // Glowing Sword Blade
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = palette.glow;
            ctx.shadowBlur = 18;
            ctx.fillRect(0, -5, 34, 8);

            // Sword Guard & Hilt
            ctx.fillStyle = '#ffb703';
            ctx.fillRect(-5, -8, 7, 14);
            ctx.restore();

            // Energy Slash Crescent Arc
            ctx.save();
            ctx.strokeStyle = palette.glow;
            ctx.lineWidth = 5;
            ctx.shadowColor = palette.glow;
            ctx.shadowBlur = 22;
            ctx.beginPath();
            ctx.arc(12, 0, 38, -Math.PI * 0.4, Math.PI * 0.4);
            ctx.stroke();

            // Slash Sparkle Core
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(12, 0, 38, -Math.PI * 0.35, Math.PI * 0.35);
            ctx.stroke();
            ctx.restore();
        } else {
            // Resting Sword
            ctx.save();
            ctx.translate(-4, -4 + bob);
            ctx.rotate(-Math.PI * 0.2);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(0, -3, 20, 5);
            ctx.fillStyle = '#ffb703';
            ctx.fillRect(-3, -5, 4, 9);
            ctx.restore();
        }

        ctx.restore();
    }
}

// ==========================================
// ENEMY CLASSES
// ==========================================
class Enemy {
    constructor(type, x, y, rangeX = 100, maxHp = 2) {
        this.type = type; // 'slime', 'bat', 'knight', 'turret', 'imp', 'boss'
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.rangeX = rangeX;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.vx = 1.3;
        this.vy = 0;
        this.isDead = false;
        this.animTimer = Math.random() * 5;
        this.facingRight = true;
        this.shootTimer = 0;
        this.hurtTimer = 0;

        if (type === 'slime') {
            this.w = 34;
            this.h = 24;
            this.color = '#70e000';
            this.scoreVal = 100;
        } else if (type === 'bat') {
            this.w = 32;
            this.h = 26;
            this.color = '#9d4edd';
            this.scoreVal = 150;
        } else if (type === 'knight') {
            this.w = 36;
            this.h = 48;
            this.color = '#e63946';
            this.hp = 3;
            this.maxHp = 3;
            this.scoreVal = 250;
        } else if (type === 'turret') {
            this.w = 36;
            this.h = 36;
            this.color = '#4361ee';
            this.hp = 3;
            this.maxHp = 3;
            this.scoreVal = 200;
        } else if (type === 'imp') {
            this.w = 30;
            this.h = 32;
            this.color = '#ff5400';
            this.scoreVal = 200;
        } else if (type === 'boss') {
            this.w = 110;
            this.h = 130;
            this.hp = maxHp || 50;
            this.maxHp = maxHp || 50;
            this.color = '#ff0054';
            this.phase = 1;
            this.scoreVal = 5000;
            this.bossTimer = 0;
            this.teleportTimer = 0;
            this.droneSpawnTimer = 0;
        }
    }

    update(dt, player, projectiles) {
        if (this.isDead) return;

        this.animTimer += dt;
        if (this.hurtTimer > 0) this.hurtTimer -= dt;

        if (this.type === 'slime') {
            this.x += this.vx * dt * 60;
            if (this.x > this.startX + this.rangeX) {
                this.vx = -Math.abs(this.vx);
                this.facingRight = false;
            } else if (this.x < this.startX) {
                this.vx = Math.abs(this.vx);
                this.facingRight = true;
            }
        } else if (this.type === 'bat') {
            this.x += this.vx * dt * 60;
            this.y = this.startY + Math.sin(this.animTimer * 4) * 35;
            if (this.x > this.startX + this.rangeX) {
                this.vx = -Math.abs(this.vx);
                this.facingRight = false;
            } else if (this.x < this.startX) {
                this.vx = Math.abs(this.vx);
                this.facingRight = true;
            }
        } else if (this.type === 'knight') {
            this.x += (this.vx * 0.8) * dt * 60;
            if (this.x > this.startX + this.rangeX) {
                this.vx = -Math.abs(this.vx);
                this.facingRight = false;
            } else if (this.x < this.startX) {
                this.vx = Math.abs(this.vx);
                this.facingRight = true;
            }
        } else if (this.type === 'turret') {
            this.shootTimer += dt;
            if (this.shootTimer > 2.5) {
                this.shootTimer = 0;
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 650) {
                    const speed = 4.5;
                    projectiles.push(new Projectile(this.x + this.w * 0.5, this.y + this.h * 0.5, (dx / dist) * speed, (dy / dist) * speed, '#00e5ff', 8, 'enemy'));
                }
            }
        } else if (this.type === 'imp') {
            this.x = this.startX + Math.sin(this.animTimer * 2) * this.rangeX;
            this.y = this.startY + Math.cos(this.animTimer * 3) * 20;
            this.shootTimer += dt;
            if (this.shootTimer > 2.8) {
                this.shootTimer = 0;
                const dir = player.x > this.x ? 1 : -1;
                projectiles.push(new Projectile(this.x + this.w * 0.5, this.y + this.h * 0.5, dir * 3.8, 0.4, '#ff5400', 9, 'enemy'));
            }
        } else if (this.type === 'boss') {
            this.updateBoss(dt, player, projectiles);
        }

        // ================= SWORD ATTACK HIT DETECTION =================
        if (player.isAttacking && !player.hasHitEnemies.has(this)) {
            if (player.rectIntersect(player.attackHitbox, this)) {
                player.hasHitEnemies.add(this);
                this.takeDamage(1, player);
            }
        }

        // ================= PLAYER BODY COLLISION =================
        if (player.rectIntersect(player, this)) {
            if (player.isDashing) {
                if (!player.hasHitEnemies.has(this)) {
                    player.hasHitEnemies.add(this);
                    this.takeDamage(1, player);
                }
            } else {
                player.takeDamage(1);
            }
        }
    }

    updateBoss(dt, player, projectiles) {
        this.bossTimer += dt;
        this.teleportTimer += dt;
        this.droneSpawnTimer += dt;

        // Phase update
        if (this.hp <= 15) this.phase = 3;
        else if (this.hp <= 35) this.phase = 2;
        else this.phase = 1;

        // Boss hovering
        const hoverAmp = this.phase === 3 ? 24 : 16;
        const hoverSpeed = this.phase === 3 ? 3.5 : 2;
        this.y = this.startY + Math.sin(this.bossTimer * hoverSpeed) * hoverAmp;

        // PHASE 3: TELEPORT DASH ATTACK
        if (this.phase === 3 && this.teleportTimer > 5.0) {
            this.teleportTimer = 0;
            window.particleSystem.emitHitSparks(this.x + this.w * 0.5, this.y + this.h * 0.5, '#ff0054');
            window.soundEngine.playDash();

            // Teleport to a tactical spot near player
            const spots = [250, 600, 950, 1250];
            const chosenX = spots[Math.floor(Math.random() * spots.length)];
            this.x = chosenX;
            this.startX = chosenX;

            if (window.gameEngine) window.gameEngine.addScreenShake(8, 0.4);
            window.particleSystem.emitHitSparks(this.x + this.w * 0.5, this.y + this.h * 0.5, '#ffffff');

            // Ground Shockwave from teleport impact
            projectiles.push(new Projectile(this.x + 10, this.y + this.h - 10, -6, 0, '#ff0054', 12, 'enemy'));
            projectiles.push(new Projectile(this.x + this.w - 10, this.y + this.h - 10, 6, 0, '#ff0054', 12, 'enemy'));
        }

        // ATTACK PATTERNS PER PHASE
        const shootInterval = this.phase === 3 ? 1.1 : (this.phase === 2 ? 1.6 : 2.2);
        this.shootTimer += dt;

        if (this.shootTimer > shootInterval) {
            this.shootTimer = 0;
            window.soundEngine.playAttack();

            if (this.phase === 1) {
                // Dual high-speed laser spread + ground pulse
                const angles = [-0.22, 0, 0.22];
                const dir = player.x < this.x ? -1 : 1;
                angles.forEach(ang => {
                    projectiles.push(new Projectile(this.x + this.w * 0.5, this.y + 40, dir * 5.2 * Math.cos(ang), 5.2 * Math.sin(ang), '#ff0054', 10, 'enemy'));
                });

                // Ground pulse
                projectiles.push(new Projectile(this.x + this.w * 0.5, this.y + this.h - 15, dir * 5.5, 0, '#ff758c', 10, 'enemy'));
            } else if (this.phase === 2) {
                // Sky Meteor Rain (4 meteors falling from top)
                for (let i = 0; i < 4; i++) {
                    const dropX = player.x + (i - 1.5) * 140;
                    projectiles.push(new Projectile(dropX, this.y - 300, (Math.random() - 0.5) * 1.5, 5.5, '#9d4edd', 12, 'enemy'));
                }

                // 8-Way Radial Energy Burst
                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI * 2 / 8) * i;
                    projectiles.push(new Projectile(this.x + this.w * 0.5, this.y + 50, Math.cos(angle) * 4.8, Math.sin(angle) * 4.8, '#ff5400', 10, 'enemy'));
                }
            } else if (this.phase === 3) {
                // FRENZY OVERDRIVE: Rapid 5-shot homing barrage + dual ground sweep
                for (let i = -2; i <= 2; i++) {
                    const dx = player.x - this.x;
                    const dy = player.y - this.y;
                    const dist = Math.hypot(dx, dy) || 1;
                    const spd = 6.8;
                    projectiles.push(new Projectile(this.x + this.w * 0.5, this.y + 45, (dx / dist) * spd + i * 1.4, (dy / dist) * spd + (Math.random() - 0.5) * 2, '#ff0054', 12, 'enemy'));
                }

                // Ground sweep waves
                projectiles.push(new Projectile(this.x + this.w * 0.5, this.y + this.h - 15, -7, 0, '#ffb703', 12, 'enemy'));
                projectiles.push(new Projectile(this.x + this.w * 0.5, this.y + this.h - 15, 7, 0, '#ffb703', 12, 'enemy'));
            }
        }
    }

    takeDamage(amount, player, isUltimate = false) {
        if (this.isDead) return;

        // Shield Guard: blocks front hits unless player is dashing or behind him or is ultimate
        if (this.type === 'knight' && !isUltimate) {
            const isFacingPlayer = (this.facingRight && player.x > this.x) || (!this.facingRight && player.x < this.x);
            if (isFacingPlayer && !player.isDashing && player.y + player.h > this.y + 10) {
                window.soundEngine.playHit();
                window.particleSystem.emitHitSparks(this.x + this.w * 0.5, this.y + this.h * 0.5, '#ffffff');
                return; // Shield Blocked!
            }
        }

        this.hp -= amount;
        this.hurtTimer = 0.2;
        window.soundEngine.playHit();
        window.particleSystem.emitHitSparks(this.x + this.w * 0.5, this.y + this.h * 0.5, this.color);

        if (this.hp <= 0) {
            this.isDead = true;
            window.soundEngine.playCoin();
            if (!isUltimate && player && player.chargeUltimate) {
                player.chargeUltimate(this.type === 'boss' ? 50 : 15);
            }
            if (this.type === 'boss') {
                window.soundEngine.playLevelClear();
                window.particleSystem.emitBossExplosion(this.x + this.w * 0.5, this.y + this.h * 0.5, this.w, this.h);
                if (window.gameEngine) {
                    window.gameEngine.addScreenShake(12, 1.2);
                }
            } else {
                window.particleSystem.emitGemBurst(this.x + this.w * 0.5, this.y + this.h * 0.5, this.color);
            }
        }
    }

    draw(ctx, cameraX, cameraY) {
        if (this.isDead) return;

        const screenX = Math.round(this.x - cameraX);
        const screenY = Math.round(this.y - cameraY);

        ctx.save();
        ctx.translate(screenX + this.w * 0.5, screenY + this.h * 0.5);
        if (!this.facingRight) ctx.scale(-1, 1);

        if (this.hurtTimer > 0) {
            ctx.filter = 'brightness(2.2) contrast(1.5)';
        }

        if (this.type === 'slime') {
            const squash = Math.sin(this.animTimer * 8) * 3;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.ellipse(0, 4 - squash * 0.5, 16 + squash, 10 - squash, 0, 0, Math.PI * 2);
            ctx.fill();

            // Eyes
            ctx.fillStyle = '#fff';
            ctx.fillRect(4, -2, 4, 6);
            ctx.fillRect(10, -2, 4, 6);
            ctx.fillStyle = '#000';
            ctx.fillRect(6, 0, 2, 4);
            ctx.fillRect(12, 0, 2, 4);
        } else if (this.type === 'bat') {
            const wingFlap = Math.sin(this.animTimer * 16) * 12;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, 9, 0, Math.PI * 2);
            ctx.fill();
            // Wings
            ctx.beginPath();
            ctx.moveTo(-6, 0);
            ctx.lineTo(-18, -wingFlap);
            ctx.lineTo(-4, 6);
            ctx.moveTo(6, 0);
            ctx.lineTo(18, -wingFlap);
            ctx.lineTo(4, 6);
            ctx.fill();
            // Eyes
            ctx.fillStyle = '#ff2e63';
            ctx.fillRect(2, -2, 3, 3);
        } else if (this.type === 'knight') {
            ctx.fillStyle = '#334155';
            ctx.fillRect(-12, -20, 24, 38);
            ctx.fillStyle = '#e63946';
            ctx.shadowColor = '#e63946';
            ctx.shadowBlur = 8;
            ctx.fillRect(4, -14, 10, 28);
            ctx.fillStyle = '#ffb703';
            ctx.fillRect(0, -16, 6, 4);
        } else if (this.type === 'turret') {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-14, -14, 28, 28);
            ctx.fillStyle = '#00e5ff';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#64748b';
            ctx.fillRect(6, -4, 14, 8);
        } else if (this.type === 'imp') {
            ctx.fillStyle = '#ff5400';
            ctx.shadowColor = '#ff5400';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffbd00';
            ctx.fillRect(-8, -16, 4, 8);
            ctx.fillRect(4, -16, 4, 8);
        } else if (this.type === 'boss') {
            // THE ANCIENT COSMIC DRAGON (التنين الكوني الأسطوري)
            const wingFlap = Math.sin(this.bossTimer * 6) * 18;
            const coreColor = this.phase === 3 ? '#ff0054' : (this.phase === 2 ? '#ffb703' : '#9d4edd');

            // 1. Dragon Wings
            ctx.fillStyle = this.phase === 3 ? '#7a001e' : '#3d0859';
            ctx.strokeStyle = coreColor;
            ctx.lineWidth = 3;
            ctx.shadowColor = coreColor;
            ctx.shadowBlur = 15;

            // Left Wing
            ctx.beginPath();
            ctx.moveTo(-20, -10);
            ctx.quadraticCurveTo(-70, -60 + wingFlap, -95, -20 + wingFlap);
            ctx.lineTo(-65, 10);
            ctx.lineTo(-40, 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Right Wing
            ctx.beginPath();
            ctx.moveTo(20, -10);
            ctx.quadraticCurveTo(70, -60 + wingFlap, 95, -20 + wingFlap);
            ctx.lineTo(65, 10);
            ctx.lineTo(40, 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 2. Dragon Main Body
            ctx.fillStyle = '#12001c';
            ctx.strokeStyle = coreColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, 0, 36, 48, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Dragon Glowing Core / Chest
            ctx.fillStyle = coreColor;
            ctx.shadowColor = coreColor;
            ctx.shadowBlur = 24;
            ctx.beginPath();
            ctx.arc(0, 4, 14, 0, Math.PI * 2);
            ctx.fill();

            // 3. Dragon Head & Horns
            ctx.fillStyle = '#1c0326';
            ctx.beginPath();
            ctx.ellipse(0, -38, 22, 18, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Horns
            ctx.fillStyle = '#ffb703';
            ctx.beginPath();
            ctx.moveTo(-12, -45);
            ctx.lineTo(-24, -70);
            ctx.lineTo(-6, -50);
            ctx.moveTo(12, -45);
            ctx.lineTo(24, -70);
            ctx.lineTo(6, -50);
            ctx.fill();

            // Glowing Dragon Eyes
            ctx.fillStyle = '#00e5ff';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 10;
            ctx.fillRect(-10, -42, 6, 6);
            ctx.fillRect(4, -42, 6, 6);
        }

        ctx.restore();
    }
}

// ==========================================
// PROJECTILE CLASS
// ==========================================
class Projectile {
    constructor(x, y, vx, vy, color, radius = 6, owner = 'enemy') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = radius;
        this.w = radius * 2;
        this.h = radius * 2;
        this.owner = owner;
        this.life = 4.0;
        this.isDead = false;
    }

    update(dt, player, platforms) {
        if (this.isDead) return;

        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;
        this.life -= dt;

        if (this.life <= 0) {
            this.isDead = true;
            return;
        }

        if (Math.random() < 0.4) {
            window.particleSystem.particles.push(new Particle(this.x, this.y, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, this.color, 3, 0.25, 'spark'));
        }

        const projBox = { x: this.x - this.radius, y: this.y - this.radius, w: this.w, h: this.h };

        // SWORD SLICES PROJECTILE: player can slice enemy projectiles away!
        if (this.owner === 'enemy' && player.isAttacking && player.rectIntersect(player.attackHitbox, projBox)) {
            this.isDead = true;
            window.soundEngine.playHit();
            window.particleSystem.emitHitSparks(this.x, this.y, '#ffffff');
            return;
        }

        // Collide with player
        if (this.owner === 'enemy' && player.rectIntersect(player, projBox)) {
            if (!player.isDashing) {
                player.takeDamage(1);
            }
            this.isDead = true;
            window.particleSystem.emitHitSparks(this.x, this.y, this.color);
            return;
        }

        // Collide with solid platforms
        for (const p of platforms) {
            if (p.type === 'solid' && player.rectIntersect(projBox, p)) {
                this.isDead = true;
                window.particleSystem.emitHitSparks(this.x, this.y, this.color);
                break;
            }
        }
    }

    draw(ctx, cameraX, cameraY) {
        if (this.isDead) return;
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ==========================================
// COLLECTIBLE & INTERACTIVE CLASSES
// ==========================================
class Collectible {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.type = data.type; // 'coin', 'star_gem', 'heart'
        this.val = data.val || 5;
        this.starIdx = data.starIdx || 1;
        this.w = this.type === 'star_gem' ? 28 : 20;
        this.h = this.w;
        this.collected = false;
        this.animTimer = Math.random() * 4;
    }

    update(dt, player) {
        if (this.collected) return;
        this.animTimer += dt;

        if (player.rectIntersect(player, this)) {
            this.collected = true;
            if (this.type === 'coin') {
                window.soundEngine.playCoin();
                window.particleSystem.emitCoinShimmer(this.x + this.w * 0.5, this.y + this.h * 0.5);
                window.gameManager.addCoins(this.val);
            } else if (this.type === 'star_gem') {
                window.soundEngine.playGem();
                window.particleSystem.emitGemBurst(this.x + this.w * 0.5, this.y + this.h * 0.5, '#ffb703');
                window.gameManager.collectLevelStar(this.starIdx);
            } else if (this.type === 'ultimate_rune') {
                player.chargeUltimate(100);
                window.soundEngine.playSecretFound();
                window.particleSystem.emitGemBurst(this.x + this.w * 0.5, this.y + this.h * 0.5, '#c77dff');
                if (window.gameManager) window.gameManager.showToast('⚡ مخطوطة قديمة! تم شحن الضربة القاضية 100%');
            } else if (this.type === 'heart') {
                player.heal(1);
            }
        }
    }

    draw(ctx, cameraX, cameraY) {
        if (this.collected) return;

        const screenX = Math.round(this.x - cameraX);
        const screenY = Math.round(this.y - cameraY + Math.sin(this.animTimer * 4) * 4);

        ctx.save();
        ctx.translate(screenX + this.w * 0.5, screenY + this.h * 0.5);

        if (this.type === 'coin') {
            const scaleX = Math.cos(this.animTimer * 5);
            ctx.scale(scaleX, 1);
            ctx.fillStyle = '#ffb703';
            ctx.shadowColor = '#ffb703';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(0, 0, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fb8500';
            ctx.fillRect(-2, -6, 4, 12);
        } else if (this.type === 'star_gem') {
            ctx.rotate(this.animTimer * 1.5);
            ctx.fillStyle = '#ffb703';
            ctx.shadowColor = '#ffb703';
            ctx.shadowBlur = 18;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.lineTo(Math.cos(i * Math.PI / 2) * 14, Math.sin(i * Math.PI / 2) * 14);
                ctx.lineTo(Math.cos(i * Math.PI / 2 + Math.PI / 4) * 5, Math.sin(i * Math.PI / 2 + Math.PI / 4) * 5);
            }
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'ultimate_rune') {
            ctx.rotate(this.animTimer * 2);
            ctx.fillStyle = '#c77dff';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 22;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                ctx.lineTo(Math.cos(i * Math.PI / 3) * 15, Math.sin(i * Math.PI / 3) * 15);
                ctx.lineTo(Math.cos(i * Math.PI / 3 + Math.PI / 6) * 7, Math.sin(i * Math.PI / 3 + Math.PI / 6) * 7);
            }
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

window.Player = Player;
window.Enemy = Enemy;
window.Projectile = Projectile;
window.Collectible = Collectible;
