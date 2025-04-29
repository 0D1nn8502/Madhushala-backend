"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceManager = void 0;
const ws_1 = __importDefault(require("ws"));
class SpaceManager {
    constructor(spaceId) {
        this.spaceId = spaceId;
        this.clients = new Map(); // userId → socket
        this.positions = new Map(); // userId → position 
    }
    addClient(userId, ws) {
        this.clients.set(userId, ws);
        // 1️⃣ Send a one-time "snapshot" of everyone's last known locations
        const snapshot = Array.from(this.positions.entries()).map(([uid, pos]) => ({ userId: uid, x: pos.x, y: pos.y }));
        ws.send(JSON.stringify({ type: 'snapshot', players: snapshot }));
        // 2️⃣ Notify everyone else that you joined
        this.broadcastExcept(userId, { type: 'join', userId });
        ws.on('message', raw => this.handleMessage(userId, raw.toString()));
        ws.on('close', () => this.removeClient(userId));
    }
    handleMessage(userId, raw) {
        let msg;
        try {
            msg = JSON.parse(raw);
        }
        catch (_a) {
            return;
        }
        if (msg.type === 'move') {
            this.positions.set(userId, { x: msg.x, y: msg.y });
            // Broadcast move to all other clients
            this.broadcastExcept(userId, msg);
        }
    }
    broadcastExcept(excludeId, msg) {
        const raw = JSON.stringify(msg);
        for (const [uid, sock] of this.clients.entries()) {
            if (uid === excludeId)
                continue;
            if (sock.readyState === ws_1.default.OPEN) {
                sock.send(raw);
            }
        }
    }
    removeClient(userId) {
        this.clients.delete(userId);
        this.positions.delete(userId);
        this.broadcastExcept(userId, { type: 'leave', userId });
    }
}
exports.SpaceManager = SpaceManager;
