/**
 * COSMIC KNIGHT 2D - REALTIME 2-PLAYER PVP MULTIPLAYER
 * Uses WebRTC DataChannels (PeerJS) for ultra-low-latency (<20ms) P2P communication.
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 */

class MultiplayerManager {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.isHost = false;
        this.roomCode = null;
        this.isConnected = false;
        this.isHandshakeDone = false;
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
        this.onConnectedCallback = null;
        this.onOpponentStateCallback = null;
        this.onOpponentAttackCallback = null;
        this.onOpponentUltimateCallback = null;
        this.onOpponentDamageCallback = null;
        this.onRoundEndCallback = null;
        this.onRematchCallback = null;
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
        const peerId = 'ck2d-room-' + this.roomCode;

        this.setStatus('🌐 جاري الاتصال بخادم النزال...');

        if (typeof Peer === 'undefined') {
            const err = 'مكتبة الاتصال لم تُحمّل بعد!';
            this.setStatus('❌ ' + err);
            if (onError) onError(err);
            return;
        }

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

        this.peer.on('open', (id) => {
            console.log('[PVP Host] Room open with code:', this.roomCode);
            this.setStatus('⏳ الغرفة جاهزة: ' + this.roomCode);
            if (onReady) onReady(this.roomCode, this.getJoinUrl(this.roomCode));
        });

        this.peer.on('connection', (conn) => {
            console.log('[PVP Host] Incoming connection from opponent!');
            this.setStatus('🔗 جاري ربط الهاتفين...');
            this.conn = conn;
            this.setupConnection();
        });

        this.peer.on('error', (err) => {
            console.error('[PVP Host Error]:', err);
            if (err.type === 'unavailable-id') {
                this.createRoom(skin, onReady, onError);
            } else {
                this.setStatus('❌ خطأ في الاتصال: ' + (err.type || ''));
                if (onError) onError(err);
            }
        });
    }

    joinRoom(code, skin = 'classic', onConnected, onError) {
        this.cleanup();
        this.isHost = false;
        this.mySkin = skin;
        this.roomCode = code.trim();
        const hostPeerId = 'ck2d-room-' + this.roomCode;

        this.setStatus('🌐 جاري الاتصال بالغرفة ' + this.roomCode + '...');

        if (typeof Peer === 'undefined') {
            const err = 'مكتبة الاتصال لم تُحمّل بعد!';
            this.setStatus('❌ ' + err);
            if (onError) onError(err);
            return;
        }

        const myPeerId = 'ck2d-guest-' + Math.floor(100000 + Math.random() * 900000);
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

        this.peer.on('open', () => {
            console.log('[PVP Guest] Connecting to host:', hostPeerId);
            this.conn = this.peer.connect(hostPeerId, {
                reliable: true
            });

            this.setupConnection();

            if (onConnected) onConnected();
        });

        this.peer.on('error', (err) => {
            console.error('[PVP Guest Peer Error]:', err);
            this.setStatus('❌ تعذر العثور على الغرفة ' + this.roomCode);
            if (onError) onError(err);
        });
    }

    setupConnection() {
        if (!this.conn) return;

        const onDataOpen = () => {
            console.log('[PVP] DataChannel open! Sending Handshake...');
            this.isConnected = true;
            this.setStatus('✅ متصل! جاري تبادل بيانات الفرسان...');

            // Send Handshake packet
            this.send('HANDSHAKE', {
                isHost: this.isHost,
                skin: this.mySkin
            });

            // Handshake Keep-Alive / Retry
            const handshakeInterval = setInterval(() => {
                if (this.isHandshakeDone || !this.isConnected) {
                    clearInterval(handshakeInterval);
                } else {
                    this.send('HANDSHAKE', {
                        isHost: this.isHost,
                        skin: this.mySkin
                    });
                }
            }, 500);
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
            this.isHandshakeDone = false;
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
            case 'HANDSHAKE':
                this.opponentSkin = msg.skin || 'fire';
                this.isHandshakeDone = true;
                console.log('[PVP] Handshake acknowledged. Opponent skin:', this.opponentSkin);
                this.send('HANDSHAKE_ACK', { skin: this.mySkin });

                if (this.isHost) {
                    setTimeout(() => {
                        this.send('MATCH_START', {
                            stage: 'pvp_arena_1',
                            round: 1
                        });
                        if (window.gameManager) {
                            window.gameManager.startPvPMatch();
                        }
                    }, 400);
                }
                break;

            case 'HANDSHAKE_ACK':
                this.opponentSkin = msg.skin || 'fire';
                this.isHandshakeDone = true;
                console.log('[PVP] Handshake ACK received.');
                break;

            case 'MATCH_START':
                this.currentRound = msg.round || 1;
                this.myScore = 0;
                this.opponentScore = 0;
                this.setStatus('⚔️ بدء النزال الآن!');
                if (window.gameManager) {
                    window.gameManager.startPvPMatch();
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
        if (window.gameManager) {
            window.gameManager.startPvPMatch();
        }
    }

    cleanup() {
        this.isConnected = false;
        this.isHandshakeDone = false;
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
