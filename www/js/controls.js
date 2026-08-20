/**
 * COSMIC KNIGHT 2D - PRO ARCADE INPUT CONTROLLER
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 * Controls: Pro 4-Way Analog Joystick (Up=Jump, Down=Crouch, Left, Right)
 * and Right Duo Action Buttons (ATTACK, DASH & ULTIMATE) + Mandatory Landscape Lock.
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
            dashJustPressed: false,
            ultimate: false,
            ultimateJustPressed: false
        };

        this.keyMap = {
            'ArrowLeft': 'left', 'KeyA': 'left',
            'ArrowRight': 'right', 'KeyD': 'right',
            'ArrowDown': 'down', 'KeyS': 'down',
            'ArrowUp': 'up', 'KeyW': 'up',
            'Space': 'jump',
            'KeyJ': 'attack', 'KeyZ': 'attack', 'KeyX': 'attack', 'KeyF': 'attack',
            'KeyK': 'dash', 'KeyC': 'dash', 'ShiftLeft': 'dash', 'ShiftRight': 'dash', 'KeyG': 'dash',
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

        this.bindTouchButton('btn-touch-attack', 'attack', 'attackJustPressed');
        this.bindTouchButton('btn-touch-dash', 'dash', 'dashJustPressed');
        this.bindTouchButton('btn-touch-jump', 'jump', 'jumpJustPressed');
        this.bindTouchButton('btn-ultimate', 'ultimate', 'ultimateJustPressed');
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
    }
}

window.inputController = new InputController();
