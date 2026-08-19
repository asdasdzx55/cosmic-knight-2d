/**
 * COSMIC KNIGHT 2D - MASTER GAME CONTROLLER
 * State management, save data persistence, UI screens, shop system, localization, and Rewarded Ads.
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 */

class GameManager {
    constructor() {
        this.state = 'MENU'; // 'MENU', 'STAGES', 'SHOP', 'HOW', 'PLAYING', 'PAUSED', 'VICTORY', 'GAMEOVER'
        this.currentStageId = 1;
        this.levelTimer = 0;
        this.collectedStars = [false, false, false];
        this.coinsCollectedThisLevel = 0;
        this.enemiesDefeated = 0;
        this.damageTakenThisLevel = 0;

        // Rewarded Ad Timer & state
        this.adInterval = null;

        // Save Data Model
        this.saveData = {
            unlockedStages: [1],
            stageStars: {
                1: [false, false, false],
                2: [false, false, false],
                3: [false, false, false],
                4: [false, false, false],
                5: [false, false, false],
                6: [false, false, false],
                7: [false, false, false],
                8: [false, false, false],
                9: [false, false, false],
                10: [false, false, false]
            },
            coins: 50, // Starting gift coins
            equippedSkin: 'classic',
            ownedSkins: ['classic'],
            equippedTrail: 'cyan',
            ownedTrails: ['cyan'],
            upgrades: { maxHpPlus: false, dashCooldownPlus: false },
            difficulty: 'medium',
            isMuted: false,
            lang: 'ar'
        };

        this.loadSaveData();

        // Initialize Engine & Player
        this.engine = new GameEngine('gameCanvas');
        this.player = new Player(80, 480);
        this.applyUpgradesAndCustomization();

        this.initUI();
        this.bindEvents();
        this.updateHUD();
        this.renderStagesGrid();
        this.renderShop();

        // Start 60 FPS Game Loop
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    initUI() {
        this.updateDifficultyUI();
        this.updateMenuStats();
        if (window.dialogueManager) window.dialogueManager.init();
        this.showScreen('screen-main-menu');
    }

    setDifficulty(diff) {
        if (!['easy', 'medium', 'hard', 'nightmare'].includes(diff)) diff = 'medium';
        this.saveData.difficulty = diff;
        this.persistSaveData();
        this.updateDifficultyUI();
        const names = {
            easy: '🟢 سهل (قلوب وفيرة وضرر منخفض)',
            medium: '🟡 وسط (تجربة متوازنة)',
            hard: '🟠 صعب (تحدٍ قوي)',
            nightmare: '💀 صعب جداً (مستحيل تلاقي قلوب + تنين هائج!)'
        };
        this.showToast(`تم ضبط الصعوبة: ${names[diff]}`);
    }

    updateDifficultyUI() {
        const diff = this.saveData.difficulty || 'medium';
        document.querySelectorAll('.btn-diff-select').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.diff === diff);
        });
        document.querySelectorAll('.stage-diff-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.diff === diff);
        });
        const hudBadge = document.getElementById('hud-difficulty-badge');
        if (hudBadge) {
            const labels = {
                easy: '🟢 سهل',
                medium: '🟡 وسط',
                hard: '🟠 صعب',
                nightmare: '💀 صعب جداً'
            };
            hudBadge.innerText = labels[diff] || '🟡 وسط';
        }
    }

    // ================= SAVE DATA PERSISTENCE =================
    loadSaveData() {
        try {
            const saved = localStorage.getItem('cosmic_knight_save');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.saveData = { ...this.saveData, ...parsed };
            }
        } catch (e) {
            console.error('Error loading save data:', e);
        }
    }

    persistSaveData() {
        try {
            localStorage.setItem('cosmic_knight_save', JSON.stringify(this.saveData));
        } catch (e) {
            console.error('Error saving data:', e);
        }
        this.updateMenuStats();
    }

    applyUpgradesAndCustomization() {
        this.player.skin = this.saveData.equippedSkin || 'classic';
        this.player.dashTrailType = this.saveData.equippedTrail || 'cyan';
        this.player.maxHp = this.saveData.upgrades.maxHpPlus ? 4 : 3;
        this.player.dashCooldown = this.saveData.upgrades.dashCooldownPlus ? 0.5 : 0.75;
    }

    // ================= STAGE PROGRESSION =================
    startLevel(stageId) {
        const levelData = window.GAME_LEVELS.find(lvl => lvl.id === stageId);
        if (!levelData) return;

        this.currentStageId = stageId;
        this.levelTimer = 0;
        this.collectedStars = [false, false, false];
        this.coinsCollectedThisLevel = 0;
        this.enemiesDefeated = 0;
        this.damageTakenThisLevel = 0;

        this.applyUpgradesAndCustomization();
        this.engine.loadLevel(levelData, this.player);

        // Update HUD
        const hudStageName = document.getElementById('hud-stage-name');
        if (hudStageName) {
            hudStageName.innerText = (this.saveData.lang === 'ar' ? 'المرحلة ' : 'Stage ') + stageId;
        }

        this.updateHUDStars();
        this.updateHUDCoins();

        this.showScreen('NONE'); // Show canvas HUD

        // Check for Story Intro Dialogue
        if (window.dialogueManager && GAME_DIALOGUES['intro_' + stageId]) {
            this.state = 'DIALOGUE';
            window.dialogueManager.startDialogue('intro_' + stageId, () => {
                this.state = 'PLAYING';
                const touchLayer = document.getElementById('touch-controls');
                if (touchLayer) touchLayer.style.display = 'flex';
            });
        } else {
            this.state = 'PLAYING';
        }
    }

    restartLevel() {
        this.startLevel(this.currentStageId);
    }

    completeLevel() {
        if (this.state !== 'PLAYING') return;

        this.state = 'VICTORY';

        const lvl = this.engine.currentLevel;
        window.soundEngine.playLevelClear();
        window.particleSystem.emitConfetti(this.engine.cameraX, this.engine.cameraY, this.engine.width, this.engine.height);

        // Calculate Stars:
        this.collectedStars[0] = true;
        const allGemsCollected = this.engine.collectibles
            .filter(c => c.type === 'star_gem')
            .every(c => c.collected);
        if (allGemsCollected) this.collectedStars[1] = true;
        if (this.levelTimer <= lvl.targetTime) {
            this.collectedStars[2] = true;
        }

        // Save stage progress
        const prevStars = this.saveData.stageStars[this.currentStageId] || [false, false, false];
        this.saveData.stageStars[this.currentStageId] = [
            prevStars[0] || this.collectedStars[0],
            prevStars[1] || this.collectedStars[1],
            prevStars[2] || this.collectedStars[2]
        ];

        // Unlock next stage (up to 10 stages)
        const nextStageId = this.currentStageId + 1;
        if (nextStageId <= 10 && !this.saveData.unlockedStages.includes(nextStageId)) {
            this.saveData.unlockedStages.push(nextStageId);
        }

        this.persistSaveData();
        this.renderStagesGrid();

        // Check for Outro Dialogue before showing victory modal
        if (window.dialogueManager && GAME_DIALOGUES['outro_' + this.currentStageId]) {
            window.dialogueManager.startDialogue('outro_' + this.currentStageId, () => {
                this.displayVictoryModal();
            });
        } else {
            this.displayVictoryModal();
        }
    }

    displayVictoryModal() {
        document.getElementById('victory-coins').innerText = '+' + this.coinsCollectedThisLevel;
        document.getElementById('victory-time').innerText = Math.floor(this.levelTimer) + 's';

        for (let i = 1; i <= 3; i++) {
            const star = document.getElementById('star-' + i);
            if (star) {
                star.className = this.collectedStars[i - 1] ? 'fa-solid fa-star star-earned' : 'fa-regular fa-star';
            }
        }

        const nextBtn = document.getElementById('btn-victory-next');
        if (nextBtn) {
            if (this.currentStageId >= 10) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'flex';
            }
        }

        this.showModal('modal-victory');
    }

    gameOver() {
        if (this.state !== 'PLAYING') return;
        this.state = 'GAMEOVER';
        this.showModal('modal-gameover');
    }

    // ================= REWARDED AD REVIVE SYSTEM =================
    showRewardedAdForRevive() {
        this.hideAllModals();
        const adModal = document.getElementById('modal-rewarded-ad');
        if (adModal) adModal.classList.remove('hidden');

        let secondsLeft = 5;
        const timerBadge = document.getElementById('ad-countdown-timer');
        const progressBar = document.getElementById('ad-progress-bar-fill');
        const claimBtn = document.getElementById('btn-claim-ad-revive');
        const statusMsg = document.getElementById('ad-status-msg');

        if (claimBtn) {
            claimBtn.disabled = true;
            claimBtn.classList.add('disabled-btn');
            claimBtn.classList.remove('pulse-anim');
        }
        if (progressBar) progressBar.style.width = '0%';
        if (timerBadge) timerBadge.innerText = `${secondsLeft} ثوانٍ`;
        if (statusMsg) statusMsg.innerText = 'جاري تحضير قلوب الشفاء وطاقة الفارس...';

        if (this.adInterval) clearInterval(this.adInterval);
        
        let elapsed = 0;
        this.adInterval = setInterval(() => {
            elapsed += 0.2;
            const remaining = Math.max(0, Math.ceil(5 - elapsed));
            if (timerBadge) timerBadge.innerText = `${remaining} ثوانٍ`;
            if (progressBar) progressBar.style.width = `${Math.min(100, (elapsed / 5) * 100)}%`;

            if (elapsed >= 5) {
                clearInterval(this.adInterval);
                this.adInterval = null;
                if (timerBadge) timerBadge.innerText = 'مكتمل! ✨';
                if (statusMsg) statusMsg.innerText = '💖 القلوب جاهزة! اضغط بالأسفل للعودة فوراً!';
                if (claimBtn) {
                    claimBtn.disabled = false;
                    claimBtn.classList.remove('disabled-btn');
                    claimBtn.classList.add('pulse-anim');
                }
                if (window.soundEngine) window.soundEngine.playLevelClear();
            }
        }, 200);
    }

    claimAdReviveReward() {
        if (this.adInterval) clearInterval(this.adInterval);
        this.hideAllModals();

        // Revive Player on the spot!
        this.player.hp = this.player.maxHp;
        this.player.isDead = false;
        this.player.invulnerableTimer = 4.0; // 4 seconds golden invulnerability shield
        this.state = 'PLAYING';

        const touchLayer = document.getElementById('touch-controls');
        if (touchLayer) touchLayer.style.display = 'flex';

        window.soundEngine.playDash();
        window.particleSystem.emitGemBurst(this.player.x + this.player.w * 0.5, this.player.y + this.player.h * 0.5, '#00f59b');
        this.showToast('💖 تم إحياء الفارس واستعادة كامل القلوب مع درع ذهبي مؤقت!');
    }

    collectLevelStar(starIdx) {
        if (starIdx >= 1 && starIdx <= 3) {
            this.collectedStars[starIdx - 1] = true;
            this.updateHUDStars();
        }
    }

    addCoins(amount) {
        this.coinsCollectedThisLevel += amount;
        this.saveData.coins += amount;
        this.updateHUDCoins();
        this.persistSaveData();
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.showModal('modal-pause');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.hideAllModals();
        }
    }

    resumeGame() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.hideAllModals();
        }
    }

    // ================= UI & NAVIGATION =================
    showScreen(screenId) {
        const screens = ['screen-main-menu', 'screen-stages', 'screen-shop', 'screen-how'];
        screens.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        this.hideAllModals();

        const hud = document.getElementById('hud-overlay');
        const touchLayer = document.getElementById('touch-controls');

        if (screenId === 'NONE') {
            if (hud) hud.classList.remove('hidden');
            if (touchLayer) touchLayer.style.display = 'flex';
        } else {
            this.state = 'MENU';
            const target = document.getElementById(screenId);
            if (target) target.classList.remove('hidden');
            if (hud) hud.classList.add('hidden');
            if (touchLayer) touchLayer.style.display = 'none';
            this.updateMenuStats();
        }
    }

    showModal(modalId) {
        this.hideAllModals();
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('hidden');
        const touchLayer = document.getElementById('touch-controls');
        if (touchLayer) touchLayer.style.display = 'none';
    }

    hideAllModals() {
        const modals = ['modal-pause', 'modal-victory', 'modal-gameover', 'modal-install-app', 'modal-rewarded-ad'];
        modals.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        if (this.state === 'PLAYING') {
            const touchLayer = document.getElementById('touch-controls');
            if (touchLayer) touchLayer.style.display = 'flex';
        }
    }

    updateMenuStats() {
        let totalStars = 0;
        for (const k in this.saveData.stageStars) {
            totalStars += this.saveData.stageStars[k].filter(Boolean).length;
        }

        const maxTotalStars = (window.GAME_LEVELS ? window.GAME_LEVELS.length * 3 : 30);
        const menuStars = document.getElementById('menu-total-stars');
        if (menuStars) menuStars.innerText = totalStars + ' / ' + maxTotalStars;

        const menuCoins = document.getElementById('menu-total-coins');
        if (menuCoins) menuCoins.innerText = this.saveData.coins;

        const stagesCoins = document.getElementById('stages-coins');
        if (stagesCoins) stagesCoins.innerText = this.saveData.coins;

        const shopCoins = document.getElementById('shop-coins');
        if (shopCoins) shopCoins.innerText = this.saveData.coins;
    }

    showToast(msg) {
        let toast = document.getElementById('game-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'game-toast';
            toast.className = 'game-toast';
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.classList.add('visible');
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, 2800);
    }

    updateHUD() {
        this.updateHUDHearts();
        this.updateHUDDash();
        this.updateHUDCoins();
        this.updateHUDStars();
    }

    updateHUDHearts() {
        const heartsContainer = document.getElementById('hud-hearts');
        if (!heartsContainer) return;
        heartsContainer.innerHTML = '';
        const maxHearts = this.player.maxHp || 3;
        for (let i = 0; i < maxHearts; i++) {
            const heart = document.createElement('i');
            heart.className = 'fa-solid fa-heart ' + (i < this.player.hp ? 'heart-active' : 'heart-empty');
            heartsContainer.appendChild(heart);
        }
    }

    updateHUDDash() {
        const dashBar = document.getElementById('hud-dash-bar');
        if (dashBar) {
            const progress = this.player.dashCooldownTimer <= 0 ? 100 : Math.max(0, (1 - (this.player.dashCooldownTimer / this.player.dashCooldown)) * 100);
            dashBar.style.width = progress + '%';
        }
    }

    updateHUDCoins() {
        const coinCount = document.getElementById('hud-coin-count');
        if (coinCount) coinCount.innerText = this.saveData.coins;
    }

    updateHUDStars() {
        for (let i = 1; i <= 3; i++) {
            const slot = document.getElementById('star-slot-' + i);
            if (slot) {
                slot.className = this.collectedStars[i - 1] ? 'fa-solid fa-star star-slot earned' : 'fa-solid fa-star star-slot';
            }
        }
    }

    renderStagesGrid() {
        const container = document.getElementById('stages-container');
        if (!container) return;
        container.innerHTML = '';

        const levels = window.GAME_LEVELS || [];
        levels.forEach(lvl => {
            const isUnlocked = this.saveData.unlockedStages.includes(lvl.id);
            const stars = this.saveData.stageStars[lvl.id] || [false, false, false];
            const starCount = stars.filter(Boolean).length;

            const card = document.createElement('div');
            card.className = `stage-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="stage-card-header">
                    <span class="stage-badge">${this.saveData.lang === 'ar' ? 'المرحلة' : 'Stage'} ${lvl.id}</span>
                    <div class="stage-stars">
                        <i class="fa-solid fa-star ${stars[0] ? 'gold-star' : 'empty-star'}"></i>
                        <i class="fa-solid fa-star ${stars[1] ? 'gold-star' : 'empty-star'}"></i>
                        <i class="fa-solid fa-star ${stars[2] ? 'gold-star' : 'empty-star'}"></i>
                    </div>
                </div>
                <div class="stage-title">${this.saveData.lang === 'ar' ? lvl.titleAr : lvl.titleEn}</div>
                <div class="stage-footer">
                    ${isUnlocked ? '<span class="stage-status"><i class="fa-solid fa-play"></i> ابدأ</span>' : '<span class="stage-status"><i class="fa-solid fa-lock"></i> مقفلة</span>'}
                </div>
            `;

            if (isUnlocked) {
                card.onclick = () => {
                    this.startLevel(lvl.id);
                };
            }

            container.appendChild(card);
        });
    }

    renderShop(activeTab = 'skins') {
        const container = document.getElementById('shop-items-container');
        if (!container) return;
        container.innerHTML = '';

        if (activeTab === 'skins') {
            const skins = [
                { id: 'classic', titleAr: 'الفارس السماوي (Classic)', titleEn: 'Cosmic Knight', color: '#00e5ff', cost: 0 },
                { id: 'crimson', titleAr: 'المحاربة القرمزية (Crimson Valkyrie)', titleEn: 'Crimson Valkyrie', color: '#ff2e63', cost: 80 },
                { id: 'cyber', titleAr: 'الفارس السيبراني (Cyber Paladin)', titleEn: 'Cyber Paladin', color: '#00f59b', cost: 120 },
                { id: 'phoenix', titleAr: 'طائر الفينيق الذهبي (Golden Phoenix)', titleEn: 'Golden Phoenix', color: '#ffb703', cost: 200 }
            ];

            skins.forEach(item => {
                const isOwned = this.saveData.ownedSkins.includes(item.id);
                const isEquipped = this.saveData.equippedSkin === item.id;

                const card = document.createElement('div');
                card.className = 'shop-item-card ' + (isEquipped ? 'equipped' : '');
                card.innerHTML = `
                    <div class="shop-item-preview" style="background: radial-gradient(circle, ${item.color} 0%, #080c14 100%);">
                        <i class="fa-solid fa-user-ninja" style="color: ${item.color};"></i>
                    </div>
                    <div class="shop-item-title">${this.saveData.lang === 'ar' ? item.titleAr : item.titleEn}</div>
                    <div class="shop-item-desc">زي قتالي متقدم بلمعان طاقة فريد</div>
                    <button class="shop-item-btn ${isEquipped ? 'btn-equipped' : (isOwned ? 'btn-equip' : 'btn-buy')}">
                        ${isEquipped ? '<i class="fa-solid fa-check"></i> مفعل' : (isOwned ? 'ارتداء' : `<i class="fa-solid fa-coins gold-coin-icon"></i> ${item.cost}`)}
                    </button>
                `;

                const btn = card.querySelector('button');
                btn.onclick = () => {
                    if (isEquipped) return;
                    if (isOwned) {
                        this.saveData.equippedSkin = item.id;
                        this.applyUpgradesAndCustomization();
                        this.persistSaveData();
                        this.renderShop('skins');
                    } else if (this.saveData.coins >= item.cost) {
                        this.saveData.coins -= item.cost;
                        this.saveData.ownedSkins.push(item.id);
                        this.saveData.equippedSkin = item.id;
                        this.applyUpgradesAndCustomization();
                        this.persistSaveData();
                        this.renderShop('skins');
                        window.soundEngine.playLevelClear();
                    } else {
                        alert(this.saveData.lang === 'ar' ? 'ليس لديك عملات كافية!' : 'Not enough coins!');
                    }
                };

                container.appendChild(card);
            });
        } else if (activeTab === 'trails') {
            const trails = [
                { id: 'cyan', titleAr: 'هالة الضوء السماوي (Cyan Glow)', titleEn: 'Cyan Glow', color: '#00e5ff', cost: 0 },
                { id: 'flame', titleAr: 'هالة النيران الحارقة (Flame Trail)', titleEn: 'Flame Trail', color: '#ff5400', cost: 60 },
                { id: 'void', titleAr: 'هالة الفراغ المظلم (Void Plasma)', titleEn: 'Void Plasma', color: '#c77dff', cost: 100 },
                { id: 'rainbow', titleAr: 'هالة النجوم البراقة (Starlight Nova)', titleEn: 'Starlight Nova', color: '#ffb703', cost: 150 }
            ];

            trails.forEach(item => {
                const isOwned = this.saveData.ownedTrails.includes(item.id);
                const isEquipped = this.saveData.equippedTrail === item.id;

                const card = document.createElement('div');
                card.className = 'shop-item-card ' + (isEquipped ? 'equipped' : '');
                card.innerHTML = `
                    <div class="shop-item-preview" style="background: radial-gradient(circle, ${item.color} 0%, #080c14 100%);">
                        <i class="fa-solid fa-fire-flame-curved" style="color: ${item.color};"></i>
                    </div>
                    <div class="shop-item-title">${this.saveData.lang === 'ar' ? item.titleAr : item.titleEn}</div>
                    <div class="shop-item-desc">تأثير هالة متوهجة يتبع الفارس أثناء الاندفاع</div>
                    <button class="shop-item-btn ${isEquipped ? 'btn-equipped' : (isOwned ? 'btn-equip' : 'btn-buy')}">
                        ${isEquipped ? '<i class="fa-solid fa-check"></i> مفعل' : (isOwned ? 'تفعيل' : `<i class="fa-solid fa-coins gold-coin-icon"></i> ${item.cost}`)}
                    </button>
                `;

                const btn = card.querySelector('button');
                btn.onclick = () => {
                    if (isEquipped) return;
                    if (isOwned) {
                        this.saveData.equippedTrail = item.id;
                        this.applyUpgradesAndCustomization();
                        this.persistSaveData();
                        this.renderShop('trails');
                    } else if (this.saveData.coins >= item.cost) {
                        this.saveData.coins -= item.cost;
                        this.saveData.ownedTrails.push(item.id);
                        this.saveData.equippedTrail = item.id;
                        this.applyUpgradesAndCustomization();
                        this.persistSaveData();
                        this.renderShop('trails');
                        window.soundEngine.playLevelClear();
                    } else {
                        alert(this.saveData.lang === 'ar' ? 'ليس لديك عملات كافية!' : 'Not enough coins!');
                    }
                };

                container.appendChild(card);
            });
        } else if (activeTab === 'upgrades') {
            const upgrades = [
                { id: 'maxHpPlus', titleAr: 'قلب صحة إضافي دائم (+1 HP)', titleEn: 'Extra Heart Container', descAr: 'زيادة الحد الأقصى لطاقة الفارس إلى 4 قلوب', cost: 140, icon: 'fa-heart' },
                { id: 'dashCooldownPlus', titleAr: 'تسريع شحن الاندفاع (Fast Dash)', titleEn: 'Quick Dash Stamina', descAr: 'تقليل وقت إعادة شحن الاندفاع بنسبة 35%', cost: 160, icon: 'fa-bolt-lightning' }
            ];

            upgrades.forEach(item => {
                const isOwned = this.saveData.upgrades[item.id];

                const card = document.createElement('div');
                card.className = 'shop-item-card ' + (isOwned ? 'equipped' : '');
                card.innerHTML = `
                    <div class="shop-item-preview" style="background: radial-gradient(circle, #00f59b 0%, #080c14 100%);">
                        <i class="fa-solid ${item.icon}" style="color: #00f59b;"></i>
                    </div>
                    <div class="shop-item-title">${this.saveData.lang === 'ar' ? item.titleAr : item.titleEn}</div>
                    <div class="shop-item-desc">${item.descAr}</div>
                    <button class="shop-item-btn ${isOwned ? 'btn-equipped' : 'btn-buy'}">
                        ${isOwned ? '<i class="fa-solid fa-check"></i> مكتمل' : `<i class="fa-solid fa-coins gold-coin-icon"></i> ${item.cost}`}
                    </button>
                `;

                const btn = card.querySelector('button');
                btn.onclick = () => {
                    if (isOwned) return;
                    if (this.saveData.coins >= item.cost) {
                        this.saveData.coins -= item.cost;
                        this.saveData.upgrades[item.id] = true;
                        this.applyUpgradesAndCustomization();
                        this.persistSaveData();
                        this.renderShop('upgrades');
                        window.soundEngine.playLevelClear();
                    } else {
                        alert(this.saveData.lang === 'ar' ? 'ليس لديك عملات كافية!' : 'Not enough coins!');
                    }
                };

                container.appendChild(card);
            });
        }
    }

    // ================= EVENT BINDINGS =================
    bindEvents() {
        // Main Menu Buttons
        document.getElementById('btn-menu-play').onclick = () => this.startLevel(1);
        document.getElementById('btn-menu-stages').onclick = () => this.showScreen('screen-stages');
        document.getElementById('btn-menu-shop').onclick = () => this.showScreen('screen-shop');
        document.getElementById('btn-menu-how').onclick = () => this.showScreen('screen-how');

        // Difficulty Selector Buttons (Main Menu & Stages Screen)
        document.querySelectorAll('.btn-diff-select, .stage-diff-btn').forEach(btn => {
            btn.onclick = () => {
                const selectedDiff = btn.dataset.diff;
                this.setDifficulty(selectedDiff);
                if (window.soundEngine) window.soundEngine.playCoin();
            };
        });

        // Back Buttons
        document.getElementById('btn-stages-back').onclick = () => this.showScreen('screen-main-menu');
        document.getElementById('btn-shop-back').onclick = () => this.showScreen('screen-main-menu');
        document.getElementById('btn-how-back').onclick = () => this.showScreen('screen-main-menu');

        // Shop Tabs
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderShop(tab.dataset.tab);
            };
        });

        // Pause Modal Buttons
        document.getElementById('hud-btn-pause').onclick = () => this.togglePause();
        document.getElementById('btn-pause-resume').onclick = () => this.resumeGame();
        document.getElementById('btn-pause-restart').onclick = () => { this.hideAllModals(); this.restartLevel(); };
        document.getElementById('btn-pause-stages').onclick = () => { this.hideAllModals(); this.showScreen('screen-stages'); };
        document.getElementById('btn-pause-menu').onclick = () => { this.hideAllModals(); this.showScreen('screen-main-menu'); };

        // Victory Modal Buttons
        document.getElementById('btn-victory-retry').onclick = () => { this.hideAllModals(); this.restartLevel(); };
        document.getElementById('btn-victory-stages').onclick = () => { this.hideAllModals(); this.showScreen('screen-stages'); };
        document.getElementById('btn-victory-next').onclick = () => {
            this.hideAllModals();
            this.startLevel(this.currentStageId + 1);
        };

        // Game Over & Rewarded Ad Revive Buttons
        document.getElementById('btn-gameover-ad-revive').onclick = () => this.showRewardedAdForRevive();
        document.getElementById('btn-claim-ad-revive').onclick = () => this.claimAdReviveReward();
        document.getElementById('btn-cancel-ad').onclick = () => {
            if (this.adInterval) clearInterval(this.adInterval);
            this.showModal('modal-gameover');
        };

        document.getElementById('btn-gameover-retry').onclick = () => { this.hideAllModals(); this.restartLevel(); };
        document.getElementById('btn-gameover-stages').onclick = () => { this.hideAllModals(); this.showScreen('screen-stages'); };
        document.getElementById('btn-gameover-menu').onclick = () => { this.hideAllModals(); this.showScreen('screen-main-menu'); };

        // Ultimate Touch Button Direct Click Trigger
        const ultBtn = document.getElementById('btn-ultimate');
        if (ultBtn) {
            ultBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.player) {
                    if (this.player.ultimateEnergy >= 100) {
                        this.player.executeUltimate(this.engine);
                    } else {
                        const pct = Math.round(this.player.ultimateEnergy);
                        this.showToast(`⚡ مقياس القاضية: ${pct}% (يتطلب 100%)`);
                    }
                }
            };
        }

        // Audio & Fullscreen Toggles
        document.getElementById('btn-toggle-sound').onclick = () => {
            const muted = window.soundEngine.toggleMute();
            document.getElementById('sound-icon').className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
        };

        document.getElementById('btn-toggle-fullscreen').onclick = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
            } else {
                document.exitFullscreen();
            }
        };

        // Language toggle
        document.getElementById('btn-lang-toggle').onclick = () => {
            this.saveData.lang = this.saveData.lang === 'ar' ? 'en' : 'ar';
            document.documentElement.dir = this.saveData.lang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = this.saveData.lang;
            this.renderStagesGrid();
            this.renderShop();
            this.persistSaveData();
        };

        // Resize Canvas Viewport
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.resizeCanvas();
    }

    resizeCanvas() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        const container = document.getElementById('canvas-wrapper');
        const aspect = 960 / 540;
        const screenW = container.clientWidth;
        const screenH = container.clientHeight;

        if (screenW / screenH > aspect) {
            canvas.style.height = screenH + 'px';
            canvas.style.width = (screenH * aspect) + 'px';
        } else {
            canvas.style.width = screenW + 'px';
            canvas.style.height = (screenW / aspect) + 'px';
        }
    }

    // ================= MAIN 60 FPS GAME LOOP =================
    gameLoop(now) {
        const dt = Math.min(0.05, (now - this.lastTime) / 1000);
        this.lastTime = now;

        if (this.state === 'PLAYING') {
            this.levelTimer += dt;

            // Engine update & render
            this.engine.update(dt, this.player, window.inputController.state);
            this.engine.render(this.player);

            // HUD update
            this.updateHUD();

            // Check if player died
            if (this.player.isDead && this.state === 'PLAYING') {
                this.gameOver();
            }

            // End frame inputs
            window.inputController.endFrame();
        } else if (this.state === 'PAUSED' || this.state === 'VICTORY' || this.state === 'GAMEOVER' || this.state === 'DIALOGUE') {
            // Still render live scene in background during cutscenes/dialogues/pause
            this.engine.render(this.player);
        }

        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Start Game Manager on load
window.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});
