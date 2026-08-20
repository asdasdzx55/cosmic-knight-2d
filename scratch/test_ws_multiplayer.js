const WebSocket = require('ws');

const hostWs = new WebSocket('ws://localhost:3000');
let roomCode = null;

hostWs.on('open', () => {
    console.log('[Test Host] Connected to WS, creating room...');
    hostWs.send(JSON.stringify({ type: 'CREATE_ROOM', skin: 'classic' }));
});

hostWs.on('message', (raw) => {
    const msg = JSON.parse(raw.toString());
    console.log('[Test Host Received]:', msg);

    if (msg.type === 'ROOM_CREATED') {
        roomCode = msg.roomCode;
        console.log('[Test Host] Room created with code:', roomCode);

        // Connect Guest
        const guestWs = new WebSocket('ws://localhost:3000');
        guestWs.on('open', () => {
            console.log('[Test Guest] Connected to WS, joining room:', roomCode);
            guestWs.send(JSON.stringify({ type: 'JOIN_ROOM', roomCode, skin: 'fire' }));
        });

        guestWs.on('message', (gRaw) => {
            const gMsg = JSON.parse(gRaw.toString());
            console.log('[Test Guest Received]:', gMsg);

            if (gMsg.type === 'MATCH_START') {
                console.log('>>> SUCCESS: Guest received MATCH_START!');
            }
        });
    }

    if (msg.type === 'MATCH_START') {
        console.log('>>> SUCCESS: Host received MATCH_START!');
        setTimeout(() => {
            console.log('=== MULTIPLAYER TEST PASSED 100% ===');
            process.exit(0);
        }, 500);
    }
});
