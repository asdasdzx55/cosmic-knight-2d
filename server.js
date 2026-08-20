/**
 * COSMIC KNIGHT 2D - HIGH-PERFORMANCE HTTP & WEBSOCKET MULTIPLAYER SERVER
 * Serves game assets + provides instant <1ms local network multiplayer room pairing and state sync.
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.apk': 'application/vnd.android.package-archive',
    '.webmanifest': 'application/manifest+json'
};

// HTTP Static Server
const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/index.html';

    const safePath = path.normalize(path.join(PUBLIC_DIR, reqUrl));
    if (!safePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': ext === '.apk' ? 'no-cache' : 'public, max-age=3600'
        });

        const stream = fs.createReadStream(safePath);
        stream.pipe(res);
    });
});

// WebSocket Multiplayer Server
const wss = new WebSocketServer({ server });
const rooms = new Map(); // roomCode -> { hostWs, guestWs, hostSkin, guestSkin }

wss.on('connection', (ws) => {
    ws.roomCode = null;
    ws.role = null;

    ws.on('message', (raw) => {
        try {
            const data = JSON.parse(raw.toString());
            handleMessage(ws, data);
        } catch (e) {
            console.error('[WS Parse Error]:', e);
        }
    });

    ws.on('close', () => {
        if (ws.roomCode && rooms.has(ws.roomCode)) {
            const room = rooms.get(ws.roomCode);
            const otherWs = ws.role === 'host' ? room.guestWs : room.hostWs;
            if (otherWs && otherWs.readyState === WebSocket.OPEN) {
                otherWs.send(JSON.stringify({ type: 'PEER_DISCONNECTED' }));
            }
            rooms.delete(ws.roomCode);
            console.log(`[PVP Room Closed]: ${ws.roomCode}`);
        }
    });
});

function handleMessage(ws, msg) {
    const { type, roomCode } = msg;

    switch (type) {
        case 'CREATE_ROOM': {
            const code = roomCode || Math.floor(1000 + Math.random() * 9000).toString();
            ws.roomCode = code;
            ws.role = 'host';
            rooms.set(code, {
                hostWs: ws,
                guestWs: null,
                hostSkin: msg.skin || 'classic',
                guestSkin: 'fire'
            });
            console.log(`[PVP Room Created]: ${code}`);
            ws.send(JSON.stringify({
                type: 'ROOM_CREATED',
                roomCode: code,
                joinUrl: `http://10.73.42.174:3000/?join=${code}`
            }));
            break;
        }

        case 'JOIN_ROOM': {
            const code = (roomCode || '').trim();
            if (!rooms.has(code)) {
                ws.send(JSON.stringify({
                    type: 'ERROR',
                    message: 'الغرفة غير موجودة أو انتهت! تأكد من إنشاء المضيف للغرفة أولاً'
                }));
                return;
            }

            const room = rooms.get(code);
            if (room.guestWs && room.guestWs.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'ERROR',
                    message: 'الغرفة ممتلئة بالفعل بلاعبين اثنين!'
                }));
                return;
            }

            ws.roomCode = code;
            ws.role = 'guest';
            room.guestWs = ws;
            room.guestSkin = msg.skin || 'fire';

            console.log(`[PVP Guest Joined Room]: ${code} -> Starting match!`);

            // Send MATCH_START to Host
            if (room.hostWs && room.hostWs.readyState === WebSocket.OPEN) {
                room.hostWs.send(JSON.stringify({
                    type: 'MATCH_START',
                    isHost: true,
                    opponentSkin: room.guestSkin,
                    round: 1
                }));
            }

            // Send MATCH_START to Guest
            ws.send(JSON.stringify({
                type: 'MATCH_START',
                isHost: false,
                opponentSkin: room.hostSkin,
                round: 1
            }));
            break;
        }

        case 'PLAYER_STATE':
        case 'PLAYER_ATTACK':
        case 'PLAYER_ULTIMATE':
        case 'TAKE_DAMAGE':
        case 'ROUND_OVER':
        case 'REMATCH_REQ':
        case 'REMATCH_START': {
            if (ws.roomCode && rooms.has(ws.roomCode)) {
                const room = rooms.get(ws.roomCode);
                const targetWs = ws.role === 'host' ? room.guestWs : room.hostWs;
                if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                    targetWs.send(JSON.stringify(msg));
                }
            }
            break;
        }
    }
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 Cosmic Knight 2D Game Server running on port ${PORT}`);
    console.log(`🌐 Local Wi-Fi Access: http://10.73.42.174:${PORT}`);
    console.log(`⚡ WebSocket Instant Multiplayer Relay: ACTIVE`);
    console.log(`=======================================================`);
});
