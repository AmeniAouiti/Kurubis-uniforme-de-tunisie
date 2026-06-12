import type { Server as SocketIOServer } from "socket.io";

declare global {
  // eslint-disable-next-line no-var
  var __kurubis_io: SocketIOServer | undefined;
}

export function setSocketIO(io: SocketIOServer) {
  global.__kurubis_io = io;
}

export function getSocketIO(): SocketIOServer | undefined {
  return global.__kurubis_io;
}

export function emitConversationEvent(
  conversationId: string,
  event: string,
  payload: unknown
) {
  const io = getSocketIO();
  if (!io) return;
  io.to(`conversation:${conversationId}`).emit(event, payload);
  io.to("admin").emit(event, payload);
}
