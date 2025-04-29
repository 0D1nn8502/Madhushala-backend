import WebSocket from 'ws';

export interface Position { x: number; y: number; }
export type WSMsg =
  | { type: 'join';   userId: string }
  | { type: 'move';   userId: string; x: number; y: number }
  | { type: 'leave';  userId: string };


export class SpaceManager {
  private clients = new Map<string, WebSocket>();      // userId → socket
  private positions = new Map<string, Position>();     // userId → position 

  constructor(public spaceId: string) {}

  addClient(userId: string, ws: WebSocket) {
    this.clients.set(userId, ws);

    // 1️⃣ Send a one-time "snapshot" of everyone's last known locations
    const snapshot = Array.from(this.positions.entries()).map(
      ([uid, pos]) => ({ userId: uid, x: pos.x, y: pos.y })
    );
    ws.send(JSON.stringify({ type: 'snapshot', players: snapshot }));

    // 2️⃣ Notify everyone else that you joined
    this.broadcastExcept(userId, { type: 'join', userId });

    ws.on('message', raw => this.handleMessage(userId, raw.toString()));
    ws.on('close',  ()  => this.removeClient(userId));
  }


  private handleMessage(userId: string, raw: string) {
    let msg: WSMsg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === 'move') {
      this.positions.set(userId, { x: msg.x, y: msg.y });
      
      // Broadcast move to all other clients
      this.broadcastExcept(userId, msg);
    }
  }
 

  private broadcastExcept(excludeId: string, msg: any) {
    const raw = JSON.stringify(msg);
    for (const [uid, sock] of this.clients.entries()) {
      if (uid === excludeId) continue;
      if (sock.readyState === WebSocket.OPEN) {
        sock.send(raw);
      }
    } 
  }

  private removeClient(userId: string) {
    this.clients.delete(userId);
    this.positions.delete(userId);
    this.broadcastExcept(userId, { type: 'leave', userId });
  }
}
