/**
 * COSMIC KNIGHT 2D - BULLETPROOF REALTIME 2-PLAYER PVP MULTIPLAYER
 * Direct WebRTC DataChannels with Deterministic Symmetrical Handshake
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 */

class MultiplayerManager {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.isHost = false;
        this.roomCode = null;
        this.isConnected = false;
        this.isMatchStarted = false;
        this.statusText = 'جاهز للاتصال';

        // Player Match State
        this.mySkin = 'classic';
        this.opponentSkin = 'fire';
        this.myScore = 0;
        this.opponentScore = 0;
        this.targetScore = 2; // Best of 3 (first to 2 KOs)
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

    generateRoomCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    getJoinUrl(code) {
        let base = window.location.origin + window.location.pathname;
        if (base.includes('localhost') || base.includes('127.0.0.1')) {
            base = 'http://10.73.42.174:3000/';
        }
        return base.split('?')[0] + '?join=' + code;
    }

    createRoom(skin = 'classic', onReady, onError) {
        this.cleanup();
        this.isHost = true;
        this.mySkin = skin;
        this.roomCode = this.generateRoomCode();
        const peerId = 'ck2dv8-' + this.roomCode;

        this.setStatus('🌐 جاري الاتصال بخادم النزال...');

        if (typeof Peer === 'undefined') {
            const err = 'مكتبة الاتصال لم تُحمّل بعد!';
            this.setStatus('❌ ' + err);
            if (onError) onError(err);
            return;
        }

        try {
            this.peer = new Peer(peerId, {
                debug: 1,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                        { urls: 'stun:stun.cloudflare.com:3478' }
                    ]
                }
            });
        } catch (e) {
            console.error('[PVP Init Error]:', e);
            if (onError) onError(e);
            return;
        }

        this.peer.on('open', (id) => {
            console.log('[PVP Host] Room open with peer ID:', id);
            this.setStatus('⏳ الغرفة جاهزة: ' + this.roomCode + ' (امسح الـ QR أو شارك الرمز)');
            if (onReady) onReady(this.roomCode, this.getJoinUrl(this.roomCode));
        });

        this.peer.on('connection', (conn) => {
            console.log('[PVP Host] Incoming connection from opponent!');
            this.setStatus('🔗 تم اتصال اللاعب الثاني! جاري بدء المعركة...');
            this.conn = conn;
            this.setupConnection();
        });

        this.peer.on('error', (err) => {
            console.error('[PVP Host Error]:', err);
            if (err.type === 'unavailable-id') {
                this.createRoom(skin, onReady, onError);
            } else {
                this.setStatus('❌ خطأ في الاتصال: ' + (err.type || err));
                if (onError) onError(err);
            }
        });
    }

    joinRoom(code, skin = 'classic', onConnected, onError) {
        this.cleanup();
        this.isHost = false;
        this.mySkin = skin;
        this.roomCode = code.trim();
        const hostPeerId = 'ck2dv8-' + this.roomCode;

        this.setStatus('🌐 جاري الاتصال بالغرفة ' + this.roomCode + '...');

        if (typeof Peer === 'undefined') {
            const err = 'مكتبة الاتصال لم تُحمّل بعد!';
            this.setStatus('❌ ' + err);
            if (onError) onError(err);
            return;
        }

        const myPeerId = 'ck2dv8-g-' + Math.floor(100000 + Math.random() * 900000);
        try {
            this.peer = new Peer(myPeerId, {
                debug: 1,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                        { urls: 'stun:stun.cloudflare.com:3478' }
                    ]
                }
            });
        } catch (e) {
            console.error('[PVP Init Error]:', e);
            if (onError) onError(e);
            return;
        }

        this.peer.on('open', () => {
            console.log('[PVP Guest] Connecting to host peer:', hostPeerId);
            this.conn = this.peer.connect(hostPeerId, {
                reliable: true
            });

            this.setupConnection();

            if (onConnected) onConnected();
        });

        this.peer.on('error', (err) => {
            console.error('[PVP Guest Peer Error]:', err);
            this.setStatus('❌ تعذر العثور على الغرفة ' + this.roomCode + ' (تأكد من فتح المضيف للغرفة أولاً)');
            if (onError) onError(err);
        });
    }

    setupConnection() {
        if (!this.conn) return;

        const onDataOpen = () => {
            console.log('[PVP] DataChannel open! Broadcasting HELLO...');
            this.isConnected = true;
            this.setStatus('⚔️ تم ربط الهاتفين! جاري تحميل ساحة النزال...');

            // Send HELLO packet
            this.send('HELLO', {
                isHost: this.isHost,
                skin: this.mySkin
            });
        };

        if (this.conn.open) {
            onDataOpen();
        } else {
            this.conn.on('open', onDataOpen);
        }

        this.conn.on('data', (data) => {
            this.handleIncomingData(data);
        });

        this.conn.on('close', () => {
            console.warn('[PVP] Connection closed');
            this.isConnected = false;
            this.isMatchStarted = false;
            this.setStatus('⚠️ تم قطع الاتصال');
            if (this.onDisconnectCallback) this.onDisconnectCallback();
        });

        this.conn.on('error', (err) => {
            console.error('[PVP Conn Error]:', err);
            this.setStatus('❌ خطأ في قناة البيانات');
        });
    }

    send(type, payload = {}) {
        if (this.conn && this.conn.open) {
            try {
                this.conn.send({
                    type,
                    timestamp: performance.now(),
                    ...payload
                });
            } catch (e) {
                console.warn('[PVP Send Error]:', e);
            }
        }
    }

    handleIncomingData(msg) {
        if (!msg || !msg.type) return;

        switch (msg.type) {
            case 'HELLO':
                this.opponentSkin = msg.skin || 'fire';
                console.log('[PVP] Received HELLO from opponent. Skin:', this.opponentSkin);
                this.send('HELLO_ACK', { skin: this.mySkin });

                if (this.isHost && !this.isMatchStarted) {
                    this.triggerMatchStart();
                }
                break;

            case 'HELLO_ACK':
                this.opponentSkin = msg.skin || 'fire';
                console.log('[PVP] Received HELLO_ACK from opponent.');

                if (this.isHost && !this.isMatchStarted) {
                    this.triggerMatchStart();
                }
                break;

            case 'START_DUEL':
                console.log('[PVP] Received START_DUEL command from host!');
                this.isMatchStarted = true;
                this.currentRound = msg.round || 1;
                this.myScore = 0;
                this.opponentScore = 0;
                this.setStatus('⚔️ النزال بدأ الآن!');
                this.send('START_DUEL_ACK');
                if (window.gameManager) {
                    window.gameManager.startPvPMatch();
                }
                break;

            case 'START_DUEL_ACK':
                console.log('[PVP] Guest confirmed START_DUEL!');
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

    triggerMatchStart() {
        this.isMatchStarted = true;
        this.setStatus('⚔️ جاري إطلاق المعركة...');
        
        // Broadcast multiple START_DUEL packets to guarantee receipt
        this.send('START_DUEL', {
            round: 1,
            arena: 'pvp_arena_1'
        });

        setTimeout(() => {
            this.send('START_DUEL', {
                round: 1,
                arena: 'pvp_arena_1'
            });
        }, 150);

        setTimeout(() => {
            if (window.gameManager) {
                window.gameManager.startPvPMatch();
            }
        }, 300);
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
        if (this.conn) {
            try { this.conn.close(); } catch (e) {}
            this.conn = null;
        }
        if (this.peer) {
            try { this.peer.destroy(); } catch (e) {}
            this.peer = null;
        }
    }
}

window.multiplayerManager = new MultiplayerManager();
