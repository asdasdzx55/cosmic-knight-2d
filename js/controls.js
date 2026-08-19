/**
 * COSMIC KNIGHT 2D - PRO ARCADE INPUT CONTROLLER
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 * Controls: Pro 4-Way Analog Joystick (Up=Jump, Down=Crouch, Left, Right)
 * and Right Duo Action Buttons (ATTACK & DASH) + Mandatory Landscape Lock.
 */

class InputController {
    constructor() {
        this.state = {
            left: false,
            right: false,
            down: false,
            up: false,
            jump: false,
            jumpJustPressed: false,
            attack: false,
            attackJustPressed: false,
            dash: false,
            dashJustPressed: false
        };

        this.keyMap = {
            'ArrowLeft': 'left', 'KeyA': 'left',
            'ArrowRight': 'right', 'KeyD': 'right',
            'ArrowDown': 'down', 'KeyS': 'down',
            'ArrowUp': 'up', 'KeyW': 'up',
            'Space': 'jump',
            'KeyJ': 'attack', 'KeyZ': 'attack', 'KeyX': 'attack',
            'KeyK': 'dash', 'KeyC': 'dash', 'ShiftLeft': 'dash', 'ShiftRight': 'dash',
            'KeyU': 'ultimate', 'KeyQ': 'ultimate',
            'Escape': 'pause', 'KeyP': 'pause'
        };

        this.isTouchDevice = false;
        this.joystickTouchId = null;
        this.isLandscapeLocked = false;
        this.hasTriggeredUpJump = false;

        this.initKeyboard();
        this.initTouch();
        this.initOrientationLock();
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            const action = this.keyMap[e.code];
            if (action) {
                if (action === 'pause') {
                    if (window.gameManager && window.gameManager.state === 'PLAYING') {
                        window.gameManager.togglePause();
                    }
                    return;
                }

                if (action === 'jump' || action === 'up') {
                    if (!this.state.jump) {
                        this.state.jumpJustPressed = true;
                    }
                    this.state.jump = true;
                    this.state.up = true;
                } else if (action === 'attack') {
                    if (!this.state.attack) {
                        this.state.attackJustPressed = true;
                    }
                    this.state.attack = true;
                } else if (action === 'dash') {
                    if (!this.state.dash) {
                        this.state.dashJustPressed = true;
                    }
                    this.state.dash = true;
                } else if (action === 'ultimate') {
                    if (!this.state.ultimate) {
                        this.state.ultimateJustPressed = true;
                    }
                    this.state.ultimate = true;
                } else {
                    this.state[action] = true;
                }

                if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                    e.preventDefault();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            const action = this.keyMap[e.code];
            if (action) {
                if (action === 'jump' || action === 'up') {
                    this.state.jump = false;
                    this.state.up = false;
                } else if (action === 'attack') {
                    this.state.attack = false;
                } else if (action === 'dash') {
                    this.state.dash = false;
                } else if (action === 'ultimate') {
                    this.state.ultimate = false;
                } else {
                    this.state[action] = false;
                }
            }
        });

        // Mouse click on canvas for sword attack
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('mousedown', (e) => {
                if (e.button === 0 && window.gameManager && window.gameManager.state === 'PLAYING') {
                    if (window.soundEngine) window.soundEngine.init();
                    this.state.attack = true;
                    this.state.attackJustPressed = true;
                }
            });
            window.addEventListener('mouseup', () => {
                this.state.attack = false;
            });
        }
    }

    initTouch() {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.isTouchDevice = hasTouch;

        const touchLayer = document.getElementById('touch-controls');
        if (!touchLayer) return;

        if (hasTouch) {
            touchLayer.style.display = 'flex';
        }

        // ================= 1. PRO 4-WAY ANALOG JOYSTICK =================
        const joystickZone = document.getElementById('joystick-touch-zone');
        const joystickBase = document.getElementById('joystick-base');
        const joystickThumb = document.getElementById('joystick-thumb');
        const indUp = document.getElementById('dpad-ind-up');
        const indLeft = document.getElementById('dpad-ind-left');
        const indRight = document.getElementById('dpad-ind-right');
        const indDown = document.getElementById('dpad-ind-down');

        if (joystickZone && joystickBase && joystickThumb) {
            const maxRadius = 40; // Max thumb travel distance

            const processJoystickMove = (clientX, clientY) => {
                const rect = joystickBase.getBoundingClientRect();
                const centerX = rect.left + rect.width * 0.5;
                const centerY = rect.top + rect.height * 0.5;

                let dx = clientX - centerX;
                let dy = clientY - centerY;
                const dist = Math.hypot(dx, dy);

                // Clamp to max radius
                if (dist > maxRadius) {
                    dx = (dx / dist) * maxRadius;
                    dy = (dy / dist) * maxRadius;
                }

                joystickThumb.style.transform = `translate(${dx}px, ${dy}px)`;

                // 1. Horizontal Motion (Left / Right)
                if (dx < -12) {
                    this.state.left = true;
                    this.state.right = false;
                    if (indLeft) indLeft.classList.add('active');
                    if (indRight) indRight.classList.remove('active');
                } else if (dx > 12) {
                    this.state.right = true;
                    this.state.left = false;
                    if (indRight) indRight.classList.add('active');
                    if (indLeft) indLeft.classList.remove('active');
                } else {
                    this.state.left = false;
                    this.state.right = false;
                    if (indLeft) indLeft.classList.remove('active');
                    if (indRight) indRight.classList.remove('active');
                }

                // 2. UP / JUMP Motion (Pushing UP triggers Jump)
                if (dy < -16) {
                    this.state.up = true;
                    if (!this.hasTriggeredUpJump) {
                        this.state.jumpJustPressed = true;
                        this.state.jump = true;
                        this.hasTriggeredUpJump = true;
                    }
                    if (indUp) indUp.classList.add('active');
                } else {
                    this.state.up = false;
                    this.state.jump = false;
                    this.hasTriggeredUpJump = false;
                    if (indUp) indUp.classList.remove('active');
                }

                // 3. DOWN / CROUCH Motion
                if (dy > 18) {
                    this.state.down = true;
                    if (indDown) indDown.classList.add('active');
                } else {
                    this.state.down = false;
                    if (indDown) indDown.classList.remove('active');
                }
            };

            const resetJoystick = () => {
                this.state.left = false;
                this.state.right = false;
                this.state.up = false;
                this.state.down = false;
                this.state.jump = false;
                this.hasTriggeredUpJump = false;
                this.joystickTouchId = null;

                joystickThumb.style.transform = 'translate(0px, 0px)';
                if (indUp) indUp.classList.remove('active');
                if (indLeft) indLeft.classList.remove('active');
                if (indRight) indRight.classList.remove('active');
                if (indDown) indDown.classList.remove('active');
            };

            // Touch events for Joystick
            joystickZone.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.soundEngine) window.soundEngine.init();
                const touch = e.changedTouches[0];
                this.joystickTouchId = touch.identifier;
                processJoystickMove(touch.clientX, touch.clientY);
            }, { passive: false });

            window.addEventListener('touchmove', (e) => {
                if (this.joystickTouchId === null) return;
                for (let i = 0; i < e.touches.length; i++) {
                    const touch = e.touches[i];
                    if (touch.identifier === this.joystickTouchId) {
                        e.preventDefault();
                        processJoystickMove(touch.clientX, touch.clientY);
                        break;
                    }
                }
            }, { passive: false });

            const handleTouchEndOrCancel = (e) => {
                if (this.joystickTouchId === null) return;
                for (let i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier === this.joystickTouchId) {
                        resetJoystick();
                        break;
                    }
                }
            };

            window.addEventListener('touchend', handleTouchEndOrCancel, { passive: false });
            window.addEventListener('touchcancel', handleTouchEndOrCancel, { passive: false });

            // Mouse Fallback for Desktop Testing
            let isMouseDown = false;
            joystickZone.addEventListener('mousedown', (e) => {
                isMouseDown = true;
                processJoystickMove(e.clientX, e.clientY);
            });
            window.addEventListener('mousemove', (e) => {
                if (isMouseDown) processJoystickMove(e.clientX, e.clientY);
            });
            window.addEventListener('mouseup', () => {
                if (isMouseDown) {
                    isMouseDown = false;
                    resetJoystick();
                }
            });
        }

        // ================= 2. PRO ARCADE ACTION BUTTONS (ATTACK & DASH) =================
        const bindActionBtn = (btnId, actionName) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;

            const handleStart = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.soundEngine) window.soundEngine.init();
                btn.classList.add('active');

                if (actionName === 'attack') {
                    this.state.attackJustPressed = true;
                    this.state.attack = true;
                } else if (actionName === 'dash') {
                    this.state.dashJustPressed = true;
                    this.state.dash = true;
                } else {
                    this.state[actionName] = true;
                }
            };

            const handleEnd = (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.classList.remove('active');

                if (actionName === 'attack') {
                    this.state.attack = false;
                } else if (actionName === 'dash') {
                    this.state.dash = false;
                } else {
                    this.state[actionName] = false;
                }
            };

            btn.addEventListener('touchstart', handleStart, { passive: false });
            btn.addEventListener('touchend', handleEnd, { passive: false });
            btn.addEventListener('touchcancel', handleEnd, { passive: false });

            btn.addEventListener('mousedown', handleStart);
            btn.addEventListener('mouseup', handleEnd);
            btn.addEventListener('mouseleave', handleEnd);
        };

        bindActionBtn('btn-attack', 'attack');
        bindActionBtn('btn-dash', 'dash');
        bindActionBtn('btn-ultimate', 'ultimate');
    }

    initOrientationLock() {
        const blocker = document.getElementById('landscape-blocker');

        const checkOrientation = () => {
            if (!blocker) return;

            const isPortrait = window.innerHeight > window.innerWidth;
            const isMobileDevice = window.innerWidth <= 1024 && (('ontouchstart' in window) || navigator.maxTouchPoints > 0);

            if (isPortrait && isMobileDevice) {
                blocker.classList.remove('hidden');
                this.isLandscapeLocked = true;
                this.reset();
            } else {
                blocker.classList.add('hidden');
                this.isLandscapeLocked = false;
                if (window.gameManager) {
                    window.gameManager.resizeCanvas();
                }
            }
        };

        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);
        checkOrientation();
    }

    endFrame() {
        this.state.jumpJustPressed = false;
        this.state.attackJustPressed = false;
        this.state.dashJustPressed = false;
        this.state.ultimateJustPressed = false;
    }

    reset() {
        for (const k in this.state) {
            this.state[k] = false;
        }
        this.hasTriggeredUpJump = false;
    }
}

window.inputController = new InputController();
