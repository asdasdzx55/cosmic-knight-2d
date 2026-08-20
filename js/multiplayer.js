/**
 * COSMIC KNIGHT 2D - ULTRA-FAST REALTIME 2-PLAYER PVP MULTIPLAYER
 * Direct WebSocket Relay + WebRTC Dual Protocol for Instant Zero-Lag Battle
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 */

class MultiplayerManager {
    constructor() {
        this.ws = null;
        this.isHost = false;
        this.roomCode = null;
        this.isConnected = false;
        this.isMatchStarted = false;
        this.statusText = 'جاهز للاتصال';

        // Match State
        this.mySkin = 'classic';
        this.opponentSkin = 'fire';
        this.myScore = 0;
        this.opponentScore = 0;
        this.targetScore = 2;
        this.currentRound = 1;
        this.rematchRequestedByMe = false;
        this.rematchRequestedByOpponent = false;

        // Callbacks
        this.onStatusChange = null;
        this.onOpponentStateCallback = null;
        this.onOpponentAttackCallback = null;
        this.onOpponentUltimateCallback = null;
        this.onOpponentDamageCallback = null;
        this.onRoundEndCallback = null;
        this.onDisconnectCallback = null;
    }

    getWsUrl() {
        let host = window.location.hostname;
        if (!host || host === 'localhost' || host === '127.0.0.1' || host === '') {
            host = '10.73.42.174';
        }
        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${proto}//${host}:3000`;
    }

    getJoinUrl(code) {
        let host = window.location.hostname;
        if (!host || host === 'localhost' || host === '127.0.0.1' || host === '') {
            host = '10.73.42.174';
        }
        return `http://${host}:3000/?join=${code}`;
    }

    setStatus(text) {
        this.statusText = text;
        console.log('[PVP Status]:', text);
        if (this.onStatusChange) {
            this.onStatusChange(text);
        }
        const netStatus = document.getElementById('pvp-net-status');
        if (netStatus) netStatus.innerText = text;

        const hostStatus = document.getElementById('host-status-msg');
        if (hostStatus && this.isHost) hostStatus.innerText = text;

        const joinStatus = document.getElementById('join-status-msg');
        if (joinStatus && !this.isHost) joinStatus.innerText = text;
    }

    createRoom(skin = 'classic', onReady, onError) {
        this.cleanup();
        this.isHost = true;
        this.mySkin = skin;
        this.setStatus('🌐 جاري الاتصال بخادم النزال...');

        const wsUrl = this.getWsUrl();
        try {
            this.ws = new WebSocket(wsUrl);
        } catch (e) {
            console.error('[PVP WS Error]:', e);
            this.setStatus('❌ تعذر الاتصال بالخادم المحلي');
            if (onError) onError(e);
            return;
        }

        this.ws.onopen = () => {
            console.log('[PVP WS Open] Registering new room...');
            this.setStatus('⏳ جاري إنشاء الغرفة ورمز الـ QR...');
            this.send('CREATE_ROOM', { skin: this.mySkin });
        };

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                this.handleMessage(msg, onReady, onError);
            } catch (e) {
                console.error('[PVP Msg Error]:', e);
            }
        };

        this.ws.onerror = (err) => {
            console.error('[PVP WS Error Event]:', err);
            this.setStatus('❌ خطأ في الاتصال بالخادم المحلي');
            if (onError) onError(err);
        };

        this.ws.onclose = () => {
            console.warn('[PVP WS Close]');
            this.isConnected = false;
            this.isMatchStarted = false;
            this.setStatus('⚠️ تم قطع الاتصال');
            if (this.onDisconnectCallback) this.onDisconnectCallback();
        };
    }

    joinRoom(code, skin = 'classic', onConnected, onError) {
        this.cleanup();
        this.isHost = false;
        this.mySkin = skin;
        this.roomCode = (code || '').trim();

        this.setStatus('🌐 جاري الاتصال بالغرفة ' + this.roomCode + '...');

        const wsUrl = this.getWsUrl();
        try {
            this.ws = new WebSocket(wsUrl);
        } catch (e) {
            console.error('[PVP WS Error]:', e);
            this.setStatus('❌ تعذر الاتصال بالخادم');
            if (onError) onError(e);
            return;
        }

        this.ws.onopen = () => {
            console.log('[PVP WS Open] Joining room:', this.roomCode);
            this.send('JOIN_ROOM', {
                roomCode: this.roomCode,
                skin: this.mySkin
            });
            if (onConnected) onConnected();
        };

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                this.handleMessage(msg, null, onError);
            } catch (e) {
                console.error('[PVP Msg Error]:', e);
            }
        };

        this.ws.onerror = (err) => {
            console.error('[PVP WS Error Event]:', err);
            this.setStatus('❌ تعذر العثور على الخادم');
            if (onError) onError(err);
        };

        this.ws.onclose = () => {
            console.warn('[PVP WS Close]');
            this.isConnected = false;
            this.isMatchStarted = false;
            this.setStatus('⚠️ تم قطع الاتصال');
            if (this.onDisconnectCallback) this.onDisconnectCallback();
        };
    }

    send(type, payload = {}) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify({
                    type,
                    timestamp: performance.now(),
                    ...payload
                }));
            } catch (e) {
                console.warn('[PVP Send Error]:', e);
            }
        }
    }

    handleMessage(msg, onReady, onError) {
        if (!msg || !msg.type) return;

        switch (msg.type) {
            case 'ROOM_CREATED':
                this.roomCode = msg.roomCode;
                this.setStatus('⏳ الغرفة جاهزة: ' + this.roomCode);
                if (onReady) onReady(this.roomCode, this.getJoinUrl(this.roomCode));
                break;

            case 'MATCH_START':
                console.log('[PVP] MATCH_START received from server! Starting game...');
                this.isConnected = true;
                this.isMatchStarted = true;
                this.isHost = msg.isHost;
                this.opponentSkin = msg.opponentSkin || 'fire';
                this.currentRound = msg.round || 1;
                this.myScore = 0;
                this.opponentScore = 0;
                this.setStatus('⚔️ انطلق النزال الآن!');

                if (window.gameManager) {
                    window.gameManager.startPvPMatch();
                }
                break;

            case 'ERROR':
                this.setStatus('❌ ' + msg.message);
                if (onError) onError(msg.message);
                if (window.gameManager) {
                    window.gameManager.showToast('⚠️ ' + msg.message);
                }
                break;

            case 'PEER_DISCONNECTED':
                this.setStatus('⚠️ غادر اللاعب الآخر النزال');
                if (window.gameManager) {
                    window.gameManager.showToast('⚠️ غادر اللاعب الآخر النزال');
                    window.gameManager.isPvP = false;
                    window.gameManager.engine.remotePlayer = null;
                    window.gameManager.showScreen('screen-pvp-lobby');
                }
                break;

            case 'PLAYER_STATE':
                if (this.onOpponentStateCallback) {
                    this.onOpponentStateCallback(msg);
                }
                break;

            case 'PLAYER_ATTACK':
                if (this.onOpponentAttackCallback) {
                    this.onOpponentAttackCallback(msg);
                }
                break;

            case 'PLAYER_ULTIMATE':
                if (this.onOpponentUltimateCallback) {
                    this.onOpponentUltimateCallback(msg);
                }
                break;

            case 'TAKE_DAMAGE':
                if (this.onOpponentDamageCallback) {
                    this.onOpponentDamageCallback(msg);
                }
                break;

            case 'ROUND_OVER':
                const isWinnerMe = (this.isHost && msg.winner === 'host') || (!this.isHost && msg.winner === 'guest');
                if (isWinnerMe) {
                    this.myScore++;
                } else {
                    this.opponentScore++;
                }
                if (this.onRoundEndCallback) {
                    this.onRoundEndCallback(isWinnerMe, this.myScore, this.opponentScore);
                }
                break;

            case 'REMATCH_REQ':
                this.rematchRequestedByOpponent = true;
                if (window.gameManager) {
                    window.gameManager.showToast('⚔️ طلب الخصم إعادة النزال!');
                    if (this.rematchRequestedByMe) {
                        this.restartMatch();
                    }
                }
                break;

            case 'REMATCH_START':
                this.restartMatch();
                break;
        }
    }

    requestRematch() {
        this.rematchRequestedByMe = true;
        this.send('REMATCH_REQ');
        if (this.rematchRequestedByOpponent) {
            this.send('REMATCH_START');
            this.restartMatch();
        }
    }

    restartMatch() {
        this.myScore = 0;
        this.opponentScore = 0;
        this.currentRound = 1;
        this.rematchRequestedByMe = false;
        this.rematchRequestedByOpponent = false;
        this.isMatchStarted = true;
        if (window.gameManager) {
            window.gameManager.startPvPMatch();
        }
    }

    cleanup() {
        this.isConnected = false;
        this.isMatchStarted = false;
        if (this.ws) {
            try { this.ws.close(); } catch (e) {}
            this.ws = null;
        }
    }
}

window.multiplayerManager = new MultiplayerManager();
