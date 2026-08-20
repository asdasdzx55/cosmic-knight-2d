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
        this.isSearching = false;
        this.lastPing = 0;
        this.rtt = 0;

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
        this.onConnectedCallback = null;
        this.onOpponentStateCallback = null;
        this.onOpponentAttackCallback = null;
        this.onOpponentUltimateCallback = null;
        this.onOpponentDamageCallback = null;
        this.onRoundEndCallback = null;
        this.onRematchCallback = null;
        this.onDisconnectCallback = null;
    }

    generateRoomCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    createRoom(skin = 'classic', onReady) {
        this.cleanup();
        this.isHost = true;
        this.mySkin = skin;
        this.roomCode = this.generateRoomCode();
        const peerId = 'ck2d-' + this.roomCode;

        if (typeof Peer === 'undefined') {
            console.error('[PVP] PeerJS is not loaded');
            return;
        }

        this.peer = new Peer(peerId, {
            debug: 1,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        this.peer.on('open', (id) => {
            console.log('[PVP Host] Room open with code:', this.roomCode);
            if (onReady) onReady(this.roomCode);
        });

        this.peer.on('connection', (conn) => {
            console.log('[PVP Host] Opponent connected!');
            this.conn = conn;
            this.setupConnection();
        });

        this.peer.on('error', (err) => {
            console.error('[PVP Host Error]:', err);
            // If ID is taken, retry with new code
            if (err.type === 'unavailable-id') {
                this.createRoom(skin, onReady);
            }
        });
    }

    joinRoom(code, skin = 'classic', onConnected, onError) {
        this.cleanup();
        this.isHost = false;
        this.mySkin = skin;
        this.roomCode = code.trim();
        const hostPeerId = 'ck2d-' + this.roomCode;

        if (typeof Peer === 'undefined') {
            if (onError) onError('PeerJS library not loaded');
            return;
        }

        // Random client peer ID
        const myPeerId = 'ck2d-client-' + Math.floor(Math.random() * 1000000);
        this.peer = new Peer(myPeerId, {
            debug: 1,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        this.peer.on('open', () => {
            console.log('[PVP Guest] Connecting to host:', hostPeerId);
            this.conn = this.peer.connect(hostPeerId, {
                reliable: false // Unreliable mode for fast 60 FPS real-time UDP gaming
            });

            this.conn.on('open', () => {
                console.log('[PVP Guest] Connected to host successfully!');
                this.setupConnection();
                if (onConnected) onConnected();
            });

            this.conn.on('error', (err) => {
                console.error('[PVP Guest Conn Error]:', err);
                if (onError) onError(err);
            });
        });

        this.peer.on('error', (err) => {
            console.error('[PVP Guest Peer Error]:', err);
            if (onError) onError(err);
        });
    }

    setupConnection() {
        if (!this.conn) return;

        this.isConnected = true;

        // Exchange skin & initial match metadata
        this.send('HANDSHAKE', {
            isHost: this.isHost,
            skin: this.mySkin
        });

        this.conn.on('data', (data) => {
            this.handleIncomingData(data);
        });

        this.conn.on('close', () => {
            console.warn('[PVP] Connection closed');
            this.isConnected = false;
            if (this.onDisconnectCallback) this.onDisconnectCallback();
        });

        if (this.onConnectedCallback) this.onConnectedCallback();
    }

    send(type, payload = {}) {
        if (this.conn && this.conn.open) {
            this.conn.send({
                type,
                timestamp: performance.now(),
                ...payload
            });
        }
    }

    handleIncomingData(msg) {
        if (!msg || !msg.type) return;

        switch (msg.type) {
            case 'HANDSHAKE':
                this.opponentSkin = msg.skin || 'fire';
                console.log('[PVP] Handshake received. Opponent skin:', this.opponentSkin);
                if (this.isHost) {
                    // Send match start trigger
                    this.send('MATCH_START', {
                        stage: 'pvp_arena_1',
                        round: 1
                    });
                }
                break;

            case 'MATCH_START':
                this.currentRound = msg.round || 1;
                this.myScore = 0;
                this.opponentScore = 0;
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
                // msg.winner is 'host' or 'guest'
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
        this.isSearching = false;
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
