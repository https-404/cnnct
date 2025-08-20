import { prisma } from "../lib/prisma";
import { serializeUserResponse } from "../util/userResponse.util";

export const listRequests = async (userId: string) => {
  // List requests sent and received by the user
  const sent = await prisma.connectionRequest.findMany({
    where: { requesterId: userId },
    include: { recipient: true },
    orderBy: { createdAt: 'desc' },
  });
  const received = await prisma.connectionRequest.findMany({
    where: { recipientId: userId },
    include: { requester: true },
    orderBy: { createdAt: 'desc' },
  });
  return {
    sent: sent.map(r => ({ ...r, recipient: serializeUserResponse(r.recipient) })),
    received: received.map(r => ({ ...r, requester: serializeUserResponse(r.requester) })),
  };
};

export const sendRequest = async (userId: string, recipientId: string) => {
  if (userId === recipientId) throw new Error('Cannot send request to yourself');
  // Check for existing request
  const existing = await prisma.connectionRequest.findUnique({
    where: { requesterId_recipientId: { requesterId: userId, recipientId } },
  });
  if (existing) throw new Error('Request already exists');
  // Check if already friends
  const alreadyFriend = await prisma.friend.findUnique({
    where: { userId_friendId: { userId, friendId: recipientId } },
  });
  if (alreadyFriend) throw new Error('You are already friends');
  const request = await prisma.connectionRequest.create({
    data: { requesterId: userId, recipientId },
    include: { recipient: true },
  });
  return { ...request, recipient: serializeUserResponse(request.recipient) };
};

export const acceptRequest = async (userId: string, requestId: string) => {
  const request = await prisma.connectionRequest.findUnique({ where: { id: requestId } });
  if (!request || request.recipientId !== userId) throw new Error('Request not found');
  if (request.status !== 'PENDING') throw new Error('Request is not pending');
  // Update status
  await prisma.connectionRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED', resolvedAt: new Date() } });
  // Create Friend rows (bidirectional)
  await prisma.friend.createMany({ data: [
    { userId: request.requesterId, friendId: request.recipientId },
    { userId: request.recipientId, friendId: request.requesterId },
  ], skipDuplicates: true });
  return { success: true };
};

export const rejectRequest = async (userId: string, requestId: string) => {
  const request = await prisma.connectionRequest.findUnique({ where: { id: requestId } });
  if (!request || request.recipientId !== userId) throw new Error('Request not found');
  if (request.status !== 'PENDING') throw new Error('Request is not pending');
  await prisma.connectionRequest.update({ where: { id: requestId }, data: { status: 'REJECTED', resolvedAt: new Date() } });
  return { success: true };
};

export const cancelRequest = async (userId: string, requestId: string) => {
  const request = await prisma.connectionRequest.findUnique({ where: { id: requestId } });
  if (!request || request.requesterId !== userId) throw new Error('Request not found');
  if (request.status !== 'PENDING') throw new Error('Request is not pending');
  await prisma.connectionRequest.update({ where: { id: requestId }, data: { status: 'CANCELED', resolvedAt: new Date() } });
  return { success: true };
};
