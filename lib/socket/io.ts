import type { Server as SocketIOServer } from "socket.io";

declare global {
  // eslint-disable-next-line no-var
  var __kurubis_io: SocketIOServer | undefined;
}

export interface AdminNotificationPayload {
  id: string;
  type: "devis" | "message";
  title: string;
  body: string;
  href: string;
  clientName: string;
  createdAt: string;
}

export interface UserNotificationPayload {
  id: string;
  type: "reply";
  title: string;
  body: string;
  href: string;
  createdAt: string;
}

export function getSocketIO(): SocketIOServer | undefined {
  return global.__kurubis_io;
}

export function emitAdminNotification(payload: AdminNotificationPayload) {
  const io = getSocketIO();
  if (!io) return;
  io.to("admin").emit("admin:notification", payload);
}

export function emitUserNotification(userId: string, payload: UserNotificationPayload) {
  const io = getSocketIO();
  if (!io) return;
  io.to(`user:${userId}`).emit("user:notification", payload);
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
