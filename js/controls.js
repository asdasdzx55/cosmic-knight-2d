/**
 * COSMIC KNIGHT 2D - PRO ARCADE & DUAL-PLAYER INPUT CONTROLLER
 * Supports Single-Player Joystick/Buttons & Shared Screen Dual 2-Player Combat Controls.
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 */

class InputController {
    constructor() {
        // Player 1 State
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
            dashJustPressed: false,
            ultimate: false,
            ultimateJustPressed: false
        };

        // Player 2 State (For Local 2-Player Duel Mode)
        this.stateP2 = {
            left: false,
            right: false,
            down: false,
            up: false,
            jump: false,
            jumpJustPressed: false,
            attack: false,
            attackJustPressed: false,
            dash: false,
            dashJustPressed: false,
            ultimate: false,
            ultimateJustPressed: false
        };

        this.isTouchDevice = false;
        this.joystickTouchId = null;
        this.isLandscapeLocked = false;
        this.hasTriggeredUpJump = false;

        this.initKeyboard();
        this.initTouch();
        this.initDualTouch();
        this.initOrientationLock();
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            const code = e.code;

            // Pause
            if (code === 'Escape' || code === 'KeyP') {
                if (window.gameManager && window.gameManager.state === 'PLAYING') {
                    window.gameManager.togglePause();
                }
                return;
            }

            // Check if in 2-Player Duel Mode
            const isDualMode = window.gameManager && window.gameManager.isPvP;

            if (isDualMode) {
                // ================= P1 (LEFT KNIGHT) =================
                if (code === 'KeyA') this.state.left = true;
                if (code === 'KeyD') this.state.right = true;
                if (code === 'KeyS') this.state.down = true;
                if (code === 'KeyW' || code === 'Space') {
                    if (!this.state.jump) this.state.jumpJustPressed = true;
                    this.state.jump = true;
                    this.state.up = true;
                }
                if (code === 'KeyF' || code === 'KeyJ') {
                    if (!this.state.attack) this.state.attackJustPressed = true;
                    this.state.attack = true;
                }
                if (code === 'KeyG' || code === 'KeyK') {
                    if (!this.state.dash) this.state.dashJustPressed = true;
                    this.state.dash = true;
                }

                // ================= P2 (RIGHT KNIGHT) =================
                if (code === 'ArrowLeft') this.stateP2.left = true;
                if (code === 'ArrowRight') this.stateP2.right = true;
                if (code === 'ArrowDown') this.stateP2.down = true;
                if (code === 'ArrowUp' || code === 'Numpad0' || code === 'Enter') {
                    if (!this.stateP2.jump) this.stateP2.jumpJustPressed = true;
                    this.stateP2.jump = true;
                    this.stateP2.up = true;
                }
                if (code === 'Numpad1' || code === 'KeyB' || code === 'KeyV') {
                    if (!this.stateP2.attack) this.stateP2.attackJustPressed = true;
                    this.stateP2.attack = true;
                }
                if (code === 'Numpad2' || code === 'KeyN') {
                    if (!this.stateP2.dash) this.stateP2.dashJustPressed = true;
                    this.stateP2.dash = true;
                }

                if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(code)) {
                    e.preventDefault();
                }
            } else {
                // Standard Single-Player Controls
                if (code === 'ArrowLeft' || code === 'KeyA') this.state.left = true;
                if (code === 'ArrowRight' || code === 'KeyD') this.state.right = true;
                if (code === 'ArrowDown' || code === 'KeyS') this.state.down = true;
                if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') {
                    if (!this.state.jump) this.state.jumpJustPressed = true;
                    this.state.jump = true;
                    this.state.up = true;
                }
                if (code === 'KeyJ' || code === 'KeyZ' || code === 'KeyX') {
                    if (!this.state.attack) this.state.attackJustPressed = true;
                    this.state.attack = true;
                }
                if (code === 'KeyK' || code === 'KeyC' || code === 'ShiftLeft' || code === 'ShiftRight') {
                    if (!this.state.dash) this.state.dashJustPressed = true;
                    this.state.dash = true;
                }
                if (code === 'KeyU' || code === 'KeyQ') {
                    if (!this.state.ultimate) this.state.ultimateJustPressed = true;
                    this.state.ultimate = true;
                }

                if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
                    e.preventDefault();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            const code = e.code;
            const isDualMode = window.gameManager && window.gameManager.isPvP;

            if (isDualMode) {
                // P1
                if (code === 'KeyA') this.state.left = false;
                if (code === 'KeyD') this.state.right = false;
                if (code === 'KeyS') this.state.down = false;
                if (code === 'KeyW' || code === 'Space') {
                    this.state.jump = false;
                    this.state.up = false;
                }
                if (code === 'KeyF' || code === 'KeyJ') this.state.attack = false;
                if (code === 'KeyG' || code === 'KeyK') this.state.dash = false;

                // P2
                if (code === 'ArrowLeft') this.stateP2.left = false;
                if (code === 'ArrowRight') this.stateP2.right = false;
                if (code === 'ArrowDown') this.stateP2.down = false;
                if (code === 'ArrowUp' || code === 'Numpad0' || code === 'Enter') {
                    this.stateP2.jump = false;
                    this.stateP2.up = false;
                }
                if (code === 'Numpad1' || code === 'KeyB' || code === 'KeyV') this.stateP2.attack = false;
                if (code === 'Numpad2' || code === 'KeyN') this.stateP2.dash = false;
            } else {
                if (code === 'ArrowLeft' || code === 'KeyA') this.state.left = false;
                if (code === 'ArrowRight' || code === 'KeyD') this.state.right = false;
                if (code === 'ArrowDown' || code === 'KeyS') this.state.down = false;
                if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') {
                    this.state.jump = false;
                    this.state.up = false;
                }
                if (code === 'KeyJ' || code === 'KeyZ' || code === 'KeyX') this.state.attack = false;
                if (code === 'KeyK' || code === 'KeyC' || code === 'ShiftLeft' || code === 'ShiftRight') this.state.dash = false;
                if (code === 'KeyU' || code === 'KeyQ') this.state.ultimate = false;
            }
        });
    }

    initTouch() {
        const joystickZone = document.getElementById('touch-joystick-zone');
        const stick = document.getElementById('joystick-stick');
        if (!joystickZone || !stick) return;

        let startX = 0, startY = 0;
        const maxDist = 38;

        const handleStart = (touch) => {
            this.isTouchDevice = true;
            this.joystickTouchId = touch.identifier;
            const rect = joystickZone.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
            this.hasTriggeredUpJump = false;
            handleMove(touch);
        };

        const handleMove = (touch) => {
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            const dist = Math.hypot(dx, dy);
            const clampedDist = Math.min(dist, maxDist);
            const angle = Math.atan2(dy, dx);

            const stickX = Math.cos(angle) * clampedDist;
            const stickY = Math.sin(angle) * clampedDist;

            stick.style.transform = `translate(${stickX}px, ${stickY}px)`;

            const deadzone = 12;
            if (dist > deadzone) {
                const normX = dx / dist;
                const normY = dy / dist;

                this.state.left = normX < -0.38;
                this.state.right = normX > 0.38;
                this.state.down = normY > 0.65;

                if (normY < -0.45) {
                    if (!this.hasTriggeredUpJump && !this.state.jump) {
                        this.state.jumpJustPressed = true;
                        this.hasTriggeredUpJump = true;
                    }
                    this.state.jump = true;
                    this.state.up = true;
                } else {
                    this.state.jump = false;
                    this.state.up = false;
                    this.hasTriggeredUpJump = false;
                }
            } else {
                this.resetJoystickState();
            }
        };

        const handleEnd = () => {
            this.joystickTouchId = null;
            this.resetJoystickState();
            stick.style.transform = 'translate(0px, 0px)';
        };

        joystickZone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (this.joystickTouchId === null) {
                    handleStart(e.changedTouches[i]);
                    break;
                }
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (this.joystickTouchId !== null) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier === this.joystickTouchId) {
                        handleMove(e.changedTouches[i]);
                        break;
                    }
                }
            }
        }, { passive: false });

        const endTouch = (e) => {
            if (this.joystickTouchId !== null) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier === this.joystickTouchId) {
                        handleEnd();
                        break;
                    }
                }
            }
        };

        window.addEventListener('touchend', endTouch, { passive: false });
        window.addEventListener('touchcancel', endTouch, { passive: false });

        // Single-Player Action Buttons
        this.bindTouchButton('btn-touch-attack', 'attack', 'attackJustPressed');
        this.bindTouchButton('btn-touch-dash', 'dash', 'dashJustPressed');
        this.bindTouchButton('btn-touch-jump', 'jump', 'jumpJustPressed');
        this.bindTouchButton('btn-ultimate', 'ultimate', 'ultimateJustPressed');
    }

    initDualTouch() {
        // Player 1 Dual Buttons (Blue - Left Side)
        this.bindDualTouchButton('p1-touch-left', this.state, 'left');
        this.bindDualTouchButton('p1-touch-right', this.state, 'right');
        this.bindDualTouchButton('p1-touch-jump', this.state, 'jump', 'jumpJustPressed');
        this.bindDualTouchButton('p1-touch-attack', this.state, 'attack', 'attackJustPressed');

        // Player 2 Dual Buttons (Red - Right Side)
        this.bindDualTouchButton('p2-touch-left', this.stateP2, 'left');
        this.bindDualTouchButton('p2-touch-right', this.stateP2, 'right');
        this.bindDualTouchButton('p2-touch-jump', this.stateP2, 'jump', 'jumpJustPressed');
        this.bindDualTouchButton('p2-touch-attack', this.stateP2, 'attack', 'attackJustPressed');
    }

    bindTouchButton(elementId, stateProp, justPressedProp = null) {
        const btn = document.getElementById(elementId);
        if (!btn) return;

        const press = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.isTouchDevice = true;
            if (justPressedProp && !this.state[stateProp]) {
                this.state[justPressedProp] = true;
            }
            this.state[stateProp] = true;
            btn.classList.add('active');
        };

        const release = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.state[stateProp] = false;
            btn.classList.remove('active');
        };

        btn.addEventListener('touchstart', press, { passive: false });
        btn.addEventListener('touchend', release, { passive: false });
        btn.addEventListener('touchcancel', release, { passive: false });
        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    }

    bindDualTouchButton(elementId, targetState, stateProp, justPressedProp = null) {
        const btn = document.getElementById(elementId);
        if (!btn) return;

        const press = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.isTouchDevice = true;
            if (justPressedProp && !targetState[stateProp]) {
                targetState[justPressedProp] = true;
            }
            targetState[stateProp] = true;
            btn.classList.add('active');
        };

        const release = (e) => {
            e.preventDefault();
            e.stopPropagation();
            targetState[stateProp] = false;
            btn.classList.remove('active');
        };

        btn.addEventListener('touchstart', press, { passive: false });
        btn.addEventListener('touchend', release, { passive: false });
        btn.addEventListener('touchcancel', release, { passive: false });
        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    }

    resetJoystickState() {
        this.state.left = false;
        this.state.right = false;
        this.state.down = false;
        this.state.jump = false;
        this.state.up = false;
        this.hasTriggeredUpJump = false;
    }

    initOrientationLock() {
        const lockLandscape = () => {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {});
            }
        };
        window.addEventListener('click', lockLandscape, { once: true });
        window.addEventListener('touchstart', lockLandscape, { once: true });
    }

    endFrame() {
        this.state.jumpJustPressed = false;
        this.state.attackJustPressed = false;
        this.state.dashJustPressed = false;
        this.state.ultimateJustPressed = false;

        this.stateP2.jumpJustPressed = false;
        this.stateP2.attackJustPressed = false;
        this.stateP2.dashJustPressed = false;
        this.stateP2.ultimateJustPressed = false;
    }
}

window.inputController = new InputController();
