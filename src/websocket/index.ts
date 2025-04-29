// src/websocket.ts
import http from 'http';
import { WebSocketServer } from 'ws';
import { SpaceManager } from './SpaceManager';  

// Keep one SpaceManager per space //
const managers = new Map<string, SpaceManager>();

export function setupWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    // Expect URL: ws://host/space-ws/<spaceId>?userId=...
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const [ , prefix, spaceId ] = url.pathname.split('/');
    const userId = url.searchParams.get('userId');

    if (prefix !== 'space-ws' || !spaceId || !userId) {
      socket.destroy();
      return;
    }

    // Get or create the SpaceManager
    let mgr = managers.get(spaceId);
    if (!mgr) {
      mgr = new SpaceManager(spaceId);
      managers.set(spaceId, mgr);
    }

    // Complete WebSocket handshake and register client
    wss.handleUpgrade(req, socket, head, ws => {
      mgr!.addClient(userId, ws);
    });
  });

  console.log('WebSocket server hooked on /space-ws/:spaceId');
}
